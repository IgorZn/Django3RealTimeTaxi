import os
import pytest
from channels.testing import WebsocketCommunicator

from channels.layers import get_channel_layer
from taxi.routing import application

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

from django.contrib.auth.models import Group

TEST_CHANNEL_LAYERS = {
	'default': {
		'BACKEND': 'channels.layers.InMemoryChannelLayer',
	},
}

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"


@database_sync_to_async
def create_user(username='test.user@example.com', password='pAssw0rd', group='rider'):
	# Create user
	user = get_user_model().objects.create_user(
		username=username,
		password=password
	)

	# Create user group
	user_group, _ = Group.objects.get_or_create(name=group)
	print('\nuser_group:', user_group)
	user.groups.add(user_group)
	user.save()

	# Create access token
	access = AccessToken.for_user(user)
	print('user', user)
	print('user.id', user.id)
	print('user.groups.first().pk', user.groups.first().pk)
	print('access', access)

	return user, access


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebSocket:

	def _communicator(self, token=None):
		if token:
			return WebsocketCommunicator(application=application, path=f'/taxi/?token={token}')
		return WebsocketCommunicator(application=application, path='/taxi/')

	async def test_can_connect_to_server(self, settings):
		settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
		_, access = await create_user()

		connected, _ = await self._communicator(access).connect()
		assert connected is True
		await self._communicator(access).disconnect()

	async def test_can_send_and_receive_messages(self, settings):
		settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
		_, access = await create_user()

		communicator = self._communicator(access)

		message = {
			'type': 'echo.message',
			'data': 'This is a test message.',
		}

		await communicator.send_json_to(message)
		response = await communicator.receive_json_from()
		assert response == message
		await communicator.disconnect()

	async def test_can_send_and_receive_broadcast_messages(self, settings):
		settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
		_, access = await create_user()

		communicator = self._communicator(access)

		connected, _ = await communicator.connect()
		message = {
			'type': 'echo.message',
			'data': 'This is a test message.',
		}
		channel_layer = get_channel_layer()
		await channel_layer.group_send('test', message=message)
		response = await communicator.receive_json_from()
		assert response == message
		await communicator.disconnect()

	async def test_cannot_connect_to_socket(self, settings):
		settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
		_, access = await create_user()
		communicator = self._communicator()

		connected, _ = await communicator.connect()
		assert connected is False
		await communicator.disconnect()

	async def test_join_driver_pool(self, settings):
		settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
		_, access = await create_user(group='driver')

		communicator = self._communicator(access)
		connected, _ = await communicator.connect()
		message = {
			'type': 'echo.message',
			'data': 'This is a test message.',
		}

		channel_layer = get_channel_layer()
		await channel_layer.group_send('drivers', message=message)
		response = await communicator.receive_json_from()
		assert response == message
		await communicator.disconnect()

	async def test_request_trip(self, settings):


		settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
		user, access = await create_user()

		communicator = self._communicator(access)
		connected, _ = await communicator.connect()

		await communicator.send_json_to({
			'type': 'create.trip',
			'data': {
				'pick_up_address': '123 Main Street',
				'drop_off_address': '456 Piney Road',
				'rider': user.id,
			},
		})
		response = await communicator.receive_json_from()
		response_data = response.get('data')
		assert response_data['id'] is not None
		assert response_data['pick_up_address'] == '123 Main Street'
		assert response_data['drop_off_address'] == '456 Piney Road'
		assert response_data['status'] == 'REQUESTED'
		assert response_data['rider']['username'] == user.username
		assert response_data['driver'] is None
		await communicator.disconnect()
