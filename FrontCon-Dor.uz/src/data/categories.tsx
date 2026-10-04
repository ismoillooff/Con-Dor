import React from 'react';
import {
    ShirtIcon, TargetIcon, BackpackIcon, TentIcon, CompassIcon, KnifeIcon,
    HatIcon, PantsIcon, UmbrellaIcon, BootIcon, SocksIcon,
    GlovesIcon, GlassesIcon, HuntingIcon, HelmetIcon, FlashlightIcon,
    RopeIcon, BinocularsIcon, WatchIcon, BriefcaseIcon, WalletIcon,
    DropletIcon, FirstAidIcon, UtensilsIcon
} from '../components/Icons';

export interface Product {
    id: number;
    name: string;
    price: string;
    oldPrice: string;
    badge: string;
    rating: number;
    reviews: number;
    color: string;
    sub: string;
}

export interface ProductGroup {
    icon: React.ReactNode;
    title: string;
    title_ru?: string;
    items: string[];
}

export interface FeaturedItem {
    label: string;
    label_ru?: string;
    img: string;
}

export interface CategoryData {
    slug: string;
    name: string;
    name_ru?: string;
    icon: React.ReactNode;
    color: string;
    desc: string;
    desc_ru?: string;
    groups: ProductGroup[];
    products: Product[];
    featured?: FeaturedItem[];
}

