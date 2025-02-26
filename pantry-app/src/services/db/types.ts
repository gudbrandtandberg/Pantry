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

export interface PantryItem {
    id: string;
    name: string;
    quantity?: number;
    unit?: string;
    lastUpdated: number;
}

export interface FirestorePantry {
    id: string;
    name: string;
    location: string;
    createdBy: string;
    inStock?: PantryItem[];
    shoppingList?: PantryItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PantryService {
    createPantry: (pantry: Omit<FirestorePantry, 'createdAt' | 'updatedAt'>) => Promise<FirestorePantry>;
    getPantry: (pantryId: string) => Promise<FirestorePantry | null>;
    getUserPantries: (userId: string) => Promise<FirestorePantry[]>;
    updatePantry: (pantryId: string, data: Partial<FirestorePantry>) => Promise<void>;
    deletePantry: (pantryId: string) => Promise<void>;
    addItem: (pantryId: string, list: 'inStock' | 'shoppingList', item: Omit<PantryItem, 'lastUpdated'>) => Promise<void>;
    updateItem: (pantryId: string, list: 'inStock' | 'shoppingList', item: PantryItem) => Promise<void>;
    removeItem: (pantryId: string, list: 'inStock' | 'shoppingList', itemId: string) => Promise<void>;
    moveItem: (pantryId: string, fromList: 'inStock' | 'shoppingList', toList: 'inStock' | 'shoppingList', itemId: string) => Promise<void>;
    addMember: (pantryId: string, member: PantryMember) => Promise<void>;
    removeMember: (pantryId: string, userId: string) => Promise<void>;
}

export interface UserService {
    createUser: (user: { id: string; email: string; displayName?: string }) => Promise<UserData>;
    getUser: (userId: string) => Promise<UserData | null>;
    updatePreferences: (userId: string, preferences: Partial<UserPreferences>) => Promise<void>;
} 