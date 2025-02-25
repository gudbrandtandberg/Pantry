import { PantryProvider } from './context/PantryContext';
import PantryApp from './components/PantryApp';
import { LanguageProvider } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';

function App() {
    return (
        <LanguageProvider>
            <PantryProvider>
                <div className="min-h-screen bg-blue-100 p-4">
                    <div className="flex justify-end mb-4">
                        <LanguageSelector />
                    </div>
                    <PantryApp />
                </div>
            </PantryProvider>
        </LanguageProvider>
    );
}

export default App; 