import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORY_ICON_MAP, SECTION_ICON_MAP } from '../../data/categoryIcons';
import {
    ShoppingBagIcon, SunIcon, MoonIcon, ChevronDownIcon,
    ChevronRightIcon, GlobeIcon, MapPinIcon
} from '../Icons';
import './Navbar.css';

interface NavLink {
    name: string;
    slug: string;
    href: string;
    hasDropdown: boolean;
    icon?: React.ReactNode;
    isScroll?: boolean;
}


/* ========== Mobile Drawer Portal ========== */
const MobileDrawer = ({
    isOpen,
    onClose,
    activeSection,
    onToggleSection,
    theme,
    onToggleTheme,
    onSubItemClick,
    categories,
    navLinks,
    settings,
    t,
    lang,
    setLang,
    navigate
}: {
    isOpen: boolean;
    onClose: () => void;
    activeSection: string | null;
    onToggleSection: (name: string) => void;
    theme: string;
    onToggleTheme: () => void;
    onSubItemClick: (menuName: string, groupTitle: string, item: string) => void;
    categories: any[];
    navLinks: any[];
    settings: any;
    t: (key: string) => string;
    lang: string;
    setLang: (lang: 'uz' | 'ru') => void;
    navigate: any;
}) => {
    const [isLangExpanded, setIsLangExpanded] = useState(false);

    if (!isOpen || !settings) return null;

    const shopName = lang === 'ru' ? (settings.shop_name_ru || settings.shop_name) : settings.shop_name;
    const tagline = lang === 'ru' ? (settings.tagline_ru || settings.tagline) : settings.tagline;
    const copyright = lang === 'ru' ? (settings.copyright_text_ru || settings.copyright_text) : settings.copyright_text;

    return createPortal(
        <>
            <div className={`mob-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
            <div className={`mob-drawer ${isOpen ? 'open' : ''}`}>
                {/* ── Header ── */}
                <div className="mob-header">
                    <div className="mob-brand">
                        <img src="/icon.png" alt="Logo" className="mob-logo-img" />
                        <div className="mob-brand-text">
                            <span className="mob-brand-name">{shopName}</span>
                            <span className="mob-brand-sub">{tagline}</span>
                        </div>
                    </div>
                    <button className="mob-close-btn" onClick={onClose} aria-label={t('nav.close')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* ── Nav Body ── */}
                <div className="mob-nav-body">
                    <div className="mob-nav-label">{t('nav.categories')}</div>
                    {navLinks.map((link, idx) => (
                        <div key={link.slug} className="mob-nav-item" style={{ animationDelay: `${idx * 0.04}s` }}>
                            {link.hasDropdown ? (
                                <>
                                    <button
                                        className={`mob-nav-link ${activeSection === link.slug ? 'expanded' : ''}`}
                                        onClick={() => onToggleSection(link.slug)}
                                    >
                                        <span className="mob-nav-left">
                                            {link.icon && <span className="mob-nav-icon">{link.icon}</span>}
                                            <span className="mob-nav-name">{link.name}</span>
                                        </span>
                                        <ChevronDownIcon size={16} className={`mob-nav-arrow ${activeSection === link.slug ? 'rotated' : ''}`} />
                                    </button>
                                    <div className={`mob-submenu ${activeSection === link.slug ? 'open' : ''}`}>
                                        {categories.find(c => c.slug === link.slug)?.categories.map((cat: any) => (
                                            <div key={cat.id} className="mob-sub-group">
                                                <div
                                                    className="mob-sub-header"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => onSubItemClick(link.slug, cat.slug, 'Barchasi')}
                                                >
                                                    <span className="mob-sub-icon">
                                                        {CATEGORY_ICON_MAP[cat.icon] || CATEGORY_ICON_MAP[cat.name] || '📦'}
                                                    </span>
                                                    <span className="mob-sub-title">{lang === 'ru' ? (cat.name_ru || cat.name) : cat.name}</span>
                                                </div>
                                                {cat.subcategories.map((sub: any) => (
                                                    <button
                                                        key={sub.id}
                                                        className="mob-sub-link"
                                                        onClick={() => onSubItemClick(link.slug, cat.slug, sub.slug)}
                                                    >
                                                        {lang === 'ru' ? (sub.name_ru || sub.name) : sub.name}
                                                        <ChevronRightIcon size={12} />
                                                    </button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={link.href}
                                    className="mob-nav-link"
                                    onClick={onClose}
                                >
                                    <span className="mob-nav-left">
                                        <span className="mob-nav-name">{link.name}</span>
                                    </span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Quick Actions ── */}
                <div className="mob-quick-actions">
                    <button className="mob-quick-btn" onClick={() => { navigate('/locations'); onClose(); }}>
                        <MapPinIcon size={14} />
                        <span>{lang === 'ru' ? 'Локация' : 'Joylashuv'}</span>
                    </button>
                    <button className="mob-quick-btn" onClick={onToggleTheme}>
                        {theme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                        <span>{theme === 'dark' ? t('nav.light') : t('nav.dark')}</span>
                    </button>
                    <div className="mob-lang-wrapper">
                        <button
                            className={`mob-quick-btn mob-lang-btn ${isLangExpanded ? 'active' : ''}`}
                            onClick={() => setIsLangExpanded(!isLangExpanded)}
                        >
                            <GlobeIcon size={14} />
                            <span>{lang.toUpperCase()}</span>
                            <ChevronDownIcon size={12} className={`mob-btn-arrow ${isLangExpanded ? 'rotated' : ''}`} />
                        </button>

                        <div className={`mob-lang-menu ${isLangExpanded ? 'open' : ''}`}>
                            <button
                                className={`mob-lang-opt ${lang === 'uz' ? 'active' : ''}`}
                                onClick={() => { setLang('uz'); setIsLangExpanded(false); }}
                            >
                                <span className="lang-flag">🇺🇿</span>
                                <span>O'zbekcha</span>
                                {lang === 'uz' && <svg className="mob-lang-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </button>
                            <button
                                className={`mob-lang-opt ${lang === 'ru' ? 'active' : ''}`}
                                onClick={() => { setLang('ru'); setIsLangExpanded(false); }}
                            >
                                <span className="lang-flag">🇷🇺</span>
                                <span>Русский</span>
                                {lang === 'ru' && <svg className="mob-lang-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="mob-footer">
                    <a href={`tel:${settings.phone}`} className="mob-contact-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></svg>
                        {settings.phone}
                    </a>
                    <a href={`mailto:${settings.email}`} className="mob-contact-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        {settings.email}
                    </a>
                    <div className="mob-footer-note">{copyright}</div>
                </div>
            </div>
        </>,
        document.body
    );
};

/* ========== Main Navbar Component ========== */
const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { itemsCount } = useCart();
    const { settings } = useSettings();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSection, setMobileSection] = useState<string | null>(null);

    const languages = [
        { code: 'uz' as const, name: 'O\'zbekcha', flag: '🇺🇿' },
        { code: 'ru' as const, name: 'Русский', flag: '🇷🇺' }
    ];

    // Dynamic categories from API
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navRef = useRef<HTMLElement>(null);

    // Fetch dynamic catalog
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                // Use the centralized api client if possible, or fetch
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/categories/`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error('Navbar fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalog();
    }, []);

    const staticNavLinks: NavLink[] = useMemo(() => [
        { name: t('nav.catalog'), slug: 'catalog', href: "/category/kiyimlar", hasDropdown: false },
        { name: t('nav.contact'), slug: 'contact', href: '/contact', hasDropdown: false, isScroll: false }
    ], [t]);

    // Map categories to navLinks
    const dynamicLinks = useMemo(() => {
        if (categories.length === 0 && !loading) return staticNavLinks;

        const links: NavLink[] = categories.map(sec => ({
            name: lang === 'ru' ? (sec.name_ru || sec.name) : sec.name,
            slug: sec.slug,
            href: `/category/${sec.slug}`,
            hasDropdown: sec.categories.length > 0,
            icon: SECTION_ICON_MAP[sec.icon] || SECTION_ICON_MAP[sec.slug],
            isScroll: false
        }));

        return [
            ...links,
            ...staticNavLinks.filter(l => !categories.find(c => c.slug === l.slug))
        ];
    }, [categories, loading, staticNavLinks, lang]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const mEnter = useCallback((n: string) => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        setHoveredMenu(n);
    }, []);
    const mLeave = useCallback(() => {
        hoverTimerRef.current = setTimeout(() => setHoveredMenu(null), 200);
    }, []);
    const ddEnter = useCallback(() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    }, []);
    const ddLeave = useCallback(() => {
        hoverTimerRef.current = setTimeout(() => setHoveredMenu(null), 200);
    }, []);

    const handleSubItemClick = useCallback((menuSlug: string, groupSlug: string, subSlug: string) => {
        const sec = categories.find(s => s.slug === menuSlug);
        if (sec) {
            let url = `/category/${sec.slug}?group=${groupSlug}`;
            if (subSlug !== 'Barchasi') {
                url += `&sub=${subSlug}`;
            }
            navigate(url);
        }
        setHoveredMenu(null);
        setMobileOpen(false);
    }, [navigate, categories]);

    const dropdownSection = useMemo(() =>
        categories.find(s => s.slug === hoveredMenu)
        , [hoveredMenu, categories]);

    return (
        <>
            <div className="navbar-top-bar">
                <div className="container top-bar-inner">
                    <div className="top-bar-left">
                        <a href={`tel:${settings?.phone}`} className="top-bar-link">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            <span>{settings?.phone}</span>
                        </a>
                        <a href={`mailto:${settings?.email}`} className="top-bar-link hide-mobile">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span>{settings?.email}</span>
                        </a>
                    </div>
                    <div className="top-bar-right">
                        <div className="top-bar-info hide-mobile">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span>{settings?.workday_hours}</span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} ref={navRef}>

                <div className="container navbar-inner">
                    {/* ── Logo ── */}
                    <Link to="/" className="navbar-logo" onClick={() => setHoveredMenu(null)}>
                        <img src="/icon.png" alt="Logo" className="logo-img" />
                        <div className="logo-text">

                            <span className="logo-main">{settings?.shop_name || 'ARMYSHOP'}</span>
                            <span className="logo-sub">
                                {lang === 'ru'
                                    ? (settings?.tagline_ru || settings?.tagline || 'СНАРЯЖЕНИЕ')
                                    : (settings?.tagline || 'TASHQI VA TAKTIK')}
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop Nav Links ── */}
                    <div className="nav-center">
                        {dynamicLinks.map(link =>
                            link.isScroll ? (
                                <a key={link.slug} href={link.href} className="nav-link">
                                    {link.name}
                                </a>
                            ) : (
                                <div
                                    key={link.slug}
                                    className="nav-item"
                                    onMouseEnter={() => link.hasDropdown && mEnter(link.slug)}
                                    onMouseLeave={mLeave}
                                >
                                    <Link
                                        to={link.href}
                                        className={`nav-link ${hoveredMenu === link.slug ? 'active' : ''}`}
                                        onClick={() => setHoveredMenu(null)}
                                    >
                                        {link.name}
                                        {link.hasDropdown && (
                                            <ChevronDownIcon size={12} className={`nav-chevron ${hoveredMenu === link.slug ? 'rotated' : ''}`} />
                                        )}
                                    </Link>
                                </div>
                            )
                        )}
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="navbar-actions">
                        <button className="action-btn location-toggle hide-mobile" onClick={() => navigate('/locations')} aria-label="Joylashuv">
                            <MapPinIcon size={18} />
                        </button>
                        <button className="action-btn theme-toggle hide-mobile" onClick={toggleTheme} aria-label={t('nav.theme')}>
                            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                        </button>
                        <div className="lang-selector">
                            <button className="action-btn lang-toggle hide-mobile" aria-label={t('nav.language')}>
                                <GlobeIcon size={17} />
                                <span className="lang-label">{lang.toUpperCase()}</span>
                                <ChevronDownIcon size={10} className="lang-chevron" />
                            </button>
                            <div className="lang-dropdown">
                                {languages.map(l => (
                                    <button
                                        key={l.code}
                                        className={`lang-item ${lang === l.code ? 'active' : ''}`}
                                        onClick={() => setLang(l.code)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="lang-flag">{l.flag}</span>
                                            <span>{l.name}</span>
                                        </div>
                                        <svg className="lang-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className="action-btn cart-btn" aria-label={t('nav.cart')} onClick={() => navigate('/cart')}>
                            <ShoppingBagIcon size={18} />
                            {itemsCount > 0 && <span className="cart-count">{itemsCount}</span>}
                        </button>
                        <button
                            className={`hamburger ${mobileOpen ? 'open' : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <span className="bar" /><span className="bar" /><span className="bar" />
                        </button>
                    </div>
                </div>

                {/* ── Desktop Mega Menu ── */}
                {hoveredMenu && dropdownSection && (
                    <div
                        className="mega-menu"
                        onMouseEnter={ddEnter}
                        onMouseLeave={ddLeave}
                    >
                        <div className="mega-backdrop" />
                        <div className="container mega-inner">
                            {/* Left: Groups grid */}
                            <div className="mega-left">
                                {dropdownSection.categories.map((cat: any, gi: number) => (
                                    <div key={cat.id} className="mega-group" style={{ animationDelay: `${gi * 0.05}s` }}>
                                        <div
                                            className="mega-group-head"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSubItemClick(dropdownSection.slug, cat.slug, 'Barchasi')}
                                        >
                                            <span className="mega-icon">{CATEGORY_ICON_MAP[cat.icon] || CATEGORY_ICON_MAP[cat.name] || '📦'}</span>
                                            <span className="mega-title">{lang === 'ru' ? (cat.name_ru || cat.name) : cat.name}</span>
                                        </div>
                                        <ul className="mega-items">
                                            {cat.subcategories.map((sub: any) => (
                                                <li key={sub.id}>
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSubItemClick(dropdownSection.slug, cat.slug, sub.slug);
                                                        }}
                                                    >
                                                        {lang === 'ru' ? (sub.name_ru || sub.name) : sub.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Drawer */}
            <MobileDrawer
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                activeSection={mobileSection}
                onToggleSection={(n) => setMobileSection(mobileSection === n ? null : n)}
                theme={theme}
                onToggleTheme={toggleTheme}
                onSubItemClick={handleSubItemClick}
                categories={categories}
                navLinks={dynamicLinks}
                settings={settings}
                t={t}
                lang={lang}
                setLang={setLang}
                navigate={navigate}
            />
        </>
    );
};

export default Navbar;
