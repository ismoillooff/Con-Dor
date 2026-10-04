import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface AnalyticsData {
    daily_revenue: {
        date: string;
        revenue: number;
        orders: number;
    }[];
    top_products: {
        name: string;
        sold: number;
        revenue: number;
    }[];
    status_breakdown: Record<string, number>;
    period: string;
}

const AnalyticsAdmin = () => {
    const { addToast } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get<AnalyticsData>('/api/admin/analytics');
                setData(res);
            } catch (err) {
                console.error('Analytics fetch error:', err);
                addToast('error', 'Analitika ma\'lumotlarini yuklashda xatolik');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [addToast]);

    const totalRevenue = data?.daily_revenue.reduce((acc, curr) => acc + curr.revenue, 0) || 0;
    const totalOrders = data?.daily_revenue.reduce((acc, curr) => acc + curr.orders, 0) || 0;

    const stats = [
        { label: 'Daromad (so\'m)', value: totalRevenue.toLocaleString('ru-RU'), change: 'Oxirgi 30 kun', up: true, color: 'var(--adm-accent)', bg: 'rgba(200,16,46,0.1)', icon: '💰' },
        { label: 'Buyurtmalar', value: totalOrders, change: 'Oxirgi 30 kun', up: true, color: 'var(--adm-green)', bg: 'var(--adm-green-bg)', icon: '🛍' },
        { label: 'Top Mahsulot', value: data?.top_products[0]?.name || '---', change: 'Eng ko\'p sotilgan', up: true, color: 'var(--adm-blue)', bg: 'var(--adm-blue-bg)', icon: '🏆' },
        { label: 'O\'rtacha Chek', value: totalOrders > 0 ? (totalRevenue / totalOrders).toLocaleString('ru-RU') : 0, change: 'so\'m / buyurtma', up: true, color: 'var(--adm-purple)', bg: 'var(--adm-purple-bg)', icon: '📈' },
    ];

    const chartData = data?.daily_revenue || [];
    const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

    return (
        <div className={loading ? 'adm-skeleton-container' : ''}>
            {/* Header */}
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Analitika</h2>
                    <p className="adm-text-sec">Oxirgi 30 kunlik do'kon faoliyati statistikasi</p>
                </div>
                <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => window.location.reload()}>
                    🔄 Yangilash
                </button>
            </div>

            {/* Stats Grid */}
            <div className="adm-grid-4 adm-mb-20">
                {stats.map((s, i) => (
                    <div key={i} className={`adm-stat ${loading ? 'adm-skeleton' : ''}`} style={{ borderLeft: `3px solid ${s.color}` }}>
                        <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div className="adm-stat-body">
                            <div className="adm-stat-value">{s.value}</div>
                            <div className="adm-stat-label">{s.label}</div>
                            <div className={`adm-stat-change ${s.up ? 'up' : 'down'}`}>
                                <span>{s.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="adm-grid-2" style={{ gap: 20, marginBottom: 20 }}>
                {/* Bar Chart */}
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">📊 Kunlik daromad</div>
                        <span className="adm-text-muted" style={{ fontSize: '0.78rem' }}>Oxirgi 30 kun (so'm)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160, paddingBottom: 8, overflowX: 'auto' }}>
                        {chartData.map((d, i) => (
                            <div key={i} style={{ flex: 1, minWidth: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{
                                    width: '100%', background: 'linear-gradient(180deg, var(--adm-accent) 0%, var(--adm-accent-dark) 100%)',
                                    borderRadius: '2px 2px 0 0', height: `${(d.revenue / maxRevenue) * 130}px`,
                                    opacity: 0.8, transition: 'all 0.3s ease',
                                    minHeight: d.revenue > 0 ? 2 : 0
                                }} title={`${d.date}: ${d.revenue.toLocaleString()} so'm`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="adm-card">
                    <div className="adm-card-header">
                        <div className="adm-card-title">📦 Buyurtmalar holati</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {data ? Object.entries(data.status_breakdown).map(([status, count], i) => {
                            const total = Object.values(data.status_breakdown).reduce((a, b) => a + b, 0);
                            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                            const colors: Record<string, string> = {
                                pending: 'var(--adm-yellow)',
                                confirmed: 'var(--adm-blue)',
                                processing: 'var(--adm-purple)',
                                shipped: 'var(--adm-accent)',
                                delivered: 'var(--adm-green)',
                                cancelled: 'var(--adm-red)'
                            };
                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.83rem', color: 'var(--adm-text)', textTransform: 'capitalize' }}>{status}</span>
                                        <span style={{ fontSize: '0.83rem', fontWeight: 600 }}>{count} ({percent}%)</span>
                                    </div>
                                    <div style={{ height: 8, background: 'var(--adm-bg-alt)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', background: colors[status] || 'var(--adm-accent)', borderRadius: 4 }} />
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="adm-text-muted">Ma'lumotlar yo'q</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="adm-card">
                <div className="adm-card-header">
                    <div className="adm-card-title">🏆 Top mahsulotlar</div>
                </div>
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mahsulot</th>
                                <th>Sotilgan</th>
                                <th>Jami Daromad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.top_products || []).map((p, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 700, color: 'var(--adm-text-muted)', fontSize: '0.8rem' }}>#{i + 1}</td>
                                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--adm-blue)' }}>{p.sold} ta</td>
                                    <td style={{ fontWeight: 600, color: 'var(--adm-green)' }}>{p.revenue.toLocaleString('ru-RU')} so'm</td>
                                </tr>
                            ))}
                            {(!loading && data?.top_products.length === 0) && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }} className="adm-text-muted">
                                        Mahsulotlar sotilmagan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsAdmin;
