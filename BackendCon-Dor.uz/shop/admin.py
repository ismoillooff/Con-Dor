from django.contrib import admin
from .models import Section, Category, SubCategory, Product, ProductImage, Review

class CategoryInline(admin.TabularInline):
    model = Category
    extra = 1
    prepopulated_fields = {"slug": ("name",)}
    fields = ["name", "slug", "order", "is_active"]

class SubCategoryInline(admin.TabularInline):
    model = SubCategory
    extra = 1
    prepopulated_fields = {"slug": ("name",)}
    fields = ["name", "slug", "order", "is_active"]

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order", "is_active"]
    list_editable = ["order", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CategoryInline]
    search_fields = ["name", "slug"]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "section", "slug", "order", "is_active"]
    list_filter = ["section", "is_active"]
    list_editable = ["order", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [SubCategoryInline]
    search_fields = ["name", "slug"]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related("section")

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "slug", "order", "is_active"]
    list_filter = ["category__section", "category", "is_active"]
    list_editable = ["order", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name", "slug"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("category__section")

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "get_section", "get_category", "subcategory", "price", "is_active", "is_featured"]
    list_filter = [
        "subcategory__category__section", 
        "subcategory__category", 
        "subcategory", 
        "is_active", 
        "is_featured"
    ]
    search_fields = ["name", "slug", "description"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]
    
    def get_section(self, obj):
        return obj.subcategory.category.section
    get_section.short_description = "Bo'lim"
    
    def get_category(self, obj):
        return obj.subcategory.category
    get_category.short_description = "Kategoriya"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "subcategory__category__section"
        )
    
    def save_model(self, request, obj, form, change):
        """Enforce clean() validation during admin save."""
        obj.full_clean()
        super().save_model(request, obj, form, change)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("product__name", "user__email", "text")
    readonly_fields = ("created_at",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("product", "user")

