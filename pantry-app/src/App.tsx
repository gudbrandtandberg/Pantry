import { PantryProvider } from './context/PantryContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { useAuth } from './context/AuthContext';
import { useUser } from './context/UserContext';
import PantryApp from './components/PantryApp';
import LoginPage from './components/LoginPage';
import LanguageSelector from './components/LanguageSelector';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
    const { user, loading: authLoading } = useAuth();
    const { loading: userLoading } = useUser();
    const loading = authLoading || userLoading;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-100">
                <LoadingSpinner className="w-12 h-12 text-blue-500" />
            </div>
        );
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

function UserContent() {
    const { loading: userLoading } = useUser();

    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-100">
                <LoadingSpinner className="w-12 h-12 text-blue-500" />
            </div>
        );
    }

    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <UserContent />
            </UserProvider>
        </AuthProvider>
    );
}

export default App; 