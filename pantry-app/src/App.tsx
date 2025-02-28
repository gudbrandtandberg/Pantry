import { PantryProvider } from './context/PantryContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import PantryApp from './components/PantryApp';
import LoginPage from './components/LoginPage';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PantryProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/invite/:inviteCode" element={<LoginPage />} />
                        <Route path="/join/:inviteCode" element={<LoginPage />} />
                        <Route 
                            path="/*" 
                            element={
                                <ProtectedRoute>
                                    <UserProvider>
                                        <LanguageProvider>
                                            <Routes>
                                                <Route path="/" element={<PantryApp />} />
                                            </Routes>
                                        </LanguageProvider>
                                    </UserProvider>
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </PantryProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App; 