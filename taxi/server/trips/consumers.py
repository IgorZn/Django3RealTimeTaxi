from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

from asgiref.sync import sync_to_async

from trips.serializers import NestedTripSerializer, TripSerializer
from trips.models import Trip


TEST_CHANNEL_LAYERS = {
	'default': {
		'BACKEND': 'channels.layers.InMemoryChannelLayer',
	},
}


class TaxiConsumer(AsyncJsonWebsocketConsumer):
	groups = ['test']

	@sync_to_async
	def _create_trip(self, data):
		serializer = TripSerializer(data=data)
		serializer.is_valid(raise_exception=True)
		return serializer.create(serializer.validated_data)

	@sync_to_async
	def _get_trip_ids(self, user):
		user_groups = user.groups.values_list('name', flat=True)
		print('_get_trip_ids__user_groups', user_groups)
		if 'driver' in user_groups:
			trip_ids = user.trips_as_driver.exclude(status=Trip.COMPLETED).only('id').values_list('id', flat=True)
		else:
			trip_ids = user.trips_as_rider.exclude(status=Trip.COMPLETED).only('id').values_list('id', flat=True)
		return map(str, trip_ids)

	@sync_to_async
	def _get_user_group(self, user):
		return user.groups.first().name

	@sync_to_async
	def _update_trip(self, data):
		instance = Trip.objects.get(id=data.get('id'))
		serializer = TripSerializer(data=data)
		serializer.is_valid(raise_exception=True)
		return serializer.update(instance, serializer.validated_data)

	@sync_to_async
	def _cancel_trip(self, data):
		instance = Trip.objects.get(id=data.get('id'))
		instance.status = data.get('status')
		serializer = TripSerializer(data=data)
		serializer.is_valid(raise_exception=True)
		return serializer.update(instance, serializer.validated_data)

	async def connect(self):
		# получить пользователя из scope
		user = self.scope['user']

		# anonymous?
		if user.is_anonymous:
			await self.close()
		else:
			user_group = await self._get_user_group(user)
			if user_group == 'driver':
				await self.channel_layer.group_add(
					group='drivers',
					channel=self.channel_name
				)

			for trip_id in await self._get_trip_ids(user):
				await self.channel_layer.group_add(
					group=trip_id,
					channel=self.channel_name
				)

			await self.accept()

	async def disconnect(self, code):
		user = self.scope['user']
		print('disconnect__code:', code)
		print('disconnect__user:', user)
		if not isinstance(user, AnonymousUser):
			user_group = await self._get_user_group(user)
			if user_group == 'driver':
				await self.channel_layer.group_discard(
					group='drivers',
					channel=self.channel_name
				)

			for trip_id in await self._get_trip_ids(user):
				await self.channel_layer.group_discard(
					group=trip_id,
					channel=self.channel_name
				)

		await super().disconnect(code)

	async def receive_json(self, content, **kwargs):
		message_type = content.get('type')
		if message_type == 'create.trip':
			await self.create_trip(content)
		elif message_type == 'echo.message':
			await self.echo_message(content)
		elif message_type == 'update.trip':
			await self.update_trip(content)
		elif message_type == 'cancel.trip':
			await self.cancel_trip(content)

	async def create_trip(self, message):
		print('create_trip', message)
		data = message.get('data')
		trip = await self._create_trip(data)
		trip_data = NestedTripSerializer(trip).data

		# Send rider requests to all drivers.
		await self.channel_layer.group_send(group='drivers', message={
			'type': 'echo.message',
			'data': trip_data
		})

		# Add rider to trip group.
		await self.channel_layer.group_add(
			group=f'{trip.id}',
			channel=self.channel_name
		)

		await self.send_json({
			'type': 'echo.message',
			'data': trip_data,
		})

	async def update_trip(self, message):
		data = message.get('data')
		trip = await self._update_trip(data)
		trip_id = f'{trip.id}'
		trip_data = NestedTripSerializer(trip).data

		# Send update to rider.
		await self.channel_layer.group_send(
			group=trip_id,
			message={
				'type': 'echo.message',
				'data': trip_data,
			}
		)

		# Add driver to the trip group.
		await self.channel_layer.group_add(
			group=trip_id,
			channel=self.channel_name
		)

		await self.send_json({
			'type': 'echo.message',
			'data': trip_data
		})

	async def cancel_trip(self, message):
		data = message.get('data')
		trip = await self._cancel_trip(data)
		trip_id = f'{trip.id}'
		trip_data = NestedTripSerializer(trip).data

		# Send update to driver.
		await self.channel_layer.group_send(
			group=trip_id,
			message={
				'type': 'echo.message',
				'data': trip_data,
			}
		)

		# Remove driver from the trip group.
		await self.channel_layer.group_discard(
			group='drivers',
			channel=self.channel_name
		)

		await self.send_json({
			'type': 'echo.message',
			'data': trip_data
		})

	async def echo_message(self, message):
		print('echo_message__message', message)
		await self.send_json(message)