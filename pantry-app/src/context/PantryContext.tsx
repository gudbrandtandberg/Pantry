import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pantry, StorageInterface } from '../types';
import { LocalStorage } from '../storage/localStorage';

interface PantryContextType {
    pantries: Pantry[];
    currentPantry: Pantry | null;
    setCurrentPantry: (pantry: Pantry) => void;
    savePantry: (pantry: Pantry) => Promise<void>;
    deletePantry: (id: string) => Promise<void>;
}

const PantryContext = createContext<PantryContextType | null>(null);

const storage: StorageInterface = new LocalStorage();

function PantryProvider({ children }: { children: ReactNode }) {
    const [pantries, setPantries] = useState<Pantry[]>([]);
    const [currentPantry, setCurrentPantry] = useState<Pantry | null>(null);

    useEffect(() => {
        // Load pantries on mount
        storage.getPantries().then(loadedPantries => {
            setPantries(loadedPantries);
            if (loadedPantries.length > 0) {
                setCurrentPantry(loadedPantries[0]);
            }
        });
    }, []);

    const savePantry = async (pantry: Pantry) => {
        console.log('Saving pantry:', pantry);
        await storage.savePantry(pantry);
        const updatedPantries = await storage.getPantries();
        console.log('Updated pantries:', updatedPantries);
        setPantries(updatedPantries);
        setCurrentPantry(pantry);
    };

    const deletePantry = async (id: string) => {
        await storage.deletePantry(id);
        const updatedPantries = await storage.getPantries();
        setPantries(updatedPantries);
        if (currentPantry?.id === id) {
            setCurrentPantry(updatedPantries[0] || null);
        }
    };

    return (
        <PantryContext.Provider value={{
            pantries,
            currentPantry,
            setCurrentPantry,
            savePantry,
            deletePantry
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

export { PantryProvider, usePantry }; 