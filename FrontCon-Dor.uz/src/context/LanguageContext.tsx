import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Lang, translations } from '../i18n';

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<Lang>(() => {
        const saved = localStorage.getItem('app_lang');
        return (saved === 'uz' || saved === 'ru') ? saved : 'uz';
    });

    const setLang = useCallback((newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem('app_lang', newLang);
    }, []);

    const t = useCallback((key: string): string => {
        return translations[lang][key] || key;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
