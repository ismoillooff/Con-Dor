from typing import TypeVar, Generic
from pydantic import BaseModel

T = TypeVar("T")

class MessageResponse(BaseModel):
    detail: str


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated wrapper."""
    count: int
    page: int
    page_size: int
    total_pages: int
    results: list[T]
