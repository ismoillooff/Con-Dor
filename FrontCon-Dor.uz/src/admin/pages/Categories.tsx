import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface Category {
    id: number;
    name: string;
    name_ru: string;
    slug: string;
    icon: string;
    description: string;
    color: string;
    is_active: boolean;
    order: number;
    section_id: number;
    section_name: string;
    product_count: number;
}

interface Section {
    id: number;
    name: string;
}

const emptyForm = { name: '', name_ru: '', slug: '', icon: '📦', description: '', color: '#c8102e', is_active: true, section_id: 0 };

const Categories = () => {
    const { addToast } = useAdmin();
    const [categories, setCategories] = useState<Category[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState(emptyForm);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [catRes, secRes] = await Promise.all([
                api.get<Category[]>('/api/admin/categories'),
                api.get<Section[]>('/api/admin/sections')
            ]);
            setCategories(catRes);
            setSections(secRes);
        } catch (err) {
            console.error('Categories fetch error:', err);
            addToast('error', 'Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const f = (k: keyof typeof emptyForm, v: string | boolean | number) => setForm(p => ({ ...p, [k]: v }));

    const openAdd = () => {
        setForm({ ...emptyForm, section_id: sections[0]?.id || 0 });
        setModal('add');
    };
    const openEdit = (c: Category) => {
        setEditing(c);
        setForm({
            name: c.name,
            name_ru: c.name_ru || '',
            slug: c.slug,
            icon: c.icon || '📦',
            description: c.description || '',
            color: c.color || '#c8102e',
            is_active: c.is_active,
            section_id: c.section_id
        });
        setModal('edit');
    };
    const openDelete = (c: Category) => { setEditing(c); setModal('delete'); };

    const handleAdd = async () => {
        try {
            const res = await api.post<Category>('/api/admin/categories', form);
            setCategories(p => [...p, res]);
            setModal(null);
            addToast('success', `"${form.name}" kategoriya qo'shildi`);
        } catch (err) {
            addToast('error', 'Saqlashda xatolik yuz berdi');
        }
    };

    const handleEdit = async () => {
        if (!editing) return;
        try {
            const res = await api.put<Category>(`/api/admin/categories/${editing.id}`, form);
            setCategories(p => p.map(c => c.id === editing.id ? res : c));
            setModal(null);
            addToast('success', `"${form.name}" yangilandi`);
        } catch (err) {
            addToast('error', 'Yangilashda xatolik yuz berdi');
        }
    };

    const handleDelete = async () => {
        if (!editing) return;
        try {
            await api.del(`/api/admin/categories/${editing.id}`);
            setCategories(p => p.filter(c => c.id !== editing.id));
            setModal(null);
            addToast('info', `"${editing.name}" o'chirildi`);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik yuz berdi');
        }
    };

    const toggleActive = async (c: Category) => {
        try {
            const res = await api.put<Category>(`/api/admin/categories/${c.id}`, { is_active: !c.is_active });
            setCategories(p => p.map(item => item.id === c.id ? res : item));
        } catch (err) {
            addToast('error', 'Holatni o\'zgartirib bo\'lmadi');
        }
    };

    return (
        <div className={loading ? 'adm-skeleton-container' : ''}>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Kategoriyalar</h2>
                    <p className="adm-text-sec">Jami {categories.length} ta kategoriya</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={openAdd} disabled={sections.length === 0}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Kategoriya qo'shish
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {categories.map((cat) => (
                    <div key={cat.id} className="adm-card" style={{ opacity: cat.is_active ? 1 : 0.5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.is_active ? 'var(--adm-green)' : 'var(--adm-text-muted)', flexShrink: 0 }} />
                            <div style={{
                                width: 44, height: 44, borderRadius: 10,
                                background: (cat.color || '#555') + '22', border: `1px solid ${cat.color || '#555'}44`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.4rem', flexShrink: 0
                            }} title="Navbar iconlari tizim tomonidan o'rnatilgan">
                                {cat.icon || '📦'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--adm-text)', marginBottom: 2 }}>{cat.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>{cat.section_name} · /category/{cat.slug} · {cat.product_count} mahsulot</div>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--adm-text-sec)', maxWidth: 200, flex: 1 }}>{cat.description}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <label className="adm-toggle"><input type="checkbox" checked={cat.is_active} onChange={() => toggleActive(cat)} /><span className="adm-toggle-slider" /></label>
                                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => openEdit(cat)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => openDelete(cat)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && !loading && (
                    <div className="adm-empty">Ma'lumot topilmadi</div>
                )}
            </div>

            {/* Modal */}
            {(modal === 'add' || modal === 'edit') && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal">
                        <div className="adm-modal-header">
                            <div className="adm-modal-title">{modal === 'add' ? 'Kategoriya qo\'shish' : 'Kategoriyani tahrirlash'}</div>
                            <button className="adm-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="adm-modal-body">
                            <div className="adm-field">
                                <label className="adm-label">Nomi (UZ) *</label>
                                <input className="adm-input" placeholder="Kategoriya nomi" value={form.name} onChange={e => f('name', e.target.value)} />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Nomi (RU) *</label>
                                <input className="adm-input" placeholder="Название категории" value={form.name_ru} onChange={e => f('name_ru', e.target.value)} />
                            </div>
                            <div className="adm-grid-2">
                                <div className="adm-field">
                                    <label className="adm-label">Slug *</label>
                                    <input className="adm-input" placeholder="kiyimlar" value={form.slug} onChange={e => f('slug', e.target.value)} />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Ikonka (Tizimda fiksirlangan)</label>
                                    <div className="adm-input" style={{ background: 'var(--adm-bg-alt)', cursor: 'default', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span>{form.icon || '📦'}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>(Navbarda statik icon ko'rinadi)</span>
                                    </div>
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Bo'lim (Section) *</label>
                                    <select className="adm-select" style={{ width: '100%' }} value={form.section_id} onChange={e => f('section_id', parseInt(e.target.value))}>
                                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Rang</label>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input type="color" value={form.color} onChange={e => f('color', e.target.value)} style={{ width: 44, height: 36, border: '1px solid var(--adm-border)', borderRadius: 6, padding: 2, cursor: 'pointer', background: 'var(--adm-bg-alt)' }} />
                                        <input className="adm-input" value={form.color} onChange={e => f('color', e.target.value)} style={{ flex: 1 }} />
                                    </div>
                                </div>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Tavsif</label>
                                <textarea className="adm-input" style={{ minHeight: 60, resize: 'vertical' }} placeholder="Kategoriya tavsifi" value={form.description} onChange={e => f('description', e.target.value)} />
                            </div>
                            <div className="adm-field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <label className="adm-toggle"><input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} /><span className="adm-toggle-slider" /></label>
                                <span className="adm-text-sec">Faol</span>
                            </div>
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button>
                            <button className="adm-btn adm-btn-primary" onClick={modal === 'add' ? handleAdd : handleEdit} disabled={!form.name || !form.name_ru || !form.slug || !form.section_id}>{modal === 'add' ? 'Qo\'shish' : 'Saqlash'}</button>
                        </div>
                    </div>
                </div>
            )}
            {modal === 'delete' && editing && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <div className="adm-modal-header"><div className="adm-modal-title" style={{ color: 'var(--adm-red)' }}>⚠ O'chirish</div><button className="adm-modal-close" onClick={() => setModal(null)}>✕</button></div>
                        <div className="adm-modal-body"><p style={{ color: 'var(--adm-text-sec)', fontSize: '0.9rem' }}><strong style={{ color: 'var(--adm-text)' }}>"{editing.name}"</strong> kategoriyasini o'chirmoqchimisiz?</p></div>
                        <div className="adm-modal-footer"><button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button><button className="adm-btn adm-btn-danger" onClick={handleDelete}>O'chirish</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
