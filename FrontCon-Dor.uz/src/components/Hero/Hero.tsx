import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TargetIcon, TentIcon, FlashlightIcon, ArrowRightIcon } from '../Icons';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

interface HeroSlide {
    id: number;
    title: string;
    title_ru: string;
    subtitle: string;
    subtitle_ru: string;
    cta1_text: string;
    cta1_text_ru: string;
    cta1_link: string;
    cta2_text: string;
    cta2_text_ru: string;
    cta2_link: string;
    badge: string;
    badge_ru: string;
    image: string | null;
    cta1_bg_color: string;
    cta1_txt_color: string;
    cta2_bg_color: string;
    cta2_txt_color: string;
    text_align: string;
    overlay_color: string;
    overlay_opacity: number;
    animation_type: string;
}

const DEFAULT_SLIDE: HeroSlide = {
    id: 0,
    badge: '',
    badge_ru: '',
    title: '',
    title_ru: '',
    subtitle: '',
    subtitle_ru: '',
    cta1_text: '',
    cta1_text_ru: '',
    cta1_link: '#highlights',
    cta2_text: '',
    cta2_text_ru: '',
    cta2_link: '#categories',
    image: null,
    cta1_bg_color: 'var(--color-text)',
    cta1_txt_color: 'var(--color-bg)',
    cta2_bg_color: 'transparent',
    cta2_txt_color: 'var(--color-text)',
    text_align: 'left',
    overlay_color: 'var(--color-bg)',
    overlay_opacity: 0.4,
    animation_type: 'fade-up'
};

const Hero = () => {
    const { t, lang } = useLanguage();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await api.get<HeroSlide[]>('/api/public/hero-slides');
                const activeSlides = res.filter(s => (s as any).is_active !== false);
                setSlides(activeSlides.length > 0 ? activeSlides : [DEFAULT_SLIDE]);
            } catch (err) {
                console.error('Hero fetch error:', err);
                setSlides([DEFAULT_SLIDE]);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
                setAnimating(false);
            }, 600);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (loading || slides.length === 0) return null;

    const slide = slides[current];

    return (
        <section className="hero" style={{
            backgroundImage: slide.image ? `url(${slide.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className={`hero-bg ${animating ? 'exit' : 'enter'}`}>
                <div
                    className="hero-gradient-overlay"
                    style={{
                        background: `linear-gradient(to right, ${(slide.overlay_color === '#000000' || !slide.overlay_color)
                            ? 'var(--color-bg)'
                            : slide.overlay_color
                            } 0%, transparent 100%)`,
                        opacity: document.documentElement.getAttribute('data-theme') === 'light'
                            ? Math.max(slide.overlay_opacity ?? 0.4, 0.7)
                            : (slide.overlay_opacity ?? 0.4)
                    }}
                />
                <div className="hero-ken-burns" style={{
                    backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                    opacity: animating ? 0 : 1,
                    transition: 'opacity 0.6s ease-in-out'
                }} />
                <div className="hero-grid-pattern" />
                <div className="hero-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }} />
                    ))}
                </div>
            </div>

            <div className="container hero-content" style={{
                justifyContent: slide.text_align === 'center' ? 'center' : slide.text_align === 'right' ? 'flex-end' : 'flex-start'
            }}>
                <div className={`hero-text ${animating ? 'hero-exit' : `hero-enter anim-${slide.animation_type || 'fade-up'}`}`} style={{
                    textAlign: slide.text_align as any || 'left',
                    alignItems: slide.text_align === 'center' ? 'center' : slide.text_align === 'right' ? 'flex-end' : 'flex-start'
                }}>
                    {((lang === 'ru' ? slide.badge_ru : slide.badge) || (slide.id === 0 && t('hero.badge'))) && (
                        <span className="hero-badge" style={{ animationDelay: '0.1s' }}>
                            {(lang === 'ru' ? slide.badge_ru : slide.badge) || t('hero.badge')}
                        </span>
                    )}
                    <h1 className="hero-title" style={{ whiteSpace: 'pre-line', animationDelay: '0.2s' }}>
                        {(lang === 'ru' ? slide.title_ru : slide.title) || t('hero.title')}
                    </h1>
                    <p className="hero-subtitle" style={{ animationDelay: '0.3s' }}>
                        {(lang === 'ru' ? slide.subtitle_ru : slide.subtitle) || t('hero.subtitle')}
                    </p>
                    <div className="hero-ctas" style={{
                        justifyContent: slide.text_align === 'center' ? 'center' : slide.text_align === 'right' ? 'flex-end' : 'flex-start',
                        animationDelay: '0.4s'
                    }}>
                        {((lang === 'ru' ? slide.cta1_text_ru : slide.cta1_text) || (slide.id === 0 && t('hero.cta1'))) && (
                            <a
                                href={slide.cta1_link || "#"}
                                className="btn btn-primary hero-btn main-cta"
                                style={{ background: slide.cta1_bg_color, color: slide.cta1_txt_color }}
                            >
                                <span>{(lang === 'ru' ? slide.cta1_text_ru : slide.cta1_text) || t('hero.cta1')}</span>
                                <ArrowRightIcon size={16} />
                            </a>
                        )}
                        {((lang === 'ru' ? slide.cta2_text_ru : slide.cta2_text) || (slide.id === 0 && t('hero.cta2'))) && (
                            <a
                                href={slide.cta2_link || "#"}
                                className="btn btn-outline hero-btn sec-cta"
                                style={{
                                    background: slide.cta2_bg_color,
                                    color: slide.cta2_txt_color,
                                    borderColor: slide.cta2_bg_color === 'transparent' ? 'rgba(255,255,255,0.3)' : 'transparent'
                                }}
                            >
                                {(lang === 'ru' ? slide.cta2_text_ru : slide.cta2_text) || t('hero.cta2')}
                            </a>
                        )}
                    </div>
                    {slides.length > 1 && (
                        <div className="hero-indicators">
                            {slides.map((_: HeroSlide, i: number) => (
                                <button
                                    key={i}
                                    className={`indicator ${i === current ? 'active' : ''}`}
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Slayd ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="hero-visual">
                    <div className="hero-floating-card card-1">
                        <div className="floating-icon"><TargetIcon size={22} /></div>
                        <span>{t('hero.taktik')}</span>
                    </div>
                    <div className="hero-floating-card card-2">
                        <div className="floating-icon"><TentIcon size={22} /></div>
                        <span>{t('hero.lager')}</span>
                    </div>
                    <div className="hero-floating-card card-3">
                        <div className="floating-icon"><FlashlightIcon size={22} /></div>
                        <span>{t('hero.uskunalar')}</span>
                    </div>
                </div>
            </div>

            <div className="hero-scroll-hint">
                <div className="scroll-mouse">
                    <div className="scroll-wheel" />
                </div>
                <span>{t('hero.scroll')}</span>
            </div>
        </section>
    );
};

export default Hero;
