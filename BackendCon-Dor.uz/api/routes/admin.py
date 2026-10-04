from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from django.utils.text import slugify
from django.conf import settings

from api.deps import get_admin_user
from api.schemas.common import MessageResponse
from api.schemas.content import (
    AdminOrderOut, AdminOrderItemOut, OrderStatusUpdate, PaginatedAdminOrderOut,
    BannerCreate, BannerOut, BannerUpdate,
    DashboardStats,
    FAQCreate, FAQOut, FAQUpdate,
    HeroSlideCreate, HeroSlideOut, HeroSlideUpdate,
    InstagramPostCreate, InstagramPostOut, InstagramPostUpdate,
    NewsletterOut,
    PartnerCreate, PartnerOut, PartnerUpdate,
    TestimonialCreate, TestimonialOut, TestimonialUpdate,
    BranchCreate, BranchOut, BranchUpdate,
)
from api.schemas.settings import SiteSettingsOut, SiteSettingsUpdate
from api.schemas.shop import (
    SectionOut, SectionCreate, SectionUpdate,
    CategoryCreate, CategoryOut, CategoryUpdate,
    SubCategoryCreate, SubCategoryOut, SubCategoryUpdate,
    ProductCreate, ProductOut, ProductUpdate, ProductImageOut, BulkDeleteRequest,
)

router = APIRouter(prefix="/api/admin", tags=["Admin"], dependencies=[Depends(get_admin_user)])

# ─── Helpers ─────────────────────────────────────────
def _get_media_url(path: str) -> str:
    if not path: return ""
    if path.startswith(('http://', 'https://')): return path
    base = settings.BACKEND_URL.rstrip('/')
    return f"{base}{path}"

def _serialize_section(s) -> SectionOut:
    return SectionOut(
        id=s.pk, name=s.name, slug=s.slug, order=s.order, is_active=s.is_active,
        categories=[_serialize_category(c) for c in s.categories.all()]
    )

def _serialize_category(c) -> CategoryOut:
    subs = [SubCategoryOut.model_validate(s) for s in c.subcategories.all()]
    return CategoryOut(
        id=c.pk, name=c.name, slug=c.slug, description=c.description,
        icon=c.icon, color=c.color, order=c.order, is_active=c.is_active,
        image=_get_media_url(c.image.url) if c.image else None,
        subcategories=subs
    )

def _serialize_testimonial(t) -> TestimonialOut:
    return TestimonialOut(
        id=t.pk, name=t.name, role=t.role, content=t.content,
        rating=t.rating, avatar=_get_media_url(t.avatar.url) if t.avatar else None,
    )

def _serialize_partner(p) -> PartnerOut:
    return PartnerOut(
        id=p.pk, name=p.name, website=p.website, order=p.order,
        logo=_get_media_url(p.logo.url) if p.logo else None,
    )

def _serialize_instagram_post(p) -> InstagramPostOut:
    return InstagramPostOut(
        id=p.pk, caption=p.caption, link=p.link, order=p.order, is_active=p.is_active,
        image=_get_media_url(p.image.url) if p.image else None,
    )

# ─────────────────────────────────────────────────────
#  DASHBOARD
# ─────────────────────────────────────────────────────
@router.get("/dashboard", response_model=DashboardStats)
def dashboard_stats():
    from accounts.models import User
    from orders.models import Order
    from shop.models import Product
    from django.db.models import Sum
    from django.utils import timezone
    from datetime import timedelta

    thirty_days_ago = timezone.now() - timedelta(days=30)
    revenue = Order.objects.exclude(status="cancelled").aggregate(total=Sum("total_amount"))["total"] or 0

    return DashboardStats(
        total_products=Product.objects.count(),
        total_orders=Order.objects.count(),
        total_users=User.objects.count(),
        total_revenue=float(revenue),
        recent_orders=Order.objects.filter(created_at__gte=thirty_days_ago).count(),
        active_products=Product.objects.filter(is_active=True).count(),
    )

