from django.db import migrations

def set_section_order(apps, schema_editor):
    Section = apps.get_model('shop', 'Section')
    
    # Define the desired order based on slugs
    desired_order = [
        "kiyimlar",
        "jihozlar",
        "omon-qolish",
        "ryukzaklar",
        "bridgehead",
        # "katalog" and "bog-lanish" are likely frontend-only links or other sections
    ]

    for index, slug in enumerate(desired_order):
        Section.objects.filter(slug=slug).update(order=index + 1)

def reverse_order(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0009_bushpeak_cleanup'),
    ]

    operations = [
        migrations.RunPython(set_section_order, reverse_order),
    ]
