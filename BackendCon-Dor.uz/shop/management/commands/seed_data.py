from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from shop.models import Section, Category, SubCategory, Product
from content.models import HeroSlide, Banner, Testimonial, FAQ, Partner

class Command(BaseCommand):
    help = "Seeds hierarchical catalog data (Section > Category > SubCategory)"

    def handle(self, *args, **options):
        self.stdout.write("--- Start Hierarchical Seeding ---")
        
        try:
            with transaction.atomic():
                self.seed_catalog()
                self.seed_cms()
            
            self.stdout.write(self.style.SUCCESS("✔ Completed successfully"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✖ Failed: {str(e)}"))
            raise e

    def seed_catalog(self):
        self.stdout.write("Clearing existing catalog data...")
        Product.objects.all().delete()
        Section.objects.all().delete()
        
        self.stdout.write("Seeding catalog hierarchy...")
        
        # 1. Targeted Sections (The only ones allowed)
        allowed_sections = [
            {
                'name': 'Kiyimlar', 'slug': 'kiyimlar', 'order': 1, 'icon': '👕', 
                'desc': "Harbiy va tashqi kiyimlar — professional sifatda, har qanday ob-havo sharoitiga mos", 
                'color': '#c8102e'
            },
            {
                'name': 'Jihozlar', 'slug': 'jihozlar', 'order': 2, 'icon': '🎯', 
                'desc': 'Taktik va ov uskunalari — professional daraja, harbiy standartlar', 
                'color': '#4a5d23'
            },
            {
                'name': 'Ryukzak va sumkalar', 'slug': 'ryukzaklar', 'order': 3, 'icon': '🎒', 
                'desc': "Taktik va sayohat sumkalari — bardoshli, keng sig'imli", 
                'color': '#c4a572'
            },
            {
                'name': 'Omon qolish va lager', 'slug': 'omon-qolish', 'order': 4, 'icon': '⛺', 
                'desc': 'Lager va favqulodda vositalar — tabiatda yashash uchun zarur', 
                'color': '#2d6a4f'
            },
            {
                'name': 'Bushpeak', 'slug': 'bushpeak', 'order': 5, 'icon': '🧭', 
                'desc': 'Premium tashqi liniya — eksklyuziv dizayn va eng yuqori sifat', 
                'color': '#6b8a33'
            },
            {
                'name': 'Bridgehead', 'slug': 'bridgehead', 'order': 6, 'icon': '🔪', 
                'desc': 'Taktik kolleksiyalar — yangi liniya, professional darajada', 
                'color': '#7c3aed'
            },
        ]
        
        # Remove sections not in the allowed list
        allowed_slugs = [s['slug'] for s in allowed_sections]
        deleted_count = Section.objects.exclude(slug__in=allowed_slugs).delete()
        self.stdout.write(f"Removed {deleted_count[0]} non-allowed sections and their children.")

        sections = {}
        for s in allowed_sections:
            obj, _ = Section.objects.update_or_create(
                slug=s['slug'],
                defaults={
                    'name': s['name'], 
                    'order': s['order'], 
                    'is_active': True,
                    'icon': s['icon'],
                    'description': s['desc'],
                    'color': s['color']
                }
            )
            sections[s['slug']] = obj

        # 2. Data from Frontend categories.tsx
        hierarchy = {
            'kiyimlar': [
                {'name': 'USTKI KIYIM', 'subs': ['Sviter', "Ko'ylaklar", 'Kurtkalar', 'Kepkalar']},
                {'name': 'BOSH KIYIM', 'subs': ['Shapkalar', 'Balaklava', 'Ovchi shapkasi']},
                {'name': 'PASTKI KIYIM', 'subs': ['Shimlar', 'Ichki kiyim']},
                {'name': "YOMG'IR KIYIM", 'subs': ['Poncholar', "Yomg'irdan himoya"]},
                {'name': 'POYABZAL', 'subs': ['Harbiy etik', 'Tashqi poyabzal']},
                {'name': 'PAYPOQ', 'subs': ['Bambuk paypoq', 'Harbiy paypoq', 'Termal paypoq', 'Treking paypoq']},
                {'name': "QO'LQOP", 'subs': ['Barmoqli', 'Barmoqsiz', "Qo'lqop"]},
                {'name': 'OV KIYIM', 'subs': ['Ov kurtkasi', 'Ov shimi']},
                {'name': 'AKSESSUARLAR', 'subs': ["Ko'zoynak", 'Bandana', 'Kamar']},
            ],
            'jihozlar': [
                {'name': 'TAKTIK JIHOZLAR', 'subs': ["Dubulg'alar", 'Himoya jileti', 'Plita tashuvchi', 'Himoya plitalari', 'Kamarlar', 'Qobiqlar', 'Ov jihozlari', 'Eshitish himoyasi']},
                {'name': 'PICHOQLAR VA ASBOBLAR', 'subs': ['Jangovar pichoq', "Cho'ntak pichog'i", 'Bukiladigan pichoq', 'Bolta', "Bolg'a va kirka", 'Aksessuarlar']},
                {'name': "YORUG'LIK VA YORITISH", 'subs': ['Bosh chiroq', 'Fonarlar', 'Lyuminestsent tayoqcha', 'Lager chiroq', 'Ishchi chiroq']},
                {'name': "ARQONLAR VA TO'RLAR", 'subs': ['Arqonlar', "Kamuflyaj to'r", 'Mahkamlash', 'Ilmoq']},
                {'name': 'OPTIKA', 'subs': ['Durbinlar', 'Termal kameralar']},
                {'name': 'AKSESSUARLAR', 'subs': ["Ko'zoynak", 'Soatlar']},
            ],
            'ryukzaklar': [
                {'name': 'RYUKZAKLAR', 'subs': ['Taktik ryukzak', 'Sayohat ryukzak', 'Kundalik ryukzak']},
                {'name': 'SUMKALAR', 'subs': ['Harbiy sumka', 'Yelka sumkasi', 'Transport sumka']},
                {'name': 'BEL SUMKALAR', 'subs': ['Taktik bel sumka', 'Kundalik bel sumka']},
                {'name': "SUV O'TKAZMAYDIGAN", 'subs': ['Suzuvchi sumkalar', 'Suv qoplari']},
                {'name': 'RETRO KOLLEKSIYA', 'subs': ['Klassik ryukzak', 'Vintage sumka']},
                {'name': 'GIDRATSIYA SUMKALARI', 'subs': ['Suv tashish tizimlari']},
            ],
            'omon-qolish': [
                {'name': 'LAGER VA UXLASH', 'subs': ["Lager ko'rpalari", 'Lager mebellari', 'Brezent', 'Chodirlar', 'Issiq uyqu xaltasi', 'Gamak']},
                {'name': 'FAVQULODDA YORDAM', 'subs': ["Qutqarish ko'rpalari", 'Plaster', 'Turniket', 'Olov yoqish']},
                {'name': 'DALA OSHXONASI', 'subs': ['Pishirish va barbekyu', 'Oziq-ovqat', 'Ichimlik idishlari']},
                {'name': 'SUV VA GIDRATSIYA', 'subs': ['Suv filtri', 'Suv termosi', 'Gidratsiya tizimlari']},
            ],
            'bushpeak': [
                {'name': 'KIYIMLAR', 'subs': ['Kurtkalar', 'Shimlar', 'Fleece kurtka', "Termal ko'ylak"]},
                {'name': 'RYUKZAKLAR', 'subs': ['Trekking ryukzak', 'Hiking ryukzak', 'Kundalik ryukzak']},
                {'name': 'AKSESSUARLAR', 'subs': ['Kamar', "Ko'zoynak", 'Shapka', "Qo'lliqop"]},
                {'name': 'POYABZAL', 'subs': ['Trek botinkasi', 'Yengil poyabzal']},
            ],
            'bridgehead': [
                {'name': 'KIYIMLAR', 'subs': ["Ko'ylaklar", 'Shimlar', 'Kurtkalar', 'Fleece']},
                {'name': 'JIHOZLAR', 'subs': ['Pichoqlar', 'Multi-tool', 'Kamar']},
                {'name': 'AKSESSUARLAR', 'subs': ["Qo'lqoplar", 'Shapkalar', 'Bandana']},
                {'name': 'TAKTIK', 'subs': ['Taktik jilet', 'Bel sumka', 'Molle aksessuarlar']},
            ]
        }

        sub_objs = []
        for sec_slug, cats in hierarchy.items():
            section = sections.get(sec_slug)
            if not section: continue
            
            for c_idx, c_data in enumerate(cats):
                cat_slug = slugify(c_data['name'].replace("'", ""))
                cat_obj, _ = Category.objects.update_or_create(
                    section=section,
                    slug=cat_slug,
                    defaults={
                        'name': c_data['name'], 
                        'order': c_idx + 1,
                        'is_active': True,
                        'color': '#c8102e'
                    }
                )
                
                for s_idx, s_name in enumerate(c_data['subs']):
                    sub_obj, _ = SubCategory.objects.update_or_create(
                        category=cat_obj,
                        slug=slugify(s_name.replace("'", "")),
                        defaults={'name': s_name, 'order': s_idx + 1, 'is_active': True}
                    )
                    sub_objs.append(sub_obj)

        self.stdout.write(f"✔ Hierarchical structure seeded ({len(sub_objs)} subcategories).")

        # 3. Products (Deep Seeding: 4 products per subcategory)
        self.stdout.write("Deep seeding products (4 per subcategory)...")
        
        IMG_MAP = {
            'jacket': ['Sviter', "Ko'ylaklar", 'Kurtkalar', 'Ov kurtkasi', 'Fleece kurtka', "Termal ko'ylak", 'Fleece', 'Kepkalar'],
            'boots': ['Harbiy etik', 'Tashqi poyabzal', 'Trek botinkasi', 'Yengil poyabzal', 'POYABZAL'],
            'backpack': ['Taktik ryukzak', 'Sayohat ryukzak', 'Kundalik ryukzak', 'Harbiy sumka', 'Yelka sumkasi', 'Transport sumka', 'Trekking ryukzak', 'Hiking ryukzak', 'Klassik ryukzak', 'Vintage sumka', 'RYUKZAKLAR', 'SUMKALAR'],
            'helmet': ["Dubulg'alar", 'Himoya jileti', 'Plita tashuvchi', 'Himoya plitalari', 'Taktik jilet', 'TAKTIK JIHOZLAR'],
            'knife': ['Jangovar pichoq', "Cho'ntak pichog'i", 'Bukiladigan pichoq', 'Bolta', "Bolg'a va kirka", 'Pichoqlar', 'Multi-tool', 'PICHOQLAR VA ASBOBLAR'],
            'watch': ['Soatlar', 'AKSESSUARLAR'],
            'flashlight': ['Bosh chiroq', 'Fonarlar', 'Lyuminestsent tayoqcha', 'Lager chiroq', 'Ishchi chiroq', 'YORUG\'LIK VA YORITISH'],
            'tent': ['Chodirlar', 'Lager ko\'rpalari', 'Issiq uyqu xaltasi', 'Gamak', 'LAGER VA UXLASH', 'Brezent', 'Lager mebellari'],
            'optics': ['Durbinlar', 'Termal kameralar', 'OPTIKA'],
            'gloves': ['Barmoqli', 'Barmoqsiz', 'Qo\'lqop', 'Qo\'lqoplar', 'Qo\'lliqop', 'QO\'LQOP'],
            'pants': ['Shimlar', 'Pastki kiyim', 'Ov shimi', 'PASTKI KIYIM'],
            'waist_bag': ['Taktik bel sumka', 'Kundalik bel sumka', 'BEL SUMKALAR', 'Bel sumka', 'TAKTIK'],
            'survival': ['Qutqarish ko\'rpalari', 'Plaster', 'Turniket', 'Olov yoqish', 'FAVQULODDA YORDAM', 'Arqonlar', 'Kamuflyaj to\'r', 'Mahkamlash', 'Ilmoq', 'ARQONLAR VA TO\'RLAR', 'Kamar', 'Kamarlar', 'Qobiqlar'],
            'kitchen': ['Pishirish va barbekyu', 'Oziq-ovqat', 'Ichimlik idishlari', 'DALA OSHXONASI', 'Suv filtri', 'Suv termosi', 'Gidratsiya tizimlari', 'Suv tashish tizimlari', 'Suzuvchi sumkalar', 'Suv qoplari', 'SUV VA GIDRATSIYA', 'SUV O\'TKAZMAYDIGAN', 'GIDRATSIYA SUMKALARI'],
        }

        def get_img_for_sub(sub_name):
            for img, subs in IMG_MAP.items():
                if any(s.lower() in sub_name.lower() for s in subs):
                    return f"products/{img}.png"
            return "products/backpack.png" # Default

        adjectives = ['Premium', 'Taktik', 'Pro', 'Elite', 'Alpha', 'Delta', 'Stealth', 'Rugged', 'Special', 'Master']
        
        all_subs = SubCategory.objects.all()
        total_p = 0
        for sub in all_subs:
            base_price = 45.0 + (sub.id % 20) * 10
            img_path = get_img_for_sub(sub.name)
            
            for i in range(1, 5):
                adj = adjectives[(i + sub.id) % len(adjectives)]
                p_name = f"{adj} {sub.name} v{i}"
                p_slug = slugify(f"{p_name}-{sub.id}")
                
                p_obj, _ = Product.objects.update_or_create(
                    slug=p_slug,
                    defaults={
                        'subcategory': sub,
                        'name': p_name,
                        'description': f"Professional {sub.name} — eng yuqori standartlarga javob beruvchi {adj} model. Chidamlilik va funksionallikning mukammal uyg'unligi.",
                        'price': base_price + (i * 5),
                        'old_price': (base_price + (i * 5)) * 1.25 if i == 1 else None,
                        'badge': 'YANGI' if i == 4 else ('SALE' if i == 1 else ''),
                        'rating': 4.5 + (i * 0.1),
                        'reviews_count': 10 + (sub.id * i),
                        'is_active': True,
                        'is_featured': i == 1
                    }
                )
                
                from shop.models import ProductImage
                ProductImage.objects.update_or_create(
                    product=p_obj,
                    is_primary=True,
                    defaults={'image': img_path, 'alt_text': p_name}
                )
                total_p += 1
        
        self.stdout.write(self.style.SUCCESS(f"✔ Successfully seeded {total_p} products across all subcategories."))

    def seed_cms(self):
        self.stdout.write("Seeding CMS content...")
        
        # Sliders (Expert Level Default Content)
        sliders = [
            {
                'title': 'HAR QANDAY VAZIFA\nUCHUN TAYYOR', 
                'sub': 'Shveytsariya harbiy sifati 1990 yildan beri. Professional taktik jihozlar va kiyimlar.', 
                'badge': '🎖️ HARBIY SIFAT', 
                'order': 1,
                'image': 'uploads/hero_1.png',
                'anim': 'fade-up'
            },
            {
                'title': 'EKSTREMAL SHAROITLARDA\nISHONCHLI HAMROH', 
                'sub': 'Bushcraft va omon qolish uchun eng yaxshi uskunalar. Tog\' cho\'qqisidan chuqur o\'rmongacha.', 
                'badge': '⛰️ EKSTREMAL', 
                'order': 2,
                'image': 'uploads/hero_2.png',
                'anim': 'slide-left'
            },
            {
                'title': 'ANIQLIK VA\nCHIDAMLILIK', 
                'sub': 'Taktik soatlar va yuqori texnologiyali uskunalar. Har bir soniya hisobda bo\'lganda bizga ishoning.', 
                'badge': '⌚ PROFESSIONAL', 
                'order': 3,
                'image': 'uploads/hero_3.png',
                'anim': 'zoom-in'
            },
        ]
        for s in sliders:
            HeroSlide.objects.update_or_create(
                order=s['order'],
                defaults={
                    'title': s['title'], 
                    'subtitle': s['sub'], 
                    'badge': s['badge'], 
                    'image': s['image'],
                    'animation_type': s['anim'],
                    'cta1_text': 'Xarid qilish', 
                    'cta1_link': '/catalog',
                    'cta2_text': 'Ko\'proq',
                    'cta2_link': '/about',
                    'overlay_color': '#000000',
                    'overlay_opacity': 0.5,
                    'is_active': True
                }
            )

        # FAQ
        FAQ.objects.update_or_create(
            question="Yetkazib berish qancha vaqt oladi?",
            defaults={'answer': "1-3 ish kuni davom etadi.", 'order': 1}
        )
        
        # Partners
        partners = ['Visa', 'Mastercard', 'PayPal', 'DHL']
        for i, name in enumerate(partners):
            Partner.objects.update_or_create(name=name, defaults={'order': i+1, 'is_active': True})

        # Banner
        Banner.objects.update_or_create(
            title="EKSTREMAL SIFAT",
            defaults={'subtitle': "Eng yaxshi jihozlar faqat bizda.", 'cta_text': "Sotib olish", 'is_active': True}
        )
        
        # Testimonials
        Testimonial.objects.update_or_create(
            name="Aziz", defaults={'role': "Toshkent", 'content': "Juda zo'r!", 'rating': 5}
        )

        self.stdout.write(self.style.SUCCESS("✔ CMS seeded"))
