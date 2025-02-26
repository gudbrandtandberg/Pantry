import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FirestorePantry } from '../services/db/types';
import { FirestorePantryService } from '../services/db/firestore-pantry';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface PantryError extends Error {
    code?: string;
}

interface PantryContextType {
    pantries: FirestorePantry[];
    currentPantry: FirestorePantry | null;
    setCurrentPantry: (pantry: FirestorePantry) => void;
    savePantry: (pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>) => Promise<void>;
    deletePantry: (id: string) => Promise<void>;
    addItem: (list: 'inStock' | 'shoppingList', item: Omit<PantryItem, 'lastUpdated' | 'id'>) => Promise<void>;
    updateItem: (list: 'inStock' | 'shoppingList', item: PantryItem) => Promise<void>;
    removeItem: (list: 'inStock' | 'shoppingList', itemId: string) => Promise<void>;
    moveItem: (fromList: 'inStock' | 'shoppingList', toList: 'inStock' | 'shoppingList', itemId: string) => Promise<void>;
    loading: boolean;
    error: PantryError | null;
}

const PantryContext = createContext<PantryContextType | null>(null);

const pantryService = new FirestorePantryService();

function PantryProvider({ children }: { children: ReactNode }) {
    const [pantries, setPantries] = useState<FirestorePantry[]>([]);
    const [currentPantry, setCurrentPantry] = useState<FirestorePantry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PantryError | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log('No user, clearing pantries');
            setPantries([]);
            setCurrentPantry(null);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        console.log('Loading pantries for user:', user.id);
        pantryService.getUserPantries(user.id)
            .then(loadedPantries => {
                console.log('Loaded pantries:', loadedPantries);
                setPantries(loadedPantries);
                if (loadedPantries.length > 0) {
                    setCurrentPantry(loadedPantries[0]);
                }
            })
            .catch(err => {
                console.error('Error loading pantries:', err, err.stack);
                setError(err as PantryError);
            })
            .finally(() => setLoading(false));
    }, [user]);

    const savePantry = async (pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>) => {
        if (!user) return;
        
        const newPantry = await pantryService.createPantry({
            ...pantry,
            createdBy: user.id
        });
        
        const updatedPantries = await pantryService.getUserPantries(user.id);
        setPantries(updatedPantries);
        setCurrentPantry(newPantry);
    };

    const deletePantry = async (id: string) => {
        if (!user) return;
        
        await pantryService.deletePantry(id);
        const updatedPantries = await pantryService.getUserPantries(user.id);
        setPantries(updatedPantries);
        if (currentPantry?.id === id) {
            setCurrentPantry(updatedPantries[0] || null);
        }
    };

    const addItem = async (list: 'inStock' | 'shoppingList', item: Omit<PantryItem, 'lastUpdated' | 'id'>) => {
        console.log('Adding item in PantryContext:', { list, item, currentPantry });
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        try {
            await pantryService.addItem(currentPantry.id, list, {
                ...item,
                id: uuidv4()
            });
            
            console.log('Item added, refreshing pantry');
            // Refresh current pantry
            const updated = await pantryService.getPantry(currentPantry.id);
            console.log('Got updated pantry:', updated);
            if (updated) setCurrentPantry(updated);
        } catch (err) {
            console.error('Error adding item:', err);
            setError(err as PantryError);
            throw err;
        }
    };

    const updateItem = async (list: 'inStock' | 'shoppingList', item: PantryItem) => {
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        try {
            await pantryService.updateItem(currentPantry.id, list, item);
            const updated = await pantryService.getPantry(currentPantry.id);
            if (updated) setCurrentPantry(updated);
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err as PantryError);
            throw err;
        }
    };

    const removeItem = async (list: 'inStock' | 'shoppingList', itemId: string) => {
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        try {
            await pantryService.removeItem(currentPantry.id, list, itemId);
            const updated = await pantryService.getPantry(currentPantry.id);
            if (updated) setCurrentPantry(updated);
        } catch (err) {
            console.error('Error removing item:', err);
            setError(err as PantryError);
            throw err;
        }
    };

    const moveItem = async (fromList: 'inStock' | 'shoppingList', toList: 'inStock' | 'shoppingList', itemId: string) => {
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        try {
            await pantryService.moveItem(currentPantry.id, fromList, toList, itemId);
            const updated = await pantryService.getPantry(currentPantry.id);
            if (updated) setCurrentPantry(updated);
        } catch (err) {
            console.error('Error moving item:', err);
            setError(err as PantryError);
            throw err;
        }
    };

    return (
        <PantryContext.Provider value={{
            pantries,
            currentPantry,
            setCurrentPantry,
            savePantry,
            deletePantry,
            addItem,
            updateItem,
            removeItem,
            moveItem,
            loading,
            error
        }}>
            {children}
        </PantryContext.Provider>
    );
}

function usePantry() {
    const context = useContext(PantryContext);
    if (!context) {
        throw new Error('usePantry must be used within a PantryProvider');
    }
    return context;
}

export { PantryProvider, usePantry }; 