import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    rating: number;
    text: string;
    date: string;
    is_active: boolean;
}

const emptyTest = { name: '', location: '', rating: 5, text: '', date: '', is_active: true };

const Testimonials = () => {
    const { addToast } = useAdmin();
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [form, setForm] = useState<typeof emptyTest>(emptyTest);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<Testimonial[]>('/api/admin/testimonials');
            setItems(res);
        } catch (err) {
            console.error('Testimonials fetch error:', err);
            addToast('error', 'Sharhlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const f = (k: keyof typeof emptyTest, v: string | boolean | number) => setForm(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        try {
            if (modal === 'add') {
                const res = await api.post<Testimonial>('/api/admin/testimonials', { ...form, date: form.date || new Date().toISOString().split('T')[0] });
                setItems(p => [...p, res]);
                addToast('success', 'Sharh qo\'shildi');
            } else if (editing) {
                const res = await api.put<Testimonial>(`/api/admin/testimonials/${editing.id}`, form);
                setItems(p => p.map(t => t.id === editing.id ? res : t));
                addToast('success', 'Sharh yangilandi');
            }
            setModal(null);
        } catch (err) {
            addToast('error', 'Saqlashda xatolik');
        }
    };

    const handleDelete = async () => {
        if (!editing) return;
        try {
            await api.del(`/api/admin/testimonials/${editing.id}`);
            setItems(p => p.filter(t => t.id !== editing.id));
            addToast('info', 'Sharh o\'chirildi');
            setModal(null);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik');
        }
    };

    const toggleActive = async (item: Testimonial) => {
        try {
            const res = await api.put<Testimonial>(`/api/admin/testimonials/${item.id}`, { is_active: !item.is_active });
            setItems(p => p.map(t => t.id === item.id ? { ...t, is_active: res.is_active } : t));
        } catch (err) {
            addToast('error', 'Xatolik yuz berdi');
        }
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Mijoz Sharhlari</h2>
                    <p className="adm-text-sec">Testimonials bo'limini boshqaring</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={() => { setForm(emptyTest); setModal('add'); }}>+ Sharh qo'shish</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                {items.map(item => (
                    <div key={item.id} className="adm-card" style={{ opacity: item.is_active ? 1 : 0.5 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--adm-accent),var(--adm-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>{item.name[0]}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.83rem', color: 'var(--adm-text)' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>{item.location} · {item.date}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <label className="adm-toggle"><input type="checkbox" checked={item.is_active} onChange={() => toggleActive(item)} /><span className="adm-toggle-slider" /></label>
                                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => { setEditing(item); setForm({ name: item.name, location: item.location, rating: item.rating, text: item.text, date: item.date, is_active: item.is_active }); setModal('edit'); }}>✎</button>
                                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => { setEditing(item); setModal('delete'); }}>✕</button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                            {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= item.rating ? '#f59e0b' : 'var(--adm-text-muted)', fontSize: '0.9rem' }}>★</span>)}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--adm-text-sec)', lineHeight: 1.5 }}>"{item.text}"</p>
                    </div>
                ))}
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal">
                        <div className="adm-modal-header"><div className="adm-modal-title">{modal === 'add' ? 'Sharh qo\'shish' : 'Sharhni tahrirlash'}</div><button className="adm-modal-close" onClick={() => setModal(null)}>✕</button></div>
                        <div className="adm-modal-body">
                            <div className="adm-grid-2">
                                <div className="adm-field"><label className="adm-label">Ism *</label><input className="adm-input" value={form.name} onChange={e => f('name', e.target.value)} /></div>
                                <div className="adm-field"><label className="adm-label">Shahar</label><input className="adm-input" value={form.location} onChange={e => f('location', e.target.value)} /></div>
                                <div className="adm-field"><label className="adm-label">Reyting</label><select className="adm-select" style={{ width: '100%' }} value={form.rating} onChange={e => f('rating', Number(e.target.value))}>{[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} yulduz</option>)}</select></div>
                                <div className="adm-field"><label className="adm-label">Sana</label><input className="adm-input" value={form.date} onChange={e => f('date', e.target.value)} placeholder="masalan: 2 hafta oldin" /></div>
                            </div>
                            <div className="adm-field"><label className="adm-label">Sharh matni *</label><textarea className="adm-textarea" value={form.text} onChange={e => f('text', e.target.value)} /></div>
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button>
                            <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={!form.name || !form.text}>Saqlash</button>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'delete' && editing && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <div className="adm-modal-header"><div className="adm-modal-title" style={{ color: 'var(--adm-red)' }}>⚠ O'chirish</div><button className="adm-modal-close" onClick={() => setModal(null)}>✕</button></div>
                        <div className="adm-modal-body"><p style={{ fontSize: '0.9rem', color: 'var(--adm-text-sec)' }}>Ushbu sharhni o'chirib yubormoqchimisiz?</p></div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button>
                            <button className="adm-btn adm-btn-danger" onClick={handleDelete}>O'chirish</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Testimonials;
