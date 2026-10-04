"""
Orders models — Order and OrderItem.
"""
from django.conf import settings
from django.db import models


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Kutilmoqda"
    CONFIRMED = "confirmed", "Tasdiqlangan"
    PROCESSING = "processing", "Tayyorlanmoqda"
    SHIPPED = "shipped", "Jo'natilgan"
    DELIVERED = "delivered", "Yetkazilgan"
    CANCELLED = "cancelled", "Bekor qilingan"


class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Foydalanuvchi",
        null=True,
        blank=True,
    )
    full_name = models.CharField("F.I.SH.", max_length=255, blank=True)
    status = models.CharField(
        "Holat",
        max_length=16,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        db_index=True,
    )
    total_amount = models.DecimalField("Jami summa", max_digits=12, decimal_places=2, default=0)
    address = models.TextField("Manzil")
    phone = models.CharField("Telefon", max_length=20)
    note = models.TextField("Izoh", blank=True)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        verbose_name = "Buyurtma"
        verbose_name_plural = "Buyurtmalar"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self) -> str:
        owner = self.user.email if self.user else f"Mehmon: {self.full_name}"
        return f"Buyurtma #{self.pk} — {owner}"

    def recalculate_total(self) -> None:
        self.total_amount = sum(item.total for item in self.items.all())
        self.save(update_fields=["total_amount"])


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Buyurtma",
    )
    product = models.ForeignKey(
        "shop.Product",
        on_delete=models.SET_NULL,
        null=True,
        related_name="order_items",
        verbose_name="Mahsulot",
    )
    product_name = models.CharField("Mahsulot nomi", max_length=255)
    quantity = models.PositiveIntegerField("Soni", default=1)
    size = models.CharField("O'lcham", max_length=50, blank=True)
    color = models.CharField("Rang", max_length=100, blank=True)
    price = models.DecimalField("Narx", max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Buyurtma elementi"
        verbose_name_plural = "Buyurtma elementlari"

    def __str__(self) -> str:
        return f"{self.product_name} x{self.quantity}"

    @property
    def total(self) -> float:
        return float(self.price) * self.quantity


# ─── Cart ────────────────────────────────────────────
class Cart(models.Model):
    """
    Shopping cart — supports both authenticated users and anonymous guests.
    Authenticated users are linked via `user` FK; guests via `session_key`.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="cart",
        verbose_name="Foydalanuvchi",
    )
    session_key = models.CharField(
        "Sessiya kaliti",
        max_length=64,
        blank=True,
        db_index=True,
        help_text="Anonymous guest identifier",
    )
    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    class Meta:
        verbose_name = "Savat"
        verbose_name_plural = "Savatlar"

    def __str__(self) -> str:
        owner = self.user.email if self.user else f"guest:{self.session_key[:12]}"
        return f"Cart #{self.pk} — {owner}"

    @property
    def total_amount(self) -> float:
        return sum(item.subtotal for item in self.items.all())

    @property
    def item_count(self) -> int:
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Individual line item inside a cart."""
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Savat",
    )
    product = models.ForeignKey(
        "shop.Product",
        on_delete=models.CASCADE,
        related_name="cart_items",
        verbose_name="Mahsulot",
    )
    quantity = models.PositiveIntegerField("Soni", default=1)
    size = models.CharField("O'lcham", max_length=10, blank=True)
    color = models.CharField("Rang", max_length=30, blank=True)
    added_at = models.DateTimeField("Qo'shilgan", auto_now_add=True)

    class Meta:
        verbose_name = "Savat elementi"
        verbose_name_plural = "Savat elementlari"
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "product", "size", "color"],
                name="unique_cart_item_variant",
            )
        ]

    def __str__(self) -> str:
        return f"{self.product.name} x{self.quantity}"

    @property
    def subtotal(self) -> float:
        return float(self.product.price) * self.quantity


# ─── Wishlist ────────────────────────────────────────
class Wishlist(models.Model):
    """A user's saved/favourite products."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wishlist",
        verbose_name="Foydalanuvchi",
    )
    product = models.ForeignKey(
        "shop.Product",
        on_delete=models.CASCADE,
        related_name="wishlisted_by",
        verbose_name="Mahsulot",
    )
    added_at = models.DateTimeField("Qo'shilgan", auto_now_add=True)

    class Meta:
        verbose_name = "Tanlangan"
        verbose_name_plural = "Tanlanganlar"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                name="unique_wishlist_item",
            )
        ]
        ordering = ["-added_at"]

    def __str__(self) -> str:
        return f"{self.user.email} ♡ {self.product.name}"

