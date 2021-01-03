from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.auth import AuthMiddleware, AuthMiddlewareStack, UserLazyObject
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from rest_framework_simplejwt.tokens import AccessToken


User = get_user_model()


@database_sync_to_async
def get_user(scope):
	close_old_connections()
	# распарсить URL на словарь
	query_string = parse_qs(scope['query_string'].decode())
	token = query_string.get('token')

	if not token:
		# нет токена, то AnonymousUser
		return AnonymousUser()

	# пробуем получить пользователя
	try:
		access_token = AccessToken(token[0])
		user = User.objects.get(id=access_token['id'])
	except Exception:
		return AnonymousUser()

	# если не активирован, то AnonymousUser
	if not user.is_active:
		return AnonymousUser()
	return user


class TokenAuthMiddleware(AuthMiddleware):
	async def resolve_scope(self, scope):
		scope['user']._wrapped = await get_user(scope)


TokenAuthMiddlewareStack = lambda inner: CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))
