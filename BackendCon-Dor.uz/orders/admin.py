from django.contrib import admin

from .models import Order, OrderItem, Cart, CartItem, Wishlist


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "product_name", "quantity", "price")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name", "status", "total_amount", "phone", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__email", "phone", "address")
    readonly_fields = ("created_at", "updated_at")
    inlines = [OrderItemInline]
    list_editable = ("status",)


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ("product", "quantity", "size", "color")


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "session_key", "item_count", "updated_at")
    list_filter = ("updated_at",)
    search_fields = ("user__email", "session_key")
    inlines = [CartItemInline]


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "added_at")
    list_filter = ("added_at",)
    search_fields = ("user__email", "product__name")
