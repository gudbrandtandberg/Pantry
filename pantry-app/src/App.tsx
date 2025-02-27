import { PantryProvider } from './context/PantryContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import PantryApp from './components/PantryApp';
import Login from './components/Login';
import JoinPantry from './components/JoinPantry';
import InviteSignup from './components/InviteSignup';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

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