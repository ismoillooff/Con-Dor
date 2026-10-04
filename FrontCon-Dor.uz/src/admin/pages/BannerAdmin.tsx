import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface Banner {
    id: number;
    label: string;
    title: string;
    description: string;
    cta1_text: string;
    cta1_link: string;
    cta2_text: string;
    cta2_link: string;
    is_active: boolean;
    image: string | null;
}

const PromoBannerAdmin = () => {
    const { addToast } = useAdmin();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<Banner[]>('/api/admin/banners');
            setBanners(res);
        } catch (err) {
            console.error('Banners fetch error:', err);
            addToast('error', 'Bannerlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (id: number, field: keyof Banner, value: string | boolean) => {
        setBanners(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const handleSave = async (id: number) => {
        const banner = banners.find(b => b.id === id);
        if (!banner) return;
        setSaving(true);
        try {
            await api.put(`/api/admin/banners/${id}`, banner);
            addToast('success', 'Banner saqlandi');
        } catch (err) {
            addToast('error', 'Saqlashda xatolik');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Promo Bannerlar</h2>
                    <p className="adm-text-sec">Sahifadagi promo bannerlar mazmunini boshqaring</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {banners.map(banner => (
                    <div key={banner.id} className="adm-grid-2" style={{ gap: 20 }}>
                        <div className="adm-card">
                            <div className="adm-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="adm-card-title">Banner #{banner.id} Sozlamalari</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <label className="adm-toggle">
                                        <input type="checkbox" checked={banner.is_active} onChange={e => handleChange(banner.id, 'is_active', e.target.checked)} />
                                        <span className="adm-toggle-slider" />
                                    </label>
                                    <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => handleSave(banner.id)} disabled={saving}>
                                        {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                                    </button>
                                </div>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Yuqori label</label>
                                <input className="adm-input" value={banner.label} onChange={e => handleChange(banner.id, 'label', e.target.value)} />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Sarlavha</label>
                                <textarea className="adm-textarea" style={{ minHeight: 60 }} value={banner.title} onChange={e => handleChange(banner.id, 'title', e.target.value)} />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Tavsif</label>
                                <textarea className="adm-textarea" value={banner.description} onChange={e => handleChange(banner.id, 'description', e.target.value)} />
                            </div>
                            <div className="adm-grid-2">
                                <div className="adm-field">
                                    <label className="adm-label">CTA 1 Matni</label>
                                    <input className="adm-input" value={banner.cta1_text} onChange={e => handleChange(banner.id, 'cta1_text', e.target.value)} />
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">CTA 1 Linki</label>
                                    <input className="adm-input" value={banner.cta1_link} onChange={e => handleChange(banner.id, 'cta1_link', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="adm-card">
                            <div className="adm-card-header"><div className="adm-card-title">Ko'rinish (Preview)</div></div>
                            <div style={{
                                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                                borderRadius: 8, padding: '28px 24px', position: 'relative', overflow: 'hidden',
                                opacity: banner.is_active ? 1 : 0.6
                            }}>
                                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(200,16,46,0.15)', pointerEvents: 'none' }} />
                                <div style={{ fontSize: '0.65rem', letterSpacing: 2, color: 'var(--adm-accent-light)', fontWeight: 600, marginBottom: 10 }}>{banner.label}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: 10, lineHeight: 1.2, whiteSpace: 'pre-line' }}>{banner.title}</div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 14 }}>{banner.description}</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <span style={{ background: 'linear-gradient(135deg,#c8102e,#a00d24)', color: 'white', padding: '7px 14px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600 }}>{banner.cta1_text}</span>
                                    <span style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '7px 14px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600 }}>{banner.cta2_text || 'Batafsil'}</span>
                                </div>
                            </div>
                            <div className="adm-mt-20">
                                <label className="adm-label">Rasm URL</label>
                                <input className="adm-input" value={banner.image || ''} onChange={e => handleChange(banner.id, 'image', e.target.value)} placeholder="https://api.con-dor.uz/media/..." />
                            </div>
                        </div>
                    </div>
                ))}
                {banners.length === 0 && !loading && (
                    <div className="adm-empty">Bannerlar topilmadi</div>
                )}
            </div>
        </div>
    );
};

export default PromoBannerAdmin;
