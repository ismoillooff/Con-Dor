"""
Cart API routes.

Supports both authenticated users (via JWT) and anonymous guests (via X-Session-Key header).
- Authenticated: Cart is linked to user (one-to-one).
- Guest: Cart is linked via X-Session-Key header.
"""
from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from django.db import transaction

from ..deps import get_current_user
from ..security import decode_token
from ..schemas.cart import CartItemAdd, CartItemUpdate, CartItemOut, CartOut
from ..schemas.common import MessageResponse

router = APIRouter(prefix="/api/cart", tags=["Cart"])

_bearer = HTTPBearer(auto_error=False)


# ─── Auth Helper ─────────────────────────────────────
def _optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
):
    """Return user if valid JWT is provided, otherwise None."""
    if credentials is None:
        return None
    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    from accounts.models import User
    try:
        return User.objects.get(pk=int(user_id), is_active=True)
    except User.DoesNotExist:
        return None


def _resolve_cart(user, session_key: str):
    """Get or create a cart for the current request context."""
    from orders.models import Cart

    if user:
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart
    if session_key:
        cart, _ = Cart.objects.get_or_create(
            session_key=session_key, user__isnull=True
        )
        return cart
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Login qiling yoki X-Session-Key header yuboring.",
    )


def _serialize_cart(cart) -> dict:
    """Serialize a Cart instance into a CartOut-compatible dict."""
    items = list(cart.items.select_related("product").all())
    return {
        "id": cart.id,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name,
                "product_slug": item.product.slug,
                "price": item.product.price,
                "quantity": item.quantity,
                "size": item.size,
                "color": item.color,
                "subtotal": item.subtotal,
            }
            for item in items
        ],
        "total_amount": sum(i.subtotal for i in items),
        "item_count": sum(i.quantity for i in items),
    }


# ─── Routes ──────────────────────────────────────────
@router.get("", response_model=CartOut, summary="View cart")
def get_cart(
    user=Depends(_optional_user),
    x_session_key: str = Header("", alias="X-Session-Key"),
):
    """Return current cart contents."""
    from orders.models import Cart

    if user:
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return {"id": 0, "items": [], "total_amount": 0, "item_count": 0}
    elif x_session_key:
        try:
            cart = Cart.objects.get(session_key=x_session_key, user__isnull=True)
        except Cart.DoesNotExist:
            return {"id": 0, "items": [], "total_amount": 0, "item_count": 0}
    else:
        return {"id": 0, "items": [], "total_amount": 0, "item_count": 0}

    return _serialize_cart(cart)


@router.post("/add", response_model=CartOut, summary="Add item to cart")
def add_to_cart(
    payload: CartItemAdd,
    user=Depends(_optional_user),
    x_session_key: str = Header("", alias="X-Session-Key"),
):
    """Add item to cart. If same product+size+color exists, increment quantity."""
    from orders.models import CartItem
    from shop.models import Product

    cart = _resolve_cart(user, x_session_key)

    try:
        product = Product.objects.get(pk=payload.product_id, is_active=True)
    except Product.DoesNotExist:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    with transaction.atomic():
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=payload.size,
            color=payload.color,
            defaults={"quantity": payload.quantity},
        )
        if not created:
            item.quantity += payload.quantity
            item.save(update_fields=["quantity"])

    return _serialize_cart(cart)


@router.put("/{item_id}", response_model=CartOut, summary="Update cart item quantity")
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    user=Depends(_optional_user),
    x_session_key: str = Header("", alias="X-Session-Key"),
):
    """Update quantity of a specific cart item."""
    from orders.models import CartItem

    cart = _resolve_cart(user, x_session_key)

    try:
        item = CartItem.objects.get(pk=item_id, cart=cart)
    except CartItem.DoesNotExist:
        raise HTTPException(status_code=404, detail="Savat elementi topilmadi.")

    item.quantity = payload.quantity
    item.save(update_fields=["quantity"])
    return _serialize_cart(cart)


@router.delete("/{item_id}", response_model=CartOut, summary="Remove cart item")
def remove_cart_item(
    item_id: int,
    user=Depends(_optional_user),
    x_session_key: str = Header("", alias="X-Session-Key"),
):
    """Remove a specific item from the cart."""
    from orders.models import CartItem

    cart = _resolve_cart(user, x_session_key)

    deleted, _ = CartItem.objects.filter(pk=item_id, cart=cart).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Savat elementi topilmadi.")

    return _serialize_cart(cart)


@router.delete("", response_model=MessageResponse, summary="Clear entire cart")
def clear_cart(
    user=Depends(_optional_user),
    x_session_key: str = Header("", alias="X-Session-Key"),
):
    """Remove all items from the cart."""
    cart = _resolve_cart(user, x_session_key)
    cart.items.all().delete()
    return MessageResponse(detail="Savat tozalandi.")
