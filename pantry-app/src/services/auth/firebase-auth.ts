import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    connectAuthEmulator,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider
} from 'firebase/auth';
import { AuthService, AuthUser } from './types';
import { firebaseConfig } from '../../config/firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use emulator in development
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://localhost:9099');
}

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export class FirebaseAuthService implements AuthService {
    async signIn(email: string, password: string): Promise<AuthUser> {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return {
            id: result.user.uid,
            email: result.user.email!,
            displayName: result.user.displayName || undefined
        };
    }

    async signOut(): Promise<void> {
        await auth.signOut();
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        const user = auth.currentUser;
        if (!user) return null;

        return {
            id: user.uid,
            email: user.email!,
            displayName: user.displayName || undefined
        };
    }

    async signInWithGoogle(): Promise<AuthUser> {
        const result = await signInWithPopup(auth, googleProvider);
        return {
            id: result.user.uid,
            email: result.user.email!,
            displayName: result.user.displayName || undefined
        };
    }

    async signInWithMicrosoft(): Promise<AuthUser> {
        const result = await signInWithPopup(auth, microsoftProvider);
        return {
            id: result.user.uid,
            email: result.user.email!,
            displayName: result.user.displayName || undefined
        };
    }

    // ... other methods
} 