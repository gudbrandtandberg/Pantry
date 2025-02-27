import { AuthService, AuthUser } from './types';

export class MockAuthService implements AuthService {
    private currentUser: AuthUser | null = null;

    async signIn(_email: string, _password: string): Promise<AuthUser> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 'mock-user-id',
                    email: 'mock@example.com',
                    displayName: 'Mock User'
                });
            }, 1000);
        });
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

    async signUp(email: string, _password: string): Promise<AuthUser> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser = {
            id: 'mock-signup-user-' + Date.now(),
            email: email,
            displayName: email.split('@')[0]
        };
        this.currentUser = mockUser;
        return mockUser;
    }

    // ... other methods
} 