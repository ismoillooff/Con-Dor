"""
Deactivate Bridgehead section (hides from navbar API).
"""
import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from shop.models import Section

bridgehead = Section.objects.get(slug="bridgehead")
bridgehead.is_active = False
bridgehead.save(update_fields=["is_active"])
print(f"Bridgehead section deactivated (is_active=False)")
