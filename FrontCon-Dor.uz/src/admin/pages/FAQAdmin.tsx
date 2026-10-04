import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}

const FAQ = () => {
    const { addToast } = useAdmin();
    const [items, setItems] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [editing, setEditing] = useState<FAQItem | null>(null);
    const [form, setForm] = useState({ question: '', answer: '', is_active: true, order: 0 });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<FAQItem[]>('/api/admin/faq');
            setItems(res);
        } catch (err) {
            console.error('FAQ fetch error:', err);
            addToast('error', 'FAQ ma\'lumotlarini yuklashda xatolik');
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
                const res = await api.post<FAQItem>('/api/admin/faq', { ...form, order: items.length });
                setItems(p => [...p, res]);
                addToast('success', 'Savol qo\'shildi');
            } else if (editing) {
                const res = await api.put<FAQItem>(`/api/admin/faq/${editing.id}`, form);
                setItems(p => p.map(t => t.id === editing.id ? res : t));
                addToast('success', 'Savol yangilandi');
            }
            setModal(null);
        } catch (err) {
            addToast('error', 'Saqlashda xatolik');
        }
    };

    const handleDelete = async () => {
        if (!editing) return;
        try {
            await api.del(`/api/admin/faq/${editing.id}`);
            setItems(p => p.filter(t => t.id !== editing.id));
            addToast('info', 'Savol o\'chirildi');
            setModal(null);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik');
        }
    };

    const toggleActive = async (item: FAQItem) => {
        try {
            const res = await api.put<FAQItem>(`/api/admin/faq/${item.id}`, { is_active: !item.is_active });
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
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>FAQ - Ko'p Beriladigan Savollar</h2>
                    <p className="adm-text-sec">{items.length} ta savol, {items.filter(i => i.is_active).length} ta faol</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={() => { setForm({ question: '', answer: '', is_active: true, order: 0 }); setModal('add'); }}>+ Savol qo'shish</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((item, i) => (
                    <div key={item.id} className="adm-card" style={{ opacity: item.is_active ? 1 : 0.5 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--adm-accent-light)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                                {i + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--adm-text)', marginBottom: 6 }}>{item.question}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-sec)', lineHeight: 1.5 }}>{item.answer}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                <label className="adm-toggle"><input type="checkbox" checked={item.is_active} onChange={() => toggleActive(item)} /><span className="adm-toggle-slider" /></label>
                                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => { setEditing(item); setForm({ question: item.question, answer: item.answer, is_active: item.is_active, order: item.order }); setModal('edit'); }}>
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
                    <div className="adm-modal">
                        <div className="adm-modal-header"><div className="adm-modal-title">{modal === 'add' ? 'Savol qo\'shish' : 'Savolni tahrirlash'}</div><button className="adm-modal-close" onClick={() => setModal(null)}>✕</button></div>
                        <div className="adm-modal-body">
                            <div className="adm-field"><label className="adm-label">Savol *</label><input className="adm-input" placeholder="Savol matni..." value={form.question} onChange={e => f('question', e.target.value)} /></div>
                            <div className="adm-field"><label className="adm-label">Javob *</label><textarea className="adm-textarea" placeholder="Javob matni..." value={form.answer} onChange={e => f('answer', e.target.value)} /></div>
                            <div className="adm-field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <label className="adm-toggle"><input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} /><span className="adm-toggle-slider" /></label>
                                <span className="adm-text-sec">Faol</span>
                            </div>
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button>
                            <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={!form.question || !form.answer}>Saqlash</button>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'delete' && editing && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <div className="adm-modal-header"><div className="adm-modal-title" style={{ color: 'var(--adm-red)' }}>⚠ O'chirish</div><button className="adm-modal-close" onClick={() => setModal(null)}>✕</button></div>
                        <div className="adm-modal-body"><p style={{ fontSize: '0.9rem', color: 'var(--adm-text-sec)' }}>Ushbu savolni o'chirib yubormoqchimisiz?</p></div>
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

export default FAQ;
