import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

// This page is the legacy "Settings" slot in the sidebar.
// It delegates entirely to the real API-backed SiteSettings endpoint.
// No hardcoded defaults, no localStorage, no mock state.

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

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="adm-card adm-mb-20">
        <div className="adm-card-header"><div className="adm-card-title">{title}</div></div>
        {children}
    </div>
);

const Settings = () => {
    const { addToast } = useAdmin();
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<SiteSettings>('/api/admin/settings');
            setSettings(res);
        } catch (err) {
            console.error('Settings fetch error:', err);
            setError("Sozlamalarni yuklashda xatolik yuz berdi.");
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
            addToast('error', 'Saqlashda xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    const update = (k: keyof SiteSettings, v: string | number) => {
        setSettings(p => p ? { ...p, [k]: v } : null);
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    if (error || !settings) {
        return (
            <div className="adm-empty" style={{ minHeight: 300 }}>
                <div className="adm-empty-title" style={{ color: 'var(--adm-red)' }}>Xatolik!</div>
                <div className="adm-empty-sub">{error || 'Sozlamalar yuklanmadi.'}</div>
                <button className="adm-btn adm-btn-primary" onClick={fetchData} style={{ marginTop: 20 }}>
                    Qayta urinish
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Sozlamalar</h2>
                    <p className="adm-text-sec">Do'kon asosiy ma'lumotlari va konfiguratsiyasi</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
            </div>

            <Block title="🏪 Do'kon Ma'lumotlari">
                <div className="adm-grid-2">
                    <div className="adm-field"><label className="adm-label">Do'kon nomi</label><input className="adm-input" value={settings.shop_name} onChange={e => update('shop_name', e.target.value)} /></div>
                    <div className="adm-field"><label className="adm-label">Tagline</label><input className="adm-input" value={settings.tagline} onChange={e => update('tagline', e.target.value)} /></div>
                    <div className="adm-field"><label className="adm-label">Valyuta</label><input className="adm-input" value={settings.currency} onChange={e => update('currency', e.target.value)} /></div>
                    <div className="adm-field">
                        <label className="adm-label">Bepul yetkazish chegarasi</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input className="adm-input" type="number" value={settings.free_shipping_threshold} onChange={e => update('free_shipping_threshold', Number(e.target.value))} />
                            <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem' }}>{settings.currency}</span>
                        </div>
                    </div>
                </div>
            </Block>

            <Block title="📞 Aloqa Ma'lumotlari">
                <div className="adm-grid-2">
                    <div className="adm-field"><label className="adm-label">Telefon</label><input className="adm-input" value={settings.phone} onChange={e => update('phone', e.target.value)} /></div>
                    <div className="adm-field"><label className="adm-label">Email</label><input className="adm-input" type="email" value={settings.email} onChange={e => update('email', e.target.value)} /></div>
                    <div className="adm-field" style={{ gridColumn: '1/-1' }}><label className="adm-label">Manzil</label><input className="adm-input" value={settings.address} onChange={e => update('address', e.target.value)} /></div>
                    <div className="adm-field"><label className="adm-label">Dushanba-Juma soati</label><input className="adm-input" value={settings.workday_hours} onChange={e => update('workday_hours', e.target.value)} /></div>
                    <div className="adm-field"><label className="adm-label">Shanba soati</label><input className="adm-input" value={settings.saturday_hours} onChange={e => update('saturday_hours', e.target.value)} /></div>
                </div>
            </Block>

            <Block title="📱 Ijtimoiy Tarmoqlar">
                <div className="adm-grid-2">
                    <div className="adm-field"><label className="adm-label">Instagram</label><input className="adm-input" type="url" value={settings.instagram_url} onChange={e => update('instagram_url', e.target.value)} /></div>
                    <div className="adm-field"><label className="adm-label">Facebook</label><input className="adm-input" type="url" value={settings.facebook_url} onChange={e => update('facebook_url', e.target.value)} /></div>
                    <div className="adm-field"><label className="adm-label">Telegram Public Link</label><input className="adm-input" type="url" value={settings.telegram_url} onChange={e => update('telegram_url', e.target.value)} /></div>
                </div>
            </Block>

            <Block title="🔍 SEO va Legal">
                <div className="adm-field"><label className="adm-label">SEO Sarlavha</label><input className="adm-input" value={settings.seo_title} onChange={e => update('seo_title', e.target.value)} /></div>
                <div className="adm-field"><label className="adm-label">SEO Tavsif</label><textarea className="adm-textarea" value={settings.seo_description} onChange={e => update('seo_description', e.target.value)} style={{ minHeight: 70 }} /></div>
                <div className="adm-field"><label className="adm-label">Copyright matn</label><input className="adm-input" value={settings.copyright_text} onChange={e => update('copyright_text', e.target.value)} /></div>
            </Block>
        </div>
    );
};

export default Settings;
