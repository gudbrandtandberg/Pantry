import React, { createContext, useState, ReactNode } from 'react';
import { translations } from '../i18n/translations';

export const LanguageContext = createContext<{
    language: string;
    setLanguage: (lang: string) => void;
    t: typeof translations.en;
}>({ language: 'no', setLanguage: () => {}, t: translations.no });

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState('no');  // Default to Norwegian
    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
} 