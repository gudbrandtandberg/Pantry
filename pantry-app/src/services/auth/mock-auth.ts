import { AuthService, AuthUser } from './types';

export class MockAuthService implements AuthService {
    private currentUser: AuthUser | null = null;

    async signIn(email: string, password: string): Promise<AuthUser> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.currentUser = {
            id: 'mock-user-1',
            email: email,
            displayName: 'Mock User'
        };
        return this.currentUser;
    }

    async signOut(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        this.currentUser = null;
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.currentUser;
    }

    async signInWithGoogle(): Promise<AuthUser> {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.currentUser = {
            id: 'mock-google-user',
            email: 'mock.google@example.com',
            displayName: 'Mock Google User'
        };
        return this.currentUser;
    }

    async signInWithMicrosoft(): Promise<AuthUser> {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.currentUser = {
            id: 'mock-microsoft-user',
            email: 'mock.microsoft@example.com',
            displayName: 'Mock Microsoft User'
        };
        return this.currentUser;
    }

    // ... other methods
} 