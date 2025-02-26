export interface UserPreferences {
    language: 'no' | 'en' | 'ru';
    defaultPantryId?: string;
}

export interface UserData {
    id: string;
    email: string;
    displayName?: string;
    preferences: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface PantryMember {
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    joinedAt: Date;
}

export interface FirestorePantry {
    id: string;
    name: string;
    location: string;
    inStock: Array<{
        id: string;
        name: string;
        quantity?: number;
        unit?: string;
        lastUpdated: number;
    }>;
    shoppingList: Array<{
        id: string;
        name: string;
        quantity?: number;
        unit?: string;
        lastUpdated: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

export interface PantryService {
    createPantry: (pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>) => Promise<FirestorePantry>;
    getPantry: (pantryId: string) => Promise<FirestorePantry | null>;
    getUserPantries: (userId: string) => Promise<FirestorePantry[]>;
    updatePantry: (pantryId: string, data: Partial<FirestorePantry>) => Promise<void>;
    deletePantry: (pantryId: string) => Promise<void>;
    addMember: (pantryId: string, member: PantryMember) => Promise<void>;
    removeMember: (pantryId: string, userId: string) => Promise<void>;
}

export interface UserService {
    createUser: (user: { id: string; email: string; displayName?: string }) => Promise<UserData>;
    getUser: (userId: string) => Promise<UserData | null>;
    updatePreferences: (userId: string, preferences: Partial<UserPreferences>) => Promise<void>;
} 