import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import './Newsletter.css';

const Newsletter = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <section className="newsletter" ref={ref}>
            <div className="newsletter-bg" />
            <div className="container newsletter-inner reveal">
                <div className="newsletter-content">
                    <span className="newsletter-badge">📧 {t('newsletter.badge')}</span>
                    <h2 className="newsletter-title">{t('newsletter.title')}</h2>
                    <p className="newsletter-desc">
                        {t('newsletter.subtitle')}
                    </p>
                </div>
                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            placeholder={t('newsletter.placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="newsletter-input"
                        />
                        <button type="submit" className="newsletter-btn">
                            {submitted ? t('newsletter.success') : t('newsletter.button')}
                        </button>
                    </div>
                    <p className="newsletter-note">
                        {t('newsletter.note')}
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
