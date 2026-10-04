from django.db import migrations

def final_seed(apps, schema_editor):
    Section = apps.get_model('shop', 'Section')
    Category = apps.get_model('shop', 'Category')
    SubCategory = apps.get_model('shop', 'SubCategory')

    # Full data for Bushpeak and Bridgehead specifically to ensure they are updated
    DATA = {
        "bushpeak": {
            "name": "Bushpeak", "is_active": True,
            "categories": {
                "bushpeak-kiyimlar": {
                    "name": "KIYIMLAR", "name_ru": "ОДЕЖДА",
                    "subcats": {
                        "kurtkalar": {"name": "Kurtkalar", "name_ru": "Куртки"},
                        "shimlar": {"name": "Shimlar", "name_ru": "Брюки"},
                        "fleece-kurtka": {"name": "Fleece kurtka", "name_ru": "Флисовая куртка"},
                        "termal-koylak": {"name": "Termal ko'ylak", "name_ru": "Термобельё"},
                    }
                },
                "bushpeak-poyabzal": {
                    "name": "POYABZAL", "name_ru": "ОБУВЬ",
                    "subcats": {
                        "trek-botinkasi": {"name": "Trek botinkasi", "name_ru": "Треккинговые ботинки"},
                        "yengil-poyabzal": {"name": "Yengil poyabzal", "name_ru": "Лёгкая обувь"},
                    }
                },
                "bushpeak-ryukzaklar": {
                    "name": "RYUKZAKLAR", "name_ru": "РЮКЗАКИ",
                    "subcats": {
                        "trekking-ryukzak": {"name": "Trekking ryukzak", "name_ru": "Треккинговый рюкзак"},
                        "hiking-ryukzak": {"name": "Hiking ryukzak", "name_ru": "Хайкинговый рюкзак"},
                        "kundalik-ryukzak": {"name": "Kundalik ryukzak", "name_ru": "Повседневный рюкзак"},
                    }
                },
                "bushpeak-aksessuarlar": {
                    "name": "AKSESSUARLAR", "name_ru": "АКСЕССУАРЫ",
                    "subcats": {
                        "kamar": {"name": "Kamar", "name_ru": "Ремень"},
                        "kozoynak": {"name": "Ko'zoynak", "name_ru": "Очки"},
                        "shapka": {"name": "Shapka", "name_ru": "Шапка"},
                        "qolliqop": {"name": "Qo'lliqop", "name_ru": "Варежки"},
                    }
                }
            }
        },
        "bridgehead": {
            "name": "Bridgehead", "is_active": True,
            "categories": {
                "bridgehead-kiyimlar": {
                    "name": "KIYIMLAR", "name_ru": "ОДЕЖДА",
                    "subcats": {
                        "koylaklar": {"name": "Ko'ylaklar", "name_ru": "Рубашки"},
                        "shimlar": {"name": "Shimlar", "name_ru": "Брюки"},
                        "kurtkalar": {"name": "Kurtkalar", "name_ru": "Куртки"},
                        "fleece": {"name": "Fleece", "name_ru": "Флис"},
                    }
                },
                "bridgehead-taktik": {
                    "name": "TAKTIK", "name_ru": "ТАКТИКА",
                    "subcats": {
                        "taktik-jilet": {"name": "Taktik jilet", "name_ru": "Тактический жилет"},
                        "bel-sumka": {"name": "Bel sumka", "name_ru": "Поясная сумка"},
                        "molle-aksessuarlar": {"name": "Molle aksessuarlar", "name_ru": "MOLLE аксессуары"},
                    }
                },
                "bridgehead-jihozlar": {
                    "name": "JIHOZLAR", "name_ru": "СНАРЯЖЕНИЕ",
                    "subcats": {
                        "pichoqlar": {"name": "Pichoqlar", "name_ru": "Ножи"},
                        "multi-tool": {"name": "Multi-tool", "name_ru": "Мультитул"},
                        "kamar": {"name": "Kamar", "name_ru": "Ремень"},
                    }
                },
                "bridgehead-aksessuarlar": {
                    "name": "AKSESSUARLAR", "name_ru": "АКСЕССУАРЫ",
                    "subcats": {
                        "qolqoplar": {"name": "Qo'lqoplar", "name_ru": "Перчатки"},
                        "shapkalar": {"name": "Shapkalar", "name_ru": "Шапки"},
                        "bandana": {"name": "Bandana", "name_ru": "Бандана"},
                    }
                }
            }
        }
    }

    for s_slug, s_data in DATA.items():
        section, _ = Section.objects.get_or_create(slug=s_slug, defaults={"name": s_data["name"]})
        section.is_active = True
        section.save()
        
        for c_slug, c_data in s_data["categories"].items():
            category, _ = Category.objects.get_or_create(
                slug=c_slug, section=section, 
                defaults={"name": c_data["name"], "name_ru": c_data.get("name_ru", "")}
            )
            category.is_active = True
            category.save()
            
            for sub_slug, sub_data in c_data["subcats"].items():
                SubCategory.objects.get_or_create(
                    slug=sub_slug, category=category,
                    defaults={"name": sub_data["name"], "name_ru": sub_data.get("name_ru", "")}
                )

def reverse_sync(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0007_sync_seed'),
    ]

    operations = [
        migrations.RunPython(final_seed, reverse_sync),
    ]