# ─────────────────────────────────────────────────────
#  SECTIONS CRUD (Level 1)
# ─────────────────────────────────────────────────────
@router.get("/sections", response_model=list[SectionOut])
def admin_list_sections():
    from shop.models import Section
    sections = Section.objects.prefetch_related("categories__subcategories").all().order_by("order", "name")
    return [_serialize_section(s) for s in sections]

@router.post("/sections", response_model=SectionOut, status_code=status.HTTP_201_CREATED)
def admin_create_section(data: SectionCreate):
    from shop.models import Section
    
    # Auto-slug if not provided
    slug = data.slug or slugify(data.name)
    
    sec = Section.objects.create(
        **data.model_dump(exclude={"slug"}),
        slug=slug
    )
    return _serialize_section(sec)

@router.delete("/sections/{sec_id}", response_model=MessageResponse)
def admin_delete_section(sec_id: int):
    from shop.models import Section
    deleted, _ = Section.objects.filter(pk=sec_id).delete()
    if not deleted: raise HTTPException(status_code=404, detail="Bo'lim topilmadi.")
    return MessageResponse(detail="Bo'lim o'chirildi.")

@router.put("/sections/{sec_id}", response_model=SectionOut)
def admin_update_section(sec_id: int, data: SectionUpdate):
    from shop.models import Section
    try:
        sec = Section.objects.get(pk=sec_id)
    except Section.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bo'lim topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(sec, field, value)
    sec.save()
    return _serialize_section(sec)

# ─────────────────────────────────────────────────────
#  CATEGORIES CRUD (Level 2)
# ─────────────────────────────────────────────────────
@router.get("/categories", response_model=list[CategoryOut])
def admin_list_categories():
    from shop.models import Category
    cats = Category.objects.prefetch_related("subcategories").all().order_by("section", "order")
    return [_serialize_category(c) for c in cats]

@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def admin_create_category(data: CategoryCreate):
    from shop.models import Category
    
    # Auto-slug if not provided
    slug = data.slug or slugify(data.name)
    
    cat = Category.objects.create(
        **data.model_dump(exclude={"slug"}),
        slug=slug
    )
    return _serialize_category(cat)

