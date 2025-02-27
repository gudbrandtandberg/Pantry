import { useState, useContext, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import InviteLinkGenerator from './InviteLinkGenerator';
import LanguageSelector from './LanguageSelector';

export default function UserMenu() {
    const { user, signOut } = useAuth();
    const { t } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <div className="flex items-center gap-4">
                <LanguageSelector />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                    <span>{user?.email}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 space-y-4">
                    <InviteLinkGenerator />
                    <button
                        onClick={signOut}
                        className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                    >
                        {t.signOut}
                    </button>
                </div>
            )}
        </div>
    );
} 