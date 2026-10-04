import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface TelegramSettings {
    telegram_bot_token: string;
    telegram_channel_id: string;
    telegram_url: string;
}

const TelegramSettingsAdmin = () => {
    const { addToast } = useAdmin();
    const [settings, setSettings] = useState<TelegramSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<any>('/api/admin/settings');
            setSettings({
                telegram_bot_token: res.telegram_bot_token || '',
                telegram_channel_id: res.telegram_channel_id || '',
                telegram_url: res.telegram_url || ''
            });
        } catch (err) {
            console.error('Telegram Settings fetch error:', err);
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
            addToast('success', 'Telegram sozlamalari saqlandi');
        } catch (err) {
            addToast('error', 'Saqlashda xatolik');
        } finally {
            setSaving(false);
        }
    };

    const handleTestConnection = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            // First save the settings to ensure we test with the latest inputs
            await api.put('/api/admin/settings', settings);
            const res = await api.post<any>('/api/admin/settings/test-telegram', {});
            addToast('success', res.detail || 'Test xabari yuborildi!');
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'Telegram xatosi. Token yoki Kanal ID noto\'g\'ri.';
            addToast('error', msg);
        } finally {
            setSaving(false);
        }
    };

    const update = (k: keyof TelegramSettings, v: string) => {
        setSettings(p => p ? { ...p, [k]: v } : null);
    };

    if (loading || !settings) return <div className="adm-skeleton-container" style={{ height: 300 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>
                        Telegram Sozlamalari
                    </h2>
                    <p className="adm-text-sec">Buyurtmalar haqida xabar yuborish uchun bot va kanal sozlamalari</p>
                </div>
                <div className="adm-flex adm-gap-10">
                    <button
                        className="adm-btn adm-btn-outline"
                        onClick={handleTestConnection}
                        disabled={saving}
                        style={{ borderColor: 'var(--adm-accent)', color: 'var(--adm-accent)' }}
                    >
                        {saving ? '...' : 'Aloqani tekshirish'}
                    </button>
                    <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </div>
            </div>

            <div className="adm-card">
                <div className="adm-card-header">
                    <div className="adm-card-title">🤖 Bot va Kanal Ma'lumotlari</div>
                </div>
                <div style={{ padding: '20px' }}>
                    <div className="adm-field">
                        <label className="adm-label">Telegram Bot Token</label>
                        <input
                            className="adm-input"
                            type="password"
                            placeholder="7123456789:ABCDefgh-IJKLmnop..."
                            value={settings.telegram_bot_token}
                            onChange={e => update('telegram_bot_token', e.target.value)}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: 6 }}>
                            @BotFather orqali olingan token
                        </div>
                    </div>

                    <div className="adm-field" style={{ marginTop: 20 }}>
                        <label className="adm-label">Telegram Kanal ID</label>
                        <input
                            className="adm-input"
                            placeholder="-100123456789"
                            value={settings.telegram_channel_id}
                            onChange={e => update('telegram_channel_id', e.target.value)}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: 6 }}>
                            Kanal ID si (masalan: -100...) yoki public kanal username (@kanali)
                        </div>
                    </div>

                    <div className="adm-field" style={{ marginTop: 20 }}>
                        <label className="adm-label">Telegram Public Link (Havola)</label>
                        <input
                            className="adm-input"
                            placeholder="https://t.me/your_channel"
                            value={settings.telegram_url}
                            onChange={e => update('telegram_url', e.target.value)}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: 6 }}>
                            Saytning footer va bog'lanish sahifasida ko'rinadigan havola
                        </div>
                    </div>

                    <div style={{ marginTop: 25, padding: 15, background: 'rgba(200, 16, 46, 0.05)', borderRadius: 8, borderLeft: '3px solid var(--adm-accent)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--adm-text)', fontWeight: 600, marginBottom: 5 }}>ℹ️ Muhim eslatma</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-sec)', lineHeight: 1.5 }}>
                            Bot xabar yubora olishi uchun uni kanalga <b>admin</b> qilib qo'shishingiz va xabar yuborish huquqini berishingiz shart.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelegramSettingsAdmin;
