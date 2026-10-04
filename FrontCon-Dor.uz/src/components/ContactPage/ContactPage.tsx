import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { PhoneIcon, MailIcon, ClockIcon, SendIcon, InstagramIcon, FacebookIcon, TelegramIcon } from '../Icons';
import './ContactPage.css';

const ContactPage: React.FC = () => {
    const { t, lang } = useLanguage();
    const { settings } = useSettings();

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Locations have been moved to a dedicated page
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formState);
        setSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-page">
            <div className="container">
                <header className="contact-hero reveal scale visible">
                    <h1>{t('contact.title')}</h1>
                    <p>{t('contact.subtitle')}</p>
                </header>

                <div className="contact-grid">
                    <div className="contact-info-container stagger-children visible">
                        <div className="info-cards">
                            <div className="info-card glass-card reveal visible">
                                <div className="icon-box"><PhoneIcon size={28} /></div>
                                <div className="info-content">
                                    <h3>{lang === 'ru' ? 'Телефон' : 'Telefon'}</h3>
                                    <a href={`tel:${settings?.phone}`}>{settings?.phone}</a>
                                </div>
                            </div>
                            <div className="info-card glass-card reveal visible" style={{ animationDelay: '0.1s' }}>
                                <div className="icon-box"><MailIcon size={28} /></div>
                                <div className="info-content">
                                    <h3>Email</h3>
                                    <a href={`mailto:${settings?.email}`}>{settings?.email}</a>
                                </div>
                            </div>
                            <div className="info-card glass-card reveal visible" style={{ animationDelay: '0.2s' }}>
                                <div className="icon-box"><ClockIcon size={28} /></div>
                                <div className="info-content">
                                    <h3>{lang === 'ru' ? 'Режим работы' : 'Ish vaqti'}</h3>
                                    <p>{settings?.workday_hours}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container glass-card reveal-right visible">
                        <form onSubmit={handleSubmit}>
                            <h2>{t('contact.form_title')}</h2>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('contact.form_name')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder={t('contact.form_name')}
                                        value={formState.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('contact.form_email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={t('contact.form_email')}
                                        value={formState.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>{t('contact.form_subject')}</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder={t('contact.form_subject')}
                                        value={formState.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>{t('contact.form_message')}</label>
                                    <textarea
                                        name="message"
                                        placeholder={t('contact.form_message')}
                                        value={formState.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary submit-btn">
                                <SendIcon size={20} />
                                <span>{t('contact.form_send')}</span>
                            </button>

                            {submitted && (
                                <div className="form-success-message">
                                    {t('contact.form_success')}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="social-section reveal-scale visible">
                    <h2>{t('contact.social_title')}</h2>
                    <div className="social-links">
                        {settings?.instagram_url && (
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="social-link">
                                <InstagramIcon size={24} />
                            </a>
                        )}
                        {settings?.facebook_url && (
                            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="social-link">
                                <FacebookIcon size={24} />
                            </a>
                        )}
                        {settings?.telegram_url && (
                            <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer" className="social-link">
                                <TelegramIcon size={24} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
