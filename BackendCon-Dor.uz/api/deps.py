"""
FastAPI dependencies — authentication, pagination, current user injection.

NOTE: All functions use sync (def) instead of async to ensure compatibility
with Django ORM which requires synchronous database access.
"""
from fastapi import Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .security import decode_token

# ─── Bearer token header ────────────────────────────
_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
):
    """Extract and validate JWT from Authorization header. Returns Django User instance."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token taqdim etilmagan.")

    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token yaroqsiz yoki muddati tugagan.")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token mazmuni noto'g'ri.")

    from accounts.models import User
    try:
        user = User.objects.get(pk=int(user_id), is_active=True)
    except User.DoesNotExist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Foydalanuvchi topilmadi.")

    return user


def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
):
    """Try to extract user from JWT, but return None if not present/invalid instead of raising 401."""
    if credentials is None:
        return None

    try:
        payload = decode_token(credentials.credentials)
        if payload is None or payload.get("type") != "access":
            return None

        user_id = payload.get("sub")
        if not user_id:
            return None

        from accounts.models import User
        return User.objects.get(pk=int(user_id), is_active=True)
    except Exception:
        return None


def get_admin_user(user=Depends(get_current_user)):
    """Require admin role."""
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin huquqi talab qilinadi.")
    return user


class PaginationParams:
    """Reusable pagination dependency."""

    def __init__(
        self,
        page: int = Query(1, ge=1, description="Sahifa raqami"),
        page_size: int = Query(20, ge=1, le=100, description="Har sahifada"),
    ):
        self.page = page
        self.page_size = page_size

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size
