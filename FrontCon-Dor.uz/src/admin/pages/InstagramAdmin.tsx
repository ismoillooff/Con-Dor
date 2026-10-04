import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface InstagramPost {
    id: number;
    caption: string;
    image: string | null;
    link: string;
    order: number;
    is_active: boolean;
}

const Instagram = () => {
    const { addToast } = useAdmin();
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<InstagramPost[]>('/api/admin/instagram');
            setPosts(res);
        } catch (err) {
            console.error('IG fetch error:', err);
            addToast('error', 'Postlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggle = async (post: InstagramPost) => {
        try {
            const res = await api.put<InstagramPost>(`/api/admin/instagram/${post.id}`, { is_active: !post.is_active });
            setPosts(p => p.map(item => item.id === post.id ? { ...item, is_active: res.is_active } : item));
        } catch (err) {
            addToast('error', 'Xatolik yuz berdi');
        }
    };

    const handleCaptionChange = async (post: InstagramPost, caption: string) => {
        setPosts(p => p.map(item => item.id === post.id ? { ...item, caption } : item));
    };

    const saveCaption = async (post: InstagramPost) => {
        try {
            await api.put(`/api/admin/instagram/${post.id}`, { caption: post.caption });
            addToast('success', 'Tavsif saqlandi');
        } catch (err) {
            addToast('error', 'Saqlashda xatolik');
        }
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Instagram Feed</h2>
                    <p className="adm-text-sec">Saytdagi Instagram feed bo'limini boshqaring</p>
                </div>
            </div>

            <div className="adm-card">
                <div className="adm-card-header"><div className="adm-card-title">Postlar ({posts.filter(p => p.is_active).length}/{posts.length} faol)</div></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                    {posts.map(post => (
                        <div key={post.id} style={{ border: '1px solid var(--adm-border)', borderRadius: 8, overflow: 'hidden', opacity: post.is_active ? 1 : 0.4, background: 'var(--adm-bg-alt)' }}>
                            <div style={{ height: 150, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                {post.image ? (
                                    <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '2rem' }}>📸</span>
                                )}
                                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                                    <label className="adm-toggle" style={{ transform: 'scale(0.8)' }}>
                                        <input type="checkbox" checked={post.is_active} onChange={() => handleToggle(post)} />
                                        <span className="adm-toggle-slider" />
                                    </label>
                                </div>
                            </div>
                            <div style={{ padding: 12 }}>
                                <textarea
                                    style={{
                                        background: 'none', border: '1px solid var(--adm-border)',
                                        borderRadius: 4, padding: 6,
                                        fontSize: '0.75rem', color: 'var(--adm-text-sec)', width: '100%',
                                        fontFamily: 'var(--adm-font-body)', minHeight: 60, resize: 'none', marginBottom: 8
                                    }}
                                    value={post.caption}
                                    onChange={e => handleCaptionChange(post, e.target.value)}
                                    onBlur={() => saveCaption(post)}
                                />
                                <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)', wordBreak: 'break-all' }}>
                                    {post.link || 'Havola yo\'q'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {posts.length === 0 && (
                    <div className="adm-empty">Postlar topilmadi. Instagram postlarini boshqaruv panelidan qo'shishingiz mumkin.</div>
                )}
            </div>
        </div>
    );
};

export default Instagram;
