import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firestore';
import { UserService, UserPreferences } from './types';

export interface UserData {
    id: string;
    displayName: string;
    email?: string;
    preferences?: UserPreferences;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FirestoreUserService implements UserService {
    async createUser(user: { id: string; email: string; displayName?: string }): Promise<UserData> {
        const userData: UserData = {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            preferences: {
                language: 'en'  // default language
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await setDoc(doc(db, 'users', user.id), userData);
        return userData;
    }

    async getUser(userId: string): Promise<UserData | null> {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            return null;
        }

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as UserData;
    }

    async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
            'preferences': preferences,
            'updatedAt': new Date()
        });
    }
} 