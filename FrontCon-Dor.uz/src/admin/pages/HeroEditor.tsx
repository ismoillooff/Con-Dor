import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface HeroEditorProps {
    slideId?: number;
    onBack: () => void;
}

const emptySlide = {
    title: '',
    title_ru: '',
    subtitle: '',
    subtitle_ru: '',
    cta1_text: 'Xarid qilish',
    cta1_text_ru: 'Купить',
    cta1_link: '#',
    cta2_text: "Ko'proq",
    cta2_text_ru: 'Больше',
    cta2_link: '#',
    badge: '',
    badge_ru: '',
    image: '',
    cta1_bg_color: '#ffffff',
    cta1_txt_color: '#111111',
    cta2_bg_color: 'transparent',
    cta2_txt_color: '#ffffff',
    text_align: 'left',
    overlay_color: '#000000',
    overlay_opacity: 0.6,
    animation_type: 'fade-up',
    order: 0,
    is_active: true,
    imageFile: null as File | null,
    imagePreview: ''
};

const HeroEditor = ({ slideId, onBack }: HeroEditorProps) => {
    const { addToast } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(emptySlide);
    const [activeLang, setActiveLang] = useState<'uz' | 'ru'>('uz');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (slideId) {
                const res = await api.get<any>(`/api/admin/hero-slides/${slideId}`);
                setForm({
                    ...emptySlide,
                    ...res,
                    title_ru: res.title_ru || '',
                    subtitle_ru: res.subtitle_ru || '',
                    cta1_text_ru: res.cta1_text_ru || '',
                    cta2_text_ru: res.cta2_text_ru || '',
                    badge_ru: res.badge_ru || '',
                    imagePreview: res.image || ''
                });
            }
        } catch (err) {
            console.error('Hero Editor fetch error:', err);
            addToast('error', 'Slayd ma\'lumotlarini yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [slideId, addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const f = (k: keyof typeof emptySlide, v: any) => setForm(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        if (!form.title || !form.title_ru) {
            addToast('error', 'Iltimos, sarlavhani ikkala tilda ham to\'ldiring');
            return;
        }

        setSaving(true);
        try {
            const dataToSave = { ...form };

            if (form.imageFile) {
                const formData = new FormData();
                formData.append('file', form.imageFile);
                const uploadRes = await api.upload<{ url: string }>('/api/upload/image', formData);
                dataToSave.image = uploadRes.url;
            }

            delete (dataToSave as any).imageFile;
            delete (dataToSave as any).imagePreview;

            if (slideId) {
                await api.put(`/api/admin/hero-slides/${slideId}`, dataToSave);
                addToast('success', 'Slayd yangilandi');
            } else {
                await api.post('/api/admin/hero-slides', dataToSave);
                addToast('success', 'Yangi slayd qo\'shildi');
            }
            onBack();
        } catch (err) {
            console.error('Hero Save error:', err);
            addToast('error', 'Saqlashda xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(p => ({
                    ...p,
                    imageFile: file,
                    imagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: '80vh' }} />;

    return (
        <div className="adm-editor-container adm-fade-in">
            <div className="adm-editor-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={onBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <h2 className="adm-editor-title">{slideId ? 'Slaydni tahrirlash' : 'Yangi slayd yaratish'}</h2>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="adm-btn adm-btn-ghost" onClick={onBack}>Bekor qilish</button>
                    <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saqlanmoqda...' : 'Slaydni saqlash'}
                    </button>
                </div>
            </div>

            <div className="adm-editor-grid hero-editor-layout">
                {/* Left Column: Form Controls */}
                <div className="adm-editor-main">

                    {/* Language Switcher */}
                    <div className="adm-tabs" style={{ marginBottom: 20 }}>
                        <button
                            className={`adm-tab ${activeLang === 'uz' ? 'active' : ''}`}
                            onClick={() => setActiveLang('uz')}
                        >
                            O'zbekcha (UZ)
                        </button>
                        <button
                            className={`adm-tab ${activeLang === 'ru' ? 'active' : ''}`}
                            onClick={() => setActiveLang('ru')}
                        >
                            Русский (RU)
                        </button>
                    </div>

                    <div className="adm-card adm-mb-20">
                        <h3 className="adm-card-title">Matnli mazmun ({activeLang === 'uz' ? 'O\'zbekcha' : 'Русский'})</h3>

                        {activeLang === 'uz' ? (
                            <>
                                <div className="adm-field">
                                    <label className="adm-label">Asosiy sarlavha (UZ) *</label>
                                    <textarea
                                        className="adm-input"
                                        value={form.title}
                                        onChange={e => f('title', e.target.value)}
                                        placeholder="Katta harflarda yozish tavsiya etiladi..."
                                        style={{ minHeight: 80, fontSize: '1.2rem', fontWeight: 800 }}
                                    />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Qisqa tavsif (UZ)</label>
                                    <textarea
                                        className="adm-input"
                                        value={form.subtitle}
                                        onChange={e => f('subtitle', e.target.value)}
                                        placeholder="Slaydning pastki qismidagi kichik matn..."
                                        style={{ minHeight: 100 }}
                                    />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Badge (UZ)</label>
                                    <input
                                        className="adm-input"
                                        value={form.badge}
                                        onChange={e => f('badge', e.target.value)}
                                        placeholder="Masalan: HARBIY DARAJADAGI SIFAT"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="adm-field">
                                    <label className="adm-label">Asosiy sarlavha (RU) *</label>
                                    <textarea
                                        className="adm-input"
                                        value={form.title_ru}
                                        onChange={e => f('title_ru', e.target.value)}
                                        placeholder="Заголовок на русском..."
                                        style={{ minHeight: 80, fontSize: '1.2rem', fontWeight: 800 }}
                                    />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Qisqa tavsif (RU)</label>
                                    <textarea
                                        className="adm-input"
                                        value={form.subtitle_ru}
                                        onChange={e => f('subtitle_ru', e.target.value)}
                                        placeholder="Описание на русском..."
                                        style={{ minHeight: 100 }}
                                    />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Badge (RU)</label>
                                    <input
                                        className="adm-input"
                                        value={form.badge_ru}
                                        onChange={e => f('badge_ru', e.target.value)}
                                        placeholder="Напр: КАЧЕСТВО ВОЕННОГО УРОВНЯ"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="adm-card adm-mb-20">
                        <h3 className="adm-card-title">Tugmalar (CTA)</h3>
                        <div className="adm-grid-2">
                            <div className="adm-field">
                                <label className="adm-label">1-tugma matni ({activeLang.toUpperCase()})</label>
                                <input
                                    className="adm-input"
                                    value={activeLang === 'uz' ? form.cta1_text : form.cta1_text_ru}
                                    onChange={e => f(activeLang === 'uz' ? 'cta1_text' : 'cta1_text_ru', e.target.value)}
                                />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">1-tugma havolasi</label>
                                <input className="adm-input" value={form.cta1_link} onChange={e => f('cta1_link', e.target.value)} />
                            </div>
                        </div>
                        <div className="adm-grid-2">
                            <div className="adm-field">
                                <label className="adm-label">2-tugma matni ({activeLang.toUpperCase()})</label>
                                <input
                                    className="adm-input"
                                    value={activeLang === 'uz' ? form.cta2_text : form.cta2_text_ru}
                                    onChange={e => f(activeLang === 'uz' ? 'cta2_text' : 'cta2_text_ru', e.target.value)}
                                />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">2-tugma havolasi</label>
                                <input className="adm-input" value={form.cta2_link} onChange={e => f('cta2_link', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="adm-card">
                        <h3 className="adm-card-title">Vizual Sozlamalar</h3>
                        <div className="adm-grid-2">
                            <div className="adm-field">
                                <label className="adm-label">Animatsiya turi</label>
                                <select className="adm-select" value={form.animation_type} onChange={e => f('animation_type', e.target.value)}>
                                    <option value="fade-up">Yuqoriga chiqish</option>
                                    <option value="slide-left">Chapdan kelish</option>
                                    <option value="zoom-in">Kattalashish</option>
                                    <option value="blur-in">Blur effektli</option>
                                </select>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Matn tekislash</label>
                                <select className="adm-select" value={form.text_align} onChange={e => f('text_align', e.target.value)}>
                                    <option value="left">Chapga</option>
                                    <option value="center">Markazga</option>
                                    <option value="right">O'ngga</option>
                                </select>
                            </div>
                        </div>
                        <div className="adm-grid-2">
                            <div className="adm-field">
                                <label className="adm-label">Tartib (Order)</label>
                                <input className="adm-input" type="number" value={form.order} onChange={e => f('order', parseInt(e.target.value))} />
                            </div>
                            <div className="adm-field" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 30 }}>
                                <label className="adm-toggle">
                                    <input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} />
                                    <span className="adm-toggle-slider" />
                                </label>
                                <span className="adm-label" style={{ marginBottom: 0 }}>Slayd faol</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview & Design */}
                <div className="adm-editor-sidebar">
                    <div className="adm-card adm-mb-20">
                        <h3 className="adm-card-title">Asosiy Rasm</h3>
                        <div
                            className="hero-image-preview-box"
                            style={{
                                height: 180,
                                background: form.imagePreview ? `url(${form.imagePreview}) center/cover` : '#222',
                                borderRadius: 10,
                                marginBottom: 15,
                                border: '1px solid var(--adm-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {!form.imagePreview && <span style={{ color: '#666', fontSize: '0.8rem' }}>Rasm tanlanmagan</span>}
                            <label className="image-overlay-btn" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s', cursor: 'pointer' }}>
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                <span>Almashtirish</span>
                            </label>
                        </div>
                        <label className="adm-btn adm-btn-secondary" style={{ width: '100%', marginBottom: 10, cursor: 'pointer' }}>
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            Rasm yuklash
                        </label>
                    </div>

                    <div className="adm-card adm-mb-20">
                        <h3 className="adm-card-title">Overlay & Ranglar</h3>
                        <div className="adm-field">
                            <label className="adm-label">Foni shaffofligi (Overlay)</label>
                            <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                                <input type="color" value={form.overlay_color} onChange={e => f('overlay_color', e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
                                <input type="range" min="0" max="1" step="0.1" value={form.overlay_opacity} onChange={e => f('overlay_opacity', parseFloat(e.target.value))} style={{ flex: 1 }} />
                                <span style={{ fontSize: '0.9rem', width: 35 }}>{Math.round(form.overlay_opacity * 100)}%</span>
                            </div>
                        </div>
                        <div className="adm-grid-2">
                            <div className="adm-field">
                                <label className="adm-label">1-tugma rangi</label>
                                <input type="color" value={form.cta1_bg_color} onChange={e => f('cta1_bg_color', e.target.value)} style={{ width: '100%', height: 35, border: 'none', borderRadius: 4 }} />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">2-tugma rangi</label>
                                <input type="color" value={form.cta2_bg_color === 'transparent' ? '#000000' : form.cta2_bg_color} onChange={e => f('cta2_bg_color', e.target.value)} style={{ width: '100%', height: 35, border: 'none', borderRadius: 4 }} />
                            </div>
                        </div>
                    </div>

                    <div className="adm-card" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
                        <h3 className="adm-card-title" style={{ color: '#f8fafc' }}>Interaktiv Preview</h3>
                        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 8, overflow: 'hidden', background: form.imagePreview ? `url(${form.imagePreview}) center/cover` : '#334155' }}>
                            <div style={{ position: 'absolute', inset: 0, background: form.overlay_color, opacity: form.overlay_opacity }}></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '10%', justifyContent: 'center', alignItems: form.text_align === 'center' ? 'center' : form.text_align === 'right' ? 'flex-end' : 'flex-start', textAlign: form.text_align as any }}>
                                {(activeLang === 'uz' ? form.badge : form.badge_ru) && (
                                    <span style={{ fontSize: '0.6rem', padding: '2px 8px', background: 'var(--adm-accent)', color: '#fff', borderRadius: 4, marginBottom: 8 }}>{activeLang === 'uz' ? form.badge : form.badge_ru}</span>
                                )}
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8, whiteSpace: 'pre-line' }}>{activeLang === 'uz' ? (form.title || 'PREMIUM TITLE') : (form.title_ru || 'ПРЕМИУМ ТИТУЛ')}</div>
                                <div style={{ fontSize: '0.6rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: 12, maxWidth: '80%' }}>{activeLang === 'uz' ? (form.subtitle || 'Bu yerda asosiy sarlavha ostidagi kichik matn ko\'rinadi...') : (form.subtitle_ru || 'Тут будет краткое описание...')}</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <div style={{ padding: '4px 12px', background: form.cta1_bg_color, color: form.cta1_txt_color, fontSize: '0.5rem', borderRadius: 4, fontWeight: 700 }}>{activeLang === 'uz' ? form.cta1_text : form.cta1_text_ru}</div>
                                    <div style={{ padding: '4px 12px', border: '1px solid rgba(255,255,255,0.4)', color: form.cta2_txt_color, fontSize: '0.5rem', borderRadius: 4, fontWeight: 700 }}>{activeLang === 'uz' ? form.cta2_text : form.cta2_text_ru}</div>
                                </div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 15, textAlign: 'center' }}>
                            Ushbu oyna foydalanuvchilar ekranida qanday ko'rinishini taxminiy ko'rsatadi.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .hero-image-preview-box:hover .image-overlay-btn { opacity: 1 !important; }
                .hero-editor-layout { align-items: flex-start; }
                .adm-tabs { display: flex; border-bottom: 2px solid var(--adm-border); gap: 20px; }
                .adm-tab { padding: 10px 20px; font-weight: 700; font-size: 0.9rem; color: var(--adm-text-sec); border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.3s; margin-bottom: -2px; }
                .adm-tab.active { color: var(--adm-accent); border-bottom-color: var(--adm-accent); }
                .adm-tab:hover { color: var(--adm-text); }
            `}</style>
        </div>
    );
};

export default HeroEditor;
