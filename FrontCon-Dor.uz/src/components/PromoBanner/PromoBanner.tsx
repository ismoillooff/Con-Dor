import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import './PromoBanner.css';

const PromoBanner = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    return (
        <section className="promo-banner" ref={ref}>
            <div className="promo-bg" />
            <div className="container promo-content reveal">
                <div className="promo-text">
                    <span className="promo-label">{t('promo.label')}</span>
                    <h2 className="promo-title">{t('promo.title')}</h2>
                    <p className="promo-desc">{t('promo.desc')}</p>
                </div>
                <div className="promo-actions">
                    <a href="#" className="btn btn-primary">{t('promo.cta1')}</a>
                    <a href="#" className="btn btn-outline">{t('promo.cta2')}</a>
                </div>
            </div>
            <div className="promo-decoration">
                <div className="promo-circle c1" />
                <div className="promo-circle c2" />
            </div>
        </section>
    );
};

export default PromoBanner;
