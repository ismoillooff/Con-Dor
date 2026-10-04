from typing import Optional
from pydantic import BaseModel, Field

# ─── Images ──────────────────────────────────────────
class ProductImageOut(BaseModel):
    id: int
    image: str
    alt_text: str = ""
    order: int
    is_primary: bool
    
    class Config:
        from_attributes = True

# ─── Hierarchy ───────────────────────────────────────
class SubCategoryBase(BaseModel):
    name: str
    name_ru: str = ""
    slug: str
    order: int = 0
    is_active: bool = True

class SubCategoryOut(SubCategoryBase):
    id: int
    product_count: int = 0
    
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    name_ru: str = ""
    slug: str
    description: str = ""
    icon: str = ""
    color: str = "#000000"
    order: int = 0
    is_active: bool = True

class CategoryOut(CategoryBase):
    id: int
    image: Optional[str] = None
    product_count: int = 0
    subcategories: list[SubCategoryOut] = []
    
    class Config:
        from_attributes = True

class SectionBase(BaseModel):
    name: str
    name_ru: str = ""
    slug: str
    description: str = ""
    icon: str = ""
    color: str = "#000000"
    order: int = 0
    is_active: bool = True

class SectionOut(SectionBase):
    id: int
    product_count: int = 0
    categories: list[CategoryOut] = []
    
    class Config:
        from_attributes = True

# ─── Products ────────────────────────────────────────
class ProductBase(BaseModel):
    name: str
    name_ru: str = ""
    slug: str
    description: str
    description_ru: str = ""
    price: float
    old_price: Optional[float] = None
    badge: str = ""
    badge_ru: str = ""
    rating: float = 0.0
    reviews_count: int = 0
    color: str = ""
    color_ru: str = ""
    sub: str = ""
    sub_ru: str = ""
    sizes: list[str] = []
    colors: list[str] = []
    is_active: bool = True
    is_featured: bool = False
    subcategory_id: int

class ProductOut(ProductBase):
    id: int
    subcategory_name: str
    category_name: str
    section_name: str
    category_slug: str
    section_slug: str
    images: list[ProductImageOut] = []
    discount_percent: int
    
    class Config:
        from_attributes = True

class ProductCreate(ProductBase):
    slug: Optional[str] = None
    description: str = ""
    description_ru: str = ""

class ProductUpdate(BaseModel):
    subcategory_id: Optional[int] = None
    name: Optional[str] = None
    name_ru: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    description_ru: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    badge: Optional[str] = None
    badge_ru: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    color: Optional[str] = None
    color_ru: Optional[str] = None
    sub: Optional[str] = None
    sub_ru: Optional[str] = None
    sizes: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None

# ─── Admin CRUD Schemas ─────────────────────────────
class SectionCreate(SectionBase):
    slug: Optional[str] = None

class SectionUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class CategoryCreate(CategoryBase):
    slug: Optional[str] = None
    section_id: int

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None
    section_id: Optional[int] = None

class SubCategoryCreate(SubCategoryBase):
    slug: Optional[str] = None
    category_id: int

class SubCategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None

    class Config:
        from_attributes = True

class BulkDeleteRequest(BaseModel):
    ids: list[int]
