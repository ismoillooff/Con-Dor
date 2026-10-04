import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { MapPinIcon, GlobeIcon } from '../Icons';
import './LocationsPage.css';

const LocationsPage: React.FC = () => {
    const { lang } = useLanguage();
    const { settings } = useSettings();
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/public/branches`);
                if (res.ok) {
                    const data = await res.json();
                    setBranches(data);
                }
            } catch (err) {
                console.error('Fetch branches error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    const getEmbedUrl = (url: string, backupQuery: string = '') => {
        if (!url) return backupQuery ? `https://maps.google.com/maps?q=${encodeURIComponent(backupQuery)}&output=embed` : '';

        // Handle iframe stripping if user pastes whole tag
        if (url.includes('<iframe')) {
            const srcMatch = url.match(/src="([^"]+)"/);
            if (srcMatch && srcMatch[1]) url = srcMatch[1];
        }

        const cleanUrl = url.trim();

        // If it's a plain string (not a URL), use it as a query
        if (!cleanUrl.startsWith('http')) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(cleanUrl)}&output=embed`;
        }

        // Google Maps transformation
        if (cleanUrl.includes('google.com/maps') || cleanUrl.includes('goo.gl/maps') || cleanUrl.includes('maps.app.goo.gl')) {
            // Already an embed URL
            if (cleanUrl.includes('/embed')) return cleanUrl;

            // Extract coordinates if present (extremely precise)
            const coordMatch = cleanUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (coordMatch && coordMatch[1] && coordMatch[2]) {
                return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
            }

            // Extract place search
            const placeMatch = cleanUrl.match(/\/place\/([^\/]+)/);
            if (placeMatch && placeMatch[1]) {
                const placeName = placeMatch[1].split('/')[0];
                return `https://maps.google.com/maps?q=${placeName}&output=embed`;
            }

            // Fallback for search query
            const searchMatch = cleanUrl.match(/q=([^&]+)/);
            if (searchMatch && searchMatch[1]) {
                return `https://maps.google.com/maps?q=${searchMatch[1]}&output=embed`;
            }

            // Generic fallback for any Google link (including maps.app.goo.gl)
            return `https://maps.google.com/maps?q=${encodeURIComponent(cleanUrl)}&output=embed`;
        }

        // Yandex Maps transformation
        if (cleanUrl.includes('yandex.uz/maps') || cleanUrl.includes('yandex.com/maps')) {
            if (cleanUrl.includes('map-widget')) return cleanUrl;

            const orgMatch = cleanUrl.match(/\/org\/[^\/]+\/(\d+)/);
            if (orgMatch && orgMatch[1]) {
                return `https://yandex.uz/map-widget/v1/org/${orgMatch[1]}/`;
            }

            return cleanUrl.replace('/maps/', '/map-widget/v1/');
        }

        // Final catch-all for other map providers (search on Google)
        return `https://maps.google.com/maps?q=${encodeURIComponent(cleanUrl)}&output=embed`;
    };

    const isEmbeddable = (url: string, address: string) => {
        return (url && url.trim().length > 0) || (address && address.trim().length > 0);
    };

    if (loading) {
        return (
            <div className="locations-loading">
                <div className="loading-shimmer"></div>
            </div>
        );
    }

    return (
        <div className="locations-v2">
            <div className="bg-blur-container">
                <div className="blur-blob blob-1"></div>
                <div className="blur-blob blob-2"></div>
            </div>

            <header className="locations-hero-v2 container">
                <div className="hero-content-v2 reveal visible">
                    <span className="hero-tag-v2">{lang === 'ru' ? 'Наши Контакты' : 'BIZNING KONTAKTLAR'}</span>
                    <h1 className="hero-title-v2">Con-Dor Locations</h1>
                    <p className="hero-desc-v2">
                        {lang === 'ru'
                            ? 'Найдите ближайший филиал Con-Dor и посетите нас сегодня.'
                            : 'O\'zingizga eng yaqin Con-Dor filialini toping va bizga tashrif buyuring.'}
                    </p>
                </div>
            </header>

            <main className="container locations-grid-v2">
                {branches.length > 0 ? (
                    branches.map((branch, idx) => {
                        const branchName = lang === 'ru' ? (branch.name_ru || branch.name) : branch.name;
                        const branchAddr = lang === 'ru' ? (branch.address_ru || branch.address) : branch.address;
                        const embedUrl = getEmbedUrl(branch.location_url, `${branchName} ${branchAddr}`);
                        const canShowMap = isEmbeddable(branch.location_url, branchAddr);

                        return (
                            <div key={branch.id} className="location-card-v2 reveal visible" style={{ animationDelay: `${idx * 0.15}s` }}>
                                <div className="card-inner-v2">
                                    <div className="card-top-v2">
                                        <div className="card-info-v2">
                                            <div className="branch-meta-v2">
                                                <span className="branch-id-v2">Loc. 0{idx + 1}</span>
                                                <div className="branch-badge-v2">
                                                    <span className="pulse-dot"></span>
                                                    {lang === 'ru' ? 'Активно' : 'Aktiv'}
                                                </div>
                                            </div>
                                            <h2 className="branch-title-v2">
                                                {lang === 'ru' ? (branch.name_ru || branch.name) : branch.name}
                                            </h2>

                                            <div className="info-rows-v2">
                                                <div className="info-row-v2">
                                                    <div className="info-icon-v2"><MapPinIcon size={18} /></div>
                                                    <div className="info-text-v2">
                                                        <label>{lang === 'ru' ? 'Адрес' : 'Manzil'}</label>
                                                        <p>{lang === 'ru' ? (branch.address_ru || branch.address) : branch.address}</p>
                                                    </div>
                                                </div>
                                                <div className="info-row-v2">
                                                    <div className="info-icon-v2"><GlobeIcon size={18} /></div>
                                                    <div className="info-text-v2">
                                                        <label>{lang === 'ru' ? 'Время работы' : 'Ish vaqti'}</label>
                                                        <p>{lang === 'ru' ? (branch.work_hours_ru || branch.work_hours) : branch.work_hours}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-actions-v2">
                                            <a href={`tel:${branch.phone || settings?.phone}`} className="phone-btn-v2">
                                                <span>{branch.phone || settings?.phone}</span>
                                            </a>
                                            <a
                                                href={branch.location_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="map-btn-v2"
                                            >
                                                {lang === 'ru' ? 'Показать маршрут' : 'Yo\'nalishni ko\'rsatish'}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="card-visual-v2">
                                        <div className="map-view-v2">
                                            {canShowMap ? (
                                                <iframe
                                                    title={`Map-${branch.id}`}
                                                    src={embedUrl}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    className="location-iframe-v2"
                                                ></iframe>
                                            ) : (
                                                <div className="map-fallback-v2">
                                                    <div className="fallback-icon-v2"><MapPinIcon size={48} /></div>
                                                    <p>{lang === 'ru' ? 'Карта недоступна' : 'Xarita mavjud emas'}</p>
                                                    <a href={branch.location_url} target="_blank" rel="noopener noreferrer">
                                                        {lang === 'ru' ? 'Открыть в браузере' : 'Brauzerda ochish'}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-locations-v2">
                        <MapPinIcon size={64} />
                        <h3>{lang === 'ru' ? 'Локации не найдены' : 'Lokatsiyalar topilmadi'}</h3>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LocationsPage;
