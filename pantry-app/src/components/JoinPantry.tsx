import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePantry } from '../context/PantryContext';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function JoinPantry() {
    const { code } = useParams<{ code: string }>();
    const { user } = useAuth();
    const { joinPantryWithCode } = usePantry();
    const { t } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleJoinPantry = async () => {
            if (!user || !code) return;
            
            try {
                await joinPantryWithCode(code);
                navigate('/');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            handleJoinPantry();
        }
    }, [code, joinPantryWithCode, navigate, user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <p className="mb-4">{t.loginToJoin}</p>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate(`/login?returnTo=/join/${code}`)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {t.login.submit}
                        </button>
                        <button
                            onClick={() => navigate(`/signup?returnTo=/join/${code}`)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            {t.signup.submit}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-4">
                <p>{t.joiningPantry}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <p className="text-red-600">{error}</p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {t.backToHome}
                </button>
            </div>
        );
    }

    return null;
} 