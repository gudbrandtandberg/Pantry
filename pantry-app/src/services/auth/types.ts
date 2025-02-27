export interface AuthUser {
    id: string;
    email: string;
    displayName?: string;
}

export interface AuthService {
    signIn: (email: string, password: string, remember?: boolean) => Promise<AuthUser>;
    signInWithGoogle: () => Promise<AuthUser>;
    signOut: () => Promise<void>;
    getCurrentUser: () => Promise<AuthUser | null>;
    signUpWithInvite: (email: string, password: string, inviteCode: string) => Promise<AuthUser>;
    // Add more methods as needed
} 