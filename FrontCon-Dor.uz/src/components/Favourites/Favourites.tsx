import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useApi } from '../../hooks/useApi';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import ProductCard from '../ProductCard/ProductCard';
import './Favourites.css';

interface ApiProduct {
    id: number;
    name: string;
    name_ru: string;
    slug: string;
    price: number;
    old_price: number | null;
    badge: string;
    badge_ru: string;
    rating: number;
    reviews_count: number;
    images: { id: number; image: string; is_primary: boolean }[];
}

interface PaginatedProducts {
    count: number;
    results: ApiProduct[];
}

const Favourites = () => {
    const ref = useScrollReveal<HTMLElement>();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();
    const { data } = useApi<PaginatedProducts>('/api/products/?is_featured=true&page_size=8');

    const apiProducts = data?.results || [];

    const scroll = (dir: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
        }
    };

    return (
        <section className="favourites" id="favourites" ref={ref}>
            <div className="container">
                <div className="favourites-header reveal">
                    <div className="section-header" style={{ marginBottom: 0, textAlign: 'left' }}>
                        <h2 style={{ background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t('favourites.title')}</h2>
                        <p>{t('favourites.subtitle')}</p>
                    </div>
                    <div className="favourites-nav">
                        <button className="fav-nav-btn" onClick={() => scroll(-1)} aria-label={t('common.prev')}>
                            <ChevronLeftIcon size={18} />
                        </button>
                        <button className="fav-nav-btn" onClick={() => scroll(1)} aria-label={t('common.next')}>
                            <ChevronRightIcon size={18} />
                        </button>
                    </div>
                </div>
                <div className="favourites-slider" ref={scrollRef}>
                    {apiProducts.length > 0 ? (
                        apiProducts.map((p) => (
                            <div key={p.id} className="fav-product-wrapper">
                                <ProductCard product={p as any} />
                            </div>
                        ))
                    ) : (
                        <p style={{ opacity: 0.5 }}>{t('common.loading')}</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Favourites;
