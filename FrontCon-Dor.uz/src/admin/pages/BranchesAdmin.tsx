import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface BranchItem {
    id: number;
    name: string;
    name_ru: string;
    address: string;
    address_ru: string;
    phone: string;
    email: string;
    work_hours: string;
    work_hours_ru: string;
    location_url: string;
    order: number;
    is_active: boolean;
}

const BranchesAdmin = () => {
    const { addToast } = useAdmin();
    const [items, setItems] = useState<BranchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [editing, setEditing] = useState<BranchItem | null>(null);
    const [form, setForm] = useState({
        name: '', name_ru: '',
        address: '', address_ru: '',
        phone: '', email: '',
        work_hours: '', work_hours_ru: '',
        location_url: '',
        is_active: true, order: 0
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<BranchItem[]>('/api/admin/branches');
            setItems(res);
        } catch (err) {
            console.error('Branches fetch error:', err);
            addToast('error', 'Filiallar ma\'lumotlarini yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const f = (k: keyof typeof form, v: string | boolean | number) => setForm(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        try {
            if (modal === 'add') {
                const res = await api.post<BranchItem>('/api/admin/branches', { ...form, order: items.length });
                setItems(p => [...p, res]);
                addToast('success', 'Filial qo\'shildi');
            } else if (editing) {
                const res = await api.put<BranchItem>(`/api/admin/branches/${editing.id}`, form);
                setItems(p => p.map(t => t.id === editing.id ? res : t));
                addToast('success', 'Filial yangilandi');
            }
            setModal(null);
        } catch (err) {
            addToast('error', 'Saqlashda xatolik');
        }
    };

    const handleDelete = async () => {
        if (!editing) return;
        try {
            await api.del(`/api/admin/branches/${editing.id}`);
            setItems(p => p.filter(t => t.id !== editing.id));
            addToast('info', 'Filial o\'chirildi');
            setModal(null);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik');
        }
    };

    const toggleActive = async (item: BranchItem) => {
        try {
            const res = await api.put<BranchItem>(`/api/admin/branches/${item.id}`, { is_active: !item.is_active });
            setItems(p => p.map(t => t.id === item.id ? { ...t, is_active: res.is_active } : t));
        } catch (err) {
            addToast('error', 'Holatni o\'zgartirishda xatolik');
        }
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Filiallar (Bog'lanish Joylari)</h2>
                    <p className="adm-text-sec">{items.length} ta filial, {items.filter(i => i.is_active).length} ta faol</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={() => {
                    setForm({
                        name: '', name_ru: '',
                        address: '', address_ru: '',
                        phone: '', email: '',
                        work_hours: '', work_hours_ru: '',
                        location_url: '',
                        is_active: true, order: 0
                    });
                    setModal('add');
                }}>+ Filial qo'shish</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
                {items.map((item, i) => (
                    <div key={item.id} className="adm-card" style={{ opacity: item.is_active ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--adm-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                                #{i + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--adm-text)', marginBottom: 4 }}>{item.name} / {item.name_ru}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-sec)', marginBottom: 8 }}>
                                    <svg style={{ verticalAlign: 'middle', marginRight: 4 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    {item.address}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                    {item.phone && <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>📞 {item.phone}</span>}
                                    {item.email && <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>✉ {item.email}</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                <label className="adm-toggle"><input type="checkbox" checked={item.is_active} onChange={() => toggleActive(item)} /><span className="adm-toggle-slider" /></label>
                                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => {
                                    setEditing(item);
                                    setForm({
                                        name: item.name, name_ru: item.name_ru,
                                        address: item.address, address_ru: item.address_ru,
                                        phone: item.phone, email: item.email,
                                        work_hours: item.work_hours, work_hours_ru: item.work_hours_ru,
                                        location_url: item.location_url,
                                        is_active: item.is_active, order: item.order
                                    });
                                    setModal('edit');
                                }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => { setEditing(item); setModal('delete'); }}>✕</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal" style={{ maxWidth: 650 }}>
                        <div className="adm-modal-header">
                            <div className="adm-modal-title">{modal === 'add' ? 'Yangi filial qo\'shish' : 'Filialni tahrirlash'}</div>
                            <button className="adm-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="adm-modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="adm-field">
                                    <label className="adm-label">Filial nomi (UZ) *</label>
                                    <input className="adm-input" value={form.name} onChange={e => f('name', e.target.value)} placeholder="Masalan: Chilonzor filiali" />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Filial nomi (RU)</label>
                                    <input className="adm-input" value={form.name_ru} onChange={e => f('name_ru', e.target.value)} placeholder="Например: Чиланзарский филиал" />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="adm-field">
                                    <label className="adm-label">Manzil (UZ) *</label>
                                    <input className="adm-input" value={form.address} onChange={e => f('address', e.target.value)} placeholder="To'liq manzil..." />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Manzil (RU)</label>
                                    <input className="adm-input" value={form.address_ru} onChange={e => f('address_ru', e.target.value)} placeholder="Полный адрес..." />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="adm-field">
                                    <label className="adm-label">Telefon</label>
                                    <input className="adm-input" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+998 90 ..." />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Email</label>
                                    <input className="adm-input" type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="filial@con-dor.uz" />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="adm-field">
                                    <label className="adm-label">Ish vaqti (UZ)</label>
                                    <input className="adm-input" value={form.work_hours} onChange={e => f('work_hours', e.target.value)} placeholder="09:00 - 18:00" />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Ish vaqti (RU)</label>
                                    <input className="adm-input" value={form.work_hours_ru} onChange={e => f('work_hours_ru', e.target.value)} placeholder="09:00 - 18:00" />
                                </div>
                            </div>

                            <div className="adm-field">
                                <label className="adm-label">Xarita havolasi (Map Iframe src / URL)</label>
                                <textarea className="adm-textarea" value={form.location_url} onChange={e => f('location_url', e.target.value)} placeholder="Google/Yandex Maps iframe 'src' qismini yoki havolasini qo'ying" rows={3} />
                                <p style={{ fontSize: '0.7rem', color: 'var(--adm-text-sec)', marginTop: 4 }}>Maslahat: Google Maps'dan 'Share' → 'Embed map' tugmasini bosib 'src' ichidagi havolani oling.</p>
                            </div>

                            <div className="adm-field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <label className="adm-toggle"><input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} /><span className="adm-toggle-slider" /></label>
                                <span className="adm-text-sec">Ko'rinish holati (Faol)</span>
                            </div>
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor qilish</button>
                            <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={!form.name || !form.address}>Ma'lumotlarni saqlash</button>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'delete' && editing && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <div className="adm-modal-header"><div className="adm-modal-title" style={{ color: 'var(--adm-red)' }}>⚠ Filialni o'chirish</div><button className="adm-modal-close" onClick={() => setModal(null)}>✕</button></div>
                        <div className="adm-modal-body"><p style={{ fontSize: '0.9rem', color: 'var(--adm-text-sec)' }}>"{editing.name}" filialini o'chirib yubormoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.</p></div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button>
                            <button className="adm-btn adm-btn-danger" onClick={handleDelete}>Ha, o'chirilsin</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchesAdmin;
