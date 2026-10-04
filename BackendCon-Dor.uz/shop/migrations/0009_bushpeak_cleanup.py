from django.db import migrations

def reorganize_bushpeak(apps, schema_editor):
    Section = apps.get_model('shop', 'Section')
    Category = apps.get_model('shop', 'Category')
    SubCategory = apps.get_model('shop', 'SubCategory')

    # 1. Deactivate Bushpeak section
    Section.objects.filter(slug='bushpeak').update(is_active=False)

    # 2. Find target Categories to move items into
    # We need to map Bushpeak subcategories to existing categories in Kiyimlar or Ryukzaklar
    
    # Target Categories slugs
    CAT_USTKI = Category.objects.filter(slug='ustki-kiyim').first()
    CAT_PASTKI = Category.objects.filter(slug='pastki-kiyim').first()
    CAT_POYABZAL = Category.objects.filter(slug='poyabzal').first()
    CAT_RYUKZAK = Category.objects.filter(slug='ryukzaklar-cat').first()
    CAT_QOLQOP = Category.objects.filter(slug='qolqop').first()

    # Move/Ensure subcategories exist in main categories
    if CAT_USTKI:
        SubCategory.objects.get_or_create(category=CAT_USTKI, slug='fleece-kurtka', defaults={'name': 'Fleece kurtka', 'name_ru': 'Флисовая куртка'})
    
    if CAT_PASTKI:
        SubCategory.objects.get_or_create(category=CAT_PASTKI, slug='termal-koylak', defaults={'name': 'Termal ko\'ylak', 'name_ru': 'Термобелье'})
        
    if CAT_POYABZAL:
        SubCategory.objects.get_or_create(category=CAT_POYABZAL, slug='trek-botinkasi', defaults={'name': 'Trek botinkasi', 'name_ru': 'Треккинговые ботинки'})
        SubCategory.objects.get_or_create(category=CAT_POYABZAL, slug='yengil-poyabzal', defaults={'name': 'Yengil poyabzal', 'name_ru': 'Легкая обувь'})

    if CAT_QOLQOP:
        SubCategory.objects.get_or_create(category=CAT_QOLQOP, slug='qolliqop', defaults={'name': 'Qo\'lliqop', 'name_ru': 'Варежки'})

def reverse_cleanup(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0008_final_sync'),
    ]

    operations = [
        migrations.RunPython(reorganize_bushpeak, reverse_cleanup),
    ]
