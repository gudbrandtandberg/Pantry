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

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        console.log('AuthContext: Starting sign out');
        try {
            setLoading(true);
            setUser(null);  // Clear user first to trigger UI updates
            await new Promise(resolve => setTimeout(resolve, 0));
            await authService.signOut();
            console.log('AuthContext: Sign out completed, user state cleared');
            navigate('/login');
        } catch (error) {
            console.error('AuthContext: Sign out failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUpWithInvite = async (email: string, password: string, inviteCode: string) => {
        const user = await authService.signUpWithInvite(email, password, inviteCode);
        setUser(user);
    };

    const signUp = async (email: string, password: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Convert Firebase User to our AuthUser type
            return {
                id: result.user.uid,
                email: result.user.email!,
                displayName: result.user.displayName || undefined
            };
        } catch (error) {
            console.error('Auth signup error:', error);
            throw error;
        }
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