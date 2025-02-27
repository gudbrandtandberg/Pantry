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
    createdAt: number;
    updatedAt: number;
    inStock: PantryItem[];
    shoppingList: PantryItem[];
    members: {
        [userId: string]: {
            role: 'owner' | 'editor';
            addedAt: number;
            addedBy: string;
        }
    };
    inviteLinks: {
        [code: string]: {
            createdAt: number;
            createdBy: string;
            expiresAt: number;
            used: boolean;
        }
    };
}

export interface PantryService {
    createPantry: (pantry: FirestorePantry) => Promise<FirestorePantry>;
    getPantry: (id: string) => Promise<FirestorePantry | null>;
    getUserPantries: (userId: string) => Promise<FirestorePantry[]>;
    updatePantry: (_pantryId: string, _data: Partial<FirestorePantry>) => Promise<void>;
    deletePantry: (_pantryId: string) => Promise<void>;
    addItem: (_pantryId: string, _list: 'inStock' | 'shoppingList', _item: Omit<PantryItem, 'lastUpdated'>) => Promise<void>;
    updateItem: (_pantryId: string, _list: 'inStock' | 'shoppingList', _item: PantryItem) => Promise<void>;
    removeItem: (_pantryId: string, _list: 'inStock' | 'shoppingList', _itemId: string) => Promise<void>;
    moveItem: (_pantryId: string, _fromList: 'inStock' | 'shoppingList', _toList: 'inStock' | 'shoppingList', _itemId: string) => Promise<void>;
    addMember: (_pantryId: string, _member: PantryMember) => Promise<void>;
    removeMember: (_pantryId: string, _userId: string) => Promise<void>;
}

export interface UserService {
    createUser: (user: { id: string; email: string; displayName?: string }) => Promise<UserData>;
    getUser: (userId: string) => Promise<UserData | null>;
    updatePreferences: (userId: string, preferences: Partial<UserPreferences>) => Promise<void>;
} 