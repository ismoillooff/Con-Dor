from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_admin(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    # Default admin for development/reset
    User.objects.get_or_create(
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

def remove_admin(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    User.objects.filter(email='admin@gmail.com').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_admin, remove_admin),
    ]
