import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/db/firestore';
import { FirestorePantry, PantryItem } from '../services/db/types';
import { FirestorePantryService } from '../services/db/firestore-pantry';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { LanguageContext } from './LanguageContext';

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
    createInviteLink: (pantryId: string, code: string) => Promise<void>;
    isOwner: (pantryId: string) => boolean;
    joinPantryWithCode: (code: string) => Promise<void>;
}

const PantryContext = createContext<PantryContextType | null>(null);

const pantryService = new FirestorePantryService();

export function PantryProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { t } = useContext(LanguageContext);
    const [pantries, setPantries] = useState<FirestorePantry[]>([]);
    const [currentPantry, setCurrentPantry] = useState<FirestorePantry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PantryError | null>(null);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

    useEffect(() => {
        if (!user) {
            setPantries([]);
            setCurrentPantry(null);
            setLoading(false);
            return;
        }
        
        // Run migration for old pantries
        const migratePantries = async () => {
            try {
                await pantryService.migrateOldPantries(user.id);
            } catch (err) {
                setError(err as PantryError);
            }
        };
        
        migratePantries();
        
        // Query pantries where user is either creator or member
        const q = query(
            collection(db, 'pantries')
        );
        
        const unsubscribe = onSnapshot(
            q,
            { includeMetadataChanges: false },
            (snapshot) => {
                const loadedPantries = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                })) as FirestorePantry[];
                
                // Filter pantries where user is a member
                const userPantries = loadedPantries.filter(pantry => 
                    pantry.members && 
                    pantry.members[user.id] &&
                    ['owner', 'editor'].includes(pantry.members[user.id].role)
                );
                
                setPantries(userPantries);
                
                // Set first pantry as current if none selected
                if (!currentPantry && userPantries.length > 0) {
                    setCurrentPantry(userPantries[0]);
                }
                
                setLoading(false);
            },
            (error) => {
                setError(error as PantryError);
                setLoading(false);
            }
        );
        
        return () => unsubscribe();
        // We only want to run this effect when the user changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (!currentPantry) return;
        
        setSyncStatus('syncing');
        
        const unsubscribe = onSnapshot(
            doc(db, 'pantries', currentPantry.id),
            (doc) => {
                if (!doc.exists()) {
                    setCurrentPantry(null);
                    setSyncStatus('error');
                    setError(new Error('Pantry no longer exists') as PantryError);
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
                setSyncStatus('error');
                setError(error as PantryError);
            }
        );
        
        return () => unsubscribe();
        // We only want to re-subscribe when the ID changes, not on every pantry update
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPantry?.id]);

    const savePantry = async (pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>) => {
        if (!user) return;
        
        const pantryId = uuidv4();
        
        setSyncStatus('syncing');
        
        const newPantry = await pantryService.createPantry({
            ...pantry,
            id: pantryId,
            createdBy: user.id,
            inStock: [],
            shoppingList: [],
            members: {
                [user.id]: {
                    role: 'owner',
                    addedAt: Date.now(),
                    addedBy: user.id
                }
            },
            inviteLinks: {}
        });
        
        // Wait for the next Firestore sync before setting current pantry
        const unsubscribe = onSnapshot(
            doc(db, 'pantries', pantryId),
            (doc) => {
                if (doc.exists()) {
                    setCurrentPantry(doc.data() as FirestorePantry);
                    setSyncStatus('synced');
                    unsubscribe();
                }
            }
        );
    };

    const deletePantry = async (id: string) => {
        if (!user) return;
        
        setSyncStatus('syncing');
        await pantryService.deletePantry(id);
        
        // The pantries list will update automatically via the subscription
        // Just need to select a new pantry if the current one was deleted
        if (currentPantry?.id === id) {
            const remainingPantries = pantries.filter(p => p.id !== id);
            setCurrentPantry(remainingPantries[0] || null);
        }
        setSyncStatus('synced');
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
            await pantryService.addItem(currentPantry.id, list, newItem);
        } catch (err) {
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
            setCurrentPantry(previousPantry);
            setError(err as PantryError);
            throw err;
        }
    };

    const isOwner = (pantryId: string) => {
        const pantry = pantries.find(p => p.id === pantryId);
        return pantry?.members && user?.id ? pantry.members[user.id]?.role === 'owner' : false;
    };

    const createInviteLink = async (pantryId: string, code: string) => {
        if (!user || !isOwner(pantryId)) {
            throw new Error('Unauthorized');
        }
        if (!currentPantry) {
            throw new Error('No pantry selected');
        }

        const updatedPantry = {
            ...currentPantry,
            inviteLinks: {
                ...currentPantry.inviteLinks,
                [code]: {
                    createdAt: Date.now(),
                }
            }
        };
        
        await pantryService.updatePantry(pantryId, updatedPantry);
    };

    const joinPantryWithCode = async (code: string) => {
        if (!user) throw new Error('Must be logged in');
        
        // Find pantry with this invite code
        const pantryQuery = query(
            collection(db, 'pantries'),
            where(`inviteLinks.${code}.used`, '==', false)
        );
        
        const querySnapshot = await getDocs(pantryQuery);
        const pantry = querySnapshot.docs[0]?.data() as FirestorePantry | undefined;
        
        if (!pantry) {
            throw new Error(t.invalidInviteLink);
        }
        
        const invite = pantry.inviteLinks?.[code];
        if (!invite) {
            throw new Error(t.invalidInviteLink);
        }
        
        if (pantry.members[user.id]) {
            throw new Error(t.alreadyMember);
        }
        
        // Update member data
        const updateData: Partial<FirestorePantry> = {
            [`members.${user.id}`]: {
                role: 'editor',
                addedAt: Date.now(),
                addedBy: user.id
            },
            [`inviteLinks.${code}.used`]: true
        };
        
        await pantryService.updatePantry(pantry.id, updateData);
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
            error,
            syncStatus,
            createInviteLink,
            isOwner,
            joinPantryWithCode,
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