from server.settings_common import *


DEBUG = 1

ALLOWED_HOSTS = []

SECRET_KEY = 'notsosecret'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ORIGIN_ALLOW_ALL = True
CSRF_TRUSTED_ORIGINS = ['http://localhost:8080']
CSRF_ORIGIN_WHITELIST = ['http://localhost:8080']
