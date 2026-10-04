"""
Product review API routes.

GET  /products/{slug}/reviews — public, no auth required.
POST /products/{slug}/reviews — requires auth, one review per user per product.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from django.db import IntegrityError

from ..deps import get_current_user
from ..schemas.reviews import ReviewCreate, ReviewOut
from ..schemas.common import MessageResponse

router = APIRouter(prefix="/api", tags=["Reviews"])


def _serialize_review(r) -> dict:
    """Serialize a Review model instance."""
    return {
        "id": r.id,
        "user_email": r.user.email[:3] + "***" + r.user.email[r.user.email.index("@"):],
        "user_name": r.user.get_full_name() or r.user.email.split("@")[0],
        "rating": r.rating,
        "text": r.text,
        "created_at": str(r.created_at),
    }


@router.get(
    "/products/{slug}/reviews",
    response_model=list[ReviewOut],
    summary="List product reviews",
)
def list_reviews(
    slug: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
):
    """Public endpoint — returns reviews for a product ordered by newest first."""
    from shop.models import Product, Review

    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    offset = (page - 1) * page_size
    reviews = (
        Review.objects
        .filter(product=product)
        .select_related("user")
        .order_by("-created_at")[offset:offset + page_size]
    )

    return [_serialize_review(r) for r in reviews]


@router.post(
    "/products/{slug}/reviews",
    response_model=ReviewOut,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a review",
)
def create_review(
    slug: str,
    payload: ReviewCreate,
    user=Depends(get_current_user),
):
    """Submit a review for a product. One review per user per product."""
    from shop.models import Product, Review

    try:
        product = Product.objects.get(slug=slug, is_active=True)
    except Product.DoesNotExist:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    try:
        review = Review.objects.create(
            user=user,
            product=product,
            rating=payload.rating,
            text=payload.text,
        )
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Siz bu mahsulotga allaqachon sharh yozgansiz.",
        )

    # Auto-update product rating/reviews_count
    review.update_product_stats()

    return _serialize_review(review)
