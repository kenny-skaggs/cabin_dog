from django.conf import settings
from django.db import models
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token


class MultiToken(Token):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tokens', on_delete=models.CASCADE, verbose_name='User')


class MultiTokenAuthentication(TokenAuthentication):
    model = MultiToken