export const allCategories: CategoryData[] = [
    {
        slug: 'kiyimlar',
        name: 'Kiyimlar',
        name_ru: 'Одежда',
        icon: <ShirtIcon size={28} />,
        color: '#c8102e',
        desc: "Harbiy va tashqi kiyimlar — professional sifatda, har qanday ob-havo sharoitiga mos",
        desc_ru: "Военная и уличная одежда — профессиональное качество, подходит для любых погодных условий",
        groups: [
            { icon: <ShirtIcon size={16} />, title: 'USTKI KIYIM', title_ru: 'ВЕРХНЯЯ ОДЕЖДА', items: ["Sviter", "Ko'ylaklar", 'Kurtkalar', 'Kepkalar'] },
            { icon: <HatIcon size={16} />, title: 'BOSH KIYIM', title_ru: 'ГОЛОВНЫЕ УБОРЫ', items: ['Shapkalar', 'Balaklava', 'Ovchi shapkasi'] },
            { icon: <PantsIcon size={16} />, title: 'PASTKI KIYIM', title_ru: 'НИЖНЯЯ ОДЕЖДА', items: ['Shimlar', 'Ichki kiyim'] },
            { icon: <UmbrellaIcon size={16} />, title: "YOMG'IR KIYIM", title_ru: 'ДОЖДЕВИКИ', items: ['Poncholar', "Yomg'irdan himoya"] },
            { icon: <BootIcon size={16} />, title: 'POYABZAL', title_ru: 'ОБУВЬ', items: ['Harbiy etik', 'Tashqi poyabzal'] },
            { icon: <SocksIcon size={16} />, title: 'PAYPOQ', title_ru: 'НОСКИ', items: ['Bambuk paypoq', 'Harbiy paypoq', 'Termal paypoq', 'Treking paypoq'] },
            { icon: <GlovesIcon size={16} />, title: "QO'LQOP", title_ru: 'ПЕРЧАТКИ', items: ['Barmoqli', 'Barmoqsiz', "Qo'lqop"] },
            { icon: <HuntingIcon size={16} />, title: 'OV KIYIM', title_ru: 'ОХОТНИЧЬЯ ОДЕЖДА', items: ['Ov kurtkasi', 'Ov shimi'] },
            { icon: <GlassesIcon size={16} />, title: 'AKSESSUARLAR', title_ru: 'АКСЕССУАРЫ', items: ["Ko'zoynak", 'Bandana', 'Kamar'] },
        ],
        featured: [
            { label: "NAFAS OLUVCHI HARBIY KO'YLAK", label_ru: 'ДЫШАЩАЯ ВОЕННАЯ РУБАШКА', img: '👔' },
            { label: 'SHVEYTSARIYA HARBIY ETIK', label_ru: 'ШВЕЙЦАРСКИЕ ВОЕННЫЕ БОТИНКИ', img: '🥾' },
        ],
        products: [
            { id: 1, name: 'Taktik kurtka Alpha', price: '189.00', oldPrice: '249.00', badge: 'SALE', rating: 4.8, reviews: 142, color: '#1a2a1a', sub: 'Kurtkalar' },
            { id: 2, name: 'Harbiy shimlar M65', price: '79.90', oldPrice: '', badge: 'HIT', rating: 4.5, reviews: 167, color: '#2a2a1a', sub: 'Shimlar' },
            { id: 3, name: 'Flis kurtka Instruktor', price: '89.90', oldPrice: '119.00', badge: '', rating: 4.6, reviews: 203, color: '#1a1a2a', sub: 'Kurtkalar' },
            { id: 4, name: "Nafas oluvchi ko'ylak", price: '49.90', oldPrice: '', badge: 'YANGI', rating: 4.4, reviews: 76, color: '#222a1a', sub: "Ko'ylaklar" },
            { id: 5, name: "Termal ichki kiyim to'plam", price: '69.90', oldPrice: '', badge: '', rating: 4.7, reviews: 89, color: '#2a1818', sub: 'Ichki kiyim' },
            { id: 6, name: 'Kamuflaj kurtka Pro', price: '159.00', oldPrice: '199.00', badge: 'SALE', rating: 4.9, reviews: 215, color: '#1a2a18', sub: 'Kurtkalar' },
            { id: 7, name: "Taktik polo ko'ylak", price: '39.90', oldPrice: '', badge: '', rating: 4.3, reviews: 54, color: '#1a1a20', sub: "Ko'ylaklar" },
            { id: 8, name: 'Harbiy shimlar Cargo', price: '89.90', oldPrice: '', badge: 'YANGI', rating: 4.6, reviews: 128, color: '#202a1a', sub: 'Shimlar' },
            { id: 9, name: 'Issiqlik kurtkasi Ranger', price: '219.00', oldPrice: '279.00', badge: 'SALE', rating: 4.8, reviews: 95, color: '#181a2a', sub: 'Kurtkalar' },
            { id: 10, name: 'Balaklava taktik', price: '24.90', oldPrice: '', badge: '', rating: 4.2, reviews: 38, color: '#2a2020', sub: 'Balaklava' },
            { id: 11, name: "Yomg'irga chidamli shimlar", price: '99.90', oldPrice: '', badge: 'YANGI', rating: 4.5, reviews: 64, color: '#1a2a20', sub: 'Shimlar' },
            { id: 12, name: "Termal ichki ko'ylak", price: '49.90', oldPrice: '', badge: '', rating: 4.6, reviews: 112, color: '#2a1a20', sub: 'Ichki kiyim' },
            { id: 13, name: 'Harbiy etik Pro', price: '139.00', oldPrice: '169.00', badge: 'SALE', rating: 4.7, reviews: 95, color: '#2a1a2a', sub: 'Harbiy etik' },
            { id: 14, name: 'Ov kurtkasi kamuflaj', price: '119.00', oldPrice: '', badge: 'YANGI', rating: 4.5, reviews: 43, color: '#1a2020', sub: 'Ov kurtkasi' },
        ],
    },
    {
        slug: 'jihozlar',
        name: 'Jihozlar',
        name_ru: 'Снаряжение',
        icon: <TargetIcon size={28} />,
        color: '#4a5d23',
        desc: 'Taktik va ov uskunalari — professional daraja, harbiy standartlar',
        desc_ru: 'Тактическое и охотничье снаряжение — профессиональный уровень, военные стандарты',
        groups: [
            { icon: <HelmetIcon size={16} />, title: 'TAKTIK JIHOZLAR', title_ru: 'ТАКТИЧЕСКОЕ СНАРЯЖЕНИЕ', items: ["Dubulg'alar", 'Himoya jileti', 'Plita tashuvchi', 'Himoya plitalari', 'Kamarlar', 'Qobiqlar', 'Ov jihozlari', 'Eshitish himoyasi'] },
            { icon: <KnifeIcon size={16} />, title: 'PICHOQLAR VA ASBOBLAR', title_ru: 'НОЖИ И ИНСТРУМЕНТЫ', items: ['Jangovar pichoq', "Cho'ntak pichog'i", 'Bukiladigan pichoq', 'Bolta', "Bolg'a va kirka", 'Aksessuarlar'] },
            { icon: <FlashlightIcon size={16} />, title: "YORUG'LIK VA YORITISH", title_ru: 'СВЕТ И ОСВЕЩЕНИЕ', items: ['Bosh chiroq', 'Fonarlar', 'Lyuminestsent tayoqcha', 'Lager chiroq', 'Ishchi chiroq'] },
            { icon: <RopeIcon size={16} />, title: "ARQONLAR VA TO'RLAR", title_ru: 'ВЕРЕВКИ И СЕТКИ', items: ['Arqonlar', "Kamuflyaj to'r", 'Mahkamlash', 'Ilmoq'] },
            { icon: <BinocularsIcon size={16} />, title: 'OPTIKA', title_ru: 'ОПТИКА', items: ['Durbinlar', 'Termal kameralar'] },
            { icon: <WatchIcon size={16} />, title: 'AKSESSUARLAR', title_ru: 'АКСЕССУАРЫ', items: ["Ko'zoynak", 'Soatlar'] },
        ],
        featured: [
            { label: 'PLITA TASHUVCHI', label_ru: 'ПЛИТОНОСЕЦ', img: '🛡️' },
            { label: 'LAMPALAR', label_ru: 'ЛАМПЫ', img: '🔦' },
            { label: "CHO'NTAK PICHOG'I", label_ru: 'КАРМАННЫЙ НОЖ', img: '🔪' },
        ],
        products: [
            { id: 20, name: "Cho'ntak pichog'i Swiss", price: '49.90', oldPrice: '', badge: '', rating: 4.4, reviews: 76, color: '#2a1a2a', sub: "Cho'ntak pichog'i" },
            { id: 21, name: 'Bosh chiroq 1000LM', price: '34.90', oldPrice: '44.90', badge: 'SALE', rating: 4.3, reviews: 58, color: '#1a1a1a', sub: 'Bosh chiroq' },
            { id: 22, name: 'Durbin 10x50 HD', price: '89.90', oldPrice: '', badge: 'YANGI', rating: 4.4, reviews: 38, color: '#2a201a', sub: 'Durbinlar' },
            { id: 23, name: 'Multi-tool Pro 18in1', price: '59.90', oldPrice: '79.90', badge: 'SALE', rating: 4.8, reviews: 190, color: '#1a2020', sub: 'Bolta' },
            { id: 24, name: 'Taktik fonar T6', price: '29.90', oldPrice: '', badge: '', rating: 4.2, reviews: 42, color: '#201a2a', sub: 'Fonarlar' },
            { id: 25, name: 'Harbiy kompas Pro', price: '24.90', oldPrice: '', badge: '', rating: 4.5, reviews: 67, color: '#1a2a1a', sub: 'Harbiy kompas' },
            { id: 26, name: 'Pichok Benchmade', price: '129.00', oldPrice: '', badge: 'PRO', rating: 4.9, reviews: 103, color: '#2a1a1a', sub: 'Jangovar pichoq' },
            { id: 27, name: 'Nishon optikasi 4x32', price: '199.00', oldPrice: '249.00', badge: 'SALE', rating: 4.7, reviews: 56, color: '#1a1a2a', sub: 'Durbinlar' },
            { id: 28, name: 'Himoya jileti taktik', price: '249.00', oldPrice: '', badge: 'PRO', rating: 4.8, reviews: 62, color: '#202020', sub: 'Himoya jileti' },
            { id: 29, name: 'Taktik kamar', price: '34.90', oldPrice: '', badge: '', rating: 4.3, reviews: 48, color: '#2a1a18', sub: 'Kamarlar' },
        ],
    },
    {
        slug: 'ryukzaklar',
        name: 'Ryukzak va sumkalar',
        name_ru: 'Рюкзаки и сумки',
        icon: <BackpackIcon size={28} />,
        color: '#c4a572',
        desc: "Taktik va sayohat sumkalari — bardoshli, keng sig'imli",
        desc_ru: "Тактические и туристические рюкзаки — прочные, вместительные",
        groups: [
            { icon: <BackpackIcon size={16} />, title: 'RYUKZAKLAR', title_ru: 'РЮКЗАКИ', items: ['Taktik ryukzak', 'Sayohat ryukzak', 'Kundalik ryukzak'] },
            { icon: <BriefcaseIcon size={16} />, title: 'SUMKALAR', title_ru: 'СУМКИ', items: ['Harbiy sumka', 'Yelka sumkasi', 'Transport sumka'] },
            { icon: <WalletIcon size={16} />, title: 'BEL SUMKALAR', title_ru: 'ПОЯСНЫЕ СУМКИ', items: ['Taktik bel sumka', 'Kundalik bel sumka'] },
            { icon: <DropletIcon size={16} />, title: "SUV O'TKAZMAYDIGAN", title_ru: 'ВОДОНЕПРОНИЦАЕМЫЕ', items: ['Suzuvchi sumkalar', 'Suv qoplari'] },
            { icon: <BackpackIcon size={16} />, title: 'RETRO KOLLEKSIYA', title_ru: 'РЕТРО КОЛЛЕКЦИЯ', items: ['Klassik ryukzak', 'Vintage sumka'] },
            { icon: <CompassIcon size={16} />, title: 'GIDRATSIYA SUMKALARI', title_ru: 'ГИДРАТАТОРЫ', items: ['Suv tashish tizimlari'] },
        ],
        featured: [
            { label: 'SCOUT LASER 45L RYUKZAK', label_ru: 'РЮКЗАК SCOUT LASER 45L', img: '🎒' },
            { label: "SUV O'TKAZMAYDIGAN SUMKA", label_ru: 'ВОДОНЕПРОНИЦАЕМАЯ СУМКА', img: '💧' },
        ],
        products: [
            { id: 40, name: 'Scout 45L Ryukzak', price: '129.00', oldPrice: '169.00', badge: 'SALE', rating: 4.8, reviews: 124, color: '#1a2a18', sub: 'Sayohat ryukzak' },
            { id: 41, name: 'Taktik bel sumka', price: '59.90', oldPrice: '', badge: 'YANGI', rating: 4.6, reviews: 91, color: '#222a1a', sub: 'Taktik bel sumka' },
            { id: 42, name: 'Assault ryukzak 25L', price: '89.90', oldPrice: '', badge: '', rating: 4.7, reviews: 156, color: '#2a1a1a', sub: 'Taktik ryukzak' },
            { id: 43, name: 'EDC kundalik sumka', price: '39.90', oldPrice: '', badge: '', rating: 4.3, reviews: 45, color: '#1a1a2a', sub: 'Kundalik ryukzak' },
            { id: 44, name: 'Expedition 65L', price: '189.00', oldPrice: '229.00', badge: 'SALE', rating: 4.9, reviews: 78, color: '#202a1a', sub: 'Sayohat ryukzak' },
            { id: 45, name: 'Molle taktik ryukzak', price: '109.00', oldPrice: '', badge: 'HIT', rating: 4.6, reviews: 203, color: '#2a201a', sub: 'Taktik ryukzak' },
            { id: 46, name: 'Harbiy sumka', price: '79.90', oldPrice: '', badge: '', rating: 4.4, reviews: 89, color: '#1a2020', sub: 'Harbiy sumka' },
            { id: 47, name: 'Messenger sumka', price: '49.90', oldPrice: '59.90', badge: 'SALE', rating: 4.5, reviews: 67, color: '#201a2a', sub: 'Yelka sumkasi' },
        ],
    },
    {
        slug: 'omon-qolish',
        name: 'Omon qolish va lager',
        name_ru: 'Выживание и лагерь',
        icon: <TentIcon size={28} />,
        color: '#2d6a4f',
        desc: 'Lager va favqulodda vositalar — tabiatda yashash uchun zarur',
        desc_ru: 'Снаряжение для лагеря и чрезвычайных ситуаций — необходимо для жизни на природе',
        groups: [
            { icon: <TentIcon size={16} />, title: 'LAGER VA UXLASH', title_ru: 'ЛАГЕРЬ И СОН', items: ["Lager ko'rpalari", 'Lager mebellari', 'Brezent', 'Chodirlar', 'Issiq uyqu xaltasi', 'Gamak'] },
            { icon: <FirstAidIcon size={16} />, title: 'FAVQULODDA YORDAM', title_ru: 'ЭКСТРЕННАЯ ПОМОЩЬ', items: ["Qutqarish ko'rpalari", 'Plaster', 'Turniket', 'Olov yoqish'] },
            { icon: <UtensilsIcon size={16} />, title: 'DALA OSHXONASI', title_ru: 'ПОЛЕВАЯ КУХНЯ', items: ['Pishirish va barbekyu', 'Oziq-ovqat', 'Ichimlik idishlari'] },
            { icon: <DropletIcon size={16} />, title: 'SUV VA GIDRATSIYA', title_ru: 'ВОДА И ГИДРАТАЦИЯ', items: ['Suv filtri', 'Suv termosi', 'Gidratsiya tizimlari'] },
        ],
        featured: [
            { label: "TAKTIK IFAK TO'PLAM", label_ru: 'ТАКТИЧЕСКАЯ АПТЕЧКА IFAK', img: '🩹' },
            { label: "TASHQI TO'PLAM", label_ru: 'НАБОР ДЛЯ УЛИЦЫ', img: '⛺' },
            { label: 'LAGER MEBELLARI', label_ru: 'КЕМПИНГОВАЯ МЕБЕЛЬ', img: '🪑' },
        ],
        products: [
            { id: 60, name: 'Uyqu xaltasi -15°C', price: '149.00', oldPrice: '189.00', badge: 'SALE', rating: 4.7, reviews: 156, color: '#202a1a', sub: 'Issiq uyqu xaltasi' },
            { id: 61, name: "IFAK tibbiy to'plam", price: '79.90', oldPrice: '99.90', badge: '', rating: 4.8, reviews: 203, color: '#1a2020', sub: 'Plaster' },
            { id: 62, name: "1-kishilik yengil chodir", price: '129.00', oldPrice: '159.00', badge: 'SALE', rating: 4.5, reviews: 67, color: '#18202a', sub: 'Chodirlar' },
            { id: 63, name: 'Suv filtri LifeStraw', price: '34.90', oldPrice: '', badge: 'HIT', rating: 4.9, reviews: 312, color: '#1a2a1a', sub: 'Suv filtri' },
            { id: 64, name: '2-kishilik chodir Pro', price: '199.00', oldPrice: '', badge: 'YANGI', rating: 4.6, reviews: 78, color: '#2a1a1a', sub: 'Chodirlar' },
            { id: 65, name: 'Gamak taktik paracord', price: '29.90', oldPrice: '', badge: '', rating: 4.3, reviews: 45, color: '#1a1a2a', sub: 'Gamak' },
            { id: 66, name: 'Suv termosi 1L', price: '24.90', oldPrice: '', badge: '', rating: 4.4, reviews: 89, color: '#2a2a1a', sub: 'Suv termosi' },
            { id: 67, name: 'Taktik turniket CAT', price: '29.90', oldPrice: '39.90', badge: 'SALE', rating: 4.8, reviews: 134, color: '#1a2a2a', sub: 'Turniket' },
            { id: 68, name: 'Lager stoli yig\'uvchan', price: '49.90', oldPrice: '', badge: 'YANGI', rating: 4.4, reviews: 52, color: '#202020', sub: 'Lager mebellari' },
            { id: 69, name: 'Brezent suv o\'tkazmas', price: '39.90', oldPrice: '', badge: '', rating: 4.2, reviews: 28, color: '#1a2a1a', sub: 'Brezent' },
            { id: 70, name: 'Olov yoqish to\'plam', price: '14.90', oldPrice: '', badge: 'HIT', rating: 4.6, reviews: 189, color: '#2a1a18', sub: 'Olov yoqish' },
            { id: 71, name: 'Gidratsiya paketi 3L', price: '44.90', oldPrice: '54.90', badge: 'SALE', rating: 4.5, reviews: 76, color: '#1a1820', sub: 'Gidratsiya tizimlari' },
        ],
    },
    {
        slug: 'bushpeak',
        name: 'Bushpeak',
        name_ru: 'Bushpeak',
        icon: <CompassIcon size={28} />,
        color: '#6b8a33',
        desc: 'Premium tashqi liniya — eksklyuziv dizayn va eng yuqori sifat',
        desc_ru: 'Премиальная линейка для активного отдыха — эксклюзивный дизайн и высочайшее качество',
        groups: [
            { icon: <ShirtIcon size={16} />, title: 'KIYIMLAR', title_ru: 'ОДЕЖДА', items: ['Kurtkalar', 'Shimlar', 'Fleece kurtka', "Termal ko'ylak"] },
            { icon: <BackpackIcon size={16} />, title: 'RYUKZAKLAR', title_ru: 'РЮКЗАКИ', items: ['Trekking ryukzak', 'Hiking ryukzak', 'Kundalik ryukzak'] },
            { icon: <GlassesIcon size={16} />, title: 'AKSESSUARLAR', title_ru: 'АКСЕССУАРЫ', items: ['Kamar', "Ko'zoynak", 'Shapka', "Qo'lliqop"] },
            { icon: <BootIcon size={16} />, title: 'POYABZAL', title_ru: 'ОБУВЬ', items: ['Trek botinkasi', 'Yengil poyabzal'] },
        ],
        featured: [
            { label: 'BUSHPEAK TRAIL KURTKA', label_ru: 'КУРТКА BUSHPEAK TRAIL', img: '🧥' },
            { label: 'TREKKING RYUKZAK', label_ru: 'ТРЕККИНГОВЫЙ РЮКЗАК', img: '🎒' },
        ],
        products: [
            { id: 80, name: 'Bushpeak Trail kurtka', price: '229.00', oldPrice: '', badge: 'YANGI', rating: 4.9, reviews: 28, color: '#1a2a18', sub: 'Kurtkalar' },
            { id: 81, name: 'Bushpeak Hike shimlar', price: '119.00', oldPrice: '', badge: 'YANGI', rating: 4.7, reviews: 19, color: '#202a1a', sub: 'Shimlar' },
            { id: 82, name: 'Bushpeak kamar', price: '39.90', oldPrice: '', badge: '', rating: 4.5, reviews: 12, color: '#2a201a', sub: 'Kamar' },
            { id: 83, name: "Bushpeak yomg'irlik", price: '179.00', oldPrice: '219.00', badge: 'SALE', rating: 4.8, reviews: 34, color: '#1a1a2a', sub: 'Kurtkalar' },
            { id: 84, name: 'Bushpeak Fleece Pro', price: '149.00', oldPrice: '', badge: 'YANGI', rating: 4.7, reviews: 22, color: '#1a2018', sub: 'Fleece kurtka' },
            { id: 85, name: 'Trekking ryukzak 40L', price: '189.00', oldPrice: '229.00', badge: 'SALE', rating: 4.8, reviews: 41, color: '#2a1a18', sub: 'Trekking ryukzak' },
            { id: 86, name: 'Bushpeak trek botinka', price: '159.00', oldPrice: '', badge: 'YANGI', rating: 4.6, reviews: 17, color: '#1a1818', sub: 'Trek botinkasi' },
            { id: 87, name: "Bushpeak ko'zoynak UV", price: '79.90', oldPrice: '', badge: '', rating: 4.4, reviews: 9, color: '#181a2a', sub: "Ko'zoynak" },
            { id: 88, name: 'Hiking ryukzak 25L', price: '129.00', oldPrice: '', badge: '', rating: 4.5, reviews: 31, color: '#1a2a20', sub: 'Hiking ryukzak' },
            { id: 89, name: "Bushpeak termal ko'ylak", price: '69.90', oldPrice: '89.90', badge: 'SALE', rating: 4.6, reviews: 26, color: '#202018', sub: "Termal ko'ylak" },
        ],
    },
    {
        slug: 'bridgehead',
        name: 'Bridgehead',
        name_ru: 'Bridgehead',
        icon: <KnifeIcon size={28} />,
        color: '#7c3aed',
        desc: 'Taktik kolleksiyalar — yangi liniya, professional darajada',
        desc_ru: 'Тактические коллекции — новая линейка, профессиональный уровень',
        groups: [
            { icon: <ShirtIcon size={16} />, title: 'KIYIMLAR', title_ru: 'ОДЕЖДА', items: ["Ko'ylaklar", 'Shimlar', 'Kurtkalar', 'Fleece'] },
            { icon: <KnifeIcon size={16} />, title: 'JIHOZLAR', title_ru: 'СНАРЯЖЕНИЕ', items: ['Pichoqlar', 'Multi-tool', 'Kamar'] },
            { icon: <GlovesIcon size={16} />, title: 'AKSESSUARLAR', title_ru: 'АКСЕССУАРЫ', items: ["Qo'lqoplar", 'Shapkalar', 'Bandana'] },
            { icon: <HelmetIcon size={16} />, title: 'TAKTIK', title_ru: 'ТАКТИЧЕСКОЕ', items: ['Taktik jilet', 'Bel sumka', 'Molle aksessuarlar'] },
        ],
        featured: [
            { label: "BRIDGEHEAD TAKTIK KO'YLAK", label_ru: 'ТАКТИЧЕСКАЯ РУБАШКА BRIDGEHEAD', img: '🎽' },
            { label: 'BRIDGEHEAD PICHOK PRO', label_ru: 'НОЖ BRIDGEHEAD PRO', img: '🔪' },
        ],
        products: [
            { id: 90, name: "Bridgehead taktik ko'ylak", price: '89.90', oldPrice: '', badge: 'YANGI', rating: 4.6, reviews: 15, color: '#201a2a', sub: "Ko'ylaklar" },
            { id: 91, name: 'Bridgehead pichok Pro', price: '149.00', oldPrice: '', badge: 'PRO', rating: 4.9, reviews: 22, color: '#1a1a1a', sub: 'Pichoqlar' },
            { id: 92, name: "Bridgehead qo'lqop taktik", price: '49.90', oldPrice: '', badge: '', rating: 4.4, reviews: 8, color: '#2a1a1a', sub: "Qo'lqoplar" },
            { id: 93, name: 'Bridgehead shimlar', price: '99.90', oldPrice: '129.00', badge: 'SALE', rating: 4.7, reviews: 31, color: '#1a2a1a', sub: 'Shimlar' },
            { id: 94, name: 'Bridgehead kurtka taktik', price: '189.00', oldPrice: '', badge: 'YANGI', rating: 4.8, reviews: 18, color: '#201528', sub: 'Kurtkalar' },
            { id: 95, name: 'Multi-tool Bridgehead 14in1', price: '79.90', oldPrice: '99.90', badge: 'SALE', rating: 4.6, reviews: 45, color: '#1a1a28', sub: 'Multi-tool' },
            { id: 96, name: 'Taktik jilet MOLLE', price: '219.00', oldPrice: '', badge: 'PRO', rating: 4.8, reviews: 27, color: '#28181a', sub: 'Taktik jilet' },
            { id: 97, name: 'Bridgehead bel sumka', price: '59.90', oldPrice: '', badge: 'YANGI', rating: 4.5, reviews: 19, color: '#1a2028', sub: 'Bel sumka' },
            { id: 98, name: 'Bandana taktik 3-pack', price: '24.90', oldPrice: '', badge: '', rating: 4.3, reviews: 42, color: '#281a28', sub: 'Bandana' },
            { id: 99, name: 'Bridgehead fleece Pro', price: '119.00', oldPrice: '149.00', badge: 'SALE', rating: 4.7, reviews: 33, color: '#1a2820', sub: 'Fleece' },
        ],
    },
];

export const getCategoryBySlug = (slug: string) => allCategories.find(c => c.slug === slug);
export const getSectionBySlug = (slug: string) => allCategories.find(c => c.slug === slug)?.name || null;
