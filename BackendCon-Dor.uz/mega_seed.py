"""
MEGA SEED SCRIPT: Recreates the entire catalog tree with translations.
Run this after 'python manage.py migrate' if you clear the database.
Usage: python mega_seed.py
"""
import os, sys, django

# Setup Django environment
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from shop.models import Section, Category, SubCategory
from content.models import HeroSlide, SiteSettings

# ─── DATA DEFINITION ───────────────────────────────────

SEED_DATA = {
    "kiyimlar": {
        "name": "Kiyimlar", "name_ru": "Одежда", "order": 1, "icon": "shirt",
        "categories": {
            "ustki-kiyim": {
                "name": "USTKI KIYIM", "name_ru": "ВЕРХНЯЯ ОДЕЖДА", "icon": "shirt",
                "subcats": {
                    "sviter": {"name": "Sviter", "name_ru": "Свитер"},
                    "koylaklar": {"name": "Ko'ylaklar", "name_ru": "Рубашки"},
                    "kurtkalar": {"name": "Kurtkalar", "name_ru": "Куртки"},
                    "fleece-kurtka": {"name": "Fleece kurtka", "name_ru": "Флисовая куртка"},
                    "kepkalar": {"name": "Kepkalar", "name_ru": "Кепки"},
                }
            },
            "bosh-kiyim": {
                "name": "BOSH KIYIM", "name_ru": "ГОЛОВНЫЕ УБОРЫ", "icon": "hat",
                "subcats": {
                    "shapkalar": {"name": "Shapkalar", "name_ru": "Шапки"},
                    "balaklava": {"name": "Balaklava", "name_ru": "Балаклава"},
                    "ovchi-shapkasi": {"name": "Ovchi shapkasi", "name_ru": "Охотничья шапка"},
                }
            },
            "pastki-kiyim": {
                "name": "PASTKI KIYIM", "name_ru": "НИЖНЯЯ ОДЕЖДА", "icon": "pants",
                "subcats": {
                    "shimlar": {"name": "Shimlar", "name_ru": "Брюки"},
                    "ichki-kiyim": {"name": "Ichki kiyim", "name_ru": "Нижное бельё"},
                    "termal-koylak": {"name": "Termal ko'ylak", "name_ru": "Термобельё"},
                }
            },
            "yomgir-kiyim": {
                "name": "YOMG'IR KIYIM", "name_ru": "ДОЖДЕВАЯ ОДЕЖДА", "icon": "umbrella",
                "subcats": {
                    "poncholar": {"name": "Poncholar", "name_ru": "Пончо"},
                    "yomgirdan-himoya": {"name": "Yomg'irdan himoya", "name_ru": "Защита от дождя"},
                }
            },
            "poyabzal": {
                "name": "POYABZAL", "name_ru": "ОБУВЬ", "icon": "boot",
                "subcats": {
                    "harbiy-etik": {"name": "Harbiy etik", "name_ru": "Военные ботинки"},
                    "tashqi-poyabzal": {"name": "Tashqi poyabzal", "name_ru": "Наружная обувь"},
                    "trek-botinkasi": {"name": "Trek botinkasi", "name_ru": "Треккинговые ботинки"},
                    "yengil-poyabzal": {"name": "Yengil poyabzal", "name_ru": "Лёгкая обувь"},
                }
            },
            "paypoq": {
                "name": "PAYPOQ", "name_ru": "НОСКИ", "icon": "socks",
                "subcats": {
                    "bambuk-paypoq": {"name": "Bambuk paypoq", "name_ru": "Бамбуковые носки"},
                    "harbiy-paypoq": {"name": "Harbiy paypoq", "name_ru": "Военные носки"},
                    "termal-paypoq": {"name": "Termal paypoq", "name_ru": "Термоноски"},
                    "treking-paypoq": {"name": "Treking paypoq", "name_ru": "Треккинговые носки"},
                }
            },
            "qolqop": {
                "name": "QO'LQOP", "name_ru": "ПЕРЧАТКИ", "icon": "gloves",
                "subcats": {
                    "barmoqli": {"name": "Barmoqli", "name_ru": "С пальцами"},
                    "barmoqsiz": {"name": "Barmoqsiz", "name_ru": "Без пальцев"},
                    "qolqop": {"name": "Qo'lqop", "name_ru": "Перчатка"},
                    "qolliqop": {"name": "Qo'lliqop", "name_ru": "Варежки"},
                }
            },
            "ov-kiyim": {
                "name": "OV KIYIM", "name_ru": "ОХОТНИЧЬЯ ОДЕЖДА", "icon": "hunting",
                "subcats": {
                    "ov-kurtkasi": {"name": "Ov kurtkasi", "name_ru": "Охотничья куртка"},
                    "ov-shimi": {"name": "Ov shimi", "name_ru": "Охотничьи брюки"},
                }
            },
            "aksessuarlar": {
                "name": "AKSESSUARLAR", "name_ru": "АКСЕССУАРЫ", "icon": "watch",
                "subcats": {
                    "kozoynak": {"name": "Ko'zoynak", "name_ru": "Очки"},
                    "bandana": {"name": "Bandana", "name_ru": "Бандана"},
                    "kamar": {"name": "Kamar", "name_ru": "Ремень"},
                }
            }
        }
    },
    "jihozlar": {
        "name": "Jihozlar", "name_ru": "Снаряжение", "order": 2, "icon": "target",
        "categories": {
            "taktik-jihozlar": {
                "name": "TAKTIK JIHOZLAR", "name_ru": "ТАКТИЧЕСКОЕ СНАРЯЖЕНИЕ", "icon": "helmet",
                "subcats": {
                    "dubulgalar": {"name": "Dubulg'alar", "name_ru": "Шлемы"},
                    "himoya-jileti": {"name": "Himoya jileti", "name_ru": "Защитный жилет"},
                    "plita-tashuvchi": {"name": "Plita tashvuchi", "name_ru": "Плитоноска"},
                    "himoya-plitalari": {"name": "Himoya plitalari", "name_ru": "Бронеплиты"},
                    "kamarlar": {"name": "Kamarlar", "name_ru": "Ремни"},
                    "qobiqlar": {"name": "Qobiqlar", "name_ru": "Чехлы"},
                    "ov-jihozlari": {"name": "Ov jihozlari", "name_ru": "Охотничье снаряжение"},
                    "eshitish-himoyasi": {"name": "Eshitish himoyasi", "name_ru": "Защита слуха"},
                }
            },
            "pichoqlar-va-asboblar": {
                "name": "PICHOQLAR VA ASBOBLAR", "name_ru": "НОЖИ И ИНСТРУМЕНТЫ", "icon": "knife",
                "subcats": {
                    "jangovar-pichoq": {"name": "Jangovar pichoq", "name_ru": "Боевой нож"},
                    "chontak-pichogi": {"name": "Cho'ntak pichog'i", "name_ru": "Карманный нож"},
                    "bukiladigan-pichoq": {"name": "Bukiladigan pichoq", "name_ru": "Складной нож"},
                    "bolta": {"name": "Bolta", "name_ru": "Топор"},
                    "bolga-va-kirka": {"name": "Bolg'a va kirka", "name_ru": "Молоток и кирка"},
                    "aksessuarlar": {"name": "Aksessuarlar", "name_ru": "Аксессуары"},
                }
            },
            "yoruglik-va-yoritish": {
                "name": "YORUGLIK VA YORITISH", "name_ru": "ОСВЕЩЕНИЕ", "icon": "flashlight",
                "subcats": {
                    "bosh-chiroq": {"name": "Bosh chiroq", "name_ru": "Налобный фонарь"},
                    "fonarlar": {"name": "Fonarlar", "name_ru": "Фонари"},
                    "lyuminestsent-tayoqcha": {"name": "Lyuminestsent tayoqcha", "name_ru": "Светящиеся палочки"},
                    "lager-chiroq": {"name": "Lager chiroq", "name_ru": "Лагерный фонарь"},
                    "ishchi-chiroq": {"name": "Ishchi chiroq", "name_ru": "Рабочий фонарь"},
                }
            },
            "arqonlar-va-torlar": {
                "name": "ARQONLAR VA TO'RLAR", "name_ru": "ВЕРЁВКИ И СЕТИ", "icon": "rope",
                "subcats": {
                    "arqonlar": {"name": "Arqonlar", "name_ru": "Верёвки"},
                    "kamuflyaj-tor": {"name": "Kamuflyaj to'r", "name_ru": "Камуфляжная сеть"},
                    "mahkamlash": {"name": "Mahkamlash", "name_ru": "Крепления"},
                    "ilmoq": {"name": "Ilmoq", "name_ru": "Крючки"},
                }
            },
            "optika": {
                "name": "OPTIKA", "name_ru": "ОПТИКА", "icon": "binoculars",
                "subcats": {
                    "durbinlar": {"name": "Durbinlar", "name_ru": "Бинокли"},
                    "termal-kameralar": {"name": "Termal kameralar", "name_ru": "Тепловизоры"},
                }
            },
            "aksessuarlar-jihozlar": {
                "name": "AKSESSUARLAR", "name_ru": "АКСЕССУАРЫ", "icon": "watch",
                "subcats": {
                    "kozoynak": {"name": "Ko'zoynak", "name_ru": "Очки"},
                    "soatlar": {"name": "Soatlar", "name_ru": "Часы"},
                }
            }
        }
    },
    "omon-qolish": {
        "name": "Omon-qolish va lager", "name_ru": "Выживание и лагерь", "order": 3, "icon": "tent",
        "categories": {
            "lager-va-uxlash": {
                "name": "LAGER VA UXLASH", "name_ru": "ЛАГЕРЬ И СОН", "icon": "tent",
                "subcats": {
                    "lager-korpalari": {"name": "Lager ko'rpalari", "name_ru": "Лагерные одеяла"},
                    "lager-mebellari": {"name": "Lager mebellari", "name_ru": "Лагерная мебель"},
                    "brezent": {"name": "Brezent", "name_ru": "Брезент"},
                    "chodirlar": {"name": "Chodirlar", "name_ru": "Палатки"},
                    "issiq-uyqu-xaltasi": {"name": "Issiq uyqu xaltasi", "name_ru": "Тёплый спальник"},
                    "gamak": {"name": "Gamak", "name_ru": "Гамак"},
                }
            },
            "favqulodda-yordam": {
                "name": "FAVQULODDA YORDAM", "name_ru": "ПЕРВАЯ ПОМОЩЬ", "icon": "first-aid",
                "subcats": {
                    "qutqarish-korpalari": {"name": "Qutqarish ko'rpalari", "name_ru": "Спасательные одеяла"},
                    "plaster": {"name": "Plaster", "name_ru": "Пластырь"},
                    "turniket": {"name": "Turniket", "name_ru": "Турникет"},
                    "olov-yoqish": {"name": "Olov yoqish", "name_ru": "Разведение огня"},
                }
            },
            "dala-oshxonasi": {
                "name": "DALA OSHXONASI", "name_ru": "ПОЛЕВАЯ КУХНЯ", "icon": "utensils",
                "subcats": {
                    "pishirish-va-barbekyu": {"name": "Pishirish va barbekyu", "name_ru": "Готовка и барбекю"},
                    "oziq-ovqat": {"name": "Oziq-ovqat", "name_ru": "Продукты питания"},
                    "ichimlik-idishlari": {"name": "Ichimlik idishlari", "name_ru": "Посуда для напитков"},
                }
            },
            "suv-va-gidratsiya": {
                "name": "SUV VA GIDRATSIYA", "name_ru": "ВОДА И ГИДРАЦИЯ", "icon": "droplet",
                "subcats": {
                    "suv-filtri": {"name": "Suv filtri", "name_ru": "Фильтр для воды"},
                    "suv-termosi": {"name": "Suv termosi", "name_ru": "Термос"},
                    "gidratsiya-tizimlari": {"name": "Gidratsiya tizimlari", "name_ru": "Системы гидрации"},
                }
            }
        }
    },
    "ryukzaklar": {
        "name": "Ryukzaklar va sumkalar", "name_ru": "Рюкзаки и сумки", "order": 4, "icon": "backpack",
        "categories": {
            "ryukzaklar-cat": {
                "name": "RYUKZAKLAR", "name_ru": "РЮКЗАКИ", "icon": "backpack",
                "subcats": {
                    "taktik-ryukzak": {"name": "Taktik ryukzak", "name_ru": "Тактический рюкзак"},
                    "sayohat-ryukzak": {"name": "Sayohat ryukzak", "name_ru": "Дорожный рюкзак"},
                    "kundalik-ryukzak": {"name": "Kundalik ryukzak", "name_ru": "Повседневный рюкзак"},
                }
            },
            "sumkalar": {
                "name": "SUMKALAR", "name_ru": "СУМКИ", "icon": "briefcase",
                "subcats": {
                    "harbiy-sumka": {"name": "Harbiy sumka", "name_ru": "Военная сумка"},
                    "yelka-sumkasi": {"name": "Yelka sumkasi", "name_ru": "Наплечная сумка"},
                    "transport-sumka": {"name": "Transport sumka", "name_ru": "Транспортная сумка"},
                }
            },
            "bel-sumkalar": {
                "name": "BEL SUMKALAR", "name_ru": "ПОЯСНЫЕ СУМКИ", "icon": "wallet",
                "subcats": {
                    "taktik-bel-sumka": {"name": "Taktik bel sumka", "name_ru": "Тактическая поясная сумка"},
                    "kundalik-bel-sumka": {"name": "Kundalik bel sumka", "name_ru": "Ежедневная поясная сумка"},
                }
            },
            "suv-otkazmaydigan": {
                "name": "SUV O'TKAZMAYDIGAN", "name_ru": "ВОДОНЕПРОНИЦАЕМЫЕ", "icon": "droplet",
                "subcats": {
                    "suzuvchi-sumkalar": {"name": "Suzuvchi sumkalar", "name_ru": "Водонепроницаемые сумки"},
                    "suv-qoplari": {"name": "Suv qoplari", "name_ru": "Ёмкости для воды"},
                }
            },
            "retro-kolleksiya": {
                "name": "RETRO KOLLEKSIYA", "name_ru": "РЕТРО КОЛЛЕКЦИЯ", "icon": "backpack",
                "subcats": {
                    "klassik-ryukzak": {"name": "Klassik ryukzak", "name_ru": "Классический рюкзак"},
                    "vintage-sumka": {"name": "Vintage sumka", "name_ru": "Винтажная сумка"},
                }
            },
            "gidratsiya-sumkalari": {
                "name": "GIDRATSIYA SUMKALARI", "name_ru": "ГИДРАЦИОННЫЕ СУМКИ", "icon": "droplet",
                "subcats": {
                    "suv-tashish-tizimlari": {"name": "Suv tashish tizimlari", "name_ru": "Системы переноски воды"},
                }
            }
        }
    },
    "bridgehead": {
        "name": "Bridgehead", "name_ru": "Bridgehead", "is_active": True, "order": 5, "icon": "shield",
        "categories": {
            "bridgehead-kiyimlar": {
                "name": "KIYIMLAR", "name_ru": "ОДЕЖДА", "icon": "shirt",
                "subcats": {
                    "koylaklar": {"name": "Ko'ylaklar", "name_ru": "Рубашки"},
                    "shimlar": {"name": "Shimlar", "name_ru": "Брюки"},
                    "kurtkalar": {"name": "Kurtkalar", "name_ru": "Куртки"},
                    "fleece": {"name": "Fleece", "name_ru": "Флис"},
                }
            },
            "bridgehead-taktik": {
                "name": "TAKTIK", "name_ru": "ТАКТИКА", "icon": "helmet",
                "subcats": {
                    "taktik-jilet": {"name": "Taktik jilet", "name_ru": "Тактический жилет"},
                    "bel-sumka": {"name": "Bel sumka", "name_ru": "Поясная сумка"},
                    "molle-aksessuarlar": {"name": "Molle aksessuarlar", "name_ru": "MOLLE аксессуары"},
                }
            },
            "bridgehead-jihozlar": {
                "name": "JIHOZLAR", "name_ru": "СНАРЯЖЕНИЕ", "icon": "knife",
                "subcats": {
                    "pichoqlar": {"name": "Pichoqlar", "name_ru": "Ножи"},
                    "multi-tool": {"name": "Multi-tool", "name_ru": "Мультитул"},
                    "kamar": {"name": "Kamar", "name_ru": "Ремень"},
                }
            },
            "bridgehead-aksessuarlar": {
                "name": "AKSESSUARLAR", "name_ru": "АКСЕССУАРЫ", "icon": "watch",
                "subcats": {
                    "qolqoplar": {"name": "Qo'lqoplar", "name_ru": "Перчатки"},
                    "shapkalar": {"name": "Shapkalar", "name_ru": "Шапки"},
                    "bandana": {"name": "Bandana", "name_ru": "Бандана"},
                }
            }
        }
    },
    "bushpeak": {
        "name": "Bushpeak", "name_ru": "Bushpeak", "is_active": True, "order": 6, "icon": "compass",
        "categories": {
            "bushpeak-kiyimlar": {
                "name": "KIYIMLAR", "name_ru": "ОДЕЖДА", "icon": "shirt",
                "subcats": {
                    "kurtkalar": {"name": "Kurtkalar", "name_ru": "Куртки"},
                    "shimlar": {"name": "Shimlar", "name_ru": "Брюки"},
                    "fleece-kurtka": {"name": "Fleece kurtka", "name_ru": "Флисовая куртка"},
                    "termal-koylak": {"name": "Termal ko'ylak", "name_ru": "Термобельё"},
                }
            },
            "bushpeak-poyabzal": {
                "name": "POYABZAL", "name_ru": "ОБУВЬ", "icon": "boot",
                "subcats": {
                    "trek-botinkasi": {"name": "Trek botinkasi", "name_ru": "Треккинговые ботинки"},
                    "yengil-poyabzal": {"name": "Yengil poyabzal", "name_ru": "Лёгкая обувь"},
                }
            },
            "bushpeak-ryukzaklar": {
                "name": "RYUKZAKLAR", "name_ru": "РЮКЗАКИ", "icon": "backpack",
                "subcats": {
                    "trekking-ryukzak": {"name": "Trekking ryukzak", "name_ru": "Треккинговый рюкзак"},
                    "hiking-ryukzak": {"name": "Hiking ryukzak", "name_ru": "Хайкинговый рюкзак"},
                    "kundalik-ryukzak": {"name": "Kundalik ryukzak", "name_ru": "Повседневный рюкзак"},
                }
            },
            "bushpeak-aksessuarlar": {
                "name": "AKSESSUARLAR", "name_ru": "АКСЕССУАРЫ", "icon": "watch",
                "subcats": {
                    "kamar": {"name": "Kamar", "name_ru": "Ремень"},
                    "kozoynak": {"name": "Ko'zoynak", "name_ru": "Очки"},
                    "shapka": {"name": "Shapka", "name_ru": "Шапка"},
                    "qolliqop": {"name": "Qo'lliqop", "name_ru": "Варежки"},
                }
            }
        }
    }
}

