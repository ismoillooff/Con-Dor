"""
FastAPI application entry point.

- Initializes Django ORM before FastAPI starts
- Configures CORS for frontend SPA
- Mounts all API route modules
- Serves media files in development
- Port management via environment variables
"""
import os
import sys
from pathlib import Path

# ─── Django setup (MUST be before any Django imports) ──────
# Add project root to sys.path so Django apps are importable
_project_root = str(Path(__file__).resolve().parent.parent)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django  # noqa: E402
django.setup()

# ─── Automatic DB Init ──────────────────────────────────
_db_file = Path(_project_root) / "db.sqlite3"
if not _db_file.exists():
    from django.core.management import call_command
    print("📦  Ma'lumotlar bazasi topilmadi. Avtomatik yaratish vа ma'lumotlarni to'ldirish boshlanmoqda...")
    try:
        call_command("migrate")
        print("✅  Bazа muvaffaqiyatli shakllandi.")
    except Exception as e:
        print(f"❌  Bazаni yaratishda xatolik: {e}")

# ─── FastAPI app ─────────────────────────────────────────
from decouple import Csv, config  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402

from api.routes import (  # noqa: E402
    admin, auth, cart, categories, content, orders, products,
    reviews, settings, upload, wishlist,
)

from fastapi.middleware.wsgi import WSGIMiddleware # noqa: E402
from core.wsgi import application as django_app # noqa: E402

app = FastAPI(
    title="Con-Dor.Uz API",
    description="Army Shop — Outdoor & Tactical e-commerce API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── Django Admin Mount ──────────────────────────────────
app.mount("/admin", WSGIMiddleware(django_app))

# ─── CORS ────────────────────────────────────────────────
cors_origins = [
    "https://con-dor.uz",
    "https://www.con-dor.uz",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
# Add any extra origins from .env if present
extra_origins = config("CORS_ORIGINS", default="", cast=Csv())
if extra_origins:
    for o in extra_origins:
        if o not in cors_origins:
            cors_origins.append(str(o).strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(content.router)
app.include_router(cart.router)
app.include_router(wishlist.router)
app.include_router(reviews.router)
app.include_router(settings.router)
app.include_router(upload.router)
app.include_router(admin.router)

# ─── Media & Static files (development only) ─────────────
_debug = config("DEBUG", default=False, cast=bool)
_media_root = Path(_project_root) / config("MEDIA_ROOT", default="media")
_static_root = Path(_project_root) / "staticfiles"

if _debug:
    if _media_root.exists():
        app.mount("/media", StaticFiles(directory=str(_media_root)), name="media")
    if _static_root.exists():
        app.mount("/static", StaticFiles(directory=str(_static_root)), name="static")


# ─── Health check ────────────────────────────────────────
@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "Con-Dor.Uz API", "version": "1.0.0"}


# ─── CLI entry point ────────────────────────────────────
if __name__ == "__main__":
    import socket
    import uvicorn

    host = config("API_HOST", default="0.0.0.0")
    port = config("API_PORT", default=8000, cast=int)

    # ── Port availability check ──────────────────────
    def find_free_port(start_port: int, max_tries: int = 10) -> int:
        """Find a free port starting from start_port."""
        for offset in range(max_tries):
            candidate = start_port + offset
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(("", candidate))
                    return candidate
                except OSError:
                    print(f"⚠  Port {candidate} band. Keyingi portni tekshirmoqda...")
        raise RuntimeError(f"Portlar {start_port}–{start_port + max_tries - 1} orasida bo'sh port topilmadi.")

    port = find_free_port(port)
    print(f"🚀 Con-Dor.Uz API ishga tushmoqda: http://{host}:{port}")
    print(f"📚 API Docs: http://{host}:{port}/docs")

    uvicorn.run("api.main:app", host=host, port=port, reload=_debug)
