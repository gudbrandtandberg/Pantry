import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, collection, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/db/firestore';
import { FirestorePantry, PantryItem } from '../services/db/types';
import { FirestorePantryService } from '../services/db/firestore-pantry';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { LanguageContext } from './LanguageContext';
import { auth } from '../services/auth/firebase-auth';

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
        
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('Must be logged in');
        const userId = currentUser.uid;
        
        console.log('Attempting to join pantry with code:', code);
        console.log('Current user ID:', userId);
        
        const pantryQuery = query(
            collection(db, 'pantries'),
            where(`inviteLinks.${code}`, '!=', null)
        );
        
        const querySnapshot = await getDocs(pantryQuery);
        const pantryDoc = querySnapshot.docs[0];
        if (!pantryDoc) {
            console.log('No pantry found with code');
            throw new Error(t.invalidInviteLink);
        }
        
        const pantry = { id: pantryDoc.id, ...pantryDoc.data() } as FirestorePantry;
        console.log('Found pantry:', {
            id: pantry.id,
            members: pantry.members,
            inviteLinks: pantry.inviteLinks
        });
        
        const invite = pantry.inviteLinks?.[code];
        console.log('Found invite:', invite);
        if (!invite) {
            console.log('No invite found with code in pantry');
            throw new Error(t.invalidInviteLink);
        }
        
        if (pantry.members?.[userId]) {
            console.log('User already a member');
            throw new Error(t.alreadyMember);
        }
        
        console.log('Updating pantry with new member:', userId);
        
        try {
            const pantryRef = doc(db, 'pantries', pantry.id);
            
            // Do the update in two steps
            // 1. First ensure members object exists
            if (!pantry.members) {
                console.log('Creating members object...');
                await updateDoc(pantryRef, {
                    members: {},
                    inviteCode: code
                });
                console.log('Members object created');
            }
            
            // 2. Then add the new member
            console.log('Adding member with data:', {
                [`members.${userId}`]: {
                    role: 'editor',
                    addedAt: Date.now(),
                    addedBy: userId
                },
                inviteCode: code
            });
            
            await updateDoc(pantryRef, {
                [`members.${userId}`]: {
                    role: 'editor',
                    addedAt: Date.now(),
                    addedBy: userId
                },
                inviteCode: code
            });
            
            console.log('Successfully joined pantry');
            
            // Get the updated pantry data
            const updatedPantryDoc = await getDoc(pantryRef);
            if (updatedPantryDoc.exists()) {
                const updatedPantry = { 
                    id: updatedPantryDoc.id, 
                    ...updatedPantryDoc.data() 
                } as FirestorePantry;
                
                // Add to pantries list
                setPantries(prev => {
                    // Check if pantry already exists in list
                    const exists = prev.some(p => p.id === updatedPantry.id);
                    if (exists) {
                        // Update existing pantry
                        return prev.map(p => 
                            p.id === updatedPantry.id ? updatedPantry : p
                        );
                    }
                    // Add new pantry
                    return [...prev, updatedPantry];
                });
                
                // Set as current pantry
                setCurrentPantry(updatedPantry);
                
                console.log('Updated pantries list and set current pantry');
            }

        } catch (error) {
            console.error('Failed to join pantry:', error);
            if (error instanceof Error) {
                console.error('Error details:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
            throw error;
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