import requests
import logging
import html
import threading

logger = logging.getLogger(__name__)

def _send_request(url, payload, order_id=None):
    """Internal helper to send the actual request to Telegram."""
    try:
        response = requests.post(url, json=payload, timeout=15)
        if response.status_code != 200:
            logger.error(f"Telegram API Error ({response.status_code}): {response.text}")
            return False, response.text
        
        if order_id:
            logger.info(f"Telegram notification sent for order #{order_id}")
        else:
            logger.info("Telegram test message sent successfully")
        return True, "OK"
    except Exception as e:
        logger.error(f"Failed to send Telegram notification: {e}")
        return False, str(e)

def send_telegram_order_notification(order):
    """
    Sends a notification about a new order to a Telegram channel.
    Uses HTML parse mode and runs in a background thread.
    """
    from content.models import SiteSettings
    settings = SiteSettings.load()
    
    token = settings.telegram_bot_token
    channel_id = settings.telegram_channel_id
    
    if not token or not channel_id:
        logger.warning(f"Telegram notification skipped: Token missed or ChannelID missed")
        return

    # Escaping helper
    def e(text):
        return html.escape(str(text or ""))

    # Format items list
    items_text = ""
    for item in order.items.all():
        price_text = f"{item.price:,.0f} {settings.currency}"
        variant_info = ""
        if item.size or item.color:
            v_parts = []
            if item.size: v_parts.append(f"O'lcham: {item.size}")
            if item.color: v_parts.append(f"Rang: {item.color}")
            variant_info = f" ({', '.join(v_parts)})"
        
        items_text += f"\n• {e(item.product_name)} x {item.quantity}{e(variant_info)} — {e(price_text)}"

    # Construct message
    admin_url = f"{getattr(settings, 'FRONTEND_URL', 'https://con-dor.uz').rstrip('/')}/own/orders"
    
    message = (
        f"🆕 <b>YANGI BUYURTMA #{order.id}</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"👤 <b>Mijoz:</b> {e(order.full_name)}\n"
        f"📞 <b>Telefon:</b> <code>{e(order.phone)}</code>\n"
        f"📍 <b>Manzil:</b> {e(order.address)}\n"
        f"💬 <b>Izoh:</b> <i>{e(order.note or 'Yo\'q')}</i>\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"📦 <b>Mahsulotlar:</b>{items_text}\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"💰 <b>Jami summa:</b> <b>{order.total_amount:,.0f} {e(settings.currency)}</b>\n"
        f"🕒 <b>Vaqt:</b> {order.created_at.strftime('%H:%M | %d.%m.%Y')}\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"🔗 <a href='{admin_url}'>Admin panelda ko'rish</a>"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": channel_id,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }

    # Run in background to avoid blocking the main request
    thread = threading.Thread(target=_send_request, args=(url, payload, order.id))
    thread.daemon = True
    thread.start()


def send_test_telegram_message():
    """
    Sends a test message to verify Telegram credentials.
    Returns (success, message).
    """
    from content.models import SiteSettings
    settings = SiteSettings.load()
    
    token = settings.telegram_bot_token
    channel_id = settings.telegram_channel_id
    
    if not token or not channel_id:
        return False, "Bot token yoki Kanal ID kiritilmagan."

    message = (
        f"✅ <b>Telegram Aloqasi Tekshirildi</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━━\n"
        f"Ushbu xabarni ko'rayotgan bo'lsangiz, demak bot va kanal sozlamalari to'g'ri sozlangan.\n"
        f"Endi yangi buyurtmalar haqida xabarlar aynan shu yerga yuboriladi.\n"
        f"━━━━━━━━━━━━━━━━━━━━━"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": channel_id,
        "text": message,
        "parse_mode": "HTML"
    }

    return _send_request(url, payload)


