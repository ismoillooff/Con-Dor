from typing import Optional
from fastapi import APIRouter, Depends, Query
from django.db.models import Q
from shop.models import Product
from api.deps import PaginationParams
from api.schemas.shop import ProductOut, ProductImageOut
from api.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api/products", tags=["Products"])

def _get_media_url(path: str) -> str:
    if not path: return ""
    from django.conf import settings
    base = settings.BACKEND_URL.rstrip('/')
    return f"{base}{path}"

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

@router.get("/", response_model=PaginatedResponse[ProductOut])
def list_products(
    pagination: PaginationParams = Depends(),
    q: Optional[str] = Query(None, description="Qidiruv matni"),
    section: Optional[str] = Query(None, description="Bo'lim slugi"),
    category: Optional[str] = Query(None, description="Kategoriya slugi"),
    subcategory: Optional[str] = Query(None, description="Sub-kategoriya slugi"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    is_featured: Optional[bool] = Query(None, description="Tanlangan mahsulotlar"),
    badge: Optional[str] = Query(None, description="Badge filtri (SALE, YANGI, HIT)"),
    sort: str = Query("-created_at", pattern="^(price|-price|rating|-rating|-created_at)$")
):
    """
    Public product listing with hierarchical filtering, search and sorting.
    """
    queryset = Product.objects.filter(is_active=True).select_related(
        "subcategory__category__section"
    ).prefetch_related("images")

    # Filters
    if q:
        queryset = queryset.filter(Q(name__icontains=q) | Q(description__icontains=q))
    
    if section:
        queryset = queryset.filter(subcategory__category__section__slug=section)
    if category:
        queryset = queryset.filter(subcategory__category__slug=category)
    if subcategory:
        queryset = queryset.filter(subcategory__slug=subcategory)
        
    if min_price is not None:
        queryset = queryset.filter(price__gte=min_price)
    if max_price is not None:
        queryset = queryset.filter(price__lte=max_price)

    if is_featured is not None:
        queryset = queryset.filter(is_featured=is_featured)
    if badge:
        queryset = queryset.filter(badge__iexact=badge)

    # Sorting
    queryset = queryset.order_by(sort)

    total = queryset.count()
    products = queryset[pagination.offset : pagination.offset + pagination.page_size]

    return {
        "count": total,
        "page": pagination.page,
        "page_size": pagination.page_size,
        "total_pages": (total + pagination.page_size - 1) // pagination.page_size,
        "results": [_serialize_product(p) for p in products]
    }

@router.get("/{id_or_slug}", response_model=ProductOut)
def get_product(id_or_slug: str):
    """Get single product by ID or Slug with full hierarchy info."""
    from shop.models import Product
    try:
        queryset = Product.objects.select_related(
            "subcategory__category__section"
        ).prefetch_related("images")
        
        # Try as ID first if numeric
        if id_or_slug.isdigit():
            product = queryset.get(pk=int(id_or_slug), is_active=True)
        else:
            product = queryset.get(slug=id_or_slug, is_active=True)
            
        return _serialize_product(product)
    except Product.DoesNotExist:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
