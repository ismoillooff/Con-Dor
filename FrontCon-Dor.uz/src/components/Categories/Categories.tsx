import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { allCategories } from '../../data/categories';
import { useApi } from '../../hooks/useApi';
import { useLanguage } from '../../context/LanguageContext';
import {
    ShoppingBagIcon, HeartIcon, StarIcon
} from '../Icons';
import './Categories.css';

interface ApiProduct {
    id: number;
    name: string;
    name_ru?: string;
    slug: string;
    price: number;
    old_price: number | null;
    badge: string;
    badge_ru?: string;
    rating: number;
    reviews_count: number;
    color: string;
    images: { id: number; image: string; is_primary: boolean }[];
}

interface PaginatedProducts {
    count: number;
    results: ApiProduct[];
}

const Categories = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t, lang } = useLanguage();
    const { data: productsData } = useApi<PaginatedProducts>('/api/products/?page_size=20');

    // Shuffle API products randomly and pick 8
    const apiProducts = useMemo(() => {
        const all = productsData?.results || [];
        if (all.length === 0) return [];
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 8);
    }, [productsData]);
    const hasApi = apiProducts.length > 0;

    const staticProducts = [
        { name: lang === 'ru' ? 'Тактическая куртка Alpha' : 'Taktik kurtka Alpha', price: `1 890 000 ${t('common.price')}`, oldPrice: `2 490 000 ${t('common.price')}`, badge: 'SALE', rating: 4.8, reviews: 142, color: '#1a2a1a' },
        { name: lang === 'ru' ? 'Брюки М65' : 'Harbiy shimlar M65', price: `790 000 ${t('common.price')}`, oldPrice: '', badge: 'HIT', rating: 4.5, reviews: 167, color: '#2a2a1a' },
        { name: lang === 'ru' ? 'Карманный нож Swiss' : "Cho'ntak pichog'i Swiss", price: `490 000 ${t('common.price')}`, oldPrice: '', badge: '', rating: 4.4, reviews: 76, color: '#2a1a2a' },
        { name: lang === 'ru' ? 'Рюкзак Scout 45L' : 'Scout 45L Ryukzak', price: `1 290 000 ${t('common.price')}`, oldPrice: `1 690 000 ${t('common.price')}`, badge: 'SALE', rating: 4.8, reviews: 124, color: '#1a2a18' },
        { name: lang === 'ru' ? 'Спальный мешок -15°C' : 'Uyqu xaltasi -15°C', price: `1 490 000 ${t('common.price')}`, oldPrice: `1 890 000 ${t('common.price')}`, badge: '', rating: 4.7, reviews: 156, color: '#202a1a' },
        { name: lang === 'ru' ? 'Куртка Bushpeak Trail' : 'Bushpeak Trail kurtka', price: `2 290 000 ${t('common.price')}`, oldPrice: '', badge: t('common.new'), rating: 4.9, reviews: 28, color: '#1a2a18' },
        { name: lang === 'ru' ? 'Multi-tool Pro 18in1' : 'Multi-tool Pro 18in1', price: `590 000 ${t('common.price')}`, oldPrice: `790 000 ${t('common.price')}`, badge: 'SALE', rating: 4.8, reviews: 190, color: '#1a2020' },
        { name: lang === 'ru' ? 'Фильтр для воды LifeStraw' : 'Suv filtri LifeStraw', price: `340 000 ${t('common.price')}`, oldPrice: '', badge: 'HIT', rating: 4.9, reviews: 312, color: '#1a2a1a' },
    ];

    return (
        <section className="categories" id="categories" ref={ref}>
            <div className="container">

                <div className="products-section" style={{ paddingTop: 0 }}>
                    <div className="section-header reveal">
                        <h2>{t('categories.popular_title')}</h2>
                        <p>{t('categories.popular_subtitle')}</p>
                        <div className="accent-line" />
                    </div>
                    <div className="products-grid">
                        {hasApi ? (
                            apiProducts.map((p) => {
                                const pName = lang === 'ru' ? (p.name_ru || p.name) : p.name;
                                const pBadge = lang === 'ru' ? (p.badge_ru || p.badge) : p.badge;
                                return (
                                    <Link key={p.id} to={`/product/${p.slug}`} className="prod-card">
                                        <div className="prod-img" style={{ background: p.color ? `linear-gradient(145deg, ${p.color} 0%, #080808 100%)` : 'var(--color-bg-elevated)' }}>
                                            {pBadge && (
                                                <span className={`prod-badge ${p.badge === 'SALE' ? 'bd-sale' : p.badge === 'YANGI' ? 'bd-new' : 'bd-hit'}`}>
                                                    {p.badge === 'SALE' && p.old_price ? `-${Math.round((1 - p.price / p.old_price) * 100)}%` : pBadge}
                                                </span>
                                            )}
                                            <button className="prod-wish" aria-label={t('common.add_wishlist')} onClick={(e) => e.preventDefault()}>
                                                <HeartIcon size={15} />
                                            </button>
                                            <div className="prod-placeholder">
                                                {p.images.length > 0
                                                    ? <img src={p.images[0].image} alt={pName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <ShoppingBagIcon size={36} />
                                                }
                                            </div>
                                            <div className="prod-overlay">
                                                <span className="prod-quick-add"><ShoppingBagIcon size={14} /> {t('common.view')}</span>
                                            </div>
                                        </div>
                                        <div className="prod-info">
                                            <h4 className="prod-name">{pName}</h4>
                                            <div className="prod-stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} size={12} className={i < Math.floor(p.rating) ? 'star-filled' : 'star-empty'} />
                                                ))}
                                                <span className="prod-reviews">({p.reviews_count})</span>
                                            </div>
                                            <div className="prod-pricing">
                                                <span className="prod-price">{p.price.toLocaleString('ru-RU')} {t('common.price')}</span>
                                                {p.old_price && <span className="prod-old">{p.old_price.toLocaleString('ru-RU')} {t('common.price')}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            staticProducts.map((p, i) => (
                                <div key={i} className="prod-card">
                                    <div className="prod-img" style={{ background: `linear-gradient(145deg, ${p.color} 0%, #080808 100%)` }}>
                                        {p.badge && (
                                            <span className={`prod-badge ${p.badge === 'SALE' ? 'bd-sale' : p.badge === t('common.new') ? 'bd-new' : 'bd-hit'}`}>
                                                {p.badge === 'SALE' && p.oldPrice ? `-${Math.round((1 - Number(p.price.replace(/[^\d]/g, '')) / Number(p.oldPrice.replace(/[^\d]/g, ''))) * 100)}%` : p.badge}
                                            </span>
                                        )}
                                        <button className="prod-wish" aria-label={t('common.add_wishlist')} onClick={(e) => e.preventDefault()}>
                                            <HeartIcon size={15} />
                                        </button>
                                        <div className="prod-placeholder"><ShoppingBagIcon size={36} /></div>
                                        <div className="prod-overlay">
                                            <span className="prod-quick-add"><ShoppingBagIcon size={14} /> {t('common.view')}</span>
                                        </div>
                                    </div>
                                    <div className="prod-info">
                                        <h4 className="prod-name">{p.name}</h4>
                                        <div className="prod-stars">
                                            {[...Array(5)].map((_, j) => (
                                                <StarIcon key={j} size={12} className={j < Math.floor(p.rating) ? 'star-filled' : 'star-empty'} />
                                            ))}
                                            <span className="prod-reviews">({p.reviews})</span>
                                        </div>
                                        <div className="prod-pricing">
                                            <span className="prod-price">{p.price}</span>
                                            {p.oldPrice && <span className="prod-old">{p.oldPrice}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="section-header reveal" style={{ marginTop: 60 }}>
                    <h2>{t('categories.grid_title')}</h2>
                    <p>{t('categories.grid_subtitle')}</p>
                    <div className="accent-line" />
                </div>
                <div className="categories-grid stagger-children">
                    {allCategories.map((cat) => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`} className="category-card glass-card">
                            <div className="cat-glow" style={{ background: cat.color }} />
                            <div className="cat-icon" style={{ color: cat.color }}>{cat.icon}</div>
                            <h3 className="cat-name">{lang === 'ru' ? (cat.name_ru || cat.name) : cat.name}</h3>
                            <p className="cat-desc">{lang === 'ru' ? (cat.desc_ru || cat.desc) : cat.desc}</p>
                            <span className="cat-count">{cat.products.length} {t('common.products')}</span>
                            <div className="cat-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
