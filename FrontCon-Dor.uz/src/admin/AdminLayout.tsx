import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '../components/Icons';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    section: string;
}

const navItems: NavItem[] = [
    {
        id: 'dashboard', label: 'Boshqaruv paneli', section: 'ASOSIY',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    },
    {
        id: 'orders', label: 'Buyurtmalar', section: 'ASOSIY',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>
    },
    {
        id: 'analytics', label: 'Analitika', section: 'ASOSIY',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
    },
    {
        id: 'products', label: 'Mahsulotlar', section: 'KATALOG',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    },
    {
        id: 'categories', label: 'Kategoriyalar', section: 'KATALOG',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    },
    {
        id: 'navbar', label: 'Navbar Boshqaruv', section: 'DIZAYN',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="4" rx="1" /><path d="M4 3v4M9 3v4M14 3v4M19 3v4" /></svg>
    },
    {
        id: 'hero', label: 'Hero Slayder', section: 'DIZAYN',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M9 5v14M2 12h20" /></svg>
    },
    {
        id: 'banner', label: 'Promo Banner', section: 'DIZAYN',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v6H4z" /><path d="M4 14h7m-7 4h10" /></svg>
    },
    {
        id: 'settings', label: 'Sozlamalar', section: 'TIZIM',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    },
    {
        id: 'telegram-settings', label: 'Telegram Sozlamalari', section: 'TIZIM',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L2 8.5l7.5 3L22 2zM9.5 11.5L22 2l-11 13L9.5 11.5zM2 8.5l7.5 3L11 15l-1.5-3.5z" /></svg>
    },
    {
        id: 'branches', label: 'Filiallar (Bog\'lanish)', section: 'TIZIM',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    },
];

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
}

const AdminLayout = ({ children, activePage, onNavigate }: AdminLayoutProps) => {
    const { logout, toasts, removeToast, stats, fetchStats } = useAdmin();
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const activeItem = navItems.find(n => n.id === activePage);
    const sections = [...new Set(navItems.map(n => n.section))];

    const itemsWithStats = navItems.map(item => {
        if (item.id === 'orders') return { ...item, badge: stats?.total_orders };
        if (item.id === 'products') return { ...item, badge: stats?.total_products };
        return item;
    });

    return (
        <div className="adm-root">
            <aside className={`adm-sidebar${mobileOpen ? ' mobile-open' : ''}`}>
                <div className="adm-sidebar-header">
                    <div className="adm-sidebar-logo-icon" style={{ background: 'var(--adm-accent)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                            <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
                            <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <div className="adm-sidebar-logo-text">
                        <div className="main" style={{ letterSpacing: '1px', fontWeight: 800 }}>ARMYSHOP</div>
                        <div className="sub" style={{ fontSize: '0.6rem', opacity: 0.8 }}>ADMIN PANEL</div>
                    </div>
                </div>

                <nav className="adm-nav">
                    {sections.map(section => (
                        <div key={section} className="adm-nav-section">
                            <div className="adm-nav-section-label">{section}</div>
                            {itemsWithStats.filter(n => n.section === section).map(item => (
                                <button
                                    key={item.id}
                                    className={`adm-nav-link${activePage === item.id ? ' active' : ''}`}
                                    onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                                >
                                    {item.icon}
                                    <span style={{ flex: 1 }}>{item.label}</span>
                                    {!!item.badge && <span className="adm-nav-badge">{item.badge}</span>}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="adm-sidebar-footer">
                    <div className="adm-sidebar-user">
                        <div className="adm-sidebar-avatar">A</div>
                        <div className="adm-sidebar-user-info">
                            <div className="adm-sidebar-user-name">Admin</div>
                            <div className="adm-sidebar-user-role">Super Admin</div>
                        </div>
                        <button className="adm-sidebar-logout" onClick={logout} title="Chiqish">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {mobileOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <main className="adm-main">
                <header className="adm-header">
                    <div className="adm-header-left">
                        <button
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-text-sec)', display: 'none', padding: 4 }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="adm-mobile-toggle"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <div className="adm-breadcrumb">
                            <span>Admin</span>
                            <span>›</span>
                            <span className="current">{activeItem?.label || 'Sahifa'}</span>
                        </div>
                    </div>
                    <div className="adm-page-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        {activeItem?.label}
                    </div>
                    <div className="adm-header-right">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener"
                            className="adm-header-btn"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Saytga o'tish
                        </a>
                        <button className="adm-header-btn" onClick={toggleTheme} title="Mavzuni o'zgartirish">
                            {theme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                        </button>
                        <button className="adm-header-btn" onClick={logout}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Chiqish
                        </button>
                    </div>
                </header>

                <div className="adm-content">
                    {children}
                </div>
            </main>

            <div className="adm-toast-wrap">
                {toasts.map(t => (
                    <div key={t.id} className={`adm-toast ${t.type}`}>
                        <span>
                            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'i'}
                        </span>
                        <span style={{ flex: 1 }}>{t.message}</span>
                        <button
                            onClick={() => removeToast(t.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-text-muted)', padding: 0 }}
                        >×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminLayout;
