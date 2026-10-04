import React from 'react';
import { useScrollReveal, useCountUp } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import { TrophyIcon, PackageIcon, SmileIcon, StarIcon } from '../Icons';
import './StatsCounter.css';

const StatItem = ({ value, suffix, label, icon, delay }: { value: number; suffix: string; label: string; icon: React.ReactNode; delay: number }) => {
    const countRef = useCountUp(value, 2200);

    return (
        <div className="stat-item" style={{ animationDelay: `${delay}s` }}>
            <span className="stat-icon">{icon}</span>
            <div className="stat-number">
                <span ref={countRef as React.RefObject<HTMLSpanElement>} className="stat-value">0</span>
                <span className="stat-suffix">{suffix}</span>
            </div>
            <span className="stat-label">{label}</span>
            <div className="stat-bar">
                <div className="stat-bar-fill" style={{ animationDelay: `${delay + 0.4}s` }} />
            </div>
        </div>
    );
};

const StatsCounter = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    const stats = [
        { value: 30, suffix: '+', label: t('counter.experience'), icon: <TrophyIcon size={26} /> },
        { value: 5000, suffix: '+', label: t('counter.products'), icon: <PackageIcon size={26} /> },
        { value: 50000, suffix: '+', label: t('counter.clients'), icon: <SmileIcon size={26} /> },
        { value: 4.8, suffix: '★', label: t('counter.rating'), icon: <StarIcon size={16} /> },
    ];

    return (
        <section className="stats" ref={ref}>
            <div className="stats-bg" />
            <div className="container">
                <div className="stats-grid stagger-children">
                    {stats.map((s, i) => (
                        <StatItem key={i} {...s} delay={i * 0.15} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
