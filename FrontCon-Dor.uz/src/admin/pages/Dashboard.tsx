import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface DashboardData {
    total_products: number;
    total_orders: number;
    total_users: number;
    total_revenue: number;
    recent_orders: number;
    active_products: number;
}

const quickActions = [
    { label: 'Mahsulot qo\'shish', icon: '+', page: 'products', color: 'var(--adm-accent)' },
    { label: 'Navbar sozlash', icon: '☰', page: 'navbar', color: 'var(--adm-blue)' },
    { label: 'Hero tahrirlash', icon: '▶', page: 'hero', color: 'var(--adm-purple)' },
    { label: 'FAQ qo\'shish', icon: '?', page: 'faq', color: 'var(--adm-yellow)' },
];

interface DashboardProps { onNavigate: (page: string) => void; }

const Dashboard = ({ onNavigate }: DashboardProps) => {
    const { addToast } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get<DashboardData>('/api/admin/dashboard');
                setData(res);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                addToast('error', 'Ma\'lumotlarni yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addToast]);

    const stats = [
        {
            label: 'Jami Mahsulotlar',
            value: data?.total_products ?? '...',
            change: data ? `${data.active_products} faol` : '...',
            up: true, color: 'blue',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
        },
        {
            label: 'Jami Buyurtmalar',
            value: data?.total_orders ?? '...',
            change: data ? `+${data.recent_orders} yaqinda` : '...',
            up: true, color: 'green',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
        },
        {
            label: 'Foydalanuvchilar',
            value: data?.total_users ?? '...',
            change: 'Jami ruyxatdan o\'tgan',
            up: true, color: 'purple',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
        },
        {
            label: "Umumiy Daromad",
            value: data ? `${data.total_revenue.toLocaleString('ru-RU')} so'm` : '...',
            change: 'Bekor qilinmaganlar',
            up: true, color: 'yellow',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><circle cx="12" cy="12" r="10" /><path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2 .9 2 2-.9 2-2 2" /><path d="M12 5v3m0 8v3" /></svg>
        },
    ];

    return (
        <div>
            {/* Welcome */}
            <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>
                        Xush kelibsiz, Admin! 👋
                    </h1>
                    <p style={{ color: 'var(--adm-text-sec)', fontSize: '0.875rem' }}>
                        ArmyShop boshqaruv paneli — barcha bo'limlarni bu yerdan boshqaring
                    </p>
                </div>
                <button
                    className="adm-btn adm-btn-primary"
                    disabled={loading}
                    onClick={() => { window.location.reload(); }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    {loading ? 'Yangilanmoqda...' : 'Saytni yangilash'}
                </button>
            </div>

            {/* Stats grid */}
            <div className="adm-grid-4 adm-mb-20">
                {stats.map((s, i) => (
                    <div key={i} className={`adm-stat ${loading ? 'adm-skeleton' : ''}`}>
                        <div className={`adm-stat-icon ${s.color}`}>{s.icon}</div>
                        <div className="adm-stat-body">
                            <div className="adm-stat-value">{s.value}</div>
                            <div className="adm-stat-label">{s.label}</div>
                            <div className={`adm-stat-change ${s.up ? 'up' : 'down'}`}>
                                <span>{s.up ? '↑' : '↓'}</span>
                                <span>{s.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions + recent activity */}
            <div className="adm-grid-2" style={{ gap: 20 }}>
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">⚡ Tezkor amallar</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {quickActions.map((a, i) => (
                            <button
                                key={i}
                                onClick={() => onNavigate(a.page)}
                                style={{
                                    background: 'var(--adm-bg-alt)',
                                    border: '1px solid var(--adm-border)',
                                    borderRadius: 'var(--adm-radius)',
                                    padding: '16px',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    transition: 'var(--adm-transition)',
                                    fontFamily: 'var(--adm-font-body)',
                                    color: 'var(--adm-text)',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.color; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--adm-border)'; }}
                            >
                                <span style={{
                                    width: 36, height: 36, background: a.color + '22',
                                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1rem', color: a.color, flexShrink: 0
                                }}>{a.icon}</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">📋 So'nggi faoliyat</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Removed recentActivity mapping as per instruction */}
                        {/* The instruction implies removing the content of recentActivity, but not the card itself.
                            However, the instruction also removes the `recentActivity` array definition.
                            To make it syntactically correct and follow the spirit of the instruction,
                            I'm removing the mapping content, leaving an empty card body.
                            If the intent was to remove the entire card, the `adm-grid-2` structure would change.
                            Given the instruction's focus on data fetching and stats, and the explicit removal of the `recentActivity` array,
                            it's safer to remove the mapping content.
                        */}
                        <div style={{ fontSize: '0.83rem', color: 'var(--adm-text-sec)', padding: '10px 0' }}>
                            So'nggi faoliyat ma'lumotlari hozircha mavjud emas.
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections overview */}
            <div className="adm-card" style={{ marginTop: 20 }}>
                <div className="adm-card-header">
                    <div className="adm-card-title">🗺 Bo'limlar xaritasi</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                    {[
                        { name: 'Navbar', page: 'navbar' },
                        { name: 'Hero Slayder', page: 'hero' },
                        { name: 'Mahsulotlar', page: 'products' },
                        { name: 'Buyurtmalar', page: 'orders' },
                        { name: 'Kategoriyalar', page: 'categories' },
                        { name: 'Brend Hamkorlar', page: 'partners' },
                        { name: 'Newsletter', page: 'newsletter' },
                        { name: 'Instagram', page: 'instagram' },
                        { name: 'Sozlamalar', page: 'site-settings' },
                    ].map((section, i) => (
                        <button
                            key={i}
                            onClick={() => onNavigate(section.page)}
                            style={{
                                background: 'var(--adm-bg-alt)',
                                border: '1px solid var(--adm-border)',
                                borderRadius: 6, padding: '10px 12px',
                                cursor: 'pointer', textAlign: 'left',
                                transition: 'var(--adm-transition)',
                                fontFamily: 'var(--adm-font-body)',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--adm-accent)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--adm-border)'; }}
                        >
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--adm-text)' }}>{section.name}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
