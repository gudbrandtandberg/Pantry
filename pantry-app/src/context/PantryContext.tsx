import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { doc, onSnapshot, collection, query, where, select } from 'firebase/firestore';
import { db } from '../services/db/firestore';
import { FirestorePantry, PantryItem } from '../services/db/types';
import { FirestorePantryService } from '../services/db/firestore-pantry';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

interface PantryError extends Error {
    code?: string;
}

interface PantryContextType {
    pantries: FirestorePantry[];
    currentPantry: FirestorePantry | null;
    setCurrentPantry: (pantry: FirestorePantry | null) => void;
    savePantry: (pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>) => Promise<void>;
    deletePantry: (id: string) => Promise<void>;
    addItem: (list: 'inStock' | 'shoppingList', item: Omit<PantryItem, 'id' | 'lastUpdated'>) => Promise<void>;
    updateItem: (list: 'inStock' | 'shoppingList', item: PantryItem) => Promise<void>;
    removeItem: (list: 'inStock' | 'shoppingList', itemId: string) => Promise<void>;
    moveItem: (fromList: 'inStock' | 'shoppingList', toList: 'inStock' | 'shoppingList', itemId: string) => Promise<void>;
    loading: boolean;
    error: PantryError | null;
    syncStatus: 'synced' | 'syncing' | 'error';
}

const PantryContext = createContext<PantryContextType | null>(null);

const pantryService = new FirestorePantryService();

export function PantryProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [pantries, setPantries] = useState<FirestorePantry[]>([]);
    const [currentPantry, setCurrentPantry] = useState<FirestorePantry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PantryError | null>(null);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

    useEffect(() => {
        if (!user) {
            console.log('No user, clearing pantries');
            setPantries([]);
            setCurrentPantry(null);
            setLoading(false);
            return;
        }
        
        const q = query(
            collection(db, 'pantries'),
            where('members', 'array-contains', user.id),
            select(['id', 'name', 'location', 'createdBy'])
        );
        
        const unsubscribe = onSnapshot(
            q,
            { includeMetadataChanges: false },
            (snapshot) => {
                const loadedPantries = snapshot.docs.map(doc => doc.data() as FirestorePantry);
                setPantries(loadedPantries);
                
                // Set first pantry as current if none selected
                if (!currentPantry && loadedPantries.length > 0) {
                    setCurrentPantry(loadedPantries[0]);
                }
                
                setLoading(false);
            },
            (error) => {
                console.error('Error watching pantries:', error);
                setError(error as PantryError);
                setLoading(false);
            }
        );
        
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (!currentPantry) return;
        
        setSyncStatus('syncing');
        
        const unsubscribe = onSnapshot(
            doc(db, 'pantries', currentPantry.id),
            (doc) => {
                if (!doc.exists()) {
                    console.warn('Pantry no longer exists:', currentPantry.id);
                    setCurrentPantry(null);
                    setSyncStatus('error');
                    return;
                }
                
                const updatedPantry = doc.data() as FirestorePantry;
                setCurrentPantry(updatedPantry);
                
                setPantries(prev => prev.map(p => 
                    p.id === updatedPantry.id ? updatedPantry : p
                ));
                
                setSyncStatus('synced');
            },
            (error) => {
                console.error('Error watching pantry:', error);
                setSyncStatus('error');
            }
        );
        
        return () => unsubscribe();
    }, [currentPantry?.id]);

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

    const addItem = async (list: 'inStock' | 'shoppingList', item: Omit<PantryItem, 'id' | 'lastUpdated'>) => {
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        // Create the new item with ID and timestamp
        const newItem: PantryItem = {
            ...item,
            id: uuidv4(),
            lastUpdated: Date.now()
        };
        
        // Optimistically update the UI
        const previousPantry = currentPantry;
        setCurrentPantry({
            ...currentPantry,
            [list]: [...(currentPantry[list] || []), newItem]
        });
        
        try {
            // Actually perform the server update
            await pantryService.addItem(currentPantry.id, list, newItem);
        } catch (err) {
            console.error('Error adding item:', err);
            // Roll back on error
            setCurrentPantry(previousPantry);
            setError(err as PantryError);
            throw err;
        }
    };

    const updateItem = async (list: 'inStock' | 'shoppingList', item: PantryItem) => {
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        // Create updated item with new timestamp
        const updatedItem = { ...item, lastUpdated: Date.now() };
        
        // Optimistically update the UI
        const previousPantry = currentPantry;
        setCurrentPantry({
            ...currentPantry,
            [list]: currentPantry[list].map(i => 
                i.id === updatedItem.id ? updatedItem : i
            )
        });
        
        try {
            await pantryService.updateItem(currentPantry.id, list, updatedItem);
        } catch (err) {
            console.error('Error updating item:', err);
            // Roll back on error
            setCurrentPantry(previousPantry);
            setError(err as PantryError);
            throw err;
        }
    };

    const removeItem = async (list: 'inStock' | 'shoppingList', itemId: string) => {
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        // Optimistically update the UI
        const previousPantry = currentPantry;
        setCurrentPantry({
            ...currentPantry,
            [list]: currentPantry[list].filter(i => i.id !== itemId)
        });
        
        try {
            await pantryService.removeItem(currentPantry.id, list, itemId);
        } catch (err) {
            console.error('Error removing item:', err);
            // Roll back on error
            setCurrentPantry(previousPantry);
            setError(err as PantryError);
            throw err;
        }
    };

    const moveItem = async (fromList: 'inStock' | 'shoppingList', toList: 'inStock' | 'shoppingList', itemId: string) => {
        if (!currentPantry) throw new Error('No pantry selected');
        setError(null);
        
        // Find the item to move
        const item = currentPantry[fromList]?.find(i => i.id === itemId);
        if (!item) throw new Error('Item not found');
        
        // Create updated item with new timestamp
        const movedItem = { ...item, lastUpdated: Date.now() };
        
        // Optimistically update the UI
        const previousPantry = currentPantry;
        setCurrentPantry({
            ...currentPantry,
            [fromList]: currentPantry[fromList].filter(i => i.id !== itemId),
            [toList]: [...currentPantry[toList], movedItem]
        });
        
        try {
            await pantryService.moveItem(currentPantry.id, fromList, toList, itemId);
        } catch (err) {
            console.error('Error moving item:', err);
            // Roll back on error
            setCurrentPantry(previousPantry);
            setError(err as PantryError);
            throw err;
        }
    };

    // Add debouncing for rapid updates
    const debouncedSetCurrentPantry = useMemo(
        () => debounce((pantry: FirestorePantry | null) => {
            setCurrentPantry(pantry);
        }, 300),
        []
    );

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
            error,
            syncStatus
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

export { usePantry }; 