"""
Django settings for Con-Dor.Uz backend.

All sensitive values loaded from environment variables.
"""
import os
from pathlib import Path

from decouple import Csv, config

# ─── Paths ───────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Security ────────────────────────────────────────
SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())

# ─── Application definition ─────────────────────────
INSTALLED_APPS = [
    # Django built-in
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "corsheaders",
    # Project apps
    "accounts",
    "shop",
    "orders",
    "content",
    "newsletter",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

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

WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"

# ─── Database ────────────────────────────────────────
# Default: SQLite. For PostgreSQL, set DATABASE_URL in env
_db_url = config("DATABASE_URL", default="sqlite:///db.sqlite3")

if _db_url.startswith("sqlite"):
    _db_path = _db_url.replace("sqlite:///", "")
    if not os.path.isabs(_db_path):
        _db_path = str(BASE_DIR / _db_path)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": _db_path,
        }
    }
else:
    # PostgreSQL: postgres://user:pass@host:port/dbname
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": _db_url,
        }
    }

# ─── Custom User Model ──────────────────────────────
AUTH_USER_MODEL = "accounts.User"

# ─── Password Validation ────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ─── Internationalization ───────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

# ─── Static & Media ─────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = config("MEDIA_URL", default="/media/")
MEDIA_ROOT = BASE_DIR / config("MEDIA_ROOT", default="media")
BACKEND_URL = config("BACKEND_URL", default="https://api.con-dor.uz")
FRONTEND_URL = config("FRONTEND_URL", default="https://con-dor.uz")

# ─── CORS ────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config("CORS_ORIGINS", default="", cast=Csv())
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "origin",
    "user-agent",
    "x-requested-with",
]

# ─── Default primary key ────────────────────────────
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