def seed_catalog():
    print("🌱 Seeding Catalog...")
    for s_slug, s_data in SEED_DATA.items():
        section, _ = Section.objects.get_or_create(
            slug=s_slug,
            defaults={
                "name": s_data["name"], 
                "name_ru": s_data.get("name_ru", ""),
                "is_active": s_data.get("is_active", True),
                "order": s_data.get("order", 0),
                "icon": s_data.get("icon", "")
            }
        )
        if section.order != s_data.get("order", 0) or section.icon != s_data.get("icon", ""):
            section.order = s_data.get("order", 0)
            section.icon = s_data.get("icon", "")
            section.save()
            
        if section.is_active != s_data.get("is_active", True):
            section.is_active = s_data.get("is_active", True)
            section.save()
        
        for c_slug, c_data in s_data.get("categories", {}).items():
            category, _ = Category.objects.get_or_create(
                slug=c_slug,
                section=section,
                defaults={
                    "name": c_data["name"], 
                    "name_ru": c_data.get("name_ru", ""), 
                    "is_active": True,
                    "icon": c_data.get("icon", "")
                }
            )
            if category.icon != c_data.get("icon", ""):
                category.icon = c_data.get("icon", "")
                category.save()
            
            for sub_slug, sub_data in c_data.get("subcats", {}).items():
                SubCategory.objects.get_or_create(
                    slug=sub_slug,
                    category=category,
                    defaults={"name": sub_data["name"], "name_ru": sub_data.get("name_ru", ""), "is_active": True}
                )

