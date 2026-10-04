import './TrustBar.css';
import {
    TruckIcon, ShieldCheckIcon, AwardIcon, LockIcon, ClockIcon, TargetIcon,
    StarIcon, PackageIcon, CheckCircleIcon, HeartIcon, FlashlightIcon, CompassIcon
} from '../Icons';

import { useLanguage } from '../../context/LanguageContext';

const TrustBar = () => {
    const { t } = useLanguage();

    const badges = [
        { icon: <TruckIcon size={18} />, title: t('trust.delivery.title'), sub: t('trust.delivery.subtitle') },
        { icon: <ShieldCheckIcon size={18} />, title: t('trust.store.title'), sub: t('trust.store.subtitle') },
        { icon: <AwardIcon size={18} />, title: t('trust.assortment.title'), sub: t('trust.assortment.subtitle') },
        { icon: <LockIcon size={18} />, title: t('trust.payment.title'), sub: t('trust.payment.subtitle') },
        { icon: <ClockIcon size={18} />, title: t('trust.speed.title'), sub: t('trust.speed.subtitle') },
        { icon: <TargetIcon size={18} />, title: t('stats.testing.title'), sub: t('stats.testing.subtitle') },
        { icon: <StarIcon size={18} />, title: t('stats.service.title'), sub: t('stats.service.subtitle') },
        { icon: <PackageIcon size={18} />, title: t('stats.return.title'), sub: t('stats.return.subtitle') },
        { icon: <CheckCircleIcon size={18} />, title: t('stats.original.title'), sub: t('stats.original.subtitle') },
        { icon: <HeartIcon size={18} />, title: t('stats.choice.title'), sub: t('stats.choice.subtitle') },
        { icon: <FlashlightIcon size={18} />, title: t('stats.pro.title'), sub: t('stats.pro.subtitle') },
        { icon: <CompassIcon size={18} />, title: t('stats.adventure.title'), sub: t('stats.adventure.subtitle') },
    ];

    return (
        <section className="trustbar">
            <div className="trustbar-track">
                <div className="trustbar-scroll">
                    {[...badges, ...badges].map((b, i) => (
                        <div key={i} className="trust-badge">
                            <span className="trust-icon">{b.icon}</span>
                            <div className="trust-text">
                                <span className="trust-title">{b.title}</span>
                                <span className="trust-sub">{b.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBar;
