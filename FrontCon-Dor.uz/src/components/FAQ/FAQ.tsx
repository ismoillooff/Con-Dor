import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import './FAQ.css';

const FAQItem = ({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) => (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
        <button className="faq-question" onClick={onClick}>
            <span>{q}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="faq-icon">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
        <div className="faq-answer">
            <p>{a}</p>
        </div>
    </div>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    const faqs = [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q4'), a: t('faq.a4') },
        { q: t('faq.q5'), a: t('faq.a5') },
    ];

    return (
        <section className="faq" ref={ref}>
            <div className="container">
                <div className="section-header reveal">
                    <h2>{t('faq.title')}</h2>
                    <p>{t('faq.subtitle')}</p>
                    <div className="accent-line" />
                </div>
                <div className="faq-list reveal">
                    {faqs.map((faq, i) => (
                        <FAQItem
                            key={i}
                            q={faq.q}
                            a={faq.a}
                            isOpen={openIndex === i}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
