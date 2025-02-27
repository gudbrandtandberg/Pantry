import { PantryProvider } from './context/PantryContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { useAuth } from './context/AuthContext';
import { useUser } from './context/UserContext';
import PantryApp from './components/PantryApp';
import Login from './components/Login';
import LanguageSelector from './components/LanguageSelector';
import LoadingSpinner from './components/LoadingSpinner';
import JoinPantry from './components/JoinPantry';
import InviteSignup from './components/InviteSignup';
import { Routes, Route, BrowserRouter, useSearchParams } from 'react-router-dom';

function AppContent() {
    const { user, loading: authLoading } = useAuth();
    const { loading: userLoading } = useUser();
    const loading = authLoading || userLoading;

    const [searchParams] = useSearchParams();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-100">
                <LoadingSpinner className="w-12 h-12 text-blue-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <LanguageProvider>
                <Login returnTo={searchParams.get('returnTo')} />
            </LanguageProvider>
        );
    }

    return (
        <div className="min-h-screen bg-blue-100 p-4">
            <div className="flex justify-end mb-4">
                <LanguageSelector />
            </div>
            <PantryApp />
        </div>
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
        <AppContent />
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UserProvider>
                    <LanguageProvider>
                        <PantryProvider>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/invite/:inviteCode" element={<InviteSignup />} />
                                <Route path="/join/:code" element={<JoinPantry />} />
                                <Route path="/" element={<PantryApp />} />
                            </Routes>
                        </PantryProvider>
                    </LanguageProvider>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App; 