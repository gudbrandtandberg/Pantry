import React, { useContext } from 'react';
import { usePantry } from '../context/PantryContext';
import PantrySelector from './PantrySelector';
import ProductList from './ProductList';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function PantryApp() {
    const { currentPantry } = usePantry();
    const { t } = useContext(LanguageContext);
    const { signOut } = useAuth();

    if (!currentPantry) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{t.title}</h1>
                    <button
                        onClick={signOut}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        {t.signOut}
                    </button>
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
                <button
                    onClick={signOut}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                    {t.signOut}
                </button>
            </div>
            <PantrySelector />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ProductList 
                    title={t.inStock}
                    products={currentPantry.inStock} 
                    listType="inStock" 
                />
                <ProductList 
                    title={t.shoppingList}
                    products={currentPantry.shoppingList} 
                    listType="shoppingList" 
                />
            </div>
        </div>
    );
} 