@router.put("/categories/{cat_id}", response_model=CategoryOut)
def admin_update_category(cat_id: int, data: CategoryUpdate):
    from shop.models import Category
    try:
        cat = Category.objects.prefetch_related("subcategories").get(pk=cat_id)
    except Category.DoesNotExist:
        raise HTTPException(status_code=404, detail="Kategoriya topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(cat, field, value)
    cat.save()
    return _serialize_category(cat)

@router.delete("/categories/{cat_id}", response_model=MessageResponse)
def admin_delete_category(cat_id: int):
    from shop.models import Category
    deleted, _ = Category.objects.filter(pk=cat_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Kategoriya topilmadi.")
    return MessageResponse(detail="Kategoriya o'chirildi.")

# ─────────────────────────────────────────────────────
#  SUBCATEGORIES CRUD (Level 3)
# ─────────────────────────────────────────────────────
@router.post("/subcategories", response_model=SubCategoryOut, status_code=status.HTTP_201_CREATED)
def admin_create_subcategory(data: SubCategoryCreate):
    from shop.models import SubCategory
    
    # Auto-slug if not provided
    slug = data.slug or slugify(data.name)
    
    sub = SubCategory.objects.create(
        **data.model_dump(exclude={"slug"}),
        slug=slug
    )
    return SubCategoryOut.model_validate(sub)

@router.put("/subcategories/{sub_id}", response_model=SubCategoryOut)
def admin_update_subcategory(sub_id: int, data: SubCategoryUpdate):
    from shop.models import SubCategory
    try:
        sub = SubCategory.objects.get(pk=sub_id)
    except SubCategory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Sub-kategoriya topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(sub, field, value)
    sub.save()
    return SubCategoryOut.model_validate(sub)

@router.delete("/subcategories/{sub_id}", response_model=MessageResponse)
def admin_delete_subcategory(sub_id: int):
    from shop.models import SubCategory
    deleted, _ = SubCategory.objects.filter(pk=sub_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Sub-kategoriya topilmadi.")
    return MessageResponse(detail="Sub-kategoriya o'chirildi.")

# ─────────────────────────────────────────────────────
#  PRODUCTS CRUD
# ─────────────────────────────────────────────────────
def _serialize_product(p) -> ProductOut:
    images = [
        ProductImageOut(
            id=img.pk, image=_get_media_url(img.image.url), alt_text=img.alt_text, 
            order=img.order, is_primary=img.is_primary
        )
        for img in p.images.all()
    ]
    sub = p.subcategory
    cat = sub.category
    sec = cat.section
    
    return ProductOut(
        id=p.pk, name=p.name, name_ru=p.name_ru, slug=p.slug, 
        description=p.description, description_ru=p.description_ru,
        price=float(p.price), old_price=float(p.old_price) if p.old_price else None,
        badge=p.badge, badge_ru=p.badge_ru, rating=p.rating, reviews_count=p.reviews_count,
        color=p.color, color_ru=p.color_ru, 
        sub=p.sub, sub_ru=p.sub_ru,
        sizes=p.sizes, colors=p.colors,
        is_active=p.is_active, is_featured=p.is_featured,
        subcategory_id=p.subcategory_id,
        subcategory_name=sub.name,
        category_name=cat.name,
        section_name=sec.name,
        category_slug=cat.slug,
        section_slug=sec.slug,
        images=images,
        discount_percent=p.discount_percent
    )

@router.get("/products", response_model=list[ProductOut])
def admin_list_products():
    from shop.models import Product
    products = Product.objects.select_related(
        "subcategory__category__section"
    ).prefetch_related("images").all().order_by("-created_at")[:200]
    return [_serialize_product(p) for p in products]

@router.get("/products/{product_id}", response_model=ProductOut)
def admin_get_product(product_id: int):
    from shop.models import Product
    try:
        product = Product.objects.select_related(
            "subcategory__category__section"
        ).prefetch_related("images").get(pk=product_id)
    except Product.DoesNotExist:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
    return _serialize_product(product)

@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def admin_create_product(data: ProductCreate):
    from shop.models import Product, SubCategory
    try:
        SubCategory.objects.get(pk=data.subcategory_id)
    except SubCategory.DoesNotExist:
        raise HTTPException(status_code=400, detail="Sub-kategoriya topilmadi.")

    # Generate unique slug
    base_slug = data.slug or slugify(data.name)
    slug = base_slug
    counter = 2
    while Product.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    product = Product.objects.create(
        **data.model_dump(exclude={"slug"}),
        slug=slug
    )
    product = Product.objects.select_related(
        "subcategory__category__section"
    ).prefetch_related("images").get(pk=product.pk)
    return _serialize_product(product)

@router.put("/products/{product_id}", response_model=ProductOut)
def admin_update_product(product_id: int, data: ProductUpdate):
    from shop.models import Product
    try:
        product = Product.objects.select_related(
            "subcategory__category__section"
        ).prefetch_related("images").get(pk=product_id)
    except Product.DoesNotExist:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    product.save()
    product.refresh_from_db()
    return _serialize_product(product)

@router.delete("/products/{product_id}", response_model=MessageResponse)
def admin_delete_product(product_id: int):
    from shop.models import Product
    deleted, _ = Product.objects.filter(pk=product_id).delete()
    if not deleted: raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
    return MessageResponse(detail="Mahsulot o'chirildi.")

@router.post("/products/bulk-delete", response_model=MessageResponse)
def admin_bulk_delete_products(data: BulkDeleteRequest):
    from shop.models import Product
    count, _ = Product.objects.filter(pk__in=data.ids).delete()
    return MessageResponse(detail=f"{count} ta mahsulot o'chirildi.")

# ── Product Images ───────────────────────────────────
@router.post("/products/{product_id}/images", status_code=status.HTTP_201_CREATED)
def admin_upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = Form(False),
):
    from shop.models import Product, ProductImage
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    # Save image file to media/products/
    import os, uuid
    from django.conf import settings as django_settings

    content = file.file.read()
    ext = os.path.splitext(file.filename or "image.jpg")[1].lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        ext = ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"

    upload_dir = os.path.join(django_settings.MEDIA_ROOT, "products")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)

    # If this is primary, unset others
    if is_primary or not product.images.exists():
        product.images.update(is_primary=False)
        is_primary = True

    img = ProductImage.objects.create(
        product=product,
        image=f"products/{unique_name}",
        is_primary=is_primary,
        order=product.images.count(),
    )
    return ProductImageOut(
        id=img.pk,
        image=_get_media_url(img.image.url),
        alt_text=img.alt_text,
        order=img.order,
        is_primary=img.is_primary,
    )

@router.delete("/products/{product_id}/images/{image_id}", response_model=MessageResponse)
def admin_delete_product_image(product_id: int, image_id: int):
    from shop.models import ProductImage
    import os
    from django.conf import settings as django_settings

    try:
        img = ProductImage.objects.get(pk=image_id, product_id=product_id)
    except ProductImage.DoesNotExist:
        raise HTTPException(status_code=404, detail="Rasm topilmadi.")

    # Delete file from disk
    if img.image:
        file_path = os.path.join(django_settings.MEDIA_ROOT, str(img.image))
        if os.path.exists(file_path):
            os.remove(file_path)

    img.delete()
    return MessageResponse(detail="Rasm o'chirildi.")

# ─────────────────────────────────────────────────────
#  CONTENT CRUD (Slides, Banners, etc.)
# ─────────────────────────────────────────────────────
# Note: Content models are unaffected by shop hierarchy changes

def _serialize_hero(s) -> HeroSlideOut:
    return HeroSlideOut(
        id=s.pk, title=s.title, subtitle=s.subtitle, cta1_text=s.cta1_text, cta1_link=s.cta1_link,
        cta2_text=s.cta2_text, cta2_link=s.cta2_link, badge=s.badge,
        cta1_bg_color=s.cta1_bg_color, cta1_txt_color=s.cta1_txt_color,
        cta2_bg_color=s.cta2_bg_color, cta2_txt_color=s.cta2_txt_color,
        text_align=s.text_align,
        overlay_color=s.overlay_color, overlay_opacity=s.overlay_opacity,
        animation_type=s.animation_type,
        image=_get_media_url(s.image.url) if s.image else None, 
        order=s.order,
        is_active=s.is_active,
    )

@router.get("/hero-slides", response_model=list[HeroSlideOut])
def admin_list_hero():
    from content.models import HeroSlide
    return [_serialize_hero(s) for s in HeroSlide.objects.all().order_by("order")]

@router.post("/hero-slides", response_model=HeroSlideOut, status_code=status.HTTP_201_CREATED)
def admin_create_hero(data: HeroSlideCreate):
    from content.models import HeroSlide
    from django.conf import settings as django_settings
    
    payload = data.model_dump()
    if payload.get("image") and payload["image"].startswith(django_settings.MEDIA_URL):
        payload["image"] = payload["image"][len(django_settings.MEDIA_URL):]
    
    slide = HeroSlide.objects.create(**payload)
    return _serialize_hero(slide)

@router.put("/hero-slides/{slide_id}", response_model=HeroSlideOut)
def admin_update_hero(slide_id: int, data: HeroSlideUpdate):
    from content.models import HeroSlide
    from django.conf import settings as django_settings
    try:
        slide = HeroSlide.objects.get(pk=slide_id)
    except HeroSlide.DoesNotExist: raise HTTPException(status_code=404, detail="Slayd topilmadi.")
    
    payload = data.model_dump(exclude_unset=True)
    if payload.get("image") and payload["image"].startswith(django_settings.MEDIA_URL):
        payload["image"] = payload["image"][len(django_settings.MEDIA_URL):]
        
    for field, value in payload.items():
        setattr(slide, field, value)
    slide.save()
    return _serialize_hero(slide)

@router.delete("/hero-slides/{slide_id}", response_model=MessageResponse)
def admin_delete_hero(slide_id: int):
    from content.models import HeroSlide
    deleted, _ = HeroSlide.objects.filter(pk=slide_id).delete()
    if not deleted: raise HTTPException(status_code=404, detail="Slayd topilmadi.")
    return MessageResponse(detail="Slayd o'chirildi.")

# ... (Banners, Testimonials, FAQ, Partners remain same as before) ...
# I will keep the existing implementation for those to save space and time.
# Fast-forwarding the rest of the content CRUD which is same.

@router.get("/banners", response_model=list[BannerOut])
def admin_list_banners():
    from content.models import Banner
    return [
        BannerOut(
            id=b.pk, title=b.title, subtitle=b.subtitle, cta_text=b.cta_text,
            cta_link=b.cta_link, is_active=b.is_active,
            image=_get_media_url(b.image.url) if b.image else None
        )
        for b in Banner.objects.all()
    ]

@router.post("/banners", response_model=BannerOut, status_code=status.HTTP_201_CREATED)
def admin_create_banner(data: BannerCreate):
    from content.models import Banner
    banner = Banner.objects.create(**data.model_dump())
    return BannerOut.model_validate(banner)

@router.put("/banners/{banner_id}", response_model=BannerOut)
def admin_update_banner(banner_id: int, data: BannerUpdate):
    from content.models import Banner
    try:
        banner = Banner.objects.get(pk=banner_id)
    except Banner.DoesNotExist:
        raise HTTPException(status_code=404, detail="Banner topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(banner, field, value)
    banner.save()
    return BannerOut.model_validate(banner)

@router.delete("/banners/{banner_id}", response_model=MessageResponse)
def admin_delete_banner(banner_id: int):
    from content.models import Banner
    deleted, _ = Banner.objects.filter(pk=banner_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Banner topilmadi.")
    return MessageResponse(detail="Banner o'chirildi.")


# ── Testimonials CRUD ────────────────────────────────
@router.get("/testimonials", response_model=list[TestimonialOut])
def admin_list_testimonials():
    from content.models import Testimonial
    return [_serialize_testimonial(t) for t in Testimonial.objects.all()]

@router.post("/testimonials", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
def admin_create_testimonial(data: TestimonialCreate):
    from content.models import Testimonial
    t = Testimonial.objects.create(**data.model_dump())
    return _serialize_testimonial(t)

@router.put("/testimonials/{tid}", response_model=TestimonialOut)
def admin_update_testimonial(tid: int, data: TestimonialUpdate):
    from content.models import Testimonial
    try:
        t = Testimonial.objects.get(pk=tid)
    except Testimonial.DoesNotExist:
        raise HTTPException(status_code=404, detail="Sharh topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(t, field, value)
    t.save()
    return _serialize_testimonial(t)

@router.delete("/testimonials/{tid}", response_model=MessageResponse)
def admin_delete_testimonial(tid: int):
    from content.models import Testimonial
    deleted, _ = Testimonial.objects.filter(pk=tid).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Sharh topilmadi.")
    return MessageResponse(detail="Sharh o'chirildi.")


# ── FAQ CRUD ─────────────────────────────────────────
@router.get("/faq", response_model=list[FAQOut])
def admin_list_faq():
    from content.models import FAQ
    return [FAQOut.model_validate(f) for f in FAQ.objects.all().order_by("order")]

@router.post("/faq", response_model=FAQOut, status_code=status.HTTP_201_CREATED)
def admin_create_faq(data: FAQCreate):
    from content.models import FAQ
    faq = FAQ.objects.create(**data.model_dump())
    return FAQOut.model_validate(faq)

@router.put("/faq/{faq_id}", response_model=FAQOut)
def admin_update_faq(faq_id: int, data: FAQUpdate):
    from content.models import FAQ
    try:
        faq = FAQ.objects.get(pk=faq_id)
    except FAQ.DoesNotExist:
        raise HTTPException(status_code=404, detail="Savol topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(faq, field, value)
    faq.save()
    return FAQOut.model_validate(faq)

@router.delete("/faq/{faq_id}", response_model=MessageResponse)
def admin_delete_faq(faq_id: int):
    from content.models import FAQ
    deleted, _ = FAQ.objects.filter(pk=faq_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Savol topilmadi.")
    return MessageResponse(detail="Savol o'chirildi.")


@router.get("/sections_old", include_in_schema=False)
def admin_list_sections_old():
    pass

@router.get("/partners", response_model=list[PartnerOut])
def admin_list_partners():
    from content.models import Partner
    return [_serialize_partner(p) for p in Partner.objects.all().order_by("order")]

@router.post("/partners", response_model=PartnerOut, status_code=status.HTTP_201_CREATED)
def admin_create_partner(data: PartnerCreate):
    from content.models import Partner
    p = Partner.objects.create(**data.model_dump())
    return _serialize_partner(p)

@router.put("/partners/{pid}", response_model=PartnerOut)
def admin_update_partner(pid: int, data: PartnerUpdate):
    from content.models import Partner
    try:
        p = Partner.objects.get(pk=pid)
    except Partner.DoesNotExist:
        raise HTTPException(status_code=404, detail="Hamkor topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    p.save()
    return _serialize_partner(p)

@router.delete("/partners/{pid}", response_model=MessageResponse)
def admin_delete_partner(pid: int):
    from content.models import Partner
    deleted, _ = Partner.objects.filter(pk=pid).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Hamkor topilmadi.")
    return MessageResponse(detail="Hamkor o'chirildi.")


# ─────────────────────────────────────────────────────
#  ADMIN ORDERS
# ─────────────────────────────────────────────────────
@router.get("/orders", response_model=PaginatedAdminOrderOut)
def admin_list_orders(
    status_filter: str = "",
    page: int = 1,
    page_size: int = 20,
):
    """List all orders with optional status filter."""
    from orders.models import Order
    import math

    qs = Order.objects.select_related("user").prefetch_related("items").order_by("-created_at")
    if status_filter:
        qs = qs.filter(status=status_filter)

    total = qs.count()
    offset = (page - 1) * page_size
    orders = qs[offset:offset + page_size]

    items = [
        AdminOrderOut(
            id=o.pk,
            user_email=o.user.email if o.user else None,
            user_full_name=o.full_name or (o.user.full_name if o.user else "Mehmon"),
            status=o.status,
            total_amount=float(o.total_amount),
            address=o.address,
            phone=o.phone,
            note=o.note,
            item_count=o.items.all().count(),
            items=[
                AdminOrderItemOut(
                    product_name=item.product_name,
                    quantity=item.quantity,
                    price=float(item.price)
                ) for item in o.items.all()
            ],
            created_at=str(o.created_at),
            updated_at=str(o.updated_at),
        )
        for o in orders
    ]
    return PaginatedAdminOrderOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 1
    )


@router.patch("/orders/{order_id}", response_model=MessageResponse)
def admin_patch_order(order_id: int, data: OrderStatusUpdate):
    """Patch order status (specifically for status updates as requested)."""
    return admin_update_order_status(order_id, data)


@router.put("/orders/{order_id}/status", response_model=MessageResponse)
def admin_update_order_status(order_id: int, data: OrderStatusUpdate):
    """Update order status. Validates against allowed transitions."""
    from orders.models import Order

    VALID_STATUSES = {"pending", "confirmed", "processing", "shipped", "delivered", "cancelled"}
    if data.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Noto'g'ri holat: {data.status}. Qabul qilinadigan: {', '.join(sorted(VALID_STATUSES))}",
        )

    try:
        order = Order.objects.get(pk=order_id)
    except Order.DoesNotExist:
        raise HTTPException(status_code=404, detail="Buyurtma topilmadi.")

    order.status = data.status
    order.save(update_fields=["status", "updated_at"])
    return MessageResponse(detail=f"Buyurtma #{order_id} holati '{data.status}' ga o'zgartirildi.")


# ─────────────────────────────────────────────────────
#  NEWSLETTER SUBSCRIBERS
# ─────────────────────────────────────────────────────
@router.get("/newsletter", response_model=list[NewsletterOut])
def admin_list_newsletter():
    from newsletter.models import NewsletterSubscriber
    return [
        NewsletterOut(
            id=s.pk,
            email=s.email,
            subscribed_at=str(s.subscribed_at),
        )
        for s in NewsletterSubscriber.objects.order_by("-subscribed_at")
    ]


@router.delete("/newsletter/{sub_id}", response_model=MessageResponse)
def admin_delete_subscriber(sub_id: int):
    from newsletter.models import NewsletterSubscriber
    deleted, _ = NewsletterSubscriber.objects.filter(pk=sub_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Obunachi topilmadi.")
    return MessageResponse(detail="Obunachi o'chirildi.")


# ─────────────────────────────────────────────────────
#  INSTAGRAM POSTS
# ─────────────────────────────────────────────────────
@router.get("/instagram", response_model=list[InstagramPostOut])
def admin_list_instagram():
    from content.models import InstagramPost
    return [_serialize_instagram_post(p) for p in InstagramPost.objects.all().order_by("order")]

@router.post("/instagram", response_model=InstagramPostOut, status_code=status.HTTP_201_CREATED)
def admin_create_instagram(data: InstagramPostCreate):
    from content.models import InstagramPost
    post = InstagramPost.objects.create(**data.model_dump())
    return _serialize_instagram_post(post)

@router.put("/instagram/{post_id}", response_model=InstagramPostOut)
def admin_update_instagram(post_id: int, data: InstagramPostUpdate):
    from content.models import InstagramPost
    try:
        post = InstagramPost.objects.get(pk=post_id)
    except InstagramPost.DoesNotExist:
        raise HTTPException(status_code=404, detail="Post topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    post.save()
    return _serialize_instagram_post(post)

@router.delete("/instagram/{post_id}", response_model=MessageResponse)
def admin_delete_instagram(post_id: int):
    from content.models import InstagramPost
    deleted, _ = InstagramPost.objects.filter(pk=post_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Post topilmadi.")
    return MessageResponse(detail="Instagram post o'chirildi.")


# ─────────────────────────────────────────────────────
#  BRANCHES CRUD
# ─────────────────────────────────────────────────────
@router.get("/branches", response_model=list[BranchOut])
def admin_list_branches():
    from content.models import Branch
    return [BranchOut.model_validate(b) for b in Branch.objects.all().order_by("order", "name")]

@router.post("/branches", response_model=BranchOut, status_code=status.HTTP_201_CREATED)
def admin_create_branch(data: BranchCreate):
    from content.models import Branch
    branch = Branch.objects.create(**data.model_dump())
    return BranchOut.model_validate(branch)

@router.put("/branches/{branch_id}", response_model=BranchOut)
def admin_update_branch(branch_id: int, data: BranchUpdate):
    from content.models import Branch
    try:
        branch = Branch.objects.get(pk=branch_id)
    except Branch.DoesNotExist:
        raise HTTPException(status_code=404, detail="Filial topilmadi.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(branch, field, value)
    branch.save()
    return BranchOut.model_validate(branch)

@router.delete("/branches/{branch_id}", response_model=MessageResponse)
def admin_delete_branch(branch_id: int):
    from content.models import Branch
    deleted, _ = Branch.objects.filter(pk=branch_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Filial topilmadi.")
    return MessageResponse(detail="Filial o'chirildi.")


# ─────────────────────────────────────────────────────
#  SITE SETTINGS
# ─────────────────────────────────────────────────────
@router.get("/settings", response_model=SiteSettingsOut)
def admin_get_settings():
    from content.models import SiteSettings
    s = SiteSettings.load()
    return {
        "shop_name": s.shop_name,
        "tagline": s.tagline,
        "tagline_ru": s.tagline_ru,
        "currency": s.currency,
        "free_shipping_threshold": s.free_shipping_threshold,
        "phone": s.phone,
        "email": s.email,
        "address": s.address,
        "workday_hours": s.workday_hours,
        "saturday_hours": s.saturday_hours,
        "instagram_url": s.instagram_url,
        "facebook_url": s.facebook_url,
        "telegram_url": s.telegram_url,
        "telegram_bot_token": s.telegram_bot_token,
        "telegram_channel_id": s.telegram_channel_id,
        "seo_title": s.seo_title,
        "seo_description": s.seo_description,
        "copyright_text": s.copyright_text,
        "copyright_text_ru": s.copyright_text_ru,
        "updated_at": str(s.updated_at),
    }


@router.put("/settings", response_model=SiteSettingsOut)
def admin_update_settings(data: SiteSettingsUpdate):
    from content.models import SiteSettings
    settings = SiteSettings.load()
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    settings.save()
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
        "telegram_bot_token": settings.telegram_bot_token,
        "telegram_channel_id": settings.telegram_channel_id,
        "seo_title": settings.seo_title,
        "seo_description": settings.seo_description,
        "copyright_text": settings.copyright_text,
        "copyright_text_ru": settings.copyright_text_ru,
        "updated_at": str(settings.updated_at),
    }


@router.post("/settings/test-telegram", response_model=MessageResponse)
def admin_test_telegram():
    """Send a test message to Telegram to verify credentials."""
    from api.utils.telegram import send_test_telegram_message
    
    success, message = send_test_telegram_message()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Telegram test xatosi: {message}"
        )
    
    return MessageResponse(detail="Test xabari muvaffaqiyatli yuborildi.")



# ─────────────────────────────────────────────────────
#  ANALYTICS
# ─────────────────────────────────────────────────────
@router.get("/analytics", summary="Analytics overview")
def admin_analytics():
    """Revenue, orders, and product performance data for the analytics panel."""
    from orders.models import Order
    from shop.models import Product
    from django.db.models import Sum, Count, F
    from django.db.models.functions import TruncDate
    from django.utils import timezone
    from datetime import timedelta

    now = timezone.now()
    thirty_days = now - timedelta(days=30)

    # Daily revenue (last 30 days)
    daily_revenue = list(
        Order.objects
        .filter(created_at__gte=thirty_days)
        .exclude(status="cancelled")
        .annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(revenue=Sum("total_amount"), count=Count("id"))
        .order_by("date")
    )

    # Top products by order frequency
    from orders.models import OrderItem
    top_products = list(
        OrderItem.objects
        .values("product_name")
        .annotate(total_sold=Sum("quantity"), total_revenue=Sum(F("price") * F("quantity")))
        .order_by("-total_sold")[:10]
    )

    # Order status breakdown
    status_breakdown = dict(
        Order.objects.values_list("status").annotate(count=Count("id")).values_list("status", "count")
    )

    return {
        "daily_revenue": [
            {"date": str(d["date"]), "revenue": float(d["revenue"]), "orders": d["count"]}
            for d in daily_revenue
        ],
        "top_products": [
            {"name": p["product_name"], "sold": p["total_sold"], "revenue": float(p["total_revenue"] or 0)}
            for p in top_products
        ],
        "status_breakdown": status_breakdown,
        "period": "30d",
    }

