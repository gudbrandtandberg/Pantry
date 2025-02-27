import { useState, useContext } from 'react';
import { Product } from '../types';
import ProductForm from './ProductForm';
import { usePantry } from '../context/PantryContext';
import { LanguageContext } from '../context/LanguageContext';

interface ProductListProps {
    title: string;
    products: Product[];
    listType: 'inStock' | 'shoppingList';
}

export default function ProductList({ title, products, listType }: ProductListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const { currentPantry, savePantry } = usePantry();
    const { t } = useContext(LanguageContext);

    const handleAddProduct = (product: Product) => {
        if (!currentPantry) return;

        const updatedPantry = {
            ...currentPantry,
            [listType]: [...currentPantry[listType], product]
        };
        savePantry(updatedPantry);
        setIsAdding(false);
    };

    const handleMoveProduct = (product: Product) => {
        if (!currentPantry) return;

        const targetList = listType === 'inStock' ? 'shoppingList' : 'inStock';
        const updatedPantry = {
            ...currentPantry,
            [listType]: currentPantry[listType].filter(p => p.id !== product.id),
            [targetList]: [...currentPantry[targetList], { ...product, lastUpdated: Date.now() }]
        };
        savePantry(updatedPantry);
    };

    const handleDeleteProduct = (productId: string) => {
        if (!currentPantry) return;

        const updatedPantry = {
            ...currentPantry,
            [listType]: currentPantry[listType].filter(p => p.id !== productId)
        };
        savePantry(updatedPantry);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    {t.addItem}
                </button>
            </div>

            {isAdding && (
                <div className="mb-4">
                    <ProductForm
                        onSubmit={handleAddProduct}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            {products.length === 0 ? (
                <p className="text-gray-500">{t.noItems}</p>
            ) : (
                <ul className="space-y-2">
                    {products.map(product => (
                        <li key={product.id} className="flex justify-between items-center">
                            <span>{product.name}</span>
                            <div className="flex items-center gap-2">
                                {product.quantity && (
                                    <span className="text-gray-600">
                                        {product.quantity} {product.unit || 'units'}
                                    </span>
                                )}
                                <button
                                    onClick={() => handleMoveProduct(product)}
                                    className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    {listType === 'inStock' ? t.moveTo.shoppingList : t.moveTo.inStock}
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    {t.delete}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
} 