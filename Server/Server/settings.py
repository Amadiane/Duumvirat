"""
Configuration Django — Duumvirat Business
Stack : Django + DRF, PostgreSQL en prod (SQLite en dev), JWT (zone admin),
CORS, stockage média (Cloudinary en prod), audit des actions admin.
"""

from pathlib import Path
from datetime import timedelta
import dj_database_url
from decouple import config, Csv

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY", default="dev-secret-key-a-changer-en-production")
DEBUG = config("DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="127.0.0.1,localhost", cast=Csv())

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Tiers
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "auditlog",
    # Apps du projet
    "contenu",
    "contact",
    "seo",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "auditlog.middleware.AuditlogMiddleware",
]

ROOT_URLCONF = "Server.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "Server.wsgi.application"

# --- Base de données ---
# Dev : SQLite par défaut. Prod (Render) : DATABASE_URL fourni en variable d'env.
DATABASE_URL = config("DATABASE_URL", default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
DATABASES = {"default": dj_database_url.parse(DATABASE_URL, conn_max_age=600)}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "fr"
TIME_ZONE = "Africa/Casablanca"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# --- Cloudinary (production) ---
USE_CLOUDINARY = config("USE_CLOUDINARY", default=False, cast=bool)
if USE_CLOUDINARY:
    INSTALLED_APPS += ["cloudinary_storage", "cloudinary"]
    STORAGES["default"] = {"BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage"}
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME", default=""),
        "API_KEY": config("CLOUDINARY_API_KEY", default=""),
        "API_SECRET": config("CLOUDINARY_API_SECRET", default=""),
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- DRF / JWT (zone admin uniquement) ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    "DEFAULT_THROTTLE_CLASSES": ("rest_framework.throttling.AnonRateThrottle",),
    "DEFAULT_THROTTLE_RATES": {
        "anon": "1000/day",
        "demande_contact": "15/hour",
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

# --- CORS ---
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173,http://127.0.0.1:5173",
    cast=Csv(),
)

# --- E-mail (notification à chaque nouvelle demande) ---
EMAIL_BACKEND = config(
    "EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend"
)
EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
# LWS (et d'autres hebergeurs) utilisent le SSL sur le port 465 plutot que le
# TLS/STARTTLS sur le port 587 : les deux variables sont mutuellement
# exclusives cote Django, on n'active donc jamais les deux a la fois.
EMAIL_USE_SSL = config("EMAIL_USE_SSL", default=False, cast=bool)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=not EMAIL_USE_SSL, cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default="sac@duumviratbusiness.com")
EMAIL_NOTIFICATION_DESTINATAIRES = config(
    "EMAIL_NOTIFICATION_DESTINATAIRES",
    default="sac@duumviratbusiness.com",
    cast=Csv(),
)

SITE_ID = 1