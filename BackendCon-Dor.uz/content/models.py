"""
CMS content models — HeroSlide, Banner, Testimonial, FAQ, Partner.
Matches frontend component data requirements.
"""
from django.db import models


class HeroSlide(models.Model):
    title = models.CharField("Sarlavha", max_length=255)
    title_ru = models.CharField("Sarlavha (RU)", max_length=255, blank=True)
    subtitle = models.TextField("Qisqa tavsif")
    subtitle_ru = models.TextField("Qisqa tavsif (RU)", blank=True)
    cta1_text = models.CharField("CTA 1 matni", max_length=64, blank=True)
    cta1_text_ru = models.CharField("CTA 1 matni (RU)", max_length=64, blank=True)
    cta1_link = models.CharField("CTA 1 havola", max_length=255, blank=True)
    cta2_text = models.CharField("CTA 2 matni", max_length=64, blank=True)
    cta2_text_ru = models.CharField("CTA 2 matni (RU)", max_length=64, blank=True)
    cta2_link = models.CharField("CTA 2 havola", max_length=255, blank=True)
    badge = models.CharField("Badge", max_length=32, blank=True)
    badge_ru = models.CharField("Badge (RU)", max_length=32, blank=True)
    image = models.ImageField("Rasm", upload_to="hero/", blank=True)
    
    # Styling fields
    cta1_bg_color = models.CharField("CTA 1 fon rangi", max_length=20, default="#ffffff")
    cta1_txt_color = models.CharField("CTA 1 matn rangi", max_length=20, default="#000000")
    cta2_bg_color = models.CharField("CTA 2 fon rangi", max_length=20, default="transparent")
    cta2_txt_color = models.CharField("CTA 2 matn rangi", max_length=20, default="#ffffff")
    text_align = models.CharField(
        "Matn tekislash", 
        max_length=20, 
        choices=[('left', 'Chap'), ('center', 'Markaz'), ('right', 'O\'ng')],
        default='left'
    )
    
    overlay_color = models.CharField("Overlay rangi", max_length=20, default="#000000")
    overlay_opacity = models.FloatField("Overlay shaffofligi", default=0.6)
    animation_type = models.CharField(
        "Animatsiya turi",
        max_length=32,
        choices=[
            ('fade-up', 'Yuqoriga chiqib ko\'rinish'),
            ('slide-left', 'Xo\'shdan kelib ko\'rinish'),
            ('zoom-in', 'Kattalashib ko\'rinish'),
            ('blur-in', 'Blur bilan ko\'rinish')
        ],
        default='fade-up'
    )
    
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True, db_index=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        verbose_name = "Hero slayd"
        verbose_name_plural = "Hero slaydlar"
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title


class Banner(models.Model):
    title = models.CharField("Sarlavha", max_length=255)
    subtitle = models.TextField("Qisqa tavsif", blank=True)
    cta_text = models.CharField("Tugma matni", max_length=64, blank=True)
    cta_link = models.CharField("Tugma havola", max_length=255, blank=True)
    image = models.ImageField("Rasm", upload_to="banners/", blank=True)
    is_active = models.BooleanField("Faol", default=True, db_index=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        verbose_name = "Banner"
        verbose_name_plural = "Bannerlar"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class Testimonial(models.Model):
    name = models.CharField("Ism", max_length=128)
    role = models.CharField("Lavozimi", max_length=128, blank=True)
    content = models.TextField("Sharh matni")
    rating = models.PositiveSmallIntegerField("Reyting", default=5)
    avatar = models.ImageField("Avatar", upload_to="testimonials/", blank=True)
    is_active = models.BooleanField("Faol", default=True, db_index=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)

    class Meta:
        verbose_name = "Sharh"
        verbose_name_plural = "Sharhlar"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} — {self.rating}★"


class FAQ(models.Model):
    question = models.CharField("Savol", max_length=255)
    answer = models.TextField("Javob")
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True, db_index=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQlar"
        ordering = ["order"]

    def __str__(self) -> str:
        return self.question[:80]


