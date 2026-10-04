from fastapi import APIRouter
from django.db.models import Prefetch, Count, Q
from shop.models import Section, Category, SubCategory
from api.schemas.shop import SectionOut, CategoryOut, SubCategoryOut

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("/", response_model=list[SectionOut])
def list_categories():
    """
    Returns the full hierarchical catalog tree with product counts.
    Section -> Categories -> SubCategories
    """
    # Optimized prefetch with active filters and product counts
    active_subcategories = SubCategory.objects.filter(is_active=True).annotate(
        p_count=Count("products", filter=Q(products__is_active=True))
    ).order_by("order", "name")
    
    active_categories = Category.objects.filter(is_active=True).annotate(
        p_count=Count("subcategories__products", filter=Q(subcategories__products__is_active=True))
    ).prefetch_related(
        Prefetch("subcategories", queryset=active_subcategories)
    ).order_by("order", "name")
    
    sections = Section.objects.filter(is_active=True).annotate(
        p_count=Count("categories__subcategories__products", filter=Q(categories__subcategories__products__is_active=True))
    ).prefetch_related(
        Prefetch("categories", queryset=active_categories)
    ).order_by("order", "name")

    result = []
    for s in sections:
        categories = []
        for c in s.categories.all():
            subcats = [
                SubCategoryOut(
                    id=sub.pk, name=sub.name, name_ru=sub.name_ru, slug=sub.slug, 
                    order=sub.order, is_active=sub.is_active,
                    product_count=getattr(sub, 'p_count', 0)
                )
                for sub in c.subcategories.all()
            ]
            categories.append(
                CategoryOut(
                    id=c.pk, name=c.name, name_ru=c.name_ru, slug=c.slug, description=c.description,
                    icon=c.icon, color=c.color, order=c.order, is_active=c.is_active,
                    image=c.image.url if c.image else None,
                    product_count=getattr(c, 'p_count', 0),
                    subcategories=subcats
                )
            )
        result.append(
            SectionOut(
                id=s.pk, name=s.name, name_ru=s.name_ru, slug=s.slug, 
                description=s.description, icon=s.icon, color=s.color,
                order=s.order, is_active=s.is_active,
                product_count=getattr(s, 'p_count', 0),
                categories=categories
            )
        )
    return result
