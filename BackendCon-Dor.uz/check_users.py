import os
import django
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from accounts.models import User

print("--- Existing Users ---")
for user in User.objects.all():
    print(f"Email: {user.email}, Active: {user.is_active}, Staff: {user.is_staff}, Role: {user.role}")
print("--- End of List ---")
