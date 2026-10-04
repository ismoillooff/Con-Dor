import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

// ─── Types ───
interface SubCategory {
    id: number;
    name: string;
    name_ru: string;
    slug: string;
    is_active: boolean;
    order: number;
    category_id?: number;
}

interface Category {
    id: number;
    name: string;
    name_ru: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    is_active: boolean;
    order: number;
    image: string | null;
    section_id?: number;
    subcategories: SubCategory[];
}

interface Section {
    id: number;
    name: string;
    name_ru: string;
    slug: string;
    is_active: boolean;
    order: number;
    categories: Category[];
}

type ModalType = 'add-sec' | 'edit-sec' | 'del-sec' | 'add-cat' | 'edit-cat' | 'del-cat' | 'add-sub' | 'edit-sub' | 'del-sub' | null;

const emptySec = { name: '', name_ru: '', slug: '', order: 0, is_active: true };
const emptyCat = { name: '', name_ru: '', slug: '', icon: '📦', description: '', color: '#c8102e', order: 0, is_active: true, section_id: 0, image: null as string | null };
const emptySub = { name: '', name_ru: '', slug: '', order: 0, is_active: true, category_id: 0 };

// ─── Main Component ───
const NavbarAdmin = () => {
    const { addToast } = useAdmin();
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Modal state
    const [modal, setModal] = useState<ModalType>(null);
    const [activeItem, setActiveItem] = useState<{ sec?: Section, cat?: Category, sub?: SubCategory } | null>(null);
    const [form, setForm] = useState<any>({});

    const fetchData = useCallback(async (isInitial = false) => {
        setLoading(true);
        try {
            const res = await api.get<Section[]>('/api/admin/sections');
            setSections(res);
            if (isInitial && res.length > 0) setExpandedId(res[0].id);
        } catch (err) {
            console.error('Hierarchy fetch error:', err);
            addToast('error', 'Strukturani yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData(true);
    }, [fetchData]);

    const f = (k: string, v: any) => {
        setForm((p: any) => {
            const newForm = { ...p, [k]: v };
            // Auto-slug: if changing 'name' and 'slug' is empty or was previously auto-generated from old name
            if (k === 'name' && (!p.slug || p.slug === p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))) {
                newForm.slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            }
            return newForm;
        });
    };

    // ─── Handlers ───
    const openModal = (type: ModalType, item?: any, parentId?: number) => {
        setModal(type);
        if (type?.startsWith('add-sec')) {
            setForm(emptySec);
        } else if (type?.startsWith('edit-sec')) {
            setForm({ name: item.name, name_ru: item.name_ru || '', slug: item.slug, order: item.order, is_active: item.is_active });
            setActiveItem({ sec: item });
        } else if (type?.startsWith('add-cat')) {
            setForm({ ...emptyCat, section_id: parentId });
        } else if (type?.startsWith('edit-cat')) {
            setForm({
                name: item.name, name_ru: item.name_ru || '', slug: item.slug, icon: item.icon, description: item.description,
                color: item.color, order: item.order, is_active: item.is_active, section_id: parentId
            });
            setActiveItem({ cat: item });
        } else if (type?.startsWith('add-sub')) {
            setForm({ ...emptySub, category_id: parentId });
        } else if (type?.startsWith('edit-sub')) {
            setForm({ name: item.name, name_ru: item.name_ru || '', slug: item.slug, order: item.order, is_active: item.is_active, category_id: parentId });
            setActiveItem({ sub: item });
        } else if (type?.startsWith('del-')) {
            setActiveItem(item);
        }
    };

    const handleSave = async () => {
        try {
            let res: any;
            const dataToSave = { ...form };

            // Handle image for category if it's a new upload or change
            if ((modal === 'add-cat' || modal === 'edit-cat') && form.imageFile) {
                const formData = new FormData();
                formData.append('file', form.imageFile);
                const uploadRes = await api.upload<{ url: string }>('/api/upload/image', formData);
                dataToSave.image = uploadRes.url;
                delete dataToSave.imageFile;
                delete dataToSave.imagePreview;
            }

            if (modal === 'add-sec') {
                res = await api.post<Section>('/api/admin/sections', dataToSave);
                setSections(p => [...p, { ...res, categories: [] }]);
                addToast('success', 'Bo\'lim qo\'shildi');
            } else if (modal === 'edit-sec' && activeItem?.sec) {
                res = await api.put<Section>(`/api/admin/sections/${activeItem.sec.id}`, dataToSave);
                setSections(p => p.map(s => s.id === res.id ? { ...s, ...res } : s));
                addToast('success', 'Bo\'lim yangilandi');
            } else if (modal === 'add-cat') {
                res = await api.post<Category>('/api/admin/categories', dataToSave);
                setSections(p => p.map(s => s.id === form.section_id
                    ? { ...s, categories: [...s.categories, { ...res, subcategories: [] }].sort((a, b) => (a.order || 0) - (b.order || 0)) }
                    : s
                ));
                addToast('success', 'Kategoriya qo\'shildi');
            } else if (modal === 'edit-cat' && activeItem?.cat) {
                res = await api.put<Category>(`/api/admin/categories/${activeItem.cat.id}`, dataToSave);
                setSections(p => p.map(s => ({
                    ...s,
                    categories: s.categories.map(c => c.id === res.id ? { ...c, ...res } : c).sort((a, b) => (a.order || 0) - (b.order || 0))
                })));
                addToast('success', 'Kategoriya yangilandi');
            } else if (modal === 'add-sub') {
                res = await api.post<SubCategory>('/api/admin/subcategories', dataToSave);
                setSections(p => p.map(s => ({
                    ...s,
                    categories: s.categories.map(c => c.id === form.category_id
                        ? { ...c, subcategories: [...c.subcategories, res].sort((a, b) => (a.order || 0) - (b.order || 0)) }
                        : c
                    )
                })));
                addToast('success', 'Sub-kategoriya qo\'shildi');
            } else if (modal === 'edit-sub' && activeItem?.sub) {
                res = await api.put<SubCategory>(`/api/admin/subcategories/${activeItem.sub.id}`, dataToSave);
                setSections(p => p.map(s => ({
                    ...s,
                    categories: s.categories.map(c => ({
                        ...c,
                        subcategories: c.subcategories.map(sub => sub.id === res.id ? res : sub).sort((a, b) => (a.order || 0) - (b.order || 0))
                    }))
                })));
                addToast('success', 'Sub-kategoriya yangilandi');
            }
            setModal(null);
        } catch (err: any) {
            console.error('Save error:', err);
            addToast('error', err.detail || err.message || 'Xatolik yuz berdi');
        }
    };

    const handleDelete = async () => {
        try {
            if (modal === 'del-sec' && activeItem?.sec) {
                await api.del(`/api/admin/sections/${activeItem.sec.id}`);
                setSections(p => p.filter(s => s.id !== activeItem.sec?.id));
            } else if (modal === 'del-cat' && activeItem?.cat) {
                await api.del(`/api/admin/categories/${activeItem.cat.id}`);
                setSections(p => p.map(s => ({ ...s, categories: s.categories.filter(c => c.id !== activeItem.cat?.id) })));
            } else if (modal === 'del-sub' && activeItem?.sub) {
                await api.del(`/api/admin/subcategories/${activeItem.sub.id}`);
                setSections(p => p.map(s => ({
                    ...s,
                    categories: s.categories.map(c => ({ ...c, subcategories: c.subcategories.filter(sub => sub.id !== activeItem.sub?.id) }))
                })));
            }
            addToast('info', 'O\'chirildi');
            setModal(null);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik');
        }
    };

    const filteredSections = useMemo(() => {
        if (!search) return sections;
        const low = search.toLowerCase();
        return sections.map(sec => {
            const matchesSec = sec.name.toLowerCase().includes(low);
            const filteredCats = sec.categories.filter(cat =>
                cat.name.toLowerCase().includes(low) ||
                cat.subcategories.some(sub => sub.name.toLowerCase().includes(low))
            );
            if (matchesSec || filteredCats.length > 0) {
                return { ...sec, categories: filteredCats.length > 0 ? filteredCats : sec.categories };
            }
            return null;
        }).filter(Boolean) as Section[];
    }, [sections, search]);

    const stats = useMemo(() => {
        let cats = 0, subs = 0;
        sections.forEach(s => {
            cats += s.categories.length;
            s.categories.forEach(c => subs += c.subcategories.length);
        });
        return { secs: sections.length, cats, subs };
    }, [sections]);

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div style={{ paddingBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #edf2f7' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Navigatsiya va Katalog</h2>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.8rem', color: 'var(--adm-text-sec)' }}>
                        <span><b>{stats.secs}</b> Bo'lim</span>
                        <span><b>{stats.cats}</b> Kategoriya</span>
                        <span><b>{stats.subs}</b> Sub-kategoriya</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            className="adm-input"
                            style={{ paddingLeft: 36, width: 220, height: 38, fontSize: '0.85rem' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-text-muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </div>
                    <button className="adm-btn adm-btn-primary" style={{ padding: '0 16px', height: 38 }} onClick={() => openModal('add-sec')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Yangi bo'lim
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredSections.map((sec: Section) => {
                    const isExpanded = expandedId === sec.id;
                    const totalSub = sec.categories.reduce((acc: number, c: Category) => acc + c.subcategories.length, 0);

                    return (
                        <div key={sec.id} className="adm-cat-card" style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                            <div className="adm-cat-header" style={{ background: '#f8fafc', padding: '16px 20px', borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none' }} onClick={() => setExpandedId(isExpanded ? null : sec.id)}>
                                <div className="adm-cat-title">
                                    <div className={`dot${sec.is_active ? '' : ' off'}`} style={{ width: 8, height: 8 }} />
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.01em' }}>{sec.name}</span>
                                    <span style={{ fontSize: '0.75rem', background: '#edf2f7', color: '#4a5568', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                                        {sec.categories.length} kat / {totalSub} sub
                                    </span>
                                </div>
                                <div className="adm-cat-controls" onClick={e => e.stopPropagation()}>
                                    <label className="adm-toggle">
                                        <input type="checkbox" checked={sec.is_active} onChange={async (e) => {
                                            const newVal = e.target.checked;
                                            try {
                                                await api.put(`/api/admin/sections/${sec.id}`, { is_active: newVal });
                                                setSections(p => p.map(s => s.id === sec.id ? { ...s, is_active: newVal } : s));
                                            } catch (err) { addToast('error', 'Holatni yangilashda xatolik'); }
                                        }} />
                                        <span className="adm-toggle-slider" />
                                    </label>
                                    <button className="adm-btn adm-btn-ghost adm-btn-icon" style={{ background: '#fff', border: '1px solid #e2e8f0' }} onClick={() => openModal('edit-sec', sec)}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    </button>
                                    <button className="adm-btn adm-btn-danger adm-btn-icon" onClick={() => openModal('del-sec', { sec })}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                    </button>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s', color: '#a0aec0', marginLeft: 8 }}>
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="adm-cat-body">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                                        {sec.categories.map((cat: Category) => (
                                            <div key={cat.id} className="adm-card" style={{
                                                padding: '16px 20px',
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: 12,
                                                transition: '0.2s',
                                                position: 'relative',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>{cat.icon || '📦'}</span>
                                                        <span style={{ fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.02em', color: '#1a202c', textTransform: 'uppercase' }}>{cat.name}</span>
                                                        <button
                                                            className="adm-btn adm-btn-ghost"
                                                            style={{
                                                                width: 22, height: 22, padding: 0,
                                                                borderRadius: '50%', border: '1px solid var(--adm-accent)',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                color: 'var(--adm-accent)', background: 'white',
                                                                boxShadow: '0 2px 4px rgba(200, 16, 46, 0.1)'
                                                            }}
                                                            onClick={(e) => { e.stopPropagation(); openModal('add-sub', null, cat.id); }}
                                                            title="Sub-kategoriya qo'shish"
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                        </button>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <label className="adm-toggle">
                                                            <input type="checkbox" checked={cat.is_active} onChange={async (e) => {
                                                                const newVal = e.target.checked;
                                                                try {
                                                                    await api.put(`/api/admin/categories/${cat.id}`, { is_active: newVal });
                                                                    setSections(p => p.map(s => ({
                                                                        ...s,
                                                                        categories: s.categories.map(c => c.id === cat.id ? { ...c, is_active: newVal } : c)
                                                                    })));
                                                                } catch (err) { addToast('error', 'Holatni yangilashda xatolik'); }
                                                            }} />
                                                            <span className="adm-toggle-slider" style={{ width: 44, height: 22 }} />
                                                        </label>
                                                        <button
                                                            className="adm-btn adm-btn-ghost adm-btn-icon"
                                                            style={{ width: 28, height: 28, background: '#fff', border: '1px solid #edf2f7' }}
                                                            onClick={() => openModal('edit-cat', cat, sec.id)}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                        </button>
                                                        <button
                                                            className="adm-btn adm-btn-danger adm-btn-icon"
                                                            style={{ width: 28, height: 28 }}
                                                            onClick={() => openModal('del-cat', { cat })}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                                                    {cat.subcategories.map((sub: SubCategory) => (
                                                        <div
                                                            key={sub.id}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                                                                background: sub.is_active ? 'rgba(200, 16, 46, 0.06)' : 'var(--adm-bg)',
                                                                border: `1px solid ${sub.is_active ? 'rgba(200, 16, 46, 0.15)' : 'var(--adm-border)'}`,
                                                                borderRadius: 20, fontSize: '0.78rem',
                                                                color: sub.is_active ? 'var(--adm-accent)' : 'var(--adm-text-sec)',
                                                                cursor: 'pointer',
                                                                transition: '0.2s',
                                                                userSelect: 'none'
                                                            }}
                                                            onClick={async (e) => {
                                                                // If clicking an icon/button, don't toggle
                                                                if ((e.target as HTMLElement).closest('button')) return;

                                                                const newVal = !sub.is_active;
                                                                try {
                                                                    await api.put(`/api/admin/subcategories/${sub.id}`, { is_active: newVal });
                                                                    setSections(p => p.map(s => ({
                                                                        ...s,
                                                                        categories: s.categories.map(c => ({
                                                                            ...c,
                                                                            subcategories: c.subcategories.map(item => item.id === sub.id ? { ...item, is_active: newVal } : item)
                                                                        }))
                                                                    })));
                                                                } catch (err) { addToast('error', 'Holatni yangilashda xatolik'); }
                                                            }}
                                                        >
                                                            <div style={{
                                                                width: 6, height: 6, borderRadius: '50%',
                                                                background: sub.is_active ? 'var(--adm-accent)' : '#ccc',
                                                                transition: 'background 0.2s'
                                                            }} />
                                                            <span style={{ fontWeight: 500 }}>{sub.name}</span>
                                                            <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
                                                                <button
                                                                    style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: 'inherit', opacity: 0.4, display: 'flex' }}
                                                                    onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                                                                    onMouseOut={(e) => (e.currentTarget.style.opacity = '0.4')}
                                                                    onClick={() => openModal('edit-sub', sub, cat.id)}
                                                                >
                                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                                </button>
                                                                <button
                                                                    style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: 'inherit', opacity: 0.4, display: 'flex' }}
                                                                    onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                                                                    onMouseOut={(e) => (e.currentTarget.style.opacity = '0.4')}
                                                                    onClick={() => openModal('del-sub', { sub })}
                                                                >
                                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        className="adm-btn adm-btn-ghost"
                                                        style={{
                                                            width: 26, height: 26, padding: 0,
                                                            borderRadius: '50%', border: '1px solid var(--adm-accent)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--adm-accent)', background: 'white',
                                                            boxShadow: '0 2px 5px rgba(200, 16, 46, 0.1)'
                                                        }}
                                                        onClick={() => openModal('add-sub', null, cat.id)}
                                                        title="Yangi sub-kategoriya"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                    </button>
                                                </div>

                                                {cat.image && (
                                                    <div style={{ borderRadius: 6, overflow: 'hidden', height: 60, marginTop: 'auto' }}>
                                                        <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button className="adm-btn adm-btn-ghost" style={{ border: '2px dashed var(--adm-border)', height: '100%', minHeight: 120, display: 'flex', flexDirection: 'column', gap: 8 }} onClick={() => openModal('add-cat', null, sec.id)}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                            <span style={{ fontSize: '0.8rem' }}>Yangi kategoriya</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* General Info */}
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(59,130,246,0.05)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.1)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-sec)', margin: 0 }}>
                    <strong>Boshqaruv:</strong> Ushbu sahifa orqali barcha ierarxiya (Bo'lim → Kategoriya → Sub-kategoriya) to'liq boshqariladi. Yangi rasm qo'shish yoki batafsil mahsulotlarni ko'rish uchun "Kategoriyalar" sahifasiga o'ting.
                </p>
            </div>

            {/* MODALS */}
            {modal && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="adm-modal" style={{ maxWidth: modal.startsWith('del') ? 400 : 500 }}>
                        <div className="adm-modal-header">
                            <h3 className="adm-modal-title">
                                {modal === 'add-sec' && 'Yangi Bo\'lim'}
                                {modal === 'edit-sec' && 'Bo\'limni Tahrirlash'}
                                {modal === 'add-cat' && 'Yangi Kategoriya'}
                                {modal === 'edit-cat' && 'Kategoriyani Tahrirlash'}
                                {modal === 'add-sub' && 'Yangi Sub-kategoriya'}
                                {modal === 'edit-sub' && 'Sub-kategoriyani Tahrirlash'}
                                {modal.startsWith('del') && 'O\'chirishni Tasdiqlang'}
                            </h3>
                            <button className="adm-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>

                        <div className="adm-modal-body">
                            {modal.startsWith('del') ? (
                                <p style={{ fontSize: '0.9rem', color: 'var(--adm-text-sec)' }}>
                                    Haqiqatdan ham <strong style={{ color: 'var(--adm-text)' }}>"{(activeItem?.sec || activeItem?.cat || activeItem?.sub)?.name}"</strong> ni o'chirib tashlamoqchimisiz?
                                    {modal !== 'del-sub' && <><br /><small style={{ color: 'var(--adm-red)', display: 'block', marginTop: 8 }}>Barcha ichki elementlar ham o'chib ketishi mumkin.</small></>}
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div className="adm-field">
                                        <label className="adm-label">Nomi (UZ) *</label>
                                        <input className="adm-input" value={form.name || ''} onChange={e => f('name', e.target.value)} placeholder="O'zbekcha nomi..." />
                                    </div>
                                    <div className="adm-field">
                                        <label className="adm-label">Nomi (RU) *</label>
                                        <input className="adm-input" value={form.name_ru || ''} onChange={e => f('name_ru', e.target.value)} placeholder="Русское название..." />
                                    </div>
                                    <div className="adm-field">
                                        <label className="adm-label">Slug (URL) *</label>
                                        <input className="adm-input" value={form.slug || ''} onChange={e => f('slug', e.target.value)} placeholder="alias..." />
                                    </div>

                                    {(modal === 'add-cat' || modal === 'edit-cat') && (
                                        <div className="adm-field">
                                            <label className="adm-label">Rasm</label>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                {(form.imagePreview || form.image) && (
                                                    <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--adm-border)' }}>
                                                        <img src={form.imagePreview || form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => f('imagePreview', reader.result);
                                                        reader.readAsDataURL(file);
                                                        f('imageFile', file);
                                                    }
                                                }} style={{ fontSize: '0.8rem' }} />
                                            </div>
                                        </div>
                                    )}

                                    {(modal === 'add-cat' || modal === 'edit-cat') && (
                                        <div className="adm-grid-2">
                                            <div className="adm-field">
                                                <label className="adm-label">Ikonka</label>
                                                <input className="adm-input" value={form.icon || '📦'} onChange={e => f('icon', e.target.value)} />
                                            </div>
                                            <div className="adm-field">
                                                <label className="adm-label">Rang</label>
                                                <input className="adm-input" type="color" value={form.color || '#c8102e'} onChange={e => f('color', e.target.value)} style={{ padding: 2, height: 38 }} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="adm-grid-2">
                                        <div className="adm-field">
                                            <label className="adm-label">Tartib</label>
                                            <input className="adm-input" type="number" value={form.order || 0} onChange={e => f('order', parseInt(e.target.value))} />
                                        </div>
                                        <div className="adm-field" style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: 'center', paddingTop: 20 }}>
                                            <label className="adm-toggle">
                                                <input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} />
                                                <span className="adm-toggle-slider" />
                                            </label>
                                            <span style={{ fontSize: '0.85rem' }}>Faol</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button>
                            {modal.startsWith('del') ? (
                                <button className="adm-btn adm-btn-danger" onClick={handleDelete}>O'chirish</button>
                            ) : (
                                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={!form.name || !form.name_ru || !form.slug}>
                                    Saqlash
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavbarAdmin;
