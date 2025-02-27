import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthService, AuthUser } from '../services/auth/types';
import { FirebaseAuthService } from '../services/auth/firebase-auth';

const authService: AuthService = process.env.NODE_ENV === 'development' 
    ? new FirebaseAuthService()  // Switch to Firebase for testing
    : new FirebaseAuthService();

interface AuthContextType {
    user: AuthUser | null;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => { throw new Error('AuthContext not initialized') },
    signInWithGoogle: async () => { throw new Error('AuthContext not initialized') },
    signOut: async () => { throw new Error('AuthContext not initialized') },
    loading: true
});

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        authService.getCurrentUser()
            .then(user => setUser(user))
            .finally(() => setLoading(false));
    }, []);

    const signIn = async (email: string, password: string) => {
        const user = await authService.signIn(email, password);
        setUser(user);
    };

    const signInWithGoogle = async () => {
        const user = await authService.signInWithGoogle();
        setUser(user);
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            signIn, 
            signInWithGoogle,
            signOut, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth }; 