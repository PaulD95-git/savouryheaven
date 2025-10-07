"""
Django settings for savouryheaven project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from decouple import config
import dj_database_url
import django_heroku


load_dotenv()

# -------------------------------------------------------------------
# BASE SETTINGS
# -------------------------------------------------------------------

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Hosts allowed to serve the project
ALLOWED_HOSTS = [
    'savouryheaven-15fa27504aa2.herokuapp.com', 
    'savouryheaven.herokuapp.com', 
    'localhost', 
    '127.0.0.1'
]

# Required by django-allauth
SITE_ID = 1

# Loggin
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}

# -------------------------------------------------------------------
# APPLICATIONS
# -------------------------------------------------------------------

INSTALLED_APPS = [
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',  # Cloudinary storage
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'cloudinary',  # Cloudinary

    # Custom apps
    'reservations',

    # Third-party apps
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
]

# -------------------------------------------------------------------
# MIDDLEWARE
# -------------------------------------------------------------------

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # Required for allauth (Django 5+)
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -------------------------------------------------------------------
# URLS & WSGI
# -------------------------------------------------------------------

ROOT_URLCONF = 'savouryheaven.urls'

WSGI_APPLICATION = 'savouryheaven.wsgi.application'

# -------------------------------------------------------------------
# TEMPLATES
# -------------------------------------------------------------------

TEMPLATE_DIR = BASE_DIR / 'templates'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATE_DIR],
        'APP_DIRS': True,  # Looks inside each app's templates folder
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                # Required by allauth
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# -------------------------------------------------------------------
# DATABASE
# -------------------------------------------------------------------

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=not DEBUG
    )
}

# -------------------------------------------------------------------
# PASSWORD VALIDATION
# -------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'UserAttributeSimilarityValidator'
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'MinimumLengthValidator'
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'CommonPasswordValidator'
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'NumericPasswordValidator'
    },
]

# -------------------------------------------------------------------
# INTERNATIONALIZATION
# -------------------------------------------------------------------

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -------------------------------------------------------------------
# STATIC FILES
# -------------------------------------------------------------------

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Use CompressedStaticFilesStorage instead of CompressedManifestStaticFilesStorage
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Ignore patterns for WhiteNoise to prevent missing file errors
WHITENOISE_IGNORE_PATTERNS = [
    r"cloudinary/",
    r".*jquery\.ui\.widget.*",
    r".*\.map$",
]

# -------------------------------------------------------------------
# DEFAULT PRIMARY KEY FIELD TYPE
# -------------------------------------------------------------------

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -------------------------------------------------------------------
# AUTHENTICATION
# -------------------------------------------------------------------

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # Default authentication
    'allauth.account.auth_backends.AuthenticationBackend',  # Django-allauth
]

# -------------------------------------------------------------------
# DJANGO-ALLAUTH SETTINGS
# -------------------------------------------------------------------

# Redirect after login/logout
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

# Email authentication settings
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']
ACCOUNT_EMAIL_VERIFICATION = "optional"

# -------------------------------------------------------------------
# CLOUDINARY CONFIGURATION
# -------------------------------------------------------------------

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}

# Use Cloudinary for media files
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# -------------------------------------------------------------------
# MEDIA FILES
# -------------------------------------------------------------------

# These are now handled by Cloudinary, but keeping for reference
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# -------------------------------------------------------------------
# DJANGO-HEROKU SETTINGS
# -------------------------------------------------------------------
# Activate Django-Heroku.
django_heroku.settings(locals())
