import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';

interface News {
    id: number;
    title: string;
    content: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
}

const NewsAdmin = () => {
    const { addToast } = useAdmin();
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'add' | 'edit' | 'del' | null>(null);
    const [activeNews, setActiveNews] = useState<News | null>(null);
    const [form, setForm] = useState<Partial<News>>({});

    // Mock initial data if API not ready
    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Assuming there might be an endpoint or we just show empty for now
                // const res = await api.get<News[]>('/api/admin/news');
                // setNews(res);
                setNews([
                    { id: 1, title: "Yangi kolleksiya yetib keldi", content: "Kuzgi kolleksiyamiz do'konlarimizda...", image: null, is_active: true, created_at: "2024-03-01" },
                    { id: 2, title: "8-mart bayrami munosabati bilan chegirmalar", content: "Barcha ayollar kiyimlariga 20% chegirma!", image: null, is_active: true, created_at: "2024-03-01" }
                ]);
            } catch (err) {
                addToast('error', 'Yangiliklarni yuklashda xatolik');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [addToast]);

    const openModal = (type: 'add' | 'edit' | 'del', item?: News) => {
        setModal(type);
        setActiveNews(item || null);
        setForm(item || { title: '', content: '', is_active: true });
    };

    const handleSave = async () => {
        addToast('success', 'Yangilik muvaffaqiyatli saqlandi (Demo)');
        setModal(null);
    };

    if (loading) return <div className="adm-loader">Yuklanmoqda...</div>;

    return (
        <div style={{ paddingBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #edf2f7' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Yangiliklar va Blog</h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--adm-text-sec)' }}>Saytdagi yangiliklarni boshqaring</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={() => openModal('add')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Yangi qo'shish
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {news.map(item => (
                    <div key={item.id} className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--adm-text)' }}>{item.title}</div>
                            <div className={`adm-badge ${item.is_active ? 'adm-badge-green' : 'adm-badge-red'}`}>
                                {item.is_active ? 'Faol' : 'Nofaol'}
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--adm-text-sec)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.content}
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{item.created_at}</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon" onClick={() => openModal('edit', item)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => openModal('del', item)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <div className="adm-modal-overlay">
                    <div className="adm-modal" style={{ maxWidth: 500 }}>
                        <div className="adm-modal-header">
                            <h3 className="adm-modal-title">
                                {modal === 'add' ? 'Yangi yangilik' : modal === 'edit' ? 'Tahrirlash' : 'O\'chirish'}
                            </h3>
                            <button className="adm-modal-close" onClick={() => setModal(null)}>×</button>
                        </div>
                        <div className="adm-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {modal === 'del' ? (
                                <p>Haqiqatan ham "<b>{activeNews?.title}</b>"ni o'chirmoqchimisiz?</p>
                            ) : (
                                <>
                                    <div className="adm-form-group">
                                        <label className="adm-label">Sarlavha</label>
                                        <input
                                            type="text"
                                            className="adm-input"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            placeholder="Yangilik sarlavhasi..."
                                        />
                                    </div>
                                    <div className="adm-form-group">
                                        <label className="adm-label">Matn</label>
                                        <textarea
                                            className="adm-input"
                                            style={{ minHeight: 120 }}
                                            value={form.content}
                                            onChange={e => setForm({ ...form, content: e.target.value })}
                                            placeholder="Yangilik matni..."
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <label className="adm-toggle">
                                            <input
                                                type="checkbox"
                                                checked={form.is_active}
                                                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                            />
                                            <span className="adm-toggle-slider" />
                                        </label>
                                        <span style={{ fontSize: '0.9rem' }}>Saytda ko'rsatish</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>Bekor</button>
                            <button className={`adm-btn ${modal === 'del' ? 'adm-btn-danger' : 'adm-btn-primary'}`} onClick={handleSave}>
                                {modal === 'del' ? 'O\'chirish' : 'Saqlash'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsAdmin;
