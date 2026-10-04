from django.core.management.base import BaseCommand
from django.db import transaction
from shop.models import Section, Category, SubCategory, Product

class Command(BaseCommand):
    help = "Seed the catalog with a strict 4-level hierarchy (Section -> Category -> SubCategory -> Product)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("🌱 Seeding Con-Dor.Uz Catalog..."))

        try:
            with transaction.atomic():
                # 1. Sections
                sections_data = [
                    {"name": "Kiyimlar", "slug": "kiyimlar", "order": 1},
                    {"name": "Jihozlar", "slug": "jihozlar", "order": 2},
                    {"name": "Oyoq kiyimlar", "slug": "oyoq-kiyimlar", "order": 3},
                ]

                sections = {}
                for data in sections_data:
                    section, created = Section.objects.update_or_create(
                        slug=data["slug"],
                        defaults={"name": data["name"], "order": data["order"], "is_active": True}
                    )
                    sections[data["slug"]] = section
                    status = "Yaratildi" if created else "Yangilandi"
                    self.stdout.write(f"  [Bo'lim] {section.name} - {status}")

                # 2. Categories
                categories_data = [
                    {"section_slug": "kiyimlar", "name": "Ustki kiyim", "slug": "ustki-kiyim", "order": 1},
                    {"section_slug": "kiyimlar", "name": "Shimlar", "slug": "shimlar", "order": 2},
                    {"section_slug": "jihozlar", "name": "Sumkalar", "slug": "sumkalar", "order": 1},
                    {"section_slug": "jihozlar", "name": "Pichoqlar", "slug": "pichoqlar", "order": 2},
                ]

                categories = {}
                for data in categories_data:
                    section = sections[data["section_slug"]]
                    category, created = Category.objects.update_or_create(
                        slug=data["slug"],
                        section=section,
                        defaults={"name": data["name"], "order": data["order"], "is_active": True}
                    )
                    categories[data["slug"]] = category
                    status = "Yaratildi" if created else "Yangilandi"
                    self.stdout.write(f"    [Kategoriya] {category.name} - {status}")

                # 3. SubCategories
                subcategories_data = [
                    {"category_slug": "ustki-kiyim", "name": "Kurtkalar", "slug": "kurtkalar", "order": 1},
                    {"category_slug": "ustki-kiyim", "name": "Jiletlar", "slug": "jiletlar", "order": 2},
                    {"category_slug": "shimlar", "name": "Taktik shimlar", "slug": "taktik-shimlar", "order": 1},
                    {"category_slug": "sumkalar", "name": "Ryukzaklar", "slug": "ryukzaklar", "order": 1},
                ]

                subcategories = {}
                for data in subcategories_data:
                    category = categories[data["category_slug"]]
                    subcategory, created = SubCategory.objects.update_or_create(
                        slug=data["slug"],
                        category=category,
                        defaults={"name": data["name"], "order": data["order"], "is_active": True}
                    )
                    subcategories[data["slug"]] = subcategory
                    status = "Yaratildi" if created else "Yangilandi"
                    self.stdout.write(f"      [Sub-kategoriya] {subcategory.name} - {status}")

                # 4. Products
                products_data = [
                    {
                        "subcategory_slug": "kurtkalar",
                        "name": "Taktik Kurtka M1",
                        "slug": "taktik-kurtka-m1",
                        "price": 450000,
                        "description": "Professional darajadagi taktik kurtka.",
                        "is_featured": True
                    },
                    {
                        "subcategory_slug": "ryukzaklar",
                        "name": "Harbiy Ryukzak 45L",
                        "slug": "harbiy-ryukzak-45l",
                        "price": 320000,
                        "description": "Bardoshli 45 litrli harbiy ryukzak.",
                        "is_featured": True
                    },
                ]

                for data in products_data:
                    subcategory = subcategories[data["subcategory_slug"]]
                    product, created = Product.objects.update_or_create(
                        slug=data["slug"],
                        defaults={
                            "name": data["name"],
                            "price": data["price"],
                            "description": data["description"],
                            "subcategory": subcategory,
                            "is_active": True,
                            "is_featured": data.get("is_featured", False)
                        }
                    )
                    status = "Yaratildi" if created else "Yangilandi"
                    self.stdout.write(f"        [Mahsulot] {product.name} - {status}")

            self.stdout.write(self.style.SUCCESS("✅ Catalog muvaffaqiyatli seed qilindi!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Xatolik yuz berdi: {str(e)}"))
            raise e
