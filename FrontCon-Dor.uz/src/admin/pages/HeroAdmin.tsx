import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    badge: string;
    image: string | null;
    order: number;
    is_active: boolean;
}

interface HeroAdminProps {
    onAdd: () => void;
    onEdit: (id: number) => void;
}

const HeroAdmin = ({ onAdd, onEdit }: HeroAdminProps) => {
    const { addToast } = useAdmin();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<HeroSlide[]>('/api/admin/hero-slides');
            setSlides(res);
        } catch (err) {
            console.error('Hero fetch error:', err);
            addToast('error', 'Slaydlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.del(`/api/admin/hero-slides/${deleteId}`);
            setSlides(p => p.filter(s => s.id !== deleteId));
            addToast('info', 'Slayd o\'chirildi');
            setDeleteId(null);
        } catch (err) {
            addToast('error', 'O\'chirishda xatolik');
        }
    };

    if (loading) return <div className="adm-skeleton-container" style={{ height: 400 }} />;

    return (
        <div>
            <div className="adm-flex-between adm-mb-20">
                <div>
                    <h2 style={{ fontFamily: 'var(--adm-font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: 4 }}>Hero Slayder</h2>
                    <p className="adm-text-sec">Bosh sahifadagi asosiy slayder elementlari (Jami {slides.length} ta)</p>
                </div>
                <button className="adm-btn adm-btn-primary" onClick={onAdd}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: 8 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Yangi slayd qo'shish
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
                {slides.map((slide) => (
                    <div key={slide.id} className="adm-card hero-admin-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--adm-border)', background: 'var(--adm-bg-main)', position: 'relative' }}>
                        <div style={{ height: 200, background: slide.image ? `url(${slide.image}) center/cover` : '#222', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)` }} />
                            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                                <span className="adm-badge" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', fontSize: '0.65rem' }}>ORD: {slide.order}</span>
                                <span className={`adm-badge ${slide.is_active ? 'adm-badge-green' : 'adm-badge-muted'}`} style={{ fontSize: '0.65rem' }}>{slide.is_active ? 'FAOL' : 'FAOL EMAS'}</span>
                            </div>
                            <div style={{ position: 'absolute', bottom: 15, left: 15, right: 15 }}>
                                {slide.badge && <div style={{ fontSize: '0.7rem', color: 'var(--adm-accent)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.1em' }}>{slide.badge}</div>}
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>{slide.title}</div>
                            </div>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--adm-text-sec)', marginBottom: 20, height: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>{slide.subtitle}</div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="adm-btn adm-btn-ghost" style={{ flex: 1, fontWeight: 700 }} onClick={() => onEdit(slide.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    Tahrirlash
                                </button>
                                <button className="adm-btn adm-btn-danger adm-btn-icon" onClick={() => setDeleteId(slide.id)} style={{ width: 40, height: 40 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {slides.length === 0 && !loading && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', background: 'var(--adm-bg-alt)', borderRadius: 12, border: '2px dashed var(--adm-border)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 15 }}>🛸</div>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text-sec)' }}>Hozircha slaydlar mavjud emas</div>
                        <button className="adm-btn adm-btn-primary" style={{ marginTop: 15 }} onClick={onAdd}>Birinchi slaydni yaratish</button>
                    </div>
                )}
            </div>

            {deleteId && (
                <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <div className="adm-modal-header"><div className="adm-modal-title" style={{ color: 'var(--adm-red)' }}>⚠ O'chirishni tasdiqlang</div><button className="adm-modal-close" onClick={() => setDeleteId(null)}>✕</button></div>
                        <div className="adm-modal-body">
                            <p style={{ fontSize: '0.95rem', color: 'var(--adm-text-sec)', lineHeight: 1.5 }}>
                                Ushbu slaydni o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
                            </p>
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-secondary" onClick={() => setDeleteId(null)}>Bekor qilish</button>
                            <button className="adm-btn adm-btn-danger" onClick={handleDelete} style={{ fontWeight: 700 }}>Ha, o'chirilsin</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .hero-admin-card { transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .hero-admin-card:hover { transform: translateY(-5px); border-color: var(--adm-accent) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            `}</style>
        </div>
    );
};

export default HeroAdmin;
