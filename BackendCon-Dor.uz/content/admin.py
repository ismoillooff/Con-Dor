from django.contrib import admin

from .models import HeroSlide, Banner, Testimonial, FAQ, Partner, InstagramPost, SiteSettings


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "badge", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "cta_text", "is_active", "created_at")
    list_filter = ("is_active",)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "rating", "is_active", "created_at")
    list_filter = ("is_active", "rating")
    search_fields = ("name", "content")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("question", "answer")


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ("name", "website", "order", "is_active")
    list_editable = ("order", "is_active")


@admin.register(InstagramPost)
class InstagramPostAdmin(admin.ModelAdmin):
    list_display = ("caption", "order", "is_active", "created_at")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("shop_name", "currency", "phone", "email", "updated_at")
    
    fieldsets = (
        ("Umumiy", {
            "fields": ("shop_name", "tagline", "currency", "free_shipping_threshold", "copyright_text")
        }),
        ("Aloqa", {
            "fields": ("phone", "email", "address", "workday_hours", "saturday_hours")
        }),
        ("Ijtimoiy tarmoqlar", {
            "fields": ("instagram_url", "facebook_url")
        }),
        ("Telegram Bildirishnomalari", {
            "fields": ("telegram_bot_token", "telegram_channel_id"),
            "description": "Yangi buyurtmalar haqida xabarlarni Telegram kanalga yuborish uchun bot token va kanal ID sini kiriting."
        }),
        ("SEO", {
            "fields": ("seo_title", "seo_description")
        }),
    )

    def has_add_permission(self, request):
        """Prevent creating more than one SiteSettings record."""
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        """Prevent deleting the singleton."""
        return False