class Partner(models.Model):
    name = models.CharField("Nomi", max_length=128)
    logo = models.ImageField("Logo", upload_to="partners/", blank=True)
    website = models.URLField("Veb-sayt", blank=True)
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True, db_index=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)

    class Meta:
        verbose_name = "Hamkor"
        verbose_name_plural = "Hamkorlar"
        ordering = ["order"]

    def __str__(self) -> str:
        return self.name


class InstagramPost(models.Model):
    """Manually curated Instagram-style feed entries for the storefront."""
    caption = models.CharField("Sarlavha", max_length=255)
    image = models.ImageField("Rasm", upload_to="instagram/", blank=True)
    link = models.URLField("Havola", blank=True, help_text="Instagram post URL")
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True, db_index=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)

    class Meta:
        verbose_name = "Instagram post"
        verbose_name_plural = "Instagram postlar"
        ordering = ["order"]

    def __str__(self) -> str:
        return self.caption[:60]


class Branch(models.Model):
    """Store branches/locations with contact info and map link."""
    name = models.CharField("Nomi", max_length=255)
    name_ru = models.CharField("Nomi (RU)", max_length=255, blank=True)
    address = models.CharField("Manzil", max_length=255)
    address_ru = models.CharField("Manzil (RU)", max_length=255, blank=True)
    phone = models.CharField("Telefon", max_length=100, blank=True)
    email = models.EmailField("Email", blank=True)
    work_hours = models.CharField("Ish vaqti", max_length=255, blank=True)
    work_hours_ru = models.CharField("Ish vaqti (RU)", max_length=255, blank=True)
    location_url = models.TextField("Xarita (Iframe src yoki URL)", blank=True)
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True, db_index=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        verbose_name = "Filial"
        verbose_name_plural = "Filiallar"
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name


class SiteSettings(models.Model):
    """
    Singleton site-wide configuration.
    Use ``SiteSettings.load()`` to get or create the single record.
    """
    # General
    shop_name = models.CharField("Do'kon nomi", max_length=128, default="Con-Dor.Uz")
    tagline = models.CharField("Tagline", max_length=255, default="Tashqi va Taktik")
    tagline_ru = models.CharField("Tagline (RU)", max_length=255, blank=True, default="Наружное и тактическое снаряжение")
    currency = models.CharField("Valyuta", max_length=10, default="UZS")
    free_shipping_threshold = models.DecimalField(
        "Bepul yetkazish chegarasi", max_digits=12, decimal_places=2, default=500000
    )

    # Contact
    phone = models.CharField("Telefon", max_length=30, default="+41 79 176 16 17")
    email = models.EmailField("Email", default="info@army-shop.ch")
    address = models.CharField("Manzil", max_length=255, default="Shveytsariya")
    workday_hours = models.CharField("Ish kunlari soati", max_length=50, default="09:00 - 16:30")
    saturday_hours = models.CharField("Shanba soati", max_length=50, default="10:00 - 13:30")

    # Social
    instagram_url = models.URLField("Instagram", blank=True, default="https://www.instagram.com/swiss.armyshop/")
    facebook_url = models.URLField("Facebook", blank=True, default="https://www.facebook.com/armyshop.ch/")
    telegram_url = models.URLField("Telegram", blank=True, default="https://t.me/con_dor_uz")

    # Telegram Notification
    telegram_bot_token = models.CharField("Telegram Bot Token", max_length=255, blank=True)
    telegram_channel_id = models.CharField("Telegram Kanal ID", max_length=100, blank=True)

    # SEO

    seo_title = models.CharField("SEO sarlavha", max_length=255, blank=True)
    seo_description = models.TextField("SEO tavsif", blank=True)

    # Legal
    copyright_text = models.CharField(
        "Copyright", max_length=255,
        default="© 2026 Army Shop CH. Barcha huquqlar himoyalangan.",
    )
    copyright_text_ru = models.CharField(
        "Copyright (RU)", max_length=255,
        default="© 2026 Army Shop CH. Все права защищены.",
    )

    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        verbose_name = "Sayt sozlamalari"
        verbose_name_plural = "Sayt sozlamalari"

    def __str__(self) -> str:
        return f"SiteSettings ({self.shop_name})"

    def save(self, *args, **kwargs):
        """Enforce singleton: always save as pk=1."""
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls) -> "SiteSettings":
        """Get or create the singleton settings record."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