def seed_content():
    print("🌱 Seeding Content (Hero & Settings)...")
    
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
            "badge": "HARBIY DARAJADAGI SIFAT",
            "badge_ru": "КАЧЕСТВО ВОЕННОГО УРОВНЯ",
            "is_active": True
        }
    )
    
    # Site Settings
    settings = SiteSettings.load()
    settings.shop_name = "Con-Dor.Uz"
    settings.tagline = "Tashqi va Taktik"
    settings.tagline_ru = "Наружное и тактическое снаряжение"
    settings.copyright_text = "© 2026 Army Shop CH. Barcha huquqlar himoyalangan."
    settings.copyright_text_ru = "© 2026 Army Shop CH. Все права защищены."
    settings.save()
    print("  Hero Slide and Settings updated.")

def seed_accounts():
    print("🌱 Seeding Accounts (Admin User)...")
    from accounts.models import User
    from django.contrib.auth.hashers import make_password
    
    user, created = User.objects.get_or_create(
        email='admin@gmail.com',
        defaults={
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
            'password': make_password('admin777')
        }
    )
    if not created:
        user.is_staff = True
        user.is_superuser = True
        user.role = 'admin'
        user.save()
    print("  Admin user (admin@gmail.com / admin777) ready.")

if __name__ == "__main__":
    seed_accounts()
    seed_catalog()
    seed_content()
    print("\n✅ All data restored successfully!")
