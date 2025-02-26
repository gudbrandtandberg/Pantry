import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FirestorePantry } from '../services/db/types';
import { usePantry } from '../context/PantryContext';
import { v4 as uuidv4 } from 'uuid';
import { FirestoreUserService, UserData } from '../services/db/firestore-user';

interface SharePantryDialogProps {
    pantry: FirestorePantry;
    isOpen: boolean;
    onClose: () => void;
}

const userService = new FirestoreUserService();

export default function SharePantryDialog({ pantry, isOpen, onClose }: SharePantryDialogProps) {
    const { t } = useContext(LanguageContext);
    const { createInviteLink, isOwner, loading } = usePantry();
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [isCreatingLink, setIsCreatingLink] = useState(false);
    const [memberData, setMemberData] = useState<Record<string, UserData>>({});
    const canShare = !loading && isOwner(pantry.id);

    const members = Object.entries(pantry.members || {}).map(([userId, member]) => ({
        userId,
        ...member
    }));

    useEffect(() => {
        const fetchMemberData = async () => {
            const userData: Record<string, UserData> = {};
            
            for (const member of members) {
                const user = await userService.getUser(member.userId);
                if (user) {
                    userData[member.userId] = user;
                }
            }
            
            setMemberData(userData);
        };
        
        fetchMemberData();
    }, [members]);

    if (!isOpen) return null;

    const handleCreateLink = async () => {
        setIsCreatingLink(true);
        try {
            const code = uuidv4().slice(0, 8);
            await createInviteLink(pantry.id, code);
            setInviteLink(`${window.location.origin}/join/${code}`);
        } finally {
            setIsCreatingLink(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{t.sharePantryTitle}</h2>
                
                {loading ? (
                    <p className="text-gray-600">{t.loading}</p>
                ) : !canShare ? (
                    <p className="text-red-600 mb-4">{t.onlyOwnerCanShare}</p>
                ) : (
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">{t.members}</h3>
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
                )}

                <div className="space-y-4">
                    {inviteLink ? (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">{t.inviteLinkCreated}</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="px-3 py-2 border rounded flex-grow"
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
                            onClick={handleCreateLink}
                            disabled={isCreatingLink}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isCreatingLink ? t.creatingLink : t.createInviteLink}
                        </button>
                    )}
                    
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
} 