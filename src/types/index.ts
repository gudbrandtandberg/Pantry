// Our core data types
interface Product {
    id: string;
    name: string;
    quantity?: number;
    unit?: string;
    lastUpdated: number;
}

interface Pantry {
    id: string;
    name: string;
    location: string;
    inStock: Product[];
    shoppingList: Product[];
}

// Abstract interface for storage - makes it easy to switch implementations later
interface StorageInterface {
    getPantries: () => Promise<Pantry[]>;
    savePantry: (pantry: Pantry) => Promise<void>;
    deletePantry: (id: string) => Promise<void>;
} 