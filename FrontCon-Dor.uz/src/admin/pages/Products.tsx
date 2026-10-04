import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';

import { api } from '../../lib/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    old_price: number | null;
    badge: string | null;
    rating: number;
    reviews_count: number;
    sub: string | null;
    is_active: boolean;
    subcategory_id: number;
    subcategory_name: string;
    category_name: string;
    images: { id: number; image: string; is_primary: boolean }[];
}

interface Category {
    id: number;
    name: string;
    subcategories: { id: number; name: string }[];
}




const Products = ({ onAdd, onEdit }: { onAdd: () => void; onEdit: (id: number) => void }) => {
    const { addToast } = useAdmin();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [modal, setModal] = useState<'delete' | 'bulk-delete' | null>(null);
    const [editing, setEditing] = useState<Product | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get<Product[]>('/api/admin/products'),
                api.get<Category[]>('/api/admin/categories')
            ]);
            setProducts(prodRes);
            setCategories(catRes);
        } catch (err) {
            console.error('Products fetch error:', err);
            addToast('error', 'Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.sub || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = !filterCat || p.category_name === filterCat;
        return matchSearch && matchCat;
    });

    const openAdd = () => onAdd();
    const openEdit = (p: Product) => onEdit(p.id);

    const handleDelete = async () => {
        if (!editing) return;
        try {
            await api.del(`/api/admin/products/${editing.id}`);
            setProducts(prev => prev.filter(p => p.id !== editing.id));
            setModal(null);
            addToast('info', `"${editing.name}" o'chirildi`);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik yuz berdi');
        }
    };

    const toggleActive = async (p: Product) => {
        try {
            const res = await api.put<Product>(`/api/admin/products/${p.id}`, { is_active: !p.is_active });
            setProducts(prev => prev.map(item => item.id === p.id ? res : item));
        } catch (err) {
            addToast('error', 'Holatni o\'zgartirib bo\'lmadi');
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filtered.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filtered.map(p => p.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        try {
            await api.post('/api/admin/products/bulk-delete', { ids: selectedIds });
            setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
            setModal(null);
            addToast('success', `${selectedIds.length} ta mahsulot o'chirildi`);
        } catch (err) {
            addToast('error', 'Ommaviy o\'chirishda xatolik');
        }
    };



    return (
        <div className={loading ? 'adm-skeleton-container' : ''}>
            {/* Header */}
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Mahsulotlar</h2>
                    <p className="adm-text-sec">Jami {products.length} ta mahsulot</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={openAdd} disabled={categories.length === 0}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Mahsulot qo'shish
                </button>
            </div>

            {/* Filters */}
            <div className="adm-card adm-mb-20">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div className="adm-search" style={{ flex: 1, minWidth: 200 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input placeholder="Mahsulot qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="adm-select" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ minWidth: 160 }}>
                        <option value="">Barcha bo'limlar</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    {(search || filterCat) && (
                        <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => { setSearch(''); setFilterCat(''); }}>
                            Filtrni tozalash
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="adm-card">
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>
                                    <input 
                                        type="checkbox" 
                                        className="adm-checkbox"
                                        checked={filtered.length > 0 && selectedIds.length === filtered.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>Mahsulot</th>
                                <th>Kategoriya</th>
                                <th>Narx</th>
                                <th>Eski narx</th>
                                <th>Badge</th>
                                <th>Holat</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className={selectedIds.includes(p.id) ? 'selected' : ''}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="adm-checkbox"
                                            checked={selectedIds.includes(p.id)}
                                            onChange={() => toggleSelect(p.id)}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="adm-prod-img">
                                                {p.images[0] ? <img src={p.images[0].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🛍'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--adm-text)' }}>{p.name}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>ID: #{p.id} • {p.sub || '---'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="adm-badge" style={{
                                            background: 'rgba(0,0,0,0.05)',
                                            color: 'var(--adm-text-sec)'
                                        }}>
                                            {p.category_name}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--adm-green)', fontWeight: 600, fontSize: '0.85rem' }}>{p.price.toLocaleString()} so'm</td>
                                    <td style={{ color: 'var(--adm-text-muted)', textDecoration: p.old_price ? 'line-through' : 'none', fontSize: '0.83rem' }}>
                                        {p.old_price ? `${p.old_price.toLocaleString()} so'm` : '—'}
                                    </td>
                                    <td>
                                        {p.badge
                                            ? <span className={`adm-badge adm-badge-blue`}>{p.badge}</span>
                                            : <span className="adm-badge adm-badge-muted">—</span>
                                        }
                                    </td>
                                    <td>
                                        <label className="adm-toggle">
                                            <input type="checkbox" checked={p.is_active} onChange={() => toggleActive(p)} />
                                            <span className="adm-toggle-slider" />
                                        </label>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => openEdit(p)} title="Tahrirlash">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => { setEditing(p); setModal('delete'); }} title="O'chirish">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && !loading && (
                        <div className="adm-empty">
                            <div className="adm-empty-title">Mahsulot topilmadi</div>
                            <div className="adm-empty-sub">Qidiruvni o'zgartirib ko'ring</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="adm-bulk-bar">
                    <div className="adm-bulk-info">
                        <span className="count">{selectedIds.length}</span>
                        <span>mahsulot tanlandi</span>
                    </div>
                    <div className="adm-bulk-actions">
                        <button className="adm-btn adm-btn-danger" onClick={() => setModal('bulk-delete')}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                            Ommaviy o'chirish
                        </button>
                        <button className="adm-btn adm-btn-ghost" onClick={() => setSelectedIds([])}>Bekor qilish</button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {(modal === 'delete' || modal === 'bulk-delete') && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <div className="adm-modal-header">
                            <div className="adm-modal-title" style={{ color: 'var(--adm-red)' }}>⚠ Tasdiqlang</div>
                            <button className="adm-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="adm-modal-body">
                            <p style={{ color: 'var(--adm-text-sec)', fontSize: '0.9rem' }}>
                                {modal === 'delete' ? (
                                    <>
                                        <strong style={{ color: 'var(--adm-text)' }}>"{editing?.name}"</strong> mahsulotini o'chirmoqchimisiz?
                                    </>
                                ) : (
                                    <>
                                        Tanlangan <strong style={{ color: 'var(--adm-text)' }}>{selectedIds.length} ta</strong> mahsulotni o'chirmoqchimisiz?
                                    </>
                                )}
                                <br />Bu amalni qaytarib bo'lmaydi.
                            </p>
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor qilish</button>
                            <button className="adm-btn adm-btn-danger" onClick={modal === 'delete' ? handleDelete : handleBulkDelete}>
                                Ha, o'chirilsin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Products;