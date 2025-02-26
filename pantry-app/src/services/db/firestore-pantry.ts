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
    arrayUnion, 
    arrayRemove 
} from 'firebase/firestore';
import { db } from './firestore';
import { FirestorePantry, PantryService, PantryMember, PantryItem } from './types';

export class FirestorePantryService implements PantryService {
    async createPantry(pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>): Promise<FirestorePantry> {
        const now = new Date();
        const newPantry: FirestorePantry = {
            ...pantry,
            inStock: [],
            shoppingList: [],
            createdAt: now,
            updatedAt: now
        };

        // Create the pantry document
        await setDoc(doc(db, 'pantries', pantry.id), newPantry);

        // Add creator as owner
        await this.addMember(pantry.id, {
            userId: pantry.createdBy,
            role: 'owner',
            joinedAt: now
        });

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
        console.log('Getting pantries for user:', userId);
        // Get all pantries where user is a member
        const pantryCollection = collection(db, 'pantries');
        const membershipRefs = await getDocs(pantryCollection);
        
        if (membershipRefs.empty) {
            console.log('No pantries found in collection');
            return [];
        }

        console.log('Found pantry docs:', membershipRefs.docs.map(d => ({id: d.id, data: d.data()})));
        const pantries: FirestorePantry[] = [];

        for (const pantryDoc of membershipRefs.docs) {
            console.log('Checking membership for pantry:', pantryDoc.id);
            const memberDoc = await getDoc(doc(db, 'pantries', pantryDoc.id, 'members', userId));
            console.log('Member doc exists?', memberDoc.exists(), memberDoc.data());
            if (memberDoc.exists()) {
                const data = pantryDoc.data();
                // Ensure arrays are initialized
                pantries.push({
                    ...data,
                    inStock: data.inStock || [],
                    shoppingList: data.shoppingList || []
                } as FirestorePantry);
            }
        }

        console.log('Returning pantries:', pantries);
        return pantries;
    }

    async updatePantry(pantryId: string, data: Partial<FirestorePantry>): Promise<void> {
        const docRef = doc(db, 'pantries', pantryId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date()
        });
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
        console.log('Adding item to pantry:', { pantryId, list, item });
        const docRef = doc(db, 'pantries', pantryId);
        
        // Clean up undefined values
        const cleanItem = {
            id: item.id,
            name: item.name,
            lastUpdated: Date.now(),
            ...(item.quantity !== undefined && { quantity: item.quantity }),
            ...(item.unit && { unit: item.unit })
        };
        
        console.log('Clean item with timestamp:', cleanItem);
        await updateDoc(docRef, {
            [list]: arrayUnion(cleanItem),
            updatedAt: new Date()
        });
        console.log('Item added successfully');

        // Verify the update
        const updated = await this.getPantry(pantryId);
        console.log('Updated pantry:', updated);
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
} 