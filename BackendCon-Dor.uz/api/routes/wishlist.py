"""
Wishlist API routes.

Requires authentication — guests cannot have wishlists.
"""
from fastapi import APIRouter, Depends, HTTPException, status

from ..deps import get_current_user
from ..schemas.wishlist import WishlistItemOut
from ..schemas.common import MessageResponse

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])


def _serialize_item(wl) -> dict:
    """Serialize a Wishlist model instance."""
    product = wl.product
    first_image = product.images.first()
    return {
        "id": wl.id,
        "product_id": product.id,
        "product_name": product.name,
        "product_slug": product.slug,
        "price": product.price,
        "image": first_image.image.url if first_image and first_image.image else None,
        "added_at": str(wl.added_at),
    }


@router.get("", response_model=list[WishlistItemOut], summary="List wishlist")
def list_wishlist(user=Depends(get_current_user)):
    """Return all items in the user's wishlist."""
    from orders.models import Wishlist

    items = (
        Wishlist.objects
        .filter(user=user)
        .select_related("product")
        .prefetch_related("product__images")
    )
    return [_serialize_item(wl) for wl in items]


@router.post(
    "/{product_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add to wishlist",
)
def add_to_wishlist(product_id: int, user=Depends(get_current_user)):
    """Add a product to the user's wishlist. Idempotent — no error if already exists."""
    from orders.models import Wishlist
    from shop.models import Product

    try:
        Product.objects.get(pk=product_id, is_active=True)
    except Product.DoesNotExist:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    _, created = Wishlist.objects.get_or_create(user=user, product_id=product_id)
    msg = "Tanlanganlarga qo'shildi." if created else "Allaqachon tanlanganlarda."
    return MessageResponse(detail=msg)


@router.delete("/{product_id}", response_model=MessageResponse, summary="Remove from wishlist")
def remove_from_wishlist(product_id: int, user=Depends(get_current_user)):
    """Remove a product from the user's wishlist."""
    from orders.models import Wishlist

    deleted, _ = Wishlist.objects.filter(user=user, product_id=product_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Tanlanganlar ro'yxatida topilmadi.")

    return MessageResponse(detail="Tanlanganlardan olib tashlandi.")
