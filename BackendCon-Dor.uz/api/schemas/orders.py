"""Order Pydantic schemas."""
from decimal import Decimal

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)
    size: str = ""
    color: str = ""


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(..., min_length=1)
    full_name: str = Field(..., min_length=2)
    address: str = Field(..., min_length=5)
    phone: str = Field(..., min_length=7)
    note: str = ""


class OrderItemOut(BaseModel):
    id: int
    product_id: int | None
    product_name: str
    quantity: int
    size: str
    color: str
    price: Decimal
    total: float

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    status: str
    total_amount: Decimal
    full_name: str
    address: str
    phone: str
    note: str
    items: list[OrderItemOut] = []
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
