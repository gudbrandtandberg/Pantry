import { useContext, useState } from 'react';
import { usePantry } from '../context/PantryContext';
import PantrySelector from './PantrySelector';
import { LanguageContext } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import ItemList from './ItemList';
import { CheckIcon, CloudIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SharePantryDialog from './SharePantryDialog';
import Footer from './Footer';
import UserMenu from './UserMenu';

export default function PantryApp() {
    const { currentPantry } = usePantry();
    const { t } = useContext(LanguageContext);
    const { userData } = useUser();
    const { signOut } = useAuth();
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
        <div className="min-h-screen bg-blue-100 p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    {currentPantry?.name || t.title}
                </h1>
                <UserMenu />
            </div>

            <div className="container mx-auto">
                <PantrySelector onShare={() => setShowShareDialog(true)} />
                
                {currentPantry && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ItemList
                            title={t.inStock}
                            products={currentPantry.inStock}
                            listType="inStock"
                        />
                        <ItemList
                            title={t.shoppingList}
                            products={currentPantry.shoppingList}
                            listType="shoppingList"
                        />
                    </div>
                )}
            </div>

            {currentPantry && showShareDialog && (
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