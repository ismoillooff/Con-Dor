import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import './Support.css';

const Support = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { settings } = useSettings();
    const { t } = useLanguage();

    if (!settings) return null;

    return (
        <section className="support" ref={ref}>
            <div className="container">
                <div className="support-grid stagger-children">
                    <div className="support-col">
                        <h3 className="support-heading">{t('support.title')}</h3>
                        <p className="support-text">
                            {t('support.subtitle')}
                        </p>
                        <div className="support-contacts">
                            <a href={`tel:${settings.phone}`} className="support-contact">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                {settings.phone}
                            </a>
                            <a href={`mailto:${settings.email}`} className="support-contact">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                {settings.email}
                            </a>
                        </div>
                        <div className="support-hours">
                            <p>{t('support.monFri')}, {settings.workday_hours}</p>
                            <p>{t('support.sat')}, {settings.saturday_hours}</p>
                        </div>
                    </div>

                    <div className="support-col">
                        <h3 className="support-heading">{t('footer.legal_title')}</h3>
                        <ul className="support-links">
                            <li><a href="#">{t('footer.impressum')}</a></li>
                            <li><a href="#">{t('footer.terms')}</a></li>
                            <li><a href="#">{t('footer.privacy')}</a></li>
                            <li><a href="#">{t('footer.returns')}</a></li>
                            <li><a href="#">{t('footer.form')}</a></li>
                        </ul>
                    </div>

                    <div className="support-col">
                        <h3 className="support-heading">{t('footer.quickLinks')}</h3>
                        <ul className="support-links">
                            <li><a href="#categories">{t('footer.newArrivals')}</a></li>
                            <li><a href="#highlights">{t('footer.bestSellers')}</a></li>
                            <li><a href="#recommendations">{t('footer.staffPicks')}</a></li>
                            <li><a href="#favourites">{t('footer.gifts')}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Support;
