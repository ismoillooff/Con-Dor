"""
Public CMS content routes + newsletter subscription.
"""
from fastapi import APIRouter, HTTPException, status

from api.schemas.common import MessageResponse
from api.schemas.content import (
    BannerOut,
    FAQOut,
    HeroSlideOut,
    NewsletterSubscribe,
    PartnerOut,
    TestimonialOut,
    BranchOut,
)

router = APIRouter(prefix="/api/public", tags=["Public Content"])


@router.get("/branches", response_model=list[BranchOut])
def get_branches():
    from content.models import Branch

    items = Branch.objects.filter(is_active=True).order_by("order", "name")
    return [
        BranchOut(
            id=b.pk,
            name=b.name,
            name_ru=b.name_ru,
            address=b.address,
            address_ru=b.address_ru,
            phone=b.phone,
            email=b.email,
            work_hours=b.work_hours,
            work_hours_ru=b.work_hours_ru,
            location_url=b.location_url,
            order=b.order,
            is_active=b.is_active,
        )
        for b in items
    ]


@router.get("/hero-slides", response_model=list[HeroSlideOut])
def get_hero_slides():
    from content.models import HeroSlide

    slides = HeroSlide.objects.filter(is_active=True).order_by("order")
    return [
        HeroSlideOut(
            id=s.pk,
            title=s.title,
            title_ru=s.title_ru,
            subtitle=s.subtitle,
            subtitle_ru=s.subtitle_ru,
            cta1_text=s.cta1_text,
            cta1_text_ru=s.cta1_text_ru,
            cta1_link=s.cta1_link,
            cta2_text=s.cta2_text,
            cta2_text_ru=s.cta2_text_ru,
            cta2_link=s.cta2_link,
            badge=s.badge,
            badge_ru=s.badge_ru,
            image=s.image.url if s.image else None,
            cta1_bg_color=s.cta1_bg_color,
            cta1_txt_color=s.cta1_txt_color,
            cta2_bg_color=s.cta2_bg_color,
            cta2_txt_color=s.cta2_txt_color,
            text_align=s.text_align,
            overlay_color=s.overlay_color,
            overlay_opacity=s.overlay_opacity,
            animation_type=s.animation_type,
            order=s.order,
            is_active=s.is_active,
        )
        for s in slides
    ]


@router.get("/banner", response_model=BannerOut | None)
def get_active_banner():
    from content.models import Banner

    banner = Banner.objects.filter(is_active=True).order_by("-created_at").first()
    if not banner:
        return None
    return BannerOut(
        id=banner.pk,
        title=banner.title,
        subtitle=banner.subtitle,
        cta_text=banner.cta_text,
        cta_link=banner.cta_link,
        image=banner.image.url if banner.image else None,
        is_active=banner.is_active,
    )


@router.get("/testimonials", response_model=list[TestimonialOut])
def get_testimonials():
    from content.models import Testimonial

    items = Testimonial.objects.filter(is_active=True).order_by("-created_at")
    return [
        TestimonialOut(
            id=t.pk,
            name=t.name,
            role=t.role,
            content=t.content,
            rating=t.rating,
            avatar=t.avatar.url if t.avatar else None,
        )
        for t in items
    ]


@router.get("/faq", response_model=list[FAQOut])
def get_faq():
    from content.models import FAQ

    items = FAQ.objects.filter(is_active=True).order_by("order")
    return [
        FAQOut(id=f.pk, question=f.question, answer=f.answer, order=f.order)
        for f in items
    ]


@router.get("/partners", response_model=list[PartnerOut])
def get_partners():
    from content.models import Partner

    items = Partner.objects.filter(is_active=True).order_by("order")
    return [
        PartnerOut(
            id=p.pk,
            name=p.name,
            logo=p.logo.url if p.logo else None,
            website=p.website,
            order=p.order,
        )
        for p in items
    ]


@router.post("/newsletter", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def subscribe_newsletter(data: NewsletterSubscribe):
    from newsletter.models import NewsletterSubscriber

    _, created = NewsletterSubscriber.objects.get_or_create(
        email=data.email,
        defaults={"is_active": True},
    )
    if not created:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bu email allaqachon obuna bo'lgan.")

    return MessageResponse(detail="Muvaffaqiyatli obuna bo'ldingiz!")
