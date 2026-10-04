import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface SiteSettings {
    shop_name: string;
    tagline: string;
    currency: string;
    free_shipping_threshold: number;
    phone: string;
    email: string;
    address: string;
    workday_hours: string;
    saturday_hours: string;
    instagram_url: string;
    facebook_url: string;
    telegram_url: string;
    seo_title: string;
    seo_description: string;
    copyright_text: string;
}

const SiteSettingsAdmin = () => {
    const { addToast } = useAdmin();
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<SiteSettings>('/api/admin/settings');
            setSettings(res);
        } catch (err) {
            console.error('Settings fetch error:', err);
            addToast('error', 'Sozlamalarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            await api.put('/api/admin/settings', settings);
            addToast('success', 'Sozlamalar saqlandi');
        } catch (err) {
            addToast('error', 'Saqlashda xatolik');
        } finally {
            setSaving(false);
        }
    };

    const update = (k: keyof SiteSettings, v: string | number) => {
        setSettings(p => p ? { ...p, [k]: v } : null);
    };

    if (loading || !settings) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>
                        Sayt Sozlamalari
                    </h2>
                    <p className="adm-text-sec">Do'kon va sayt parametrlarini boshqaring</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saqlanmoqda...' : 'Barchasini saqlash'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* General */}
                <div className="adm-card">
                    <div className="adm-card-header"><div className="adm-card-title">⚙️ Asosiy Ma'lumotlar</div></div>
                    <div className="adm-grid-2">
                        <div className="adm-field">
                            <label className="adm-label">Do'kon nomi</label>
                            <input className="adm-input" value={settings.shop_name} onChange={e => update('shop_name', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Shior (Tagline)</label>
                            <input className="adm-input" value={settings.tagline} onChange={e => update('tagline', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Email</label>
                            <input className="adm-input" type="email" value={settings.email} onChange={e => update('email', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Telefon</label>
                            <input className="adm-input" value={settings.phone} onChange={e => update('phone', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Manzil</label>
                            <input className="adm-input" value={settings.address} onChange={e => update('address', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Valyuta</label>
                            <input className="adm-input" value={settings.currency} onChange={e => update('currency', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Hours */}
                <div className="adm-card">
                    <div className="adm-card-header"><div className="adm-card-title">🕒 Ish vaqti</div></div>
                    <div className="adm-grid-2">
                        <div className="adm-field">
                            <label className="adm-label">Ish kunlari (Dush-Jum)</label>
                            <input className="adm-input" value={settings.workday_hours} onChange={e => update('workday_hours', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Shanba</label>
                            <input className="adm-input" value={settings.saturday_hours} onChange={e => update('saturday_hours', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* SEO */}
                <div className="adm-card">
                    <div className="adm-card-header"><div className="adm-card-title">🔍 SEO va Legal</div></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div className="adm-field">
                            <label className="adm-label">SEO Sarlavha</label>
                            <input className="adm-input" value={settings.seo_title} onChange={e => update('seo_title', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">SEO Tavsif</label>
                            <textarea className="adm-textarea" value={settings.seo_description} onChange={e => update('seo_description', e.target.value)} style={{ minHeight: 70 }} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Copyright Matni</label>
                            <input className="adm-input" value={settings.copyright_text} onChange={e => update('copyright_text', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Social */}
                <div className="adm-card">
                    <div className="adm-card-header"><div className="adm-card-title">📱 Ijtimoiy Tarmoqlar</div></div>
                    <div className="adm-grid-2">
                        <div className="adm-field">
                            <label className="adm-label">Instagram URL</label>
                            <input className="adm-input" type="url" value={settings.instagram_url} onChange={e => update('instagram_url', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Facebook URL</label>
                            <input className="adm-input" type="url" value={settings.facebook_url} onChange={e => update('facebook_url', e.target.value)} />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Telegram URL</label>
                            <input className="adm-input" type="url" value={settings.telegram_url} onChange={e => update('telegram_url', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Shipping */}
                <div className="adm-card">
                    <div className="adm-card-header"><div className="adm-card-title">🚚 Yetkazib Berish</div></div>
                    <div className="adm-field">
                        <label className="adm-label">Bepul yetkazish chegarasi (Valyutada):</label>
                        <input className="adm-input" type="number" value={settings.free_shipping_threshold} onChange={e => update('free_shipping_threshold', Number(e.target.value))} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: 4 }}>Ushbu summadan yuqori buyurtmalar bepul yetkaziladi</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteSettingsAdmin;
