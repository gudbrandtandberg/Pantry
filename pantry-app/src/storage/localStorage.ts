import { Pantry, StorageInterface } from '../types';

const STORAGE_KEY = 'pantry-app-data';

export class LocalStorage implements StorageInterface {
    async getPantries(): Promise<Pantry[]> {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    async savePantry(pantry: Pantry): Promise<void> {
        const pantries = await this.getPantries();
        const index = pantries.findIndex(p => p.id === pantry.id);
        
        if (index >= 0) {
            pantries[index] = pantry;
        } else {
            pantries.push(pantry);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(pantries));
    }

    async deletePantry(id: string): Promise<void> {
        const pantries = await this.getPantries();
        const filtered = pantries.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
} 