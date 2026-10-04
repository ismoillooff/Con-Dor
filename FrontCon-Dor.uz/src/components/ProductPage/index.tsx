import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import {
    ChevronRightIcon, ChevronLeftIcon, StarIcon, ShoppingBagIcon,
    ShieldIcon, TruckIcon, RefreshCcwIcon,
    HeartIcon, MinusIcon, PlusIcon,
    CheckIcon, ShareIcon
} from '../Icons';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import ProductCard from '../ProductCard/ProductCard';
import toast from 'react-hot-toast';
import './ProductPage.css';

interface ApiProduct {
    id: number;
    name: string;
    name_ru: string;
    slug: string;
    description: string;
    description_ru: string;
    price: number;
    old_price: number | null;
    badge: string;
    badge_ru: string;
    rating: number;
    reviews_count: number;
    color: string;
    color_ru: string;
    sub: string;
    sub_ru: string;
    sizes: string[];
    colors: string[];
    is_featured: boolean;
    images: { id: number; image: string; is_primary: boolean }[];
    category_name: string;
    category_slug: string;
    subcategory_name: string;
    section_name: string;
}

interface PaginatedProducts {
    count: number;
    results: ApiProduct[];
}

const ProductPage: React.FC = () => {
    const { id: slugOrId } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('specs');
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);

    const { addToCart } = useCart();
    const { t, lang } = useLanguage();
    const relatedScrollRef = useRef<HTMLDivElement>(null);

    const scrollRelated = (dir: number) => {
        if (relatedScrollRef.current) {
            relatedScrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
        }
    };

    const { data: product, loading, error } = useApi<ApiProduct>(`/api/products/${slugOrId}`);

    const { data: relatedData } = useApi<PaginatedProducts>(
        product ? `/api/products/?category=${product.category_slug}&page_size=4` : null
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slugOrId]);

    useEffect(() => {
        if (product) {
            if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
            if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
            const primaryIdx = product.images.findIndex(img => img.is_primary);
            setActiveImage(primaryIdx >= 0 ? primaryIdx : 0);
        }
    }, [product]);

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => q > 1 ? q - 1 : 1);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(lang === 'ru' ? 'Ссылка скопирована' : 'Havola nusxalandi');
    };

    if (loading) return <div className="p-loader-screen"><div className="p-spinner"></div></div>;

    if (error || !product) {
        return (
            <div className="p-not-found-screen">
                <ShoppingBagIcon size={64} style={{ opacity: 0.2, marginBottom: 20 }} />
                <h2>{t('common.not_found')}</h2>
                <Link to="/" className="p-back-home-btn">{t('common.back_home')}</Link>
            </div>
        );
    }

    const pName = lang === 'ru' ? (product.name_ru || product.name) : product.name;
    const pDesc = lang === 'ru' ? (product.description_ru || product.description) : product.description;
    const pBadge = lang === 'ru' ? (product.badge_ru || product.badge) : product.badge;
    const pColor = lang === 'ru' ? (product.color_ru || product.color) : product.color;
    const pBrand = lang === 'ru' ? (product.sub_ru || product.sub) : product.sub;

    const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;
    const savings = product.old_price ? (product.old_price - product.price) : 0;

    return (
        <div className="p-page-container fade-in">
            <div className="container">
                <nav className="p-breadcrumbs">
                    <Link to="/">{t('common.home')}</Link>
                    <ChevronRightIcon size={12} />
                    <Link to={`/category/${product.category_slug}`}>{product.category_name}</Link>
                    <ChevronRightIcon size={12} />
                    <span>{pName}</span>
                </nav>

                <div className="p-main-layout">
                    {/* ══ Left: Gallery ══ */}
                    <div className="p-gallery-section">
                        <div className="p-main-visual">
                            {product.images.length > 0 ? (
                                <img
                                    src={product.images[activeImage]?.image}
                                    alt={pName}
                                    className="p-active-img"
                                />
                            ) : (
                                <div className="p-no-img"><ShoppingBagIcon size={48} /></div>
                            )}
                            {pBadge && <span className={`p-badge-tag ${product.badge.toLowerCase()}`}>{pBadge}</span>}
                        </div>
                        {product.images.length > 1 && (
                            <div className="p-thumb-reel">
                                {product.images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        className={`p-thumb-btn ${i === activeImage ? 'active' : ''}`}
                                        onClick={() => setActiveImage(i)}
                                    >
                                        <img src={img.image} alt="thumbnail" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ══ Right: Buy Box ══ */}
                    <div className="p-buy-box">
                        <div className="p-header">
                            <div className="p-top-meta">
                                {pBrand && <span className="p-brand">{pBrand}</span>}
                                <div className="p-actions">
                                    <button className="p-icon-action" onClick={handleShare}><ShareIcon size={18} /></button>
                                    <button className="p-icon-action"><HeartIcon size={18} /></button>
                                </div>
                            </div>
                            <h1 className="p-title">{pName}</h1>
                            <div className="p-social-meta">
                                <div className="p-rating-pill">
                                    <StarIcon size={14} className="star-filled" />
                                    <span>{product.rating}</span>
                                    <span className="p-rev-count">({product.reviews_count})</span>
                                </div>
                                <span className="p-sku">SKU: {product.id}ARMS</span>
                            </div>
                        </div>

                        <div className="p-price-card">
                            <div className="p-current-price">
                                {product.price.toLocaleString('ru-RU')} <span className="p-currency">{t('common.price')}</span>
                            </div>
                            {product.old_price && (
                                <div className="p-price-discount">
                                    <span className="p-old">{product.old_price.toLocaleString('ru-RU')}</span>
                                    <span className="p-save-badge">-{discount}% {lang === 'ru' ? 'Скидка' : 'Chegirma'}</span>
                                    <span className="p-savings-text">
                                        {lang === 'ru' ? 'Вы экономите' : 'Tejov'}: <strong>{savings.toLocaleString('ru-RU')} {t('common.price')}</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-selection-area">
                            {product.sizes?.length > 0 && (
                                <div className="p-select-group">
                                    <div className="p-select-label">
                                        <span>{t('common.size')}</span>
                                        <strong className="p-select-current">{selectedSize}</strong>
                                    </div>
                                    <div className="p-select-options">
                                        {product.sizes.map(s => (
                                            <button
                                                key={s}
                                                className={`p-size-btn ${selectedSize === s ? 'active' : ''}`}
                                                onClick={() => setSelectedSize(s)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.colors?.length > 0 && (
                                <div className="p-select-group">
                                    <div className="p-select-label">
                                        <span>{lang === 'ru' ? 'Цвет / Вариант' : 'Rang / Variant'}</span>
                                        <strong className="p-select-current">{selectedColor}</strong>
                                    </div>
                                    <div className="p-select-options">
                                        {product.colors.map(c => {
                                            const lowerC = c.toLowerCase();
                                            const isHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(c);
                                            let dotColor = '';
                                            if (isHex) dotColor = c;
                                            else if (lowerC === 'qora' || lowerC === 'black') dotColor = '#000';
                                            else if (lowerC === 'o\'q' || lowerC === 'oq' || lowerC === 'white') dotColor = '#fff';
                                            else if (lowerC === 'yashil' || lowerC === 'green') dotColor = '#2d5a27';
                                            else if (lowerC === 'ko\'k' || lowerC === 'kok' || lowerC === 'blue') dotColor = '#1e40af';
                                            else if (lowerC === 'qizil' || lowerC === 'red') dotColor = '#dc2626';
                                            else if (lowerC === 'jigarrang' || lowerC === 'brown') dotColor = '#78350f';
                                            else if (lowerC === 'kulrang' || lowerC === 'gray') dotColor = '#6b7280';

                                            return (
                                                <button
                                                    key={c}
                                                    className={`p-variant-btn ${selectedColor === c ? 'active' : ''}`}
                                                    onClick={() => setSelectedColor(c)}
                                                >
                                                    {dotColor && (
                                                        <span className="p-variant-dot" style={{ backgroundColor: dotColor, border: dotColor === '#fff' ? '1px solid #ddd' : 'none' }}></span>
                                                    )}
                                                    {selectedColor === c && <CheckIcon size={12} />}
                                                    {c}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-cart-controls">
                            <div className="p-qty-box">
                                <button onClick={decrement}><MinusIcon size={16} /></button>
                                <span className="p-qty-val">{quantity}</span>
                                <button onClick={increment}><PlusIcon size={16} /></button>
                            </div>
                            <button
                                className="p-add-cart-btn"
                                onClick={() => {
                                    addToCart({ ...product, selectedSize, selectedColor } as any, quantity);
                                    toast.success(t('common.added'));
                                }}
                            >
                                <ShoppingBagIcon size={20} />
                                <span>{t('common.add_to_cart')}</span>
                            </button>
                        </div>

                        <button className="p-direct-buy">{t('common.buy_now')}</button>

                        <div className="p-trust-stack">
                            <div className="p-trust-item">
                                <TruckIcon size={20} className="p-trust-icon" />
                                <div><h6>{t('product.free_shipping')}</h6><p>{t('product.free_shipping_sub')}</p></div>
                            </div>
                            <div className="p-trust-item">
                                <RefreshCcwIcon size={20} className="p-trust-icon" />
                                <div><h6>{t('product.return')}</h6><p>{t('product.return_sub')}</p></div>
                            </div>
                            <div className="p-trust-item">
                                <ShieldIcon size={20} className="p-trust-icon" />
                                <div><h6>{t('product.warranty')}</h6><p>{t('product.warranty_sub')}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ Details Section ══ */}
                <div className="p-details-tabs">
                    <div className="p-tabs-nav">
                        <button className={activeTab === 'specs' ? 'active' : ''} onClick={() => setActiveTab('specs')}>{t('common.specs')}</button>
                        <button className={activeTab === 'desc' ? 'active' : ''} onClick={() => setActiveTab('desc')}>{t('common.description')}</button>
                    </div>
                    <div className="p-tabs-body">
                        {activeTab === 'specs' && (
                            <div className="p-specs-grid">
                                <div className="p-spec-row"><span className="k">{t('common.category')}</span><span className="v">{product.category_name} › {product.subcategory_name}</span></div>
                                <div className="p-spec-row"><span className="k">{lang === 'ru' ? 'Основной цвет' : 'Asosiy rang'}</span><span className="v">{pColor || '—'}</span></div>
                                {product.colors?.length > 0 && (
                                    <div className="p-spec-row"><span className="k">{lang === 'ru' ? 'Доступные цвета' : 'Mavjud ranglar'}</span><span className="v">{product.colors.join(', ')}</span></div>
                                )}
                                <div className="p-spec-row"><span className="k">{lang === 'ru' ? 'Производитель' : 'Ishlab chiqaruvchi'}</span><span className="v">{pBrand || 'ArmyShop'}</span></div>
                                <div className="p-spec-row"><span className="k">{lang === 'ru' ? 'Гарантия' : 'Kafolat'}</span><span className="v">{lang === 'ru' ? '1 год' : '1 yil'}</span></div>
                                <div className="p-spec-row"><span className="k">{lang === 'ru' ? 'Код товара' : 'Mahsulot kodi'}</span><span className="v">COND-OR-{product.id}-X</span></div>
                            </div>
                        )}
                        {activeTab === 'desc' && (
                            <div className="p-description-content">
                                <p style={{ whiteSpace: 'pre-line' }}>{pDesc}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ══ Recommended Products ══ */}
                {relatedData?.results && relatedData.results.length > 0 && (
                    <div className="p-related-section">
                        <div className="p-related-header">
                            <h2 className="p-related-title">{t('common.related') || 'O\'xshash mahsulotlar'}</h2>
                            <div className="p-related-nav">
                                <button className="p-nav-btn" onClick={() => scrollRelated(-1)} aria-label={t('common.prev')}>
                                    <ChevronLeftIcon size={18} />
                                </button>
                                <button className="p-nav-btn" onClick={() => scrollRelated(1)} aria-label={t('common.next')}>
                                    <ChevronRightIcon size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-related-slider-container">
                            <div className="p-related-grid" ref={relatedScrollRef}>
                                {relatedData.results.filter(r => r.id !== product.id).map(r => (
                                    <div key={r.id} className="p-related-card-wrapper">
                                        <ProductCard product={r as any} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
