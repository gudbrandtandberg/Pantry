export interface Product {
    id: string;
    name: string;
    quantity?: number;
    unit?: string;
    lastUpdated: number; // timestamp
}

export interface Pantry {
    id: string;
    name: string;
    location: string;
    inStock: Product[];
    shoppingList: Product[];
}

// Abstract storage interface that we can implement differently later
export interface StorageInterface {
    getPantries: () => Promise<Pantry[]>;
    savePantry: (pantry: Pantry) => Promise<void>;
    deletePantry: (id: string) => Promise<void>;
} 