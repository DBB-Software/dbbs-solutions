from .base import *

ALLOWED_HOSTS = ['*']

DEBUG = True

SILKY_PYTHON_PROFILER = True

MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

INSTALLED_APPS += [
    'debug_toolbar',
    'django_extensions',
]

INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
]

CSRF_COOKIE_DOMAIN = None
