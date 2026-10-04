import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheckIcon, CheckCircleIcon, AwardIcon } from '../Icons';
import './History.css';

const History = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    return (
        <section className="history" ref={ref}>
            <div className="container history-inner">
                <div className="history-image reveal-left">
                    <div className="history-img-wrapper">
                        <div className="history-img-placeholder">
                            <ShieldCheckIcon size={48} />
                            <p>{t('history.tagline')}</p>
                        </div>
                        <div className="history-img-badge">
                            <span className="badge-number">30+</span>
                            <span className="badge-text">{t('counter.experience').split(' ')[1] || 'Yil'}</span>
                        </div>
                    </div>
                </div>
                <div className="history-content reveal-right">
                    <span className="history-label">{t('history.badge')}</span>
                    <h2 className="history-title">{t('history.title')}</h2>
                    <p className="history-text">
                        {t('history.content1')}
                    </p>
                    <p className="history-text">
                        {t('history.content2')}
                    </p>
                    <div className="history-features">
                        <div className="history-feature">
                            <div className="feature-dot"><CheckCircleIcon size={16} /></div>
                            <span>{t('history.item1')}</span>
                        </div>
                        <div className="history-feature">
                            <div className="feature-dot"><AwardIcon size={16} /></div>
                            <span>{t('history.item2')}</span>
                        </div>
                        <div className="history-feature">
                            <div className="feature-dot"><ShieldCheckIcon size={16} /></div>
                            <span>{t('history.item3')}</span>
                        </div>
                    </div>
                    <a href="#" className="btn btn-primary">{t('history.more')}</a>
                </div>
            </div>
        </section>
    );
};

export default History;
