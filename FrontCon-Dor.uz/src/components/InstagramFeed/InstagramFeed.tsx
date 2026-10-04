import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import './InstagramFeed.css';

const InstagramFeed = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t, lang } = useLanguage();

    const posts = [
        { icon: '🏔️', caption: lang === 'ru' ? 'Снаряжение для гор и лагеря — готово!' : 'Tog\' va lager jihozlari — tayyor!', likes: '2.4K' },
        { icon: '🎒', caption: lang === 'ru' ? 'Новый рюкзак Scout — для всех приключений' : 'Yangi Scout ryukzak — barcha sarguzashtlar uchun', likes: '1.8K' },
        { icon: '🔪', caption: lang === 'ru' ? 'Профессиональная коллекция тактических ножей' : 'Professional taktik pichoqlar kolleksiyasi', likes: '3.1K' },
        { icon: '🏕️', caption: lang === 'ru' ? 'Воскресная ночь с нашей палаткой' : 'Chodirimiz bilan yakshanba tuni', likes: '2.7K' },
        { icon: '🧥', caption: lang === 'ru' ? 'Новая куртка Bushpeak — водонепроницаемая' : 'Bushpeak yangi kurtka — suvga bardoshli', likes: '1.5K' },
        { icon: '⛺', caption: lang === 'ru' ? 'Курс по выживанию в дикой природе' : 'Tabiatda omon qolish kursi', likes: '4.2K' },
    ];

    return (
        <section className="instagram" ref={ref}>
            <div className="container">
                <div className="section-header reveal">
                    <h2>{t('instagram.title')}</h2>
                    <p>{t('instagram.handle')} · {t('instagram.followers')}</p>
                    <div className="accent-line" />
                </div>
                <div className="insta-grid stagger-children">
                    {posts.map((post, i) => (
                        <a key={i} href="https://www.instagram.com/swiss.armyshop/" className="insta-item" target="_blank" rel="noopener">
                            <div className="insta-placeholder">
                                <span className="insta-icon">{post.icon}</span>
                            </div>
                            <div className="insta-overlay">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                                <span>{post.caption}</span>
                            </div>
                        </a>
                    ))}
                </div>
                <div className="insta-cta reveal">
                    <a href="https://www.instagram.com/swiss.armyshop/" className="btn btn-outline" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>
                        {t('instagram.follow')}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
