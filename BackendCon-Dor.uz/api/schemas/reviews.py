"""Product review Pydantic schemas."""
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    """Payload for creating a product review."""
    rating: int = Field(..., ge=1, le=5, description="1–5 star rating")
    text: str = ""


class ReviewOut(BaseModel):
    """Single review in response."""
    id: int
    user_email: str
    user_name: str
    rating: int
    text: str
    created_at: str

    class Config:
        from_attributes = True
