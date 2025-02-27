import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    writeBatch,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { db } from './firestore';
import { FirestorePantry, PantryService, PantryMember, PantryItem } from './types';

export class FirestorePantryService implements PantryService {
    async createPantry(pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>): Promise<FirestorePantry> {
        // Use the provided ID instead of letting Firestore generate one
        const docRef = doc(db, 'pantries', pantry.id);
        
        // Ensure all required fields are present
        const newPantry: FirestorePantry = {
            id: docRef.id,
            name: pantry.name,
            location: pantry.location,
            createdBy: pantry.createdBy,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            inStock: [],
            shoppingList: [],
            members: {
                [pantry.createdBy]: {
                    role: 'owner',
                    addedAt: Date.now(),
                    addedBy: pantry.createdBy
                }
            },
            inviteLinks: {}  // Add this to match our data structure
        };
        
        await setDoc(docRef, newPantry);
        return newPantry;
    }

    async getPantry(pantryId: string): Promise<FirestorePantry | null> {
        const docRef = doc(db, 'pantries', pantryId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            return null;
        }

        return docSnap.data() as FirestorePantry;
    }

    async getUserPantries(userId: string): Promise<FirestorePantry[]> {
        const pantryCollection = collection(db, 'pantries');
        const membershipRefs = await getDocs(pantryCollection);
        
        if (membershipRefs.empty) {
            return [];
        }

        const pantries: FirestorePantry[] = [];

        for (const pantryDoc of membershipRefs.docs) {
            const memberDoc = await getDoc(doc(db, 'pantries', pantryDoc.id, 'members', userId));
            if (memberDoc.exists()) {
                const data = pantryDoc.data();
                pantries.push({
                    ...data,
                    inStock: data.inStock || [],
                    shoppingList: data.shoppingList || []
                } as FirestorePantry);
            }
        }

        return pantries;
    }

    async updatePantry(id: string, data: Partial<FirestorePantry>): Promise<void> {
        const docRef = doc(db, 'pantries', id);
        await updateDoc(docRef, data);
    }

    async deletePantry(pantryId: string): Promise<void> {
        await deleteDoc(doc(db, 'pantries', pantryId));
    }

    async addMember(pantryId: string, member: PantryMember): Promise<void> {
        const memberRef = doc(db, 'pantries', pantryId, 'members', member.userId);
        await setDoc(memberRef, member);
    }

    async removeMember(pantryId: string, userId: string): Promise<void> {
        await deleteDoc(doc(db, 'pantries', pantryId, 'members', userId));
    }

    async addItem(
        pantryId: string, 
        list: 'inStock' | 'shoppingList', 
        item: Omit<PantryItem, 'lastUpdated'>
    ): Promise<void> {
        const docRef = doc(db, 'pantries', pantryId);
        
        // Clean up undefined values
        const cleanItem = {
            id: item.id,
            name: item.name,
            lastUpdated: Date.now(),
            ...(item.quantity !== undefined && { quantity: item.quantity }),
            ...(item.unit && { unit: item.unit })
        };
        
        await updateDoc(docRef, {
            [list]: arrayUnion(cleanItem),
            updatedAt: new Date()
        });

    }

    async updateItem(
        pantryId: string, 
        list: 'inStock' | 'shoppingList', 
        item: PantryItem
    ): Promise<void> {
        const docRef = doc(db, 'pantries', pantryId);
        const pantry = await this.getPantry(pantryId);
        
        if (!pantry) throw new Error('Pantry not found');
        
        const items = pantry[list] || [];
        const updatedItems = items.map(i => 
            i.id === item.id ? { ...item, lastUpdated: Date.now() } : i
        );
        
        await updateDoc(docRef, {
            [list]: updatedItems,
            updatedAt: new Date()
        });
    }

    async removeItem(
        pantryId: string, 
        list: 'inStock' | 'shoppingList', 
        itemId: string
    ): Promise<void> {
        const docRef = doc(db, 'pantries', pantryId);
        const pantry = await this.getPantry(pantryId);
        
        if (!pantry) throw new Error('Pantry not found');
        
        const items = pantry[list] || [];
        const itemToRemove = items.find(i => i.id === itemId);
        
        if (itemToRemove) {
            await updateDoc(docRef, {
                [list]: arrayRemove(itemToRemove),
                updatedAt: new Date()
            });
        }
    }

    async moveItem(
        pantryId: string,
        fromList: 'inStock' | 'shoppingList',
        toList: 'inStock' | 'shoppingList',
        itemId: string
    ): Promise<void> {
        const docRef = doc(db, 'pantries', pantryId);
        const pantry = await this.getPantry(pantryId);
        
        if (!pantry) throw new Error('Pantry not found');
        
        const sourceItems = pantry[fromList] || [];
        const item = sourceItems.find(i => i.id === itemId);
        
        if (item) {
            const movedItem: PantryItem = {
                ...item,
                lastUpdated: Date.now()
            };
            
            await updateDoc(docRef, {
                [fromList]: arrayRemove(item),
                [toList]: arrayUnion(movedItem),
                updatedAt: new Date()
            });
        }
    }

    async migrateOldPantries(userId: string): Promise<void> {
        const pantryCollection = collection(db, 'pantries');
        const q = query(pantryCollection, where('createdBy', '==', userId));
        const querySnapshot = await getDocs(q);

        const batch = writeBatch(db);
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!data.members) {
                batch.update(doc.ref, {
                    members: {
                        [userId]: {
                            role: 'owner',
                            addedAt: data.createdAt || Date.now(),
                            addedBy: userId
                        }
                    }
                });
            }
        });

        await batch.commit();
    }

    async createInviteLink(pantryId: string, code: string): Promise<void> {
        const docRef = doc(db, 'pantries', pantryId);
        await updateDoc(docRef, {
            [`inviteLinks.${code}`]: {
                createdAt: Date.now(),
                used: false
            }
        });
    }
} 