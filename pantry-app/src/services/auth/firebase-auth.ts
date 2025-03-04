import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    connectAuthEmulator,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged
} from 'firebase/auth';
import type { AuthService, AuthUser } from './types';
import { firebaseConfig } from '../../config/firebase';
import { FirestoreUserService } from '../db/firestore-user';
import { FirebaseError } from 'firebase/app';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export auth instance for direct use
export { auth };

// Use emulator in development
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://localhost:9099');
}

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

const userService = new FirestoreUserService();

export const handleError = (error: FirebaseError | Error | unknown): string => {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/invalid-email':
                return 'Please enter a valid email address';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later';
        }
    }
    return 'An unexpected error occurred';
};

export const handleAuthError = (error: FirebaseError | Error | unknown): void => {
    if (error instanceof FirebaseError) {
        throw error;
    }
    throw error;
};

export class FirebaseAuthService implements AuthService {
    async signIn(email: string, password: string, remember: boolean = false): Promise<AuthUser> {
        try {
            await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
            const result = await signInWithEmailAndPassword(auth, email, password);
            
            // Create user document if it doesn't exist
            const user = await userService.getUser(result.user.uid);
            if (!user) {
                await userService.createUser({
                    id: result.user.uid,
                    email: result.user.email!,
                    displayName: result.user.displayName || undefined
                });
            }
            
            return {
                id: result.user.uid,
                email: result.user.email!,
                displayName: result.user.displayName || undefined
            };
        } catch (error) {
            throw new Error(handleError(error));
        }
    }

    async signOut(): Promise<void> {
        await auth.signOut();
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        // Wait for auth state to be restored
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe(); // Stop listening after first response
                if (!user) {
                    resolve(null);
                    return;
                }
                resolve({
                    id: user.uid,
                    email: user.email!,
                    displayName: user.displayName || undefined
                });
            });
        });
    }

    async signInWithGoogle(): Promise<AuthUser> {
        const result = await signInWithPopup(auth, googleProvider);
        
        // Create user document if it doesn't exist
        const user = await userService.getUser(result.user.uid);
        if (!user) {
            await userService.createUser({
                id: result.user.uid,
                email: result.user.email!,
                displayName: result.user.displayName || undefined
            });
        }
        
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

    async signUpWithInvite(email: string, password: string, inviteCode: string): Promise<AuthUser> {
        // Validate invite code first
        const isValidInvite = await userService.validateInviteCode(inviteCode);
        if (!isValidInvite) {
            throw new Error('Invalid invite code');
        }

        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document
        await userService.createUser({
            id: result.user.uid,
            email: result.user.email!,
            displayName: result.user.displayName || undefined
        });

        return {
            id: result.user.uid,
            email: result.user.email!,
            displayName: result.user.displayName || undefined
        };
    }

    // ... other methods
} 