import React, { useState } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FirestorePantry } from '../services/db/types';

interface DeletePantryDialogProps {
    pantry: FirestorePantry;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    isOpen: boolean;
}

export default function DeletePantryDialog({ pantry, onConfirm, onCancel, isOpen }: DeletePantryDialogProps) {
    const { t } = useContext(LanguageContext);
    const [confirmName, setConfirmName] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmName !== pantry.name) return;

        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
            setConfirmName('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-red-600 mb-4">
                    {t.deletePantryTitle}
                </h2>
                <p className="mb-4">
                    {t.deletePantryConfirm.replace('{name}', pantry.name)}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        placeholder={t.deletePantryPlaceholder}
                        className="w-full px-3 py-2 border rounded"
                        disabled={isDeleting}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            disabled={isDeleting}
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            disabled={confirmName !== pantry.name || isDeleting}
                        >
                            {isDeleting ? t.deleting : t.delete}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 