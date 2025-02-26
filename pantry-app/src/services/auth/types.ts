export interface AuthUser {
    id: string;
    email: string;
    displayName?: string;
}

export interface AuthService {
    signIn: (email: string, password: string) => Promise<AuthUser>;
    signInWithGoogle: () => Promise<AuthUser>;
    signOut: () => Promise<void>;
    getCurrentUser: () => Promise<AuthUser | null>;
    // Add more methods as needed
} 