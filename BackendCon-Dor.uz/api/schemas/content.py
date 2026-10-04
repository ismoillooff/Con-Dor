"""CMS content Pydantic schemas."""
from pydantic import BaseModel, Field


# ─── HeroSlide ───────────────────────────────────────
class HeroSlideOut(BaseModel):
    id: int
    title: str
    title_ru: str = ""
    subtitle: str
    subtitle_ru: str = ""
    cta1_text: str
    cta1_text_ru: str = ""
    cta1_link: str
    cta2_text: str
    cta2_text_ru: str = ""
    cta2_link: str
    badge: str
    badge_ru: str = ""
    image: str | None = None
    cta1_bg_color: str
    cta1_txt_color: str
    cta2_bg_color: str
    cta2_txt_color: str
    text_align: str
    overlay_color: str
    overlay_opacity: float
    animation_type: str
    order: int
    is_active: bool

    class Config:
        from_attributes = True


class HeroSlideCreate(BaseModel):
    title: str = Field(..., max_length=255)
    title_ru: str = ""
    subtitle: str = ""
    subtitle_ru: str = ""
    cta1_text: str = ""
    cta1_text_ru: str = ""
    cta1_link: str = ""
    cta2_text: str = ""
    cta2_text_ru: str = ""
    cta2_link: str = ""
    badge: str = ""
    badge_ru: str = ""
    cta1_bg_color: str = "#ffffff"
    cta1_txt_color: str = "#000000"
    cta2_bg_color: str = "transparent"
    cta2_txt_color: str = "#ffffff"
    text_align: str = "left"
    overlay_color: str = "#000000"
    overlay_opacity: float = 0.6
    animation_type: str = "fade-up"
    order: int = 0
    is_active: bool = True
    image: str | None = None


class HeroSlideUpdate(BaseModel):
    title: str | None = None
    title_ru: str | None = None
    subtitle: str | None = None
    subtitle_ru: str | None = None
    cta1_text: str | None = None
    cta1_text_ru: str | None = None
    cta1_link: str | None = None
    cta2_text: str | None = None
    cta2_text_ru: str | None = None
    cta2_link: str | None = None
    badge: str | None = None
    badge_ru: str | None = None
    cta1_bg_color: str | None = None
    cta1_txt_color: str | None = None
    cta2_bg_color: str | None = None
    cta2_txt_color: str | None = None
    text_align: str | None = None
    overlay_color: str | None = None
    overlay_opacity: float | None = None
    animation_type: str | None = None
    order: int | None = None
    is_active: bool | None = None
    image: str | None = None


# ─── Banner ──────────────────────────────────────────
class BannerOut(BaseModel):
    id: int
    title: str
    subtitle: str
    cta_text: str
    cta_link: str
    image: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


class BannerCreate(BaseModel):
    title: str = Field(..., max_length=255)
    subtitle: str = ""
    cta_text: str = ""
    cta_link: str = ""
    is_active: bool = True


class BannerUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    cta_text: str | None = None
    cta_link: str | None = None
    is_active: bool | None = None


# ─── Testimonial ─────────────────────────────────────
class TestimonialOut(BaseModel):
    id: int
    name: str
    role: str
    content: str
    rating: int
    avatar: str | None = None

    class Config:
        from_attributes = True


class TestimonialCreate(BaseModel):
    name: str = Field(..., max_length=128)
    role: str = ""
    content: str
    rating: int = Field(5, ge=1, le=5)
    is_active: bool = True


class TestimonialUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    content: str | None = None
    rating: int | None = None
    is_active: bool | None = None


# ─── FAQ ─────────────────────────────────────────────
class FAQOut(BaseModel):
    id: int
    question: str
    answer: str
    order: int

    class Config:
        from_attributes = True


class FAQCreate(BaseModel):
    question: str = Field(..., max_length=255)
    answer: str
    order: int = 0
    is_active: bool = True


class FAQUpdate(BaseModel):
    question: str | None = None
    answer: str | None = None
    order: int | None = None
    is_active: bool | None = None


# ─── Partner ─────────────────────────────────────────
class PartnerOut(BaseModel):
    id: int
    name: str
    logo: str | None = None
    website: str
    order: int

    class Config:
        from_attributes = True


class PartnerCreate(BaseModel):
    name: str = Field(..., max_length=128)
    website: str = ""
    order: int = 0
    is_active: bool = True


class PartnerUpdate(BaseModel):
    name: str | None = None
    website: str | None = None
    order: int | None = None
    is_active: bool | None = None


# ─── Newsletter ──────────────────────────────────────
class NewsletterSubscribe(BaseModel):
    email: str = Field(..., max_length=254)


class NewsletterOut(BaseModel):
    id: int
    email: str
    subscribed_at: str

    class Config:
        from_attributes = True


# ─── Dashboard ───────────────────────────────────────
class DashboardStats(BaseModel):
    total_products: int
    total_orders: int
    total_users: int
    total_revenue: float
    recent_orders: int
    active_products: int


# ─── Instagram ───────────────────────────────────────
class InstagramPostOut(BaseModel):
    id: int
    caption: str
    image: str | None = None
    link: str
    order: int
    is_active: bool

    class Config:
        from_attributes = True


class InstagramPostCreate(BaseModel):
    caption: str = Field(..., max_length=255)
    link: str = ""
    order: int = 0
    is_active: bool = True


class InstagramPostUpdate(BaseModel):
    caption: str | None = None
    link: str | None = None
    order: int | None = None
    is_active: bool | None = None


# ─── Admin Orders ────────────────────────────────────
class AdminOrderItemOut(BaseModel):
    """Product details within an order."""
    product_name: str
    quantity: int
    price: float


class AdminOrderOut(BaseModel):
    """Order listing for the admin panel."""
    id: int
    user_email: str | None = None
    user_full_name: str | None = None
    status: str
    total_amount: float
    address: str
    phone: str
    note: str
    item_count: int
    items: list[AdminOrderItemOut] = []
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    """Payload for changing an order's status."""
    status: str = Field(
        ...,
        description="One of: pending, confirmed, processing, shipped, delivered, cancelled",
    )


class PaginatedAdminOrderOut(BaseModel):
    """Paginated order listing with metadata."""
    items: list[AdminOrderOut]
    total: int
    page: int
    page_size: int
    total_pages: int


# ─── Branch ──────────────────────────────────────────
class BranchOut(BaseModel):
    id: int
    name: str
    name_ru: str = ""
    address: str
    address_ru: str = ""
    phone: str = ""
    email: str = ""
    work_hours: str = ""
    work_hours_ru: str = ""
    location_url: str = ""
    order: int
    is_active: bool

    class Config:
        from_attributes = True


class BranchCreate(BaseModel):
    name: str = Field(..., max_length=255)
    name_ru: str = ""
    address: str = Field(..., max_length=255)
    address_ru: str = ""
    phone: str = ""
    email: str = ""
    work_hours: str = ""
    work_hours_ru: str = ""
    location_url: str = ""
    order: int = 0
    is_active: bool = True


class BranchUpdate(BaseModel):
    name: str | None = None
    name_ru: str | None = None
    address: str | None = None
    address_ru: str | None = None
    phone: str | None = None
    email: str | None = None
    work_hours: str | None = None
    work_hours_ru: str | None = None
    location_url: str | None = None
    order: int | None = None
    is_active: bool | None = None

