"""
Populate name_ru for ALL Section, Category, and SubCategory records.
Run: .\venv\Scripts\activate; python populate_ru.py
"""
import os, sys, django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from shop.models import Section, Category, SubCategory

# ─── Sections ────────────────────────────────────────
SECTION_RU = {
    "kiyimlar": "Одежда",
    "jihozlar": "Снаряжение",
    "ryukzaklar": "Рюкзаки и сумки",
    "omon-qolish": "Выживание и лагерь",
    "bushpeak": "Bushpeak",
    "bridgehead": "Bridgehead",
}

# ─── Categories ──────────────────────────────────────
CATEGORY_RU = {
    "kiyimlar": "ОДЕЖДА",
    "ustki-kiyim": "ВЕРХНЯЯ ОДЕЖДА",
    "bosh-kiyim": "ГОЛОВНЫЕ УБОРЫ",
    "pastki-kiyim": "НИЖНЯЯ ОДЕЖДА",
    "poyabzal": "ОБУВЬ",
    "paypoq": "НОСКИ",
    "qolqop": "ПЕРЧАТКИ",
    "ov-kiyim": "ОХОТНИЧЬЯ ОДЕЖДА",
    "yomgir-kiyim": "ДОЖДЕВАЯ ОДЕЖДА",
    "jihozlar": "СНАРЯЖЕНИЕ",
    "taktik-jihozlar": "ТАКТИЧЕСКОЕ СНАРЯЖЕНИЕ",
    "taktik": "ТАКТИКА",
    "pichoqlar-va-asboblar": "НОЖИ И ИНСТРУМЕНТЫ",
    "yoruglik-va-yoritish": "ОСВЕЩЕНИЕ",
    "arqonlar-va-torlar": "ВЕРЁВКИ И СЕТИ",
    "optika": "ОПТИКА",
    "suv-otkazmaydigan": "ВОДОНЕПРОНИЦАЕМЫЕ",
    "ryukzaklar": "РЮКЗАКИ",
    "sumkalar": "СУМКИ",
    "aksessuarlar": "АКСЕССУАРЫ",
    "bel-sumkalar": "ПОЯСНЫЕ СУМКИ",
    "gidratsiya-sumkalari": "ГИДРАЦИОННЫЕ СУМКИ",
    "dala-oshxonasi": "ПОЛЕВАЯ КУХНЯ",
    "suv-va-gidratsiya": "ВОДА И ГИДРАЦИЯ",
    "lager-va-uxlash": "ЛАГЕРЬ И СОН",
    "favqulodda-yordam": "ПЕРВАЯ ПОМОЩЬ",
    "retro-kolleksiya": "РЕТРО КОЛЛЕКЦИЯ",
}

