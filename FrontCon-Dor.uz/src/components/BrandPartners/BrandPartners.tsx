import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import './BrandPartners.css';

const brands = ['VICTORINOX', 'MAMMUT', 'FJÄLLRÄVEN', 'PETZL', 'LEATHERMAN', 'SALEWA', 'HELIKON-TEX', 'MIL-TEC', 'CONDOR', '5.11 TACTICAL'];

const BrandPartners = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    return (
        <section className="brands" ref={ref}>
            <div className="container">
                <div className="brands-label reveal">{t('testimonials.partners')}</div>
                <div className="brands-track">
                    <div className="brands-slider">
                        {[...brands, ...brands].map((brand, i) => (
                            <div key={i} className="brand-item">
                                <span className="brand-name">{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandPartners;
