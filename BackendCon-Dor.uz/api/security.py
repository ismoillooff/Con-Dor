"""
JWT + Password security utilities.

- bcrypt password hashing
- HS256 JWT access + refresh tokens
- Token verification
- All secrets from environment variables
"""
from datetime import datetime, timedelta, timezone

from decouple import config
from jose import JWTError, jwt
from passlib.context import CryptContext

# ─── Config ──────────────────────────────────────────
JWT_SECRET = config("JWT_SECRET_KEY")
JWT_ALGORITHM = config("JWT_ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)
REFRESH_TOKEN_EXPIRE_DAYS = config("JWT_REFRESH_TOKEN_EXPIRE_DAYS", default=7, cast=int)

# ─── Password hashing ───────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── JWT tokens ──────────────────────────────────────
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict | None:
    """Decode and verify a JWT. Returns payload dict or None on failure."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None
