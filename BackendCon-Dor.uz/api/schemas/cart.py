"""Cart & CartItem Pydantic schemas."""
from decimal import Decimal

from pydantic import BaseModel, Field


class CartItemAdd(BaseModel):
    """Payload for adding or incrementing a cart item."""
    product_id: int
    quantity: int = Field(1, ge=1, le=99)
    size: str = ""
    color: str = ""


class CartItemUpdate(BaseModel):
    """Payload for updating an existing cart item's quantity."""
    quantity: int = Field(..., ge=1, le=99)


class CartItemOut(BaseModel):
    """Single item inside the cart response."""
    id: int
    product_id: int
    product_name: str
    product_slug: str
    price: Decimal
    quantity: int
    size: str
    color: str
    subtotal: float

    class Config:
        from_attributes = True


class CartOut(BaseModel):
    """Full cart response."""
    id: int
    items: list[CartItemOut] = []
    total_amount: float
    item_count: int

    class Config:
        from_attributes = True
