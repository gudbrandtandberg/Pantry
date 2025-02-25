// Modern state management (replaces global variables/state)
// Makes data available throughout the app without prop drilling
const PantryContext = createContext<PantryContextType | null>(null);

function PantryProvider({ children }: { children: ReactNode }) {
    const [pantries, setPantries] = useState<Pantry[]>([]);
    const [currentPantry, setCurrentPantry] = useState<Pantry | null>(null);
    // ... methods for managing pantries
} 