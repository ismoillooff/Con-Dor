import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface Subscriber {
    id: number;
    email: string;
    created_at: string;
    is_active: boolean;
}

const Newsletter = () => {
    const { addToast } = useAdmin();
    const [subs, setSubs] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<Subscriber[]>('/api/admin/newsletter');
            setSubs(res);
        } catch (err) {
            console.error('Newsletter fetch error:', err);
            addToast('error', 'Obunachilarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id: number, email: string) => {
        try {
            await api.del(`/api/admin/newsletter/${id}`);
            setSubs(p => p.filter(s => s.id !== id));
            addToast('info', `${email} o'chirildi`);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik');
        }
    };

    const filtered = subs.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));
    const active = subs.filter(s => s.is_active).length;

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Newsletter Obunachlar</h2>
                    <p className="adm-text-sec">Jami {subs.length} ta, {active} ta faol obunachi</p>
                </div>
                <button className="adm-btn adm-btn-secondary" onClick={() => addToast('info', 'Export funksiyasi hali tayyor emas')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    CSV yuklab olish
                </button>
            </div>

            <div className="adm-grid-3 adm-mb-20">
                <div className="adm-stat">
                    <div className="adm-stat-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                    <div className="adm-stat-body"><div className="adm-stat-value">{subs.length}</div><div className="adm-stat-label">Jami obunachi</div></div>
                </div>
                <div className="adm-stat">
                    <div className="adm-stat-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
                    <div className="adm-stat-body"><div className="adm-stat-value">{active}</div><div className="adm-stat-label">Faol obunachi</div></div>
                </div>
                <div className="adm-stat">
                    <div className="adm-stat-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg></div>
                    <div className="adm-stat-body"><div className="adm-stat-value">{subs.length - active}</div><div className="adm-stat-label">Bekor qilganlar</div></div>
                </div>
            </div>

            <div className="adm-card">
                <div className="adm-card-header">
                    <div className="adm-card-title">Obunachlar ro'yxati</div>
                    <div className="adm-search" style={{ width: 240 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input placeholder="Email qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead><tr><th>#</th><th>Email</th><th>Sana</th><th>Holat</th><th>Amal</th></tr></thead>
                        <tbody>
                            {filtered.map((sub, i) => (
                                <tr key={sub.id}>
                                    <td style={{ color: 'var(--adm-text-muted)', fontSize: '0.78rem' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{sub.email}</td>
                                    <td style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem' }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                                    <td><span className={`adm-badge ${sub.is_active ? 'adm-badge-green' : 'adm-badge-muted'}`}>{sub.is_active ? 'Faol' : 'Bekor'}</span></td>
                                    <td>
                                        <button className="adm-btn adm-btn-danger adm-btn-xs" onClick={() => handleDelete(sub.id, sub.email)}>O'chirish</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="adm-empty"><div className="adm-empty-title">Obunachi topilmadi</div></div>}
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
