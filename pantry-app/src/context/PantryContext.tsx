import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/db/firestore';
import { FirestorePantry, PantryItem } from '../services/db/types';
import { FirestorePantryService } from '../services/db/firestore-pantry';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';
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
            console.log('No user, clearing pantries');
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
                console.error('Error migrating pantries:', err);
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
                
                console.log('Loaded pantries:', userPantries);
                setPantries(userPantries);
                
                // Set first pantry as current if none selected
                if (!currentPantry && userPantries.length > 0) {
                    setCurrentPantry(userPantries[0]);
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
        console.log('Watching pantry:', currentPantry.id, 'with data:', currentPantry);
        
        const unsubscribe = onSnapshot(
            doc(db, 'pantries', currentPantry.id),
            (doc) => {
                console.log('Snapshot received:', doc.data());
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
                console.error('Error watching pantry:', error, 'for pantry:', currentPantry.id);
                setSyncStatus('error');
            }
        );
        
        return () => unsubscribe();
    }, [currentPantry?.id]);

    const savePantry = async (pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>) => {
        if (!user) return;
        
        const pantryId = uuidv4();
        
        console.log('Creating pantry with data:', {
            id: pantryId,
            ...pantry,
            createdBy: user.id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
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
        
        const newPantry = await pantryService.createPantry({
            id: pantryId,
            ...pantry,
            createdBy: user.id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
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
        
        console.log('Created pantry:', newPantry);
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

    const isOwner = (pantryId: string) => {
        const pantry = pantries.find(p => p.id === pantryId);
        return pantry?.members && user?.id ? pantry.members[user.id]?.role === 'owner' : false;
    };

    const createInviteLink = async (pantryId: string, code: string) => {
        if (!user || !isOwner(pantryId)) {
            throw new Error('Unauthorized');
        }

        const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        
        await pantryService.updatePantry(pantryId, {
            inviteLinks: {
                [code]: {
                    createdAt: Date.now(),
                    createdBy: user.id,
                    expiresAt,
                    used: false
                }
            }
        });
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
        
        if (invite.expiresAt < Date.now()) {
            throw new Error(t.inviteLinkExpired);
        }
        
        if (pantry.members[user.id]) {
            throw new Error(t.alreadyMember);
        }
        
        // Add user as member and mark invite as used
        const updateData = {
            inviteCode: code,
            [`members.${user.id}`]: {
                role: 'editor',
                addedAt: Date.now(),
                addedBy: invite.createdBy
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