import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { useUser } from './UserContext';

const LanguageContext = createContext<{
    language: 'no' | 'en' | 'ru';
    setLanguage: (lang: string) => void;
    t: typeof translations.en;
    loading: boolean;
}>({ language: 'no', setLanguage: () => {}, t: translations.no, loading: true });

function LanguageProvider({ children }: { children: ReactNode }) {
    const { userData, updatePreferences } = useUser();
    const [language, setInternalLanguage] = useState<'no' | 'en' | 'ru' | null>(null);
    const [loading, setLoading] = useState(true);
    const t = translations[language || 'no'];  // Fallback only for type safety

    // Load language from user preferences
    useEffect(() => {
        if (userData?.preferences.language) {
            setInternalLanguage(userData.preferences.language);
            setLoading(false);
        } else {
            setInternalLanguage('no');  // Default only after we know user has no preference
            setLoading(false);
        }
    }, [userData]);

    const setLanguage = async (newLang: string) => {
        setInternalLanguage(newLang as 'no' | 'en' | 'ru');
        await updatePreferences({ language: newLang as 'no' | 'en' | 'ru' });
    };

    return (
        <LanguageContext.Provider value={{ 
            language: language || 'no', 
            setLanguage, 
            t, 
            loading: loading || language === null 
        }}>
            {loading ? null : children}
        </LanguageContext.Provider>
    );
}

export { LanguageContext, LanguageProvider }; 