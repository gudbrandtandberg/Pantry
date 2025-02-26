import React, { useState, useContext } from 'react';
import { usePantry } from '../context/PantryContext';
import { LanguageContext } from '../context/LanguageContext';
import { FirestorePantry } from '../services/db/types';
import { v4 as uuidv4 } from 'uuid';
import { locations } from '../i18n/translations';
import { useAuth } from '../context/AuthContext';
import ComboBox from './ComboBox';

export default function PantrySelector() {
    const { pantries, currentPantry, setCurrentPantry, savePantry } = usePantry();
    const { user } = useAuth();
    const { t, language } = useContext(LanguageContext);
    const [isCreating, setIsCreating] = useState(false);
    const [newPantryName, setNewPantryName] = useState('');
    const [newPantryLocation, setNewPantryLocation] = useState('');

    const handleCreatePantry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPantryName.trim() || !user) return;

        const newPantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'> = {
            id: uuidv4(),
            name: newPantryName.trim(),
            location: newPantryLocation.trim(),
            createdBy: user.id,
            inStock: [],
            shoppingList: []
        };

        await savePantry(newPantry);
        setCurrentPantry(newPantry);
        setIsCreating(false);
        setNewPantryName('');
        setNewPantryLocation('');
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <select
                className="px-4 py-2 border rounded-lg"
                value={currentPantry?.id || ''}
                onChange={(e) => {
                    const selected = pantries.find(p => p.id === e.target.value);
                    if (selected) setCurrentPantry(selected);
                }}
            >
                <option value="">{t.selectPantry}</option>
                {pantries.map(pantry => (
                    <option key={pantry.id} value={pantry.id}>
                        {pantry.name} ({pantry.location})
                    </option>
                ))}
            </select>

            {!isCreating ? (
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    {t.createPantry}
                </button>
            ) : (
                <form onSubmit={handleCreatePantry} className="flex gap-2 items-start">
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder={t.pantryName}
                            value={newPantryName}
                            onChange={(e) => setNewPantryName(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        />
                        <ComboBox
                            value={newPantryLocation}
                            onChange={setNewPantryLocation}
                            options={locations[language]}
                            placeholder={t.location}
                            className="px-4 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        {t.save}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        {t.cancel}
                    </button>
                </form>
            )}
        </div>
    );
} 