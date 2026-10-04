import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import './Testimonials.css';

const Testimonials = () => {
    const [active, setActive] = useState(0);
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    const reviews = [
        { name: t('testimonial.r1_name'), loc: t('testimonial.r1_loc'), text: t('testimonial.r1_text'), stars: 5 },
        { name: t('testimonial.r2_name'), loc: t('testimonial.r2_loc'), text: t('testimonial.r2_text'), stars: 5 },
        { name: t('testimonial.r3_name'), loc: t('testimonial.r3_loc'), text: t('testimonial.r3_text'), stars: 4 },
        { name: t('testimonial.r4_name'), loc: t('testimonial.r4_loc'), text: t('testimonial.r4_text'), stars: 5 },
    ];

    return (
        <section className="testimonials" ref={ref}>
            <div className="container">
                <div className="section-header reveal">
                    <h2>{t('testimonials.title')}</h2>
                    <p>{t('testimonials.subtitle')}</p>
                    <div className="accent-line" />
                </div>
                <div className="testimonials-wrapper reveal">
                    <div className="testimonial-main glass-card">
                        <div className="testimonial-stars">
                            {[...Array(reviews[active].stars)].map((_, i) => (
                                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            ))}
                        </div>
                        <p className="testimonial-text">"{reviews[active].text}"</p>
                        <div className="testimonial-author">
                            <div className="author-avatar">{reviews[active].name.charAt(0)}</div>
                            <div className="author-info">
                                <span className="author-name">{reviews[active].name}</span>
                                <span className="author-location">{reviews[active].loc}</span>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-dots">
                        {reviews.map((_, i) => (
                            <button
                                key={i}
                                className={`t-dot ${i === active ? 'active' : ''}`}
                                onClick={() => setActive(i)}
                                aria-label={`Sharh ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="trust-seal reveal">
                    <div className="seal-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        <span>4.74 / 5.0</span>
                    </div>
                    <span className="seal-text">{t('testimonials.trustpilot')}</span>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