# ─── SubCategories ───────────────────────────────────
SUBCAT_RU = {
    "arqonlar": "Верёвки",
    "bambuk-paypoq": "Бамбуковые носки",
    "barmoqli": "С пальцами",
    "barmoqsiz": "Без пальцев",
    "bosh-chiroq": "Налобный фонарь",
    "dubulgalar": "Шлемы",
    "durbinlar": "Бинокли",
    "harbiy-etik": "Военные ботинки",
    "harbiy-sumka": "Военная сумка",
    "jangovar-pichoq": "Боевой нож",
    "kamar": "Ремень",
    "kamarlar": "Ремни",
    "klassik-ryukzak": "Классический рюкзак",
    "koylaklar": "Рубашки",
    "kozoynak": "Очки",
    "kurtkalar": "Куртки",
    "lager-korpalari": "Лагерные одеяла",
    "lager-mebellari": "Лагерная мебель",
    "ov-kurtkasi": "Охотничья куртка",
    "ov-shimi": "Охотничьи брюки",
    "pichoqlar": "Ножи",
    "pishirish-va-barbekyu": "Готовка и барбекю",
    "poncholar": "Пончо",
    "qolqoplar": "Перчатки",
    "qolqop": "Перчатка",
    "qolliqop": "Варежки",
    "qutqarish-korpalari": "Спасательные одеяла",
    "shapkalar": "Шапки",
    "shapka": "Шапка",
    "shimlar": "Брюки",
    "suv-filtri": "Фильтр для воды",
    "suv-tashish-tizimlari": "Системы переноски воды",
    "suv-qoplari": "Ёмкости для воды",
    "suv-termosi": "Термос",
    "suzuvchi-sumkalar": "Водонепроницаемые сумки",
    "sviter": "Свитер",
    "taktik-bel-sumka": "Тактическая поясная сумка",
    "taktik-jilet": "Тактический жилет",
    "taktik-ryukzak": "Тактический рюкзак",
    "trek-botinkasi": "Треккинговые ботинки",
    "trekking-ryukzak": "Треккинговый рюкзак",
    "balaklava": "Балаклава",
    "bandana": "Бандана",
    "bel-sumka": "Поясная сумка",
    "chontak-pichogi": "Карманный нож",
    "fonarlar": "Фонари",
    "harbiy-paypoq": "Военные носки",
    "hiking-ryukzak": "Хайкинговый рюкзак",
    "himoya-jileti": "Защитный жилет",
    "ichki-kiyim": "Нижнее бельё",
    "kamuflyaj-tor": "Камуфляжная сеть",
    "kundalik-bel-sumka": "Ежедневная поясная сумка",
    "kundalik-ryukzak": "Повседневный рюкзак",
    "multi-tool": "Мультитул",
    "oziq-ovqat": "Продукты питания",
    "plaster": "Пластырь",
    "sayohat-ryukzak": "Дорожный рюкзак",
    "soatlar": "Часы",
    "tashqi-poyabzal": "Наружная обувь",
    "termal-kameralar": "Тепловизоры",
    "vintage-sumka": "Винтажная сумка",
    "yelka-sumkasi": "Наплечная сумка",
    "yengil-poyabzal": "Лёгкая обувь",
    "yomgirdan-himoya": "Защита от дождя",
    "brezent": "Брезент",
    "bukiladigan-pichoq": "Складной нож",
    "fleece-kurtka": "Флисовая куртка",
    "fleece": "Флис",
    "gidratsiya-tizimlari": "Системы гидрации",
    "ichimlik-idishlari": "Посуда для напитков",
    "lyuminestsent-tayoqcha": "Светящиеся палочки",
    "mahkamlash": "Крепления",
    "molle-aksessuarlar": "MOLLE аксессуары",
    "ovchi-shapkasi": "Охотничья шапка",
    "plita-tashuvchi": "Плитоноска",
    "termal-paypoq": "Термоноски",
    "transport-sumka": "Транспортная сумка",
    "turniket": "Турникет",
    "bolta": "Топор",
    "chodirlar": "Палатки",
    "himoya-plitalari": "Бронеплиты",
    "ilmoq": "Крючки",
    "kepkalar": "Кепки",
    "lager-chiroq": "Лагерный фонарь",
    "olov-yoqish": "Разведение огня",
    "termal-koylak": "Термобельё",
    "treking-paypoq": "Треккинговые носки",
    "bolga-va-kirka": "Молоток и кирка",
    "ishchi-chiroq": "Рабочий фонарь",
    "issiq-uyqu-xaltasi": "Тёплый спальник",
    "aksessuarlar": "Аксессуары",
    "gamak": "Гамак",
    "qobiqlar": "Чехлы",
    "ov-jihozlari": "Охотничье снаряжение",
    "eshitish-himoyasi": "Защита слуха",
}

updated = 0

for s in Section.objects.all():
    ru = SECTION_RU.get(s.slug, "")
    if ru:
        s.name_ru = ru
        s.save(update_fields=["name_ru"])
        updated += 1
        print(f"  Section: {s.name} -> {ru}")

for c in Category.objects.all():
    ru = CATEGORY_RU.get(c.slug, "")
    if ru:
        c.name_ru = ru
        c.save(update_fields=["name_ru"])
        updated += 1
        print(f"  Category: {c.name} -> {ru}")

for s in SubCategory.objects.all():
    ru = SUBCAT_RU.get(s.slug, "")
    if ru:
        s.name_ru = ru
        s.save(update_fields=["name_ru"])
        updated += 1
        print(f"  SubCat: {s.name} -> {ru}")

print(f"\n✅ Updated {updated} records with Russian names.")
