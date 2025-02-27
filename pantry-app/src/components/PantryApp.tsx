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
    const { currentPantry, loading, syncStatus } = usePantry();
    const { t } = useContext(LanguageContext);
    const { userData } = useUser();
    const { signOut } = useAuth();
    const [showShareDialog, setShowShareDialog] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!currentPantry) {
        return (
            <div className="min-h-screen bg-blue-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">{t.title}</h1>
                        <UserMenu />
                    </div>
                    <PantrySelector />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-100 p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{t.title}</h1>
                    {currentPantry && (
                        <h2 className="text-lg text-gray-600 mt-1">
                            {currentPantry.name}
                        </h2>
                    )}
                </div>
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