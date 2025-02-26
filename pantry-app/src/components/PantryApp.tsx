import React, { useContext } from 'react';
import { usePantry } from '../context/PantryContext';
import PantrySelector from './PantrySelector';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import ItemList from './ItemList';

export default function PantryApp() {
    const { currentPantry } = usePantry();
    const { t } = useContext(LanguageContext);
    const { signOut } = useAuth();
    const { userData } = useUser();

    if (!currentPantry) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{t.title}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">{userData?.displayName}</span>
                        <button
                            onClick={signOut}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            {t.signOut}
                        </button>
                    </div>
                </div>
                <PantrySelector />
                <p className="text-gray-600 mt-4">{t.selectPantry}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">{userData?.displayName}</span>
                    <button
                        onClick={signOut}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        {t.signOut}
                    </button>
                </div>
            </div>
            <PantrySelector />
            
            {currentPantry && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <ItemList type="inStock" />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <ItemList type="shoppingList" />
                    </div>
                </div>
            )}
        </div>
    );
} 