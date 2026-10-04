"""Wishlist Pydantic schemas."""
from decimal import Decimal

from pydantic import BaseModel


class WishlistItemOut(BaseModel):
    """Single wishlist entry."""
    id: int
    product_id: int
    product_name: str
    product_slug: str
    price: Decimal
    image: str | None = None
    added_at: str

    class Config:
        from_attributes = True
