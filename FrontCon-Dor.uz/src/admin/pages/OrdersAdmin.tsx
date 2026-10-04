import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

// Backend statuses: "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"
type BackendStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
    product_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    user_email: string | null;
    user_full_name: string | null;
    phone: string;
    item_count: number;
    total_amount: number;
    status: BackendStatus;
    address: string;
    note: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

interface PaginatedOrders {
    items: Order[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

const statusConfig: Record<string, { label: string; badge: string; color: string; bg: string }> = {
    pending: { label: 'Yangi', badge: 'adm-badge-blue', color: 'var(--adm-blue)', bg: 'var(--adm-blue-bg)' },
    confirmed: { label: 'Tasdiqlangan', badge: 'adm-badge-blue', color: 'var(--adm-blue)', bg: 'var(--adm-blue-bg)' },
    processing: { label: 'Tayyorlanmoqda', badge: 'adm-badge-yellow', color: 'var(--adm-yellow)', bg: 'var(--adm-yellow-bg)' },
    shipped: { label: 'Yo\'lda', badge: 'adm-badge-purple', color: 'var(--adm-purple)', bg: 'var(--adm-purple-bg)' },
    delivered: { label: 'Yetkazildi', badge: 'adm-badge-green', color: 'var(--adm-green)', bg: 'var(--adm-green-bg)' },
    cancelled: { label: 'Bekor qilingan', badge: 'adm-badge-red', color: 'var(--adm-red)', bg: 'var(--adm-red-bg)' },
};

const OrdersAdmin = () => {
    const { addToast, fetchStats } = useAdmin();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Order | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchOrders = useCallback(async (p = page, status = filterStatus) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<PaginatedOrders>(`/api/admin/orders?page=${p}&status_filter=${status}`);
            setOrders(res.items);
            setTotalItems(res.total);
            setTotalPages(res.total_pages);
            setPage(res.page);
        } catch (err) {
            console.error('Orders fetch error:', err);
            setError('Buyurtmalarni yuklashda xatolik yuz berdi.');
            addToast('error', 'Buyurtmalarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast, page, filterStatus]);

    useEffect(() => {
        fetchOrders(1, filterStatus);
    }, [filterStatus]);

    useEffect(() => {
        fetchOrders(page, filterStatus);
    }, [page]);

    const handleRefresh = () => {
        fetchOrders(page, filterStatus);
        fetchStats();
    };

    const handleFilterChange = (s: string) => {
        setFilterStatus(s);
        setPage(1);
    };

    const changeStatus = async (id: number, status: BackendStatus) => {
        try {
            await api.patch(`/api/admin/orders/${id}`, { status });
            addToast('success', `Buyurtma #${id} holati yangilandi`);
            setModalOpen(false);
            handleRefresh();
        } catch (err) {
            console.error('Status update error:', err);
            addToast('error', 'Statusni yangilashda xatolik');
        }
    };

    const filtered = orders.filter(o => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (o.user_email || '').toLowerCase().includes(searchLower) ||
            (o.user_full_name || '').toLowerCase().includes(searchLower) ||
            String(o.id).includes(search) || o.phone.includes(search);
    });

    if (error) {
        return (
            <div className="adm-empty" style={{ minHeight: 400 }}>
                <div className="adm-empty-title" style={{ color: 'var(--adm-red)' }}>Xatolik!</div>
                <div className="adm-empty-sub">{error}</div>
                <button className="adm-btn adm-btn-primary" onClick={handleRefresh} style={{ marginTop: 20 }}>Qayta urinish</button>
            </div>
        );
    }

    return (
        <div className={loading ? 'adm-skeleton-container' : ''}>
            {/* Header */}
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Buyurtmalar</h2>
                    <p className="adm-text-sec">Jami {totalItems} ta buyurtma</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={handleRefresh} disabled={loading}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                    {loading ? 'Yuklanmoqda...' : 'Yangilash'}
                </button>
            </div>

            {/* Filters */}
            <div className="adm-card adm-mb-20">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="adm-search" style={{ flex: 1, minWidth: 200 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input placeholder="Qidirish (Ism, Email, telefon, ID)..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="adm-select" value={filterStatus} onChange={e => handleFilterChange(e.target.value)} style={{ minWidth: 150 }}>
                        <option value="">Barcha statuslar</option>
                        {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="adm-card">
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Mijoz</th>
                                <th>Mahsulotlar</th>
                                <th>Jami</th>
                                <th>Sana</th>
                                <th>Status</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && filtered.map(order => {
                                const cfg = statusConfig[order.status] || { label: order.status, badge: 'adm-badge-muted' };
                                return (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--adm-accent)', fontSize: '0.82rem' }}>#{order.id}</td>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.user_full_name || 'Mehmon'}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>{order.phone}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-sec)', maxWidth: 220 }}>
                                                {order.items.slice(0, 2).map((it, idx) => (
                                                    <div key={idx} className="adm-text-truncate">{it.product_name} × {it.quantity}</div>
                                                ))}
                                                {order.items.length > 2 && <div style={{ fontSize: '0.7rem', color: 'var(--adm-accent)' }}>+ yana {order.items.length - 2} ta...</div>}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700, color: 'var(--adm-green)', fontSize: '0.85rem' }}>{order.total_amount.toLocaleString()} so'm</td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`adm-badge ${cfg.badge}`}>{cfg.label}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" title="Batafsil ko'rish"
                                                    onClick={() => { setSelected(order); setModalOpen(true); }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                </button>
                                                {order.status === 'pending' && (
                                                    <button className="adm-btn adm-btn-sm" style={{ background: 'rgba(52,211,153,0.1)', color: '#10b981', border: '1px solid rgba(52,211,153,0.2)' }}
                                                        onClick={() => changeStatus(order.id, 'confirmed')}>
                                                        Qabul qilish
                                                    </button>
                                                )}
                                                {(order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped') && (
                                                    <button className="adm-btn adm-btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                                                        onClick={() => changeStatus(order.id, 'delivered')}>
                                                        Yetkazildi
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {loading && (
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <div className="adm-skeleton" style={{ height: 200, width: '100%' }}></div>
                        </div>
                    )}

                    {!loading && filtered.length === 0 && (
                        <div className="adm-empty" style={{ padding: '60px 0' }}>
                            <div className="adm-empty-title">Buyurtmalar topilmadi</div>
                            <div className="adm-empty-sub">Database hali bo'sh yoki filtr natija bermadi</div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'center', gap: 8 }}>
                        <button className="adm-btn adm-btn-secondary adm-btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>O'tgan</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600 }}>
                            {page} / {totalPages}
                        </div>
                        <button className="adm-btn adm-btn-secondary adm-btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Keyingi</button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {modalOpen && selected && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
                    <div className="adm-modal" style={{ maxWidth: 600 }}>
                        <div className="adm-modal-header">
                            <div className="adm-modal-title">Buyurtma #{selected.id} — {statusConfig[selected.status]?.label || selected.status}</div>
                            <button className="adm-modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className="adm-modal-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <div className="adm-label">Mijoz</div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{selected.user_full_name || 'Mehmon'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-sec)' }}>{selected.user_email}</div>
                                    </div>
                                    <div>
                                        <div className="adm-label">Telefon</div>
                                        <div style={{ fontSize: '0.95rem' }}>{selected.phone}</div>
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <div className="adm-label">Yetkazib berish manzili</div>
                                        <div style={{ fontSize: '0.9rem', background: 'var(--adm-bg-alt)', padding: '10px 12px', borderRadius: 8 }}>{selected.address}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="adm-label" style={{ marginBottom: 10 }}>Buyurtma tarkibi</div>
                                    <div style={{ borderRadius: 8, border: '1px solid var(--adm-border)', overflow: 'hidden' }}>
                                        {selected.items.map((item, i) => (
                                            <div key={i} style={{ padding: '10px 12px', background: i % 2 === 0 ? 'transparent' : 'var(--adm-bg-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === selected.items.length - 1 ? 'none' : '1px solid var(--adm-border)' }}>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <span style={{ fontWeight: 600 }}>{item.product_name}</span>
                                                    <span style={{ color: 'var(--adm-text-muted)', marginLeft: 8 }}>× {item.quantity}</span>
                                                </div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{(item.price * item.quantity).toLocaleString()} so'm</div>
                                            </div>
                                        ))}
                                        <div style={{ padding: '12px', background: 'var(--adm-accent-light)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>JAMI SUMMA</span>
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selected.total_amount.toLocaleString()} so'm</span>
                                        </div>
                                    </div>
                                </div>

                                {selected.note && (
                                    <div>
                                        <div className="adm-label">Mijoz izohi</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--adm-text-sec)', fontStyle: 'italic' }}>"{selected.note}"</div>
                                    </div>
                                )}

                                <div>
                                    <div className="adm-label" style={{ marginBottom: 10 }}>Statusni o'zgartirish</div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {(Object.keys(statusConfig) as BackendStatus[]).map(s => (
                                            <button key={s}
                                                className={`adm-btn adm-btn-sm ${selected.status === s ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
                                                style={selected.status === s ? { borderColor: statusConfig[s].color, background: statusConfig[s].color } : {}}
                                                onClick={() => changeStatus(selected.id, s)}>
                                                {statusConfig[s].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModalOpen(false)}>Yopish</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersAdmin;
