import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FirebaseAuthService } from '../services/auth/firebase-auth';
import type { AuthUser } from '../services/auth/types';

const authService = new FirebaseAuthService();

interface AuthContextType {
    user: AuthUser | null;
    signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
    signUpWithInvite: (email: string, password: string, inviteCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => { throw new Error('AuthContext not initialized') },
    signInWithGoogle: async () => { throw new Error('AuthContext not initialized') },
    signup: async () => { throw new Error('AuthContext not initialized') },
    signOut: async () => { throw new Error('AuthContext not initialized') },
    loading: true,
    signUpWithInvite: async () => { throw new Error('AuthContext not initialized') }
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

    const signup = async (email: string, password: string) => {
        const user = await authService.signUpWithInvite(email, password, '');
        setUser(user);
    };

    const signUpWithInvite = async (email: string, password: string, inviteCode: string) => {
        const user = await authService.signUpWithInvite(email, password, inviteCode);
        setUser(user);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            signIn, 
            signInWithGoogle,
            signup,
            signOut, 
            loading,
            signUpWithInvite
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