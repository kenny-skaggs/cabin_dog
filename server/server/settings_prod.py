from server.settings_common import *

import os

from dotenv import load_dotenv

load_dotenv()

DEBUG = 0

SECRET_KEY = os.environ.get('SECRET_KEY')

ALLOWED_HOSTS = ['cabin.goodtohaveyou.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cabin_dog',
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': 'localhost',
        'PORT': '5432'
    }
}
