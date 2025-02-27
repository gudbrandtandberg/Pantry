import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../types';
import { units } from '../i18n/translations';

interface ProductFormProps {
    onSubmit: (product: Product) => void;
    onCancel: () => void;
}

export default function ProductForm({
    onSubmit,
    onCancel
}: ProductFormProps) {
    const { t, language } = useContext(LanguageContext);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const product: Product = {
            id: uuidv4(),
            name: name.trim(),
            quantity: quantity ? Number(quantity) : undefined,
            unit: unit.trim() || undefined,
            lastUpdated: Date.now()
        };

        onSubmit(product);
        setName('');
        setQuantity('');
        setUnit('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                type="text"
                placeholder={t.pantryName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder={t.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-24 px-4 py-2 border rounded-lg"
                />
                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                >
                    <option value="">{t.unit}</option>
                    {units[language].map((u: string) => (
                        <option key={u} value={u}>{u}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    {t.addItem}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    {t.cancel}
                </button>
            </div>
        </form>
    );
} 