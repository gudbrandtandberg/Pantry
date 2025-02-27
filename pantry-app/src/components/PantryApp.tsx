import { useContext, useState } from 'react';
import { usePantry } from '../context/PantryContext';
import PantrySelector from './PantrySelector';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import ItemList from './ItemList';
import { CheckIcon, CloudIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SharePantryDialog from './SharePantryDialog';
import Footer from './Footer';

export default function PantryApp() {
    const { currentPantry } = usePantry();
    const { t } = useContext(LanguageContext);
    const { signOut } = useAuth();
    const { userData } = useUser();
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [syncStatus] = useState('synced');

    const getSyncStatusIcon = () => {
        switch (syncStatus) {
            case 'synced':
                return <CheckIcon className="w-5 h-5 text-green-500" />;
            case 'syncing':
                return <CloudIcon className="w-5 h-5 text-blue-500 animate-pulse" />;
            case 'error':
                return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
        }
    };

    if (!currentPantry) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{t.title}</h1>
                    <div className="flex items-center gap-4 relative">
                        <div className="absolute right-full mr-4">
                            {getSyncStatusIcon()}
                        </div>
                        <span className="text-gray-600">{userData?.displayName}</span>
                        <button
                            onClick={signOut}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            {t.signOut}
                        </button>
                    </div>
                </div>
                <PantrySelector />
                <p className="text-gray-600 mt-4">{t.selectPantry}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{currentPantry?.name}</h1>
                <div className="flex items-center gap-4 relative">
                    <div className="absolute right-full mr-4">
                        {getSyncStatusIcon()}
                    </div>
                    <span className="text-gray-600">{userData?.displayName}</span>
                    <button
                        onClick={signOut}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        {t.signOut}
                    </button>
                </div>
            </div>
            <PantrySelector />
            
            {currentPantry && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <ItemList type="inStock" />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <ItemList type="shoppingList" />
                    </div>
                </div>
            )}
            
            {currentPantry && (
                <SharePantryDialog
                    pantry={currentPantry}
                    isOpen={showShareDialog}
                    onClose={() => setShowShareDialog(false)}
                />
            )}
            <Footer />
        </div>
    );
} 