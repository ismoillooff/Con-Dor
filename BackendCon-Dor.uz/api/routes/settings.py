"""
Public site settings API.

Single endpoint that serves store info for the frontend
(footer, support section, topbar, etc.).
"""
from fastapi import APIRouter

from ..schemas.settings import PublicSettingsOut

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("/public", response_model=PublicSettingsOut, summary="Public store info")
def get_public_settings():
    """Return public-facing store configuration (shop name, contact, social, etc.)."""
    from content.models import SiteSettings

    settings = SiteSettings.load()
    return {
        "shop_name": settings.shop_name,
        "tagline": settings.tagline,
        "tagline_ru": settings.tagline_ru,
        "currency": settings.currency,
        "free_shipping_threshold": settings.free_shipping_threshold,
        "phone": settings.phone,
        "email": settings.email,
        "address": settings.address,
        "workday_hours": settings.workday_hours,
        "saturday_hours": settings.saturday_hours,
        "instagram_url": settings.instagram_url,
        "facebook_url": settings.facebook_url,
        "telegram_url": settings.telegram_url,
        "copyright_text": settings.copyright_text,
        "copyright_text_ru": settings.copyright_text_ru,
    }
