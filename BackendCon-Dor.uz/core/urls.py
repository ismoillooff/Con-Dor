"""
Con-Dor.Uz — Django URL configuration.

Only the Django admin is served here.
All API endpoints are handled by FastAPI in api/main.py.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

admin.site.site_header = "Con-Dor.Uz Admin"
admin.site.site_title = "Con-Dor.Uz"
admin.site.index_title = "Dashboard"

urlpatterns = [
    path("", admin.site.urls),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
