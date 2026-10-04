import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from content.models import SiteSettings

try:
    s = SiteSettings.load()
    print(f"BOT_TOKEN_RAW: '{s.telegram_bot_token}'")
    print(f"CHANNEL_ID_RAW: '{s.telegram_channel_id}'")
    
    if not s.telegram_bot_token or not s.telegram_channel_id:
        print("WARNING: One or both fields are EMPTY in database.")
    else:
        print("SUCCESS: Both fields have values in database.")
except Exception as e:
    print(f"ERROR: {e}")
