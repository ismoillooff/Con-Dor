import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
    const { settings } = useSettings();
    const { t, lang } = useLanguage();
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!settings) return null;

    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="/icon.png" alt="Logo" className="footer-logo-img" />
                            <div>
                                <span className="footer-logo-main">{settings.shop_name}</span>
                                <span className="footer-logo-sub">
                                    {lang === 'ru' ? (settings.tagline_ru || settings.tagline) : settings.tagline}
                                </span>
                            </div>
                        </div>

                        <p className="footer-tagline">
                            {settings.seo_description || t('footer.tagline')}
                        </p>
                        <div className="footer-social">
                            {settings.instagram_url && (
                                <a href={settings.instagram_url} aria-label="Instagram" target="_blank" rel="noopener">
                                    <img src="/instagram.png" alt="Instagram" className="social-icon-img" />
                                </a>
                            )}
                            {settings.facebook_url && (
                                <a href={settings.facebook_url} aria-label="Facebook" target="_blank" rel="noopener">
                                    <img src="/facebook.png" alt="Facebook" className="social-icon-img" />
                                </a>
                            )}
                            {settings.telegram_url && (
                                <a href={settings.telegram_url} aria-label="Telegram" target="_blank" rel="noopener">
                                    <img src="/telegram.png" alt="Telegram" className="social-icon-img" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <h4>{t('footer.quickLinks')}</h4>
                        <ul>
                            <li><a href="/">{t('common.home')}</a></li>
                            <li><a href="/category/kiyimlar">{t('nav.catalog')}</a></li>
                            <li><a href="/contact">{t('nav.contact')}</a></li>
                            <li><a href="/cart">{t('nav.cart')}</a></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4>{t('footer.contact')}</h4>
                        <ul className="footer-contact-list">
                            <li>
                                <strong>{t('footer.address')}:</strong> {settings.address}
                            </li>
                            <li>
                                <strong>{t('footer.phone')}:</strong> <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                            </li>
                            <li>
                                <strong>{t('footer.email')}:</strong> <a href={`mailto:${settings.email}`}>{settings.email}</a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="footer-bottom">
                    <div className="footer-copy">
                        <p>{lang === 'ru' ? (settings.copyright_text_ru || settings.copyright_text) : settings.copyright_text}</p>
                        <p className="footer-legal">{t('footer.legal')}</p>
                    </div>
                    <div className="footer-payments">
                        {['TWINT', 'VISA', 'MC', 'AMEX', 'PayPal'].map((p) => (
                            <div key={p} className="payment-badge">{p}</div>
                        ))}
                    </div>
                </div>
            </div>

            <button className="back-to-top" onClick={scrollToTop} aria-label={t('footer.backToTop')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
            </button>
        </footer>
    );
};

export default Footer;
