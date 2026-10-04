"""Auth Pydantic schemas."""
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = ""
    last_name: str = ""
    phone: str = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    phone: str
    role: str
    created_at: str

    class Config:
        from_attributes = True
