import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface Partner {
    id: number;
    name: string;
    logo: string | null;
    website: string;
    order: number;
    is_active: boolean;
}

const Partners = () => {
    const { addToast } = useAdmin();
    const [brands, setBrands] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<Partner[]>('/api/admin/partners');
            setBrands(res);
        } catch (err) {
            console.error('Partners fetch error:', err);
            addToast('error', 'Hamkorlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = async () => {
        if (!newName) return;
        setSaving(true);
        try {
            const res = await api.post<Partner>('/api/admin/partners', {
                name: newName,
                is_active: true,
                order: brands.length
            });
            setBrands(p => [...p, res]);
            setNewName('');
            addToast('success', `"${newName}" hamkor qo'shildi`);
        } catch (err) {
            addToast('error', 'Qo\'shishda xatolik');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (brand: Partner) => {
        try {
            await api.put(`/api/admin/partners/${brand.id}`, { is_active: !brand.is_active });
            setBrands(p => p.map(b => b.id === brand.id ? { ...b, is_active: !b.is_active } : b));
        } catch (err) {
            addToast('error', 'Xatolik yuz berdi');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.del(`/api/admin/partners/${id}`);
            setBrands(p => p.filter(b => b.id !== id));
            addToast('info', 'Hamkor o\'chirildi');
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik');
        }
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Hamkorlar & Brendlar</h2>
                    <p className="adm-text-sec">To'lov va yetkazish hamkorlari marque qatori</p>
                </div>
            </div>

            <div className="adm-card adm-mb-20">
                <div className="adm-card-header"><div className="adm-card-title">Yangi hamkor qo'shish</div></div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="adm-field" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="adm-label">Brend nomi</label>
                        <input className="adm-input" placeholder="brend nomi..." value={newName} onChange={e => setNewName(e.target.value)} />
                    </div>
                    <button className="adm-btn adm-btn-primary" onClick={handleAdd} disabled={!newName || saving}>
                        {saving ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {brands.map(brand => (
                    <div key={brand.id} className="adm-card" style={{ opacity: brand.is_active ? 1 : 0.4, textAlign: 'center' }}>
                        <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' }}>
                            {brand.logo
                                ? <img src={brand.logo} alt={brand.name} style={{ maxHeight: 40, maxWidth: 120, objectFit: 'contain' }} />
                                : <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--adm-text-sec)', letterSpacing: 1 }}>{brand.name}</span>
                            }
                        </div>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            <label className="adm-toggle" style={{ transform: 'scale(0.85)' }}>
                                <input type="checkbox" checked={brand.is_active} onChange={() => handleToggle(brand)} />
                                <span className="adm-toggle-slider" />
                            </label>
                            <button className="adm-btn adm-btn-danger adm-btn-xs" onClick={() => handleDelete(brand.id)}>✕</button>
                        </div>
                    </div>
                ))}
            </div>
            {brands.length === 0 && !loading && (
                <div className="adm-empty">Hamkorlar topilmadi</div>
            )}
        </div>
    );
};

export default Partners;
