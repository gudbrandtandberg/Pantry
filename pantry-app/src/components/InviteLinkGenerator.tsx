import { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FirestoreUserService } from '../services/db/firestore-user';

const userService = new FirestoreUserService();

export default function InviteLinkGenerator() {
    const { t } = useContext(LanguageContext);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateInvite = async () => {
        setLoading(true);
        try {
            const code = await userService.createInviteLink();
            const link = `${window.location.origin}/invite/${code}`;
            setInviteLink(link);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium mb-4">{t.inviteFriends}</h3>
            
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
                    onClick={handleGenerateInvite}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? t.generating : t.generateInviteLink}
                </button>
            )}
        </div>
    );
} 