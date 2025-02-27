export interface AuthUser {
    id: string;
    email: string;
    displayName?: string;
}

export interface AuthService {
    signIn: (_email: string, _password: string) => Promise<AuthUser>;
    signInWithGoogle: () => Promise<AuthUser>;
    signUp: (_email: string, _password: string) => Promise<AuthUser>;
    signOut: () => Promise<void>;
    getCurrentUser: () => Promise<AuthUser | null>;
    // Add more methods as needed
} 