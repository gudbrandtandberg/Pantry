import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

interface ComboBoxProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    allowCustom?: boolean;
    className?: string;
}

export default function ComboBox({ value, onChange, options, placeholder, allowCustom = false, className = '' }: ComboBoxProps) {
    const [isCustom, setIsCustom] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const { t } = useContext(LanguageContext);

    // Reset custom state when value is cleared externally
    React.useEffect(() => {
        if (!value) {
            setIsCustom(false);
            setCustomValue('');
        }
    }, [value]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '__custom__') {
            setIsCustom(true);
            setCustomValue('');
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
            {allowCustom && <option value="__custom__">{t.customValue}</option>}
        </select>
    );
} 