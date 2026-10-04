import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface Image {
    id?: number;
    image: string;
    is_primary: boolean;
    file?: File;
    preview?: string;
}

interface SubCategory {
    id: number;
    name: string;
    name_ru: string;
}

interface Category {
    id: number;
    name: string;
    name_ru: string;
    subcategories: SubCategory[];
}

interface Section {
    id: number;
    name: string;
    name_ru: string;
    categories: Category[];
}

interface ProductEditorProps {
    productId?: number;
    onBack: () => void;
}

const ProductEditor = ({ productId, onBack }: ProductEditorProps) => {
    const { addToast } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeLang, setActiveLang] = useState<'uz' | 'ru'>('uz');

    // Data for dropdowns
    const [sections, setSections] = useState<Section[]>([]);

    // Form state
    const [form, setForm] = useState({
        name: '',
        name_ru: '',
        description: '',
        description_ru: '',
        price: '',
        old_price: '',
        badge: '',
        badge_ru: '',
        color: '',
        color_ru: '',
        sub: '',
        sub_ru: '',
        is_active: true,
        is_featured: false,
        subcategory_id: 0,
        sizes: [] as string[],
        colors: [] as string[]
    });

    const [tempSize, setTempSize] = useState('');
    const [tempColor, setTempColor] = useState('');

    // Tiered selection state
    const [selectedSectionId, setSelectedSectionId] = useState<number>(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

    // Images state
    const [images, setImages] = useState<Image[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch hierarchy
            const hierarchy = await api.get<Section[]>('/api/admin/sections?include_all=true');
            setSections(hierarchy);

            if (productId) {
                // Fetch product details for edit
                const product = await api.get<any>(`/api/admin/products/${productId}`);
                setForm({
                    name: product.name || '',
                    name_ru: product.name_ru || '',
                    description: product.description || '',
                    description_ru: product.description_ru || '',
                    price: String(product.price),
                    old_price: product.old_price ? String(product.old_price) : '',
                    badge: product.badge || '',
                    badge_ru: product.badge_ru || '',
                    color: product.color || '',
                    color_ru: product.color_ru || '',
                    sub: product.sub || '',
                    sub_ru: product.sub_ru || '',
                    is_active: product.is_active,
                    is_featured: product.is_featured || false,
                    subcategory_id: product.subcategory_id,
                    sizes: product.sizes || [],
                    colors: product.colors || []
                });
                setImages(product.images.map((img: any) => ({ ...img, preview: img.image })));

                // Find and set section and category for tiered selection
                for (const s of hierarchy) {
                    for (const c of s.categories) {
                        if (c.subcategories.find(sub => sub.id === product.subcategory_id)) {
                            setSelectedSectionId(s.id);
                            setSelectedCategoryId(c.id);
                            break;
                        }
                    }
                }
            } else {
                // Set defaults for new product
                if (hierarchy.length > 0 && hierarchy[0].categories.length > 0 && hierarchy[0].categories[0].subcategories.length > 0) {
                    setSelectedSectionId(hierarchy[0].id);
                    setSelectedCategoryId(hierarchy[0].categories[0].id);
                    setForm(f => ({ ...f, subcategory_id: hierarchy[0].categories[0].subcategories[0].id }));
                }
            }
        } catch (err) {
            console.error('Editor fetch error:', err);
            addToast('error', 'Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [productId, addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        if (!form.name || !form.name_ru || !form.price || !form.subcategory_id) {
            addToast('error', 'Iltimos, barcha majburiy maydonlarni (nomi, narxi, kategoriya) to\'ldiring');
            return;
        }

        setSaving(true);
        try {
            const productData = {
                ...form,
                price: parseFloat(form.price),
                old_price: form.old_price ? parseFloat(form.old_price) : null
            };

            let savedProduct;
            if (productId) {
                savedProduct = await api.put<any>(`/api/admin/products/${productId}`, productData);
            } else {
                savedProduct = await api.post<any>('/api/admin/products', productData);
            }

            const pid = savedProduct.id;

            // Handle images (only new ones)
            const newImages = images.filter(img => img.file);
            let uploadErrors = 0;
            for (const img of newImages) {
                try {
                    const fd = new FormData();
                    fd.append('file', img.file!, img.file!.name);
                    fd.append('is_primary', img.is_primary ? 'true' : 'false');
                    await api.upload(`/api/admin/products/${pid}/images`, fd);
                } catch (imgErr: any) {
                    console.error('Image upload error:', imgErr);
                    uploadErrors++;
                }
            }

            if (uploadErrors > 0) {
                addToast('error', `${uploadErrors} ta rasmni yuklashda xatolik`);
            }

            addToast('success', productId ? 'Mahsulot yangilandi' : 'Yangi mahsulot qo\'shildi');
            onBack();
        } catch (err: any) {
            console.error('Save error:', err);
            addToast('error', err?.message || 'Saqlashda xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImages = files.map(file => ({
                image: '',
                is_primary: images.length === 0,
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = async (index: number) => {
        const img = images[index];
        if (img.id) {
            try {
                await api.del(`/api/admin/products/${productId}/images/${img.id}`);
            } catch (err) {
                addToast('error', 'Rasmni o\'chirishda xatolik');
                return;
            }
        }
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const setPrimaryImage = (index: number) => {
        setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === index })));
    };

    const addTag = (type: 'sizes' | 'colors') => {
        const val = type === 'sizes' ? tempSize : tempColor;
        if (!val) return;
        if (form[type].includes(val)) return;
        setForm(f => ({ ...f, [type]: [...f[type], val] }));
        if (type === 'sizes') setTempSize(''); else setTempColor('');
    };

    const removeTag = (type: 'sizes' | 'colors', val: string) => {
        setForm(f => ({ ...f, [type]: f[type].filter(t => t !== val) }));
    };

    const currentSection = sections.find(s => s.id === selectedSectionId);
    const currentCategory = currentSection?.categories.find(c => c.id === selectedCategoryId);

    if (loading) return <div className="adm-skeleton-container" style={{ height: '80vh' }} />;

    return (
        <div className="adm-editor-container adm-fade-in">
            <div className="adm-editor-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={onBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 className="adm-editor-title">{productId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}</h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-sec)' }}>ID: {productId || 'Yangi'}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="adm-btn adm-btn-ghost" onClick={onBack}>Bekor qilish</button>
                    <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saqlanmoqda...' : 'Saqlash va yakunlash'}
                    </button>
                </div>
            </div>

            <div className="adm-editor-grid">
                {/* Left Column: Basic Info & Categorization */}
                <div className="adm-editor-main">

                    {/* Language Tabs */}
                    <div className="adm-tabs" style={{ marginBottom: 20 }}>
                        <button className={`adm-tab ${activeLang === 'uz' ? 'active' : ''}`} onClick={() => setActiveLang('uz')}>O'zbekcha (UZ)</button>
                        <button className={`adm-tab ${activeLang === 'ru' ? 'active' : ''}`} onClick={() => setActiveLang('ru')}>Русский (RU)</button>
                    </div>

                    <div className="adm-card adm-mb-20">
                        <h3 className="adm-card-title">Asosiy ma'lumotlar ({activeLang.toUpperCase()})</h3>

                        {activeLang === 'uz' ? (
                            <>
                                <div className="adm-field">
                                    <label className="adm-label">Mahsulot nomi (UZ) *</label>
                                    <input
                                        className="adm-input"
                                        style={{ fontSize: '1.05rem', fontWeight: 600 }}
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="Masalan: Taktik shim 5.11"
                                    />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Batafsil tavsif (UZ)</label>
                                    <textarea
                                        className="adm-input"
                                        style={{ minHeight: 180, lineHeight: 1.6 }}
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Mahsulot haqida batafsil ma'lumot..."
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="adm-field">
                                    <label className="adm-label">Mahsulot nomi (RU) *</label>
                                    <input
                                        className="adm-input"
                                        style={{ fontSize: '1.05rem', fontWeight: 600 }}
                                        value={form.name_ru}
                                        onChange={e => setForm(f => ({ ...f, name_ru: e.target.value }))}
                                        placeholder="Название на русском..."
                                    />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Batafsil tavsif (RU)</label>
                                    <textarea
                                        className="adm-input"
                                        style={{ minHeight: 180, lineHeight: 1.6 }}
                                        value={form.description_ru}
                                        onChange={e => setForm(f => ({ ...f, description_ru: e.target.value }))}
                                        placeholder="Описание на русском..."
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="adm-card adm-mb-20">
                        <h3 className="adm-card-title">Ierarxiya va tanlov</h3>
                        <div className="adm-grid-3">
                            <div className="adm-field">
                                <label className="adm-label">Bo'lim (Section) *</label>
                                <select
                                    className="adm-select"
                                    value={selectedSectionId}
                                    onChange={e => {
                                        const sid = parseInt(e.target.value);
                                        setSelectedSectionId(sid);
                                        const sec = sections.find(s => s.id === sid);
                                        if (sec && sec.categories.length > 0) {
                                            setSelectedCategoryId(sec.categories[0].id);
                                            if (sec.categories[0].subcategories.length > 0) {
                                                setForm(f => ({ ...f, subcategory_id: sec.categories[0].subcategories[0].id }));
                                            }
                                        }
                                    }}
                                >
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.name_ru})</option>)}
                                </select>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Kategoriya *</label>
                                <select
                                    className="adm-select"
                                    value={selectedCategoryId}
                                    onChange={e => {
                                        const cid = parseInt(e.target.value);
                                        setSelectedCategoryId(cid);
                                        const cat = currentSection?.categories.find(c => c.id === cid);
                                        if (cat && cat.subcategories.length > 0) {
                                            setForm(f => ({ ...f, subcategory_id: cat.subcategories[0].id }));
                                        }
                                    }}
                                >
                                    {currentSection?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Sub-kategoriya *</label>
                                <select
                                    className="adm-select"
                                    value={form.subcategory_id}
                                    onChange={e => setForm(f => ({ ...f, subcategory_id: parseInt(e.target.value) }))}
                                >
                                    {currentCategory?.subcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="adm-card">
                        <h3 className="adm-card-title">Variantlar va Xususiyatlar</h3>

                        <div className="adm-grid-2">
                            {/* Sizes Tags */}
                            <div className="adm-field">
                                <label className="adm-label">O'lchamlar (Sizes)</label>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                    <input className="adm-input" value={tempSize} onChange={e => setTempSize(e.target.value)} placeholder="masalan: XL, 42, L" onKeyDown={e => e.key === 'Enter' && addTag('sizes')} />
                                    <button className="adm-btn adm-btn-primary" style={{ padding: '0 15px' }} onClick={() => addTag('sizes')}>+</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {form.sizes.map(s => (
                                        <span key={s} style={{ background: 'var(--adm-bg-alt)', padding: '4px 10px', borderRadius: 4, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--adm-border)' }}>
                                            {s} <button onClick={() => removeTag('sizes', s)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--adm-accent)' }}>✕</button>
                                        </span>
                                    ))}
                                    {form.sizes.length === 0 && <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.8rem' }}>Hali qo'shilmagan</span>}
                                </div>
                            </div>

                            {/* Colors Tags */}
                            <div className="adm-field">
                                <label className="adm-label">Ranglar (Colors - Variantlar)</label>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                    <input className="adm-input" value={tempColor} onChange={e => setTempColor(e.target.value)} placeholder="masalan: Qora, Yashil" onKeyDown={e => e.key === 'Enter' && addTag('colors')} />
                                    <button className="adm-btn adm-btn-primary" style={{ padding: '0 15px' }} onClick={() => addTag('colors')}>+</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {form.colors.map(c => (
                                        <span key={c} style={{ background: 'var(--adm-bg-alt)', padding: '4px 10px', borderRadius: 4, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--adm-border)' }}>
                                            {c} <button onClick={() => removeTag('colors', c)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--adm-accent)' }}>✕</button>
                                        </span>
                                    ))}
                                    {form.colors.length === 0 && <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.8rem' }}>Hali qo'shilmagan</span>}
                                </div>
                            </div>
                        </div>

                        <hr style={{ margin: '20px 0', opacity: 0.1 }} />

                        <div className="adm-grid-2">
                            <div className="adm-field">
                                <label className="adm-label">Brend / Liniya</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <input className="adm-input" value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))} placeholder="UZ (Bushpeak)" />
                                    <input className="adm-input" value={form.sub_ru} onChange={e => setForm(f => ({ ...f, sub_ru: e.target.value }))} placeholder="RU" />
                                </div>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Asosiy Rang (Text)</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <input className="adm-input" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="UZ (Tan)" />
                                    <input className="adm-input" value={form.color_ru} onChange={e => setForm(f => ({ ...f, color_ru: e.target.value }))} placeholder="RU" />
                                </div>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Badge</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <select className="adm-select" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                                        <option value="">Yo'q</option>
                                        <option value="YANGI">YANGI</option>
                                        <option value="SALE">SALE</option>
                                        <option value="HIT">HIT</option>
                                    </select>
                                    <input className="adm-input" value={form.badge_ru} onChange={e => setForm(f => ({ ...f, badge_ru: e.target.value }))} placeholder="RU Badge (masalan: НОВИНКА)" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 20, paddingTop: 30 }}>
                                <label className="adm-toggle-label">
                                    <label className="adm-toggle">
                                        <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                                        <span className="adm-toggle-slider" />
                                    </label>
                                    <span>Sotuvda faol</span>
                                </label>
                                <label className="adm-toggle-label">
                                    <label className="adm-toggle">
                                        <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                                        <span className="adm-toggle-slider" />
                                    </label>
                                    <span>Featured</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Images */}
                <div className="adm-editor-sidebar">
                    <div className="adm-card adm-mb-20">
                        <h3 className="adm-card-title">Narxlar</h3>
                        <div className="adm-field">
                            <label className="adm-label">Asosiy narx (so'm) *</label>
                            <div className="adm-input-group">
                                <input className="adm-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                                <span className="unit">so'm</span>
                            </div>
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Eski narx (so'm)</label>
                            <div className="adm-input-group">
                                <input className="adm-input" type="number" value={form.old_price} onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))} placeholder="0" />
                                <span className="unit">so'm</span>
                            </div>
                        </div>
                        {form.old_price && parseFloat(form.old_price) > parseFloat(form.price) && (
                            <div className="adm-discount-preview" style={{ background: 'var(--adm-red-bg)', color: 'var(--adm-red)', padding: '8px 12px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 700 }}>
                                Chegirma: <span>-{Math.round((1 - parseFloat(form.price) / parseFloat(form.old_price)) * 100)}%</span>
                            </div>
                        )}
                    </div>

                    <div className="adm-card">
                        <h3 className="adm-card-title">Rasmlar Galereyasi</h3>
                        <div className="adm-image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
                            {images.map((img, idx) => (
                                <div key={idx} className={`adm-image-item ${img.is_primary ? 'primary' : ''}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: img.is_primary ? '2px solid var(--adm-accent)' : '1px solid var(--adm-border)' }}>
                                    <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div className="actions" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, opacity: 0, transition: '0.2s' }}>
                                        <button onClick={() => setPrimaryImage(idx)} style={{ background: '#fff', border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer' }}>★</button>
                                        <button onClick={() => removeImage(idx)} style={{ background: 'var(--adm-accent)', color: '#fff', border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer' }}>✕</button>
                                    </div>
                                    {img.is_primary && <span style={{ position: 'absolute', top: 4, left: 4, background: 'var(--adm-accent)', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: 2 }}>ASOSIY</span>}
                                </div>
                            ))}
                            <label className="adm-image-upload-btn" style={{ aspectRatio: '1', border: '2px dashed var(--adm-border)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                <span style={{ fontSize: '10px', color: 'var(--adm-text-sec)' }}>Qo'shish</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .adm-image-item:hover .actions { opacity: 1 !important; }
                .adm-tabs { display: flex; border-bottom: 2px solid var(--adm-border); gap: 20px; }
                .adm-tab { padding: 10px 20px; font-weight: 700; font-size: 0.9rem; color: var(--adm-text-sec); border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.3s; margin-bottom: -2px; }
                .adm-tab.active { color: var(--adm-accent); border-bottom-color: var(--adm-accent); }
                .adm-info-box { padding: 10px; background: var(--adm-bg-alt); border-radius: 6px; font-size: 0.85rem; }
                .highlight { color: var(--adm-accent); fontWeight: 700; }
                .mt-10 { margin-top: 10px; }
            `}</style>
        </div>
    );
};

export default ProductEditor;
