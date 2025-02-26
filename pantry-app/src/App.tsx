import { PantryProvider } from './context/PantryContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import PantryApp from './components/PantryApp';
import LoginPage from './components/LoginPage';
import LanguageSelector from './components/LanguageSelector';

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <PantryProvider>
            <div className="min-h-screen bg-blue-100 p-4">
                <div className="flex justify-end mb-4">
                    <LanguageSelector />
                </div>
                <PantryApp />
            </div>
        </PantryProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App; 