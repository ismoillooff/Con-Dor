"""SiteSettings Pydantic schemas."""
from decimal import Decimal

from pydantic import BaseModel


class PublicSettingsOut(BaseModel):
    """Public-facing store info (for footer, navbar, support sections)."""
    shop_name: str
    tagline: str
    tagline_ru: str = ""
    currency: str
    free_shipping_threshold: Decimal
    phone: str
    email: str
    address: str
    workday_hours: str
    saturday_hours: str
    instagram_url: str
    facebook_url: str
    telegram_url: str
    copyright_text: str
    copyright_text_ru: str = ""

    class Config:
        from_attributes = True


class SiteSettingsOut(PublicSettingsOut):
    """Admin view — includes SEO and Telegram fields."""
    seo_title: str
    seo_description: str
    telegram_bot_token: str
    telegram_channel_id: str
    updated_at: str


    class Config:
        from_attributes = True


class SiteSettingsUpdate(BaseModel):
    """Admin update payload — all fields optional."""
    shop_name: str | None = None
    tagline: str | None = None
    tagline_ru: str | None = None
    currency: str | None = None
    free_shipping_threshold: Decimal | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    workday_hours: str | None = None
    saturday_hours: str | None = None
    instagram_url: str | None = None
    facebook_url: str | None = None
    telegram_url: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    copyright_text: str | None = None
    copyright_text_ru: str | None = None
    telegram_bot_token: str | None = None
    telegram_channel_id: str | None = None

