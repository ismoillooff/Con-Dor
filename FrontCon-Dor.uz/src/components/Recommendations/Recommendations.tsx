import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useApi } from '../../hooks/useApi';
import { useLanguage } from '../../context/LanguageContext';
import ProductCard from '../ProductCard/ProductCard';
import './Recommendations.css';

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

const Recommendations = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();
    const { data } = useApi<PaginatedProducts>('/api/products/?sort=-rating&page_size=8');

    const apiProducts = data?.results || [];

    return (
        <section className="recommendations" id="recommendations" ref={ref}>
            <div className="container">
                <div className="section-header reveal">
                    <h2>{t('recommendations.title')}</h2>
                    <p>{t('recommendations.subtitle')}</p>
                    <div className="accent-line" />
                </div>
                <div className="reco-grid stagger-children">
                    {apiProducts.length > 0 ? (
                        apiProducts.map((p) => (
                            <ProductCard key={p.id} product={p as any} />
                        ))
                    ) : (
                        // Skeleton or empty state could go here
                        <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.5 }}>{t('common.loading')}</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Recommendations;
