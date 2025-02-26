import React, { useState } from 'react';
import { usePantry } from '../context/PantryContext';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { PantryItem } from '../services/db/types';

interface ItemListProps {
    type: 'inStock' | 'shoppingList';
}

export default function ItemList({ type }: ItemListProps) {
    const { currentPantry, addItem, removeItem, moveItem } = usePantry();
    const { t } = useContext(LanguageContext);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [newItemUnit, setNewItemUnit] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        try {
            setIsAdding(true);
            const newItem: Omit<PantryItem, 'lastUpdated' | 'id'> = {
                name: newItemName.trim(),
            };

            if (newItemQuantity) {
                newItem.quantity = Number(newItemQuantity);
            }

            if (newItemUnit && newItemUnit.trim()) {
                newItem.unit = newItemUnit.trim();
            }

            await addItem(type, newItem);

            // Clear form
            setNewItemName('');
            setNewItemQuantity('');
            setNewItemUnit('');
        } catch (err) {
            console.error('Failed to add item:', err);
        } finally {
            setIsAdding(false);
        }
    };

    const handleMoveItem = async (itemId: string) => {
        try {
            setLoadingItems(prev => new Set([...prev, itemId]));
            await moveItem(
                type,
                type === 'inStock' ? 'shoppingList' : 'inStock',
                itemId
            );
        } finally {
            setLoadingItems(prev => {
                const next = new Set(prev);
                next.delete(itemId);
                return next;
            });
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            setLoadingItems(prev => new Set([...prev, itemId]));
            await removeItem(type, itemId);
        } finally {
            setLoadingItems(prev => {
                const next = new Set(prev);
                next.delete(itemId);
                return next;
            });
        }
    };

    const items = type === 'inStock' ? currentPantry?.inStock : currentPantry?.shoppingList;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">
                {type === 'inStock' ? t.inStock : t.shoppingList}
            </h2>

            <form onSubmit={handleAddItem} className="flex gap-2">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={t.itemName}
                    className="px-2 py-1 border rounded"
                    disabled={isAdding}
                />
                <input
                    type="number"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder={t.quantity}
                    className="px-2 py-1 border rounded w-20"
                    disabled={isAdding}
                />
                <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder={t.unit}
                    className="px-2 py-1 border rounded w-20"
                    disabled={isAdding}
                />
                <button
                    type="submit"
                    className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={isAdding}
                >
                    {isAdding ? '...' : t.add}
                </button>
            </form>

            <ul className="space-y-2">
                {items?.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 p-2 bg-white rounded shadow">
                        <span>
                            {item.name}
                            {item.quantity && (
                                <span className="ml-2 text-gray-600">
                                    {item.quantity} {item.unit}
                                </span>
                            )}
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleMoveItem(item.id)}
                                className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                disabled={loadingItems.has(item.id)}
                            >
                                {loadingItems.has(item.id) ? '...' : 
                                    type === 'inStock' ? t.moveToShoppingList : t.moveToInStock}
                            </button>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                disabled={loadingItems.has(item.id)}
                            >
                                {loadingItems.has(item.id) ? '...' : t.remove}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
} 