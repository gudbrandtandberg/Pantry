import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { FirestorePantry } from '../services/db/types';
import { usePantry } from '../context/PantryContext';
import { v4 as uuidv4 } from 'uuid';
import { FirestoreUserService } from '../services/db/firestore-user';
import { UserData } from '../services/db/types';
import { FirestorePantryService } from '../services/db/firestore-pantry';

interface SharePantryDialogProps {
    pantry: FirestorePantry;
    isOpen: boolean;
    onClose: () => void;
}

const userService = new FirestoreUserService();
const pantryService = new FirestorePantryService();

export default function SharePantryDialog({ pantry, isOpen, onClose }: SharePantryDialogProps) {
    const { t } = useContext(LanguageContext);
    const { loading: authLoading, user } = useAuth();
    const { isOwner } = usePantry();
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [isCreatingLink, setIsCreatingLink] = useState(false);
    const [memberData, setMemberData] = useState<Record<string, UserData>>({});

    const members = Object.entries(pantry.members || {}).map(([userId, member]) => ({
        userId,
        ...member
    }));

    useEffect(() => {
        if (!user) {
            onClose();
        }
    }, [user, onClose]);

    useEffect(() => {
        let mounted = true;
        const fetchMemberData = async () => {
            if (authLoading || !user) return;
            
            const userData: Record<string, UserData> = {};
            
            try {
                for (const member of members) {
                    if (!mounted) return;
                    const user = await userService.getUser(member.userId);
                    if (!mounted) return;
                    if (user) {
                        userData[member.userId] = user;
                    }
                }
                
                if (mounted) {
                    setMemberData(userData);
                }
            } catch (error) {
                if (mounted) {
                    onClose();
                }
            }
        };
        
        fetchMemberData();
        
        return () => {
            mounted = false;
        };
    }, [members, authLoading, user, onClose]);

    const handleCreateInviteLink = async () => {
        if (!isOwner(pantry.id)) {
            return;
        }
        setIsCreatingLink(true);
        try {
            const code = uuidv4().slice(0, 8);
            await pantryService.createInviteLink(pantry.id, code);
            setInviteLink(`${window.location.origin}/login/${code}`);
        } finally {
            setIsCreatingLink(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">{t.sharePantryTitle}</h2>
                    
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">{t.currentMembers}</h3>
                        <ul className="space-y-2">
                            {members.map(member => (
                                <li key={member.userId} className="flex justify-between items-center">
                                    <span>{memberData[member.userId]?.displayName || member.userId}</span>
                                    <span className="text-sm text-gray-500">
                                        {member.role === 'owner' ? t.owner : t.editor}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isOwner(pantry.id) && (
                        <>
                            {inviteLink ? (
                                <div className="mt-4">
                                    <p className="mb-2">{t.inviteLinkCreated}</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inviteLink}
                                            readOnly
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <button
                                            onClick={() => navigator.clipboard.writeText(inviteLink)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {t.copy}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleCreateInviteLink}
                                    disabled={isCreatingLink}
                                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isCreatingLink ? t.creatingLink : t.createInviteLink}
                                </button>
                            )}
                        </>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </Dialog>
    );
} 