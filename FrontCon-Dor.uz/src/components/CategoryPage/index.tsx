import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigationState } from '../../hooks/useNavigationState';
import { SubCategoryTabs } from '../SubCategoryTabs/SubCategoryTabs';
import { SECTION_ICON_MAP } from '../../data/categoryIcons';
import { useApi } from '../../hooks/useApi';
import { ChevronRightIcon } from '../Icons';
import { useLanguage } from '../../context/LanguageContext';
import ProductCard from '../ProductCard/ProductCard';
import './CategoryPage.css';

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
    color: string;
    images: { id: number; image: string; is_primary: boolean }[];
    subcategory_name: string;
    category_name: string;
    section_name: string;
}

interface PaginatedProducts {
    count: number;
    results: ApiProduct[];
}

const CategoryPage: React.FC = () => {
    const {
        activeGroup,
        activeSub,
        setGroup,
        setSub,
        slug
    } = useNavigationState();

    const { t, lang } = useLanguage();

    const { data: catalog, loading: catalogLoading } = useApi<any[]>('/api/categories/');

    const activeSection = useMemo(() => {
        if (!catalog) return null;
        return catalog.find(s => s.slug === slug) || null;
    }, [catalog, slug]);

    const effectiveGroup = useMemo(() => {
        if (!activeSection) return null;
        return activeGroup || (activeSection.categories.length > 0 ? activeSection.categories[0].slug : null);
    }, [activeSection, activeGroup]);

    const productPath = useMemo(() => {
        if (!slug) return '';
        let url = `/api/products/?section=${slug}&page_size=50`;
        if (effectiveGroup) url += `&category=${effectiveGroup}`;
        if (activeSub && activeSub !== 'Barchasi') url += `&subcategory=${activeSub}`;
        return url;
    }, [slug, effectiveGroup, activeSub]);

    const { data: productsData, loading: productsLoading } = useApi<PaginatedProducts>(productPath);
    const apiProducts = productsData?.results || [];

    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }, [slug, activeGroup, activeSub]);

    if (catalogLoading) return <div className="cp-loading">{t('common.loading')}</div>;

    if (!activeSection) {
        return (
            <div className="cp-not-found">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>{t('category.not_found')}</h2>
                    <Link to="/" className="adm-btn adm-btn-primary" style={{ marginTop: 20, display: 'inline-block', textDecoration: 'none' }}>{t('common.back_home')}</Link>
                </div>
            </div>
        );
    }

    const currentCategory = activeSection.categories.find((c: any) => c.slug === effectiveGroup) || activeSection.categories[0];
    const subCategories = currentCategory ? currentCategory.subcategories : [];

    const sectionName = lang === 'ru' ? (activeSection.name_ru || activeSection.name) : activeSection.name;
    const sectionDesc = lang === 'ru' ? (activeSection.description_ru || activeSection.description) : activeSection.description;

    return (
        <div className="cp-page" style={{ '--cp-color': activeSection.color } as any}>
            <header className="cp-hero">
                <div className="cp-hero-bg" />
                <div className="container cp-hero-content">
                    <nav className="cp-breadcrumb">
                        <Link to="/">{t('common.home')}</Link>
                        <ChevronRightIcon size={12} />
                        <span>{sectionName}</span>
                    </nav>

                    <div className="cp-hero-info">
                        <div className="cp-hero-icon">
                            {SECTION_ICON_MAP[slug || ''] || '📦'}
                        </div>
                        <div className="cp-hero-text">
                            <h1 className="cp-hero-title">{sectionName}</h1>
                            <p className="cp-hero-desc">{sectionDesc}</p>
                            <span className="cp-hero-count">
                                {t('common.total')} {activeSection.product_count} {t('common.products')}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container cp-wrapper">
                <aside className="cp-sidebar cp-sidebar-desktop">
                    <div className="cp-sidebar-section">
                        <h3 className="cp-sidebar-title">{sectionName.toUpperCase()} {t('category.sections')}</h3>
                        <nav className="cp-sidebar-nav">
                            {activeSection.categories.map((cat: any) => {
                                const isActive = cat.slug === effectiveGroup;
                                return (
                                    <button
                                        key={cat.slug}
                                        className={`cp-sidebar-link ${isActive ? 'active' : ''}`}
                                        onClick={() => setGroup(cat.slug)}
                                    >
                                        <span className="cp-sidebar-label">{lang === 'ru' ? (cat.name_ru || cat.name) : cat.name}</span>
                                        <span className="cp-sidebar-count">{cat.product_count}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="cp-sidebar-section">
                        <h3 className="cp-sidebar-title">{t('nav.categories')}</h3>
                        <nav className="cp-sidebar-nav">
                            {catalog?.map(sec => (
                                <Link key={sec.slug} to={`/category/${sec.slug}`} className={`cp-sidebar-link ${sec.slug === slug ? 'active' : ''}`}>
                                    <span className="cp-sidebar-label">{lang === 'ru' ? (sec.name_ru || sec.name) : sec.name}</span>
                                    <ChevronRightIcon size={14} />
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="cp-main">
                    <div className="cp-pills-section">
                        <SubCategoryTabs
                            items={[
                                { label: lang === 'ru' ? 'Все' : 'Barchasi', value: 'Barchasi', count: currentCategory?.product_count || 0 },
                                ...subCategories.map((sub: any) => ({
                                    label: lang === 'ru' ? (sub.name_ru || sub.name) : sub.name,
                                    value: sub.slug,
                                    count: sub.product_count
                                }))
                            ]}
                            activeItem={activeSub}
                            onSelect={setSub}
                            accentColor={activeSection.color}
                        />
                    </div>

                    <div className="cp-grid">
                        {apiProducts.map(product => (
                            <ProductCard key={product.id} product={product as any} />
                        ))}
                    </div>

                    {!productsLoading && apiProducts.length === 0 && (
                        <div className="cp-empty">
                            <p>{t('category.empty')}</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CategoryPage;
