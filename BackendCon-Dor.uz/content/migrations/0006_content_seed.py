from django.db import migrations

def seed_content(apps, schema_editor):
    HeroSlide = apps.get_model('content', 'HeroSlide')
    SiteSettings = apps.get_model('content', 'SiteSettings')

    # Hero Slide
    HeroSlide.objects.get_or_create(
        id=1,
        defaults={
            "title": "CON-DOR\nARMYSHOP",
            "title_ru": "CON-DOR\nARMYSHOP",
            "subtitle": "Professional harbiy va tashqi jihozlar — Shveytsariya standartida. 30+ yillik tajriba, 50,000+ mamnun mijoz.",
            "subtitle_ru": "Профессиональное военное и уличное снаряжение — по швейцарским стандартам. 30+ лет опыта, 50,000+ довольных клиентов.",
            "cta1_text": "Mahsulotlarni ko'rish",
            "cta1_text_ru": "Посмотреть товары",
            "cta1_link": "#highlights",
            "cta2_text": "Katalogni ko'rish",
            "cta2_text_ru": "Посмотреть каталог",
            "cta2_link": "#categories",
            "badge": "🎖️ HARBIY DARAJADAGI SIFAT",
            "badge_ru": "🎖️ КАЧЕСТВО ВОЕННОГО УРОВНЯ",
            "is_active": True,
            "order": 1
        }
    )
    
    # Site Settings (Singleton setup)
    settings, _ = SiteSettings.objects.get_or_create(pk=1)
    settings.shop_name = "Con-Dor.Uz"
    settings.tagline = "Tashqi va Taktik"
    settings.tagline_ru = "Наружное и тактическое снаряжение"
    settings.copyright_text = "© 2026 Army Shop CH. Barcha huquqlar himoyalangan."
    settings.copyright_text_ru = "© 2026 Army Shop CH. Все права защищены."
    settings.save()

def reverse_seed(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('content', '0005_heroslide_badge_ru_heroslide_cta1_text_ru_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_content, reverse_seed),
    ]
