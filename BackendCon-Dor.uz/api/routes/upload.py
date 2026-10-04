"""
Image upload API.

Generic file upload endpoint for product images, hero slides, Instagram posts, etc.
Validates file type, enforces size limits, and generates unique filenames.
"""
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from ..deps import get_admin_user

router = APIRouter(prefix="/api/upload", tags=["Upload"])

# ─── Configuration ───────────────────────────────────
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/image", summary="Upload an image", status_code=status.HTTP_201_CREATED)
def upload_image(
    file: UploadFile = File(...),
    _admin=Depends(get_admin_user),
):
    """
    Upload an image file. Returns the accessible media URL.

    - **Allowed types**: JPEG, PNG, WebP, GIF, SVG
    - **Max size**: 5 MB
    - **Returns**: ``{ "url": "/media/uploads/…" }``
    """
    # ── Validate content type ──
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Ruxsat etilmagan fayl turi: {file.content_type}. "
                   f"Faqat: {', '.join(sorted(ALLOWED_TYPES))}",
        )

    # ── Read and validate size ──
    content = file.file.read()
    if len(content) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Fayl hajmi {MAX_SIZE_BYTES // (1024*1024)} MB dan oshmasligi kerak.",
        )

    # ── Generate unique filename ──
    ext = Path(file.filename or "image.jpg").suffix.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
        ext = ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"

    # ── Save to media/uploads/ ──
    from django.conf import settings as django_settings

    upload_dir = os.path.join(django_settings.MEDIA_ROOT, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)

    media_url = f"{django_settings.MEDIA_URL}uploads/{unique_name}"
    return {"url": media_url, "filename": unique_name}


@router.delete("/image", summary="Delete an uploaded image")
def delete_image(
    url: str,
    _admin=Depends(get_admin_user),
):
    """
    Delete a previously uploaded image file by its media URL.
    - Only allows deleting files in the 'uploads/' directory.
    """
    from django.conf import settings as django_settings
    
    # Extract relative path from media URL
    if not url.startswith(django_settings.MEDIA_URL):
        raise HTTPException(status_code=400, detail="Noto'g'ri rasm havolasi.")
    
    rel_path = url[len(django_settings.MEDIA_URL):]
    if ".." in rel_path or not rel_path.startswith("uploads/"):
        raise HTTPException(status_code=403, detail="Ruxsat etilmagan yo'l.")
    
    file_path = os.path.join(django_settings.MEDIA_ROOT, rel_path)
    
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return {"detail": "Rasm o'chirildi."}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"O'chirishda xatolik: {str(e)}")
    
    return {"detail": "Fayl topilmadi."}
