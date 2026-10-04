import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';

interface SiteSettings {
    shop_name: string;
    tagline: string;
    tagline_ru: string;
    currency: string;
    free_shipping_threshold: number;
    phone: string;
    email: string;
    address: string;
    workday_hours: string;
    saturday_hours: string;
    instagram_url: string;
    facebook_url: string;
    telegram_url: string;
    copyright_text: string;
    copyright_text_ru: string;
    seo_title: string;
    seo_description: string;
}

interface SettingsContextType {
    settings: SiteSettings | null;
    loading: boolean;
    error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await api.get<SiteSettings>('/api/settings/public');
                setSettings(data);
            } catch (err: any) {
                console.error('Failed to fetch site settings:', err);
                setError(err.message || 'Sozlamalarni yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings) {
            // Dynamic title
            if (settings.seo_title) {
                document.title = settings.seo_title;
            } else {
                document.title = settings.shop_name;
            }

            // Dynamic meta description
            if (settings.seo_description) {
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    (metaDesc as HTMLMetaElement).name = 'description';
                    document.head.appendChild(metaDesc);
                }
                (metaDesc as HTMLMetaElement).content = settings.seo_description;
            }
        }
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, loading, error }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
