"""
Authentication routes — register, login, refresh, me.
"""
from fastapi import APIRouter, Depends, HTTPException, status

from api.deps import get_current_user
from api.schemas.auth import RefreshRequest, TokenResponse, UserLogin, UserRegister, UserResponse
from api.security import create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister):
    from accounts.models import User

    if User.objects.filter(email=data.email).exists():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bu email allaqachon ro'yxatdan o'tgan.")

    user = User.objects.create_user(
        email=data.email,
        password=data.password,
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
    )
    return UserResponse(
        id=user.pk,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        role=user.role,
        created_at=user.created_at.isoformat(),
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin):
    from accounts.models import User

    try:
        user = User.objects.get(email=data.email, is_active=True)
    except User.DoesNotExist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email yoki parol noto'g'ri.")

    if not user.check_password(data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email yoki parol noto'g'ri.")

    token_data = {"sub": str(user.pk), "role": user.role}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(data: RefreshRequest):
    payload = decode_token(data.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token yaroqsiz.")

    from accounts.models import User

    try:
        user = User.objects.get(pk=int(payload["sub"]), is_active=True)
    except User.DoesNotExist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Foydalanuvchi topilmadi.")

    token_data = {"sub": str(user.pk), "role": user.role}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.get("/me", response_model=UserResponse)
def get_me(user=Depends(get_current_user)):
    return UserResponse(
        id=user.pk,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        role=user.role,
        created_at=user.created_at.isoformat(),
    )
