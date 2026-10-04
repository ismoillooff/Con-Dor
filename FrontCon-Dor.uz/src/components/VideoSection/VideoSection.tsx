import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import './VideoSection.css';

const VideoSection = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    return (
        <section className="video-section" ref={ref}>
            <div className="video-bg" />
            <div className="video-overlay" />
            <div className="container video-content reveal-scale">
                <span className="video-label">{t('video.badge')}</span>
                <h2 className="video-title">{t('video.title')}</h2>
                <p className="video-desc">
                    {t('video.content')}
                </p>
                <div className="video-ctas">
                    <a href="#highlights" className="btn btn-primary">
                        {t('video.cta')}
                    </a>
                    <button className="video-play-btn" aria-label={t('product.view')}>
                        <div className="play-ring" />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
