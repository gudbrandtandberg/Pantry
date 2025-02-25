import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function LanguageSelector() {
    const { language, setLanguage } = useContext(LanguageContext);

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 rounded border"
        >
            <option value="no">Norsk</option>
            <option value="en">English</option>
        </select>
    );
} 