import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

interface ComboBoxProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    className?: string;
}

export default function ComboBox({ value, onChange, options, placeholder, className = '' }: ComboBoxProps) {
    const [isCustom, setIsCustom] = useState(false);
    const [customValue, setCustomValue] = useState(value);
    const { t } = useContext(LanguageContext);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '__custom__') {
            setIsCustom(true);
            setCustomValue(value);
        } else {
            onChange(value);
        }
    };

    if (isCustom) {
        return (
            <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onBlur={() => {
                    if (!customValue) {
                        setIsCustom(false);
                    } else {
                        onChange(customValue);
                    }
                }}
                placeholder={placeholder}
                className={`px-2 py-1 border rounded ${className}`}
                autoFocus
            />
        );
    }

    return (
        <select
            value={options.includes(value) ? value : value ? '__custom__' : ''}
            onChange={handleSelectChange}
            className={`px-2 py-1 border rounded ${className}`}
        >
            <option value="">{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
            <option value="__custom__">{t.customValue}</option>
        </select>
    );
} 