from django.db import migrations

def move_bushpeak_to_end(apps, schema_editor):
    Section = apps.get_model('shop', 'Section')
    
    # 1. Ensure Bushpeak is active again
    bushpeak = Section.objects.filter(slug='bushpeak').first()
    if bushpeak:
        bushpeak.is_active = True
        bushpeak.order = 100  # High number to ensure it stays at the end
        bushpeak.save()

    # 2. Refine other orders just in case
    orders = {
        "kiyimlar": 1,
        "jihozlar": 2,
        "omon-qolish": 3,
        "ryukzaklar": 4,
        "bridgehead": 5,
        "bushpeak": 6,  # Final position
    }

    for slug, order in orders.items():
        Section.objects.filter(slug=slug).update(order=order)

def reverse_cleanup(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0010_section_ordering'),
    ]

    operations = [
        migrations.RunPython(move_bushpeak_to_end, reverse_cleanup),
    ]
