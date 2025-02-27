import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FirebaseAuthService } from '../services/auth/firebase-auth';
import type { AuthUser } from '../services/auth/types';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/auth/firebase-auth';

const authService = new FirebaseAuthService();

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    signUpWithInvite: (email: string, password: string, inviteCode: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { throw new Error('AuthContext not initialized') },
    signInWithGoogle: async () => { throw new Error('AuthContext not initialized') },
    signOut: async () => { throw new Error('AuthContext not initialized') },
    signUpWithInvite: async () => { throw new Error('AuthContext not initialized') },
    signUp: async () => { throw new Error('AuthContext not initialized') }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUser(user);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const signIn = async (email: string, password: string) => {
        const user = await authService.signIn(email, password);
        setUser(user);
    };

    const signInWithGoogle = async () => {
        const user = await authService.signInWithGoogle();
        setUser(user);
        navigate('/');
    };
    const signOut = async () => {
        await authService.signOut();
        navigate('/login');
    };

    const signUpWithInvite = async (email: string, password: string, inviteCode: string) => {
        const user = await authService.signUpWithInvite(email, password, inviteCode);
        setUser(user);
    };
    const signUp = async (email: string, password: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Convert Firebase User to our AuthUser type
        return {
            id: result.user.uid,
            email: result.user.email!,
            displayName: result.user.displayName || undefined
        };
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading,
            signIn, 
            signInWithGoogle,
            signOut, 
            signUpWithInvite,
            signUp
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