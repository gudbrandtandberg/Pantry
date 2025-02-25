import React, { useContext } from 'react';
import { usePantry } from '../context/PantryContext';
import PantrySelector from './PantrySelector';
import ProductList from './ProductList';
import { LanguageContext } from '../context/LanguageContext';

export default function PantryApp() {
    const { currentPantry } = usePantry();
    const { t } = useContext(LanguageContext);

    if (!currentPantry) {
        return (
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
                <PantrySelector />
                <p className="text-gray-600 mt-4">{t.selectPantry}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
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