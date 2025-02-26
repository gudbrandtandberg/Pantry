import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, UserPreferences } from '../services/db/types';
import { FirestoreUserService } from '../services/db/firestore-user';
import { useAuth } from './AuthContext';

interface UserContextType {
    userData: UserData | null;
    updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    userData: null,
    updatePreferences: async () => { throw new Error('UserContext not initialized') },
    loading: true
});

const userService = new FirestoreUserService();

function UserProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setUserData(null);
            setLoading(false);
            return;
        }

        // Load user data when auth user changes
        userService.getUser(user.id)
            .then(data => {
                setUserData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading user data:', error);
                setLoading(false);
            });
    }, [user]);

    const updatePreferences = async (preferences: Partial<UserPreferences>) => {
        if (!user || !userData) return;

        await userService.updatePreferences(user.id, {
            ...userData.preferences,
            ...preferences
        });

        setUserData(prev => prev ? {
            ...prev,
            preferences: {
                ...prev.preferences,
                ...preferences
            },
            updatedAt: new Date()
        } : null);
    };

    return (
        <UserContext.Provider value={{ userData, updatePreferences, loading }}>
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export { UserProvider, useUser }; 