import React, { useState, useContext } from 'react';
import { usePantry } from '../context/PantryContext';
import { LanguageContext } from '../context/LanguageContext';
import { FirestorePantry } from '../services/db/types';
import { v4 as uuidv4 } from 'uuid';
import { locations } from '../i18n/translations';
import { useAuth } from '../context/AuthContext';
import ComboBox from './ComboBox';
import DeletePantryDialog from './DeletePantryDialog';
import { TrashIcon, ShareIcon } from '@heroicons/react/24/outline';
import SharePantryDialog from './SharePantryDialog';

export default function PantrySelector() {
    const { pantries, currentPantry, setCurrentPantry, savePantry, deletePantry } = usePantry();
    const { user } = useAuth();
    const { t, language } = useContext(LanguageContext);
    const [isCreating, setIsCreating] = useState(false);
    const [newPantryName, setNewPantryName] = useState('');
    const [newPantryLocation, setNewPantryLocation] = useState('');
    const [pantryToDelete, setPantryToDelete] = useState<FirestorePantry | null>(null);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

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
            <div className="flex items-center gap-2 flex-grow">
                <select
                    className="px-4 py-2 border rounded-lg flex-grow"
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
                {currentPantry && (
                    <>
                        <button
                            onClick={() => setIsShareDialogOpen(true)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title={t.share}
                        >
                            <ShareIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setPantryToDelete(currentPantry)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                            title={t.delete}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

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

            <DeletePantryDialog
                pantry={pantryToDelete!}
                isOpen={!!pantryToDelete}
                onConfirm={async () => {
                    await deletePantry(pantryToDelete!.id);
                    setPantryToDelete(null);
                }}
                onCancel={() => setPantryToDelete(null)}
            />

            {currentPantry && (
                <SharePantryDialog
                    pantry={currentPantry}
                    isOpen={isShareDialogOpen}
                    onClose={() => setIsShareDialogOpen(false)}
                />
            )}
        </div>
    );
} 