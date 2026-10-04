import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import { TentIcon, BootIcon, BedIcon, BinocularsIcon, FirstAidIcon, KnifeIcon } from '../Icons';
import './DiscoverWorld.css';

const DiscoverWorld = () => {
    const ref = useScrollReveal<HTMLElement>();
    const { t } = useLanguage();

    const categories = [
        { name: t('discover.cat1'), icon: <TentIcon size={28} />, color: '#4a5d23' },
        { name: t('discover.cat2'), icon: <BootIcon size={28} />, color: '#8b6914' },
        { name: t('discover.cat3'), icon: <BedIcon size={28} />, color: '#1e3a5f' },
        { name: t('discover.cat4'), icon: <BinocularsIcon size={28} />, color: '#5c2d91' },
        { name: t('discover.cat5'), icon: <FirstAidIcon size={28} />, color: '#c8102e' },
        { name: t('discover.cat6'), icon: <KnifeIcon size={28} />, color: '#555' },
    ];

    return (
        <section className="discover" id="discover" ref={ref}>
            <div className="container">
                <div className="section-header reveal">
                    <h2>{t('discover.title')}</h2>
                    <p>{t('discover.subtitle')}</p>
                    <div className="accent-line" />
                </div>
                <div className="discover-grid stagger-children">
                    {categories.map((cat) => (
                        <a key={cat.name} href="#" className="discover-item">
                            <div className="discover-circle" style={{ '--disc-color': cat.color } as React.CSSProperties}>
                                <span className="discover-icon" style={{ color: cat.color }}>{cat.icon}</span>
                                <div className="discover-ring" />
                            </div>
                            <h4 className="discover-name">{cat.name}</h4>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DiscoverWorld;
