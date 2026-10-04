import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useApi } from '../../hooks/useApi';
import { useLanguage } from '../../context/LanguageContext';
import ProductCard from '../ProductCard/ProductCard';
import './Highlights.css';

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

const Highlights = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();
    const { data } = useApi<PaginatedProducts>('/api/products/?badge=YANGI&page_size=8');

    const apiProducts = data?.results || [];

    return (
        <section className="highlights" id="highlights" ref={ref}>
            <div className="container">
                <div className="section-header reveal">
                    <h2>{t('highlights.title')}</h2>
                    <p>{t('highlights.subtitle')}</p>
                    <div className="accent-line" />
                </div>
                <div className="highlights-grid stagger-children">
                    {apiProducts.length > 0 ? (
                        apiProducts.map((p) => (
                            <ProductCard key={p.id} product={p as any} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.5 }}>{t('common.loading')}</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
