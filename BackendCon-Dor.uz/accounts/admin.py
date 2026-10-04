from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "first_name", "last_name", "role", "is_active", "created_at")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("email", "first_name", "last_name", "phone")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Shaxsiy", {"fields": ("first_name", "last_name", "phone")}),
        ("Ruxsatlar", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Sanalar", {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "first_name", "last_name", "role"),
        }),
    )
