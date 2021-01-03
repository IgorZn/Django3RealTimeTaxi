from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


TEST_CHANNEL_LAYERS = {
	'default': {
		'BACKEND': 'channels.layers.InMemoryChannelLayer',
	},
}


class TaxiConsumer(AsyncJsonWebsocketConsumer):
	groups = ['test']

	@database_sync_to_async
	def _get_user_group(self, user):
		return user.groups.first().name

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
		await super().disconnect(code)

	async def receive_json(self, content, **kwargs):
		message_type = content.get('type')
		if message_type == 'echo.message':
			await self.send_json({
				'type': message_type,
				'data': content.get('data'),
			})

	async def echo_message(self, message):
		await self.send_json({
			'type': message.get('type'),
			'data': message.get('data'),
		})