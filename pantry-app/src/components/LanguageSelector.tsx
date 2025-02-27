import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function LanguageSelector() {
    const { language, setLanguage } = useContext(LanguageContext);

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'no' | 'en' | 'ru')}
            className="px-2 py-1 rounded border"
        >
            <option value="no">Norsk</option>
            <option value="en">English</option>
            <option value="ru">Русский</option>
        </select>
    );
} 