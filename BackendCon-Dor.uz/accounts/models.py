"""
Custom User model — email-based authentication with role system.
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserRole(models.TextChoices):
    ADMIN = "admin", "Administrator"
    STAFF = "staff", "Staff"
    USER = "user", "User"


class UserManager(BaseUserManager):
    """Custom manager: email is the unique identifier."""

    def create_user(self, email: str, password: str | None = None, **extra_fields):
        if not email:
            raise ValueError("Email majburiy.")
        email = self.normalize_email(email)
        extra_fields.setdefault("role", UserRole.USER)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.update(
            {
                "role": UserRole.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            }
        )
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("Email", unique=True, db_index=True)
    first_name = models.CharField("Ism", max_length=64, blank=True)
    last_name = models.CharField("Familiya", max_length=64, blank=True)
    phone = models.CharField("Telefon", max_length=20, blank=True)
    role = models.CharField(
        "Rol",
        max_length=10,
        choices=UserRole.choices,
        default=UserRole.USER,
        db_index=True,
    )

    is_active = models.BooleanField("Faol", default=True)
    is_staff = models.BooleanField("Xodim", default=False)

    created_at = models.DateTimeField("Yaratilgan", auto_now_add=True)
    updated_at = models.DateTimeField("Yangilangan", auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # email is already required by USERNAME_FIELD

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip() or self.email

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN or self.is_superuser
