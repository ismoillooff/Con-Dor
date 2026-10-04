from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify

class Section(models.Model):
    """
    Level 1: Main Departments (e.g., Kiyimlar, Jihozlar)
    """
    name = models.CharField(max_length=100, db_index=True)
    name_ru = models.CharField("Nomi (RU)", max_length=100, blank=True)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    # CMS fields for Section
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, default="#000000")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Bo'lim"
        verbose_name_plural = "Bo'limlar"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

class Category(models.Model):
    """
    Level 2: Categories within a Section (e.g., USTKI KIYIM under Kiyimlar)
    """
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="categories", db_index=True)
    name = models.CharField(max_length=100)
    name_ru = models.CharField("Nomi (RU)", max_length=100, blank=True)
    slug = models.SlugField(max_length=120, db_index=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    # CMS fields
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, default="#000000")
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"
        ordering = ["order", "name"]
        constraints = [
            models.UniqueConstraint(fields=["slug", "section"], name="unique_category_slug_per_section")
        ]

    def __str__(self):
        return f"{self.section.name} > {self.name}"

    def clean(self):
        if not self.section.is_active and self.is_active:
            raise ValidationError({"is_active": "Kategoriya faol bo'lishi uchun uning bo'limi ham faol bo'lishi kerak."})

class SubCategory(models.Model):
    """
    Level 3: Specific sub-groupings (e.g., Kurtka under USTKI KIYIM)
    """
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories", db_index=True)
    name = models.CharField(max_length=100)
    name_ru = models.CharField("Nomi (RU)", max_length=100, blank=True)
    slug = models.SlugField(max_length=120, db_index=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Sub-kategoriya"
        verbose_name_plural = "Sub-kategoriyalar"
        ordering = ["order", "name"]
        constraints = [
            models.UniqueConstraint(fields=["slug", "category"], name="unique_subcategory_slug_per_category")
        ]

    def __str__(self):
        return f"{self.category.name} > {self.name}"

    def clean(self):
        if not self.category.is_active and self.is_active:
            raise ValidationError({"is_active": "Sub-kategoriya faol bo'lishi uchun uning kategoriyasi ham faol bo'lishi kerak."})

class Product(models.Model):
    """
    Product model linked to Level 3: SubCategory
    """
    subcategory = models.ForeignKey(SubCategory, on_delete=models.PROTECT, related_name="products", db_index=True)
    name = models.CharField(max_length=255, db_index=True)
    name_ru = models.CharField("Nomi (RU)", max_length=255, blank=True, default="")
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    description = models.TextField()
    description_ru = models.TextField("Tavsif (RU)", blank=True, default="")
    
    # Financials
    price = models.DecimalField(max_digits=12, decimal_places=2, db_index=True)
    old_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Attributes
    badge = models.CharField(max_length=50, blank=True, default="")
    badge_ru = models.CharField("Badge (RU)", max_length=50, blank=True, default="")
    rating = models.FloatField(default=0.0, db_index=True)
    reviews_count = models.PositiveIntegerField(default=0)
    
    color = models.CharField(max_length=100, blank=True, default="")
    color_ru = models.CharField("Rang (RU)", max_length=100, blank=True, default="")
    
    sub = models.CharField(max_length=100, blank=True, default="")
    sub_ru = models.CharField("Brend (RU)", max_length=100, blank=True, default="")
    
    # Dynamic Attributes
    sizes = models.JSONField("O'lchamlar", default=list, blank=True)
    colors = models.JSONField("Ranglar (Variantlar)", default=list, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=['is_active', 'price']),
            models.Index(fields=['subcategory', 'is_active']),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        if not self.subcategory.is_active and self.is_active:
            raise ValidationError({"is_active": "Mahsulot faol bo'lishi uchun uning sub-kategoriyasi ham faol bo'lishi kerak."})

    @property
    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return round(((self.old_price - self.price) / self.old_price) * 100)
        return 0

    @property
    def primary_image(self):
        img = self.images.filter(is_primary=True).first()
        if not img:
            img = self.images.first()
        return img

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Mahsulot rasmi"
        verbose_name_plural = "Mahsulot rasmlari"
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} - Image"


class Review(models.Model):
    """
    Product review — one review per user per product.
    On save/delete, the parent product's rating/reviews_count are recalculated.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Foydalanuvchi",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Mahsulot",
    )
    rating = models.PositiveSmallIntegerField(
        "Reyting",
        help_text="1 dan 5 gacha baho",
    )
    text = models.TextField("Sharh matni", blank=True)
    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)

    class Meta:
        verbose_name = "Sharh"
        verbose_name_plural = "Sharhlar"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                name="unique_review_per_user_product",
            )
        ]

    def __str__(self) -> str:
        return f"{self.user.email} → {self.product.name} ({self.rating}★)"

    def clean(self):
        if self.rating is not None and not (1 <= self.rating <= 5):
            raise ValidationError({"rating": "Reyting 1 dan 5 gacha bo'lishi kerak."})

    def update_product_stats(self) -> None:
        """Recalculate product rating & reviews_count from all reviews."""
        from django.db.models import Avg, Count

        stats = Review.objects.filter(product=self.product).aggregate(
            avg_rating=Avg("rating"),
            total=Count("id"),
        )
        Product.objects.filter(pk=self.product_id).update(
            rating=round(stats["avg_rating"] or 0, 1),
            reviews_count=stats["total"],
        )

