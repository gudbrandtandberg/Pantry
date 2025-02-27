import { useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { FirebaseError } from 'firebase/app';
import LoadingSpinner from './LoadingSpinner';
import { useParams, useNavigate } from 'react-router-dom';
import { FirestoreUserService } from '../services/db/firestore-user';
import { usePantry } from '../context/PantryContext';
import Footer from './Footer';

const userService = new FirestoreUserService();

export default function LoginPage() {
    const { signIn, signInWithGoogle, signUp } = useAuth();
    const { t } = useContext(LanguageContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const { joinPantryWithCode } = usePantry();

    useEffect(() => {
        // Remove empty effect or add actual functionality
    }, [inviteCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                if (!name.trim()) {
                    setError(t.signup.nameRequired);
                    return;
                }
                const user = await signUp(email, password);
                if (!user) {
                    throw new Error('Failed to create account');
                }
                
                const createUserPromise = userService.createUser({
                    id: user.id,
                    email: user.email,
                    displayName: name.trim()
                });

                if (inviteCode) {
                    await createUserPromise;
                    
                    try {
                        await joinPantryWithCode(inviteCode);
                    } catch (err: unknown) {
                        setError(err instanceof Error ? err.message : 'An unknown error occurred');
                        return;
                    }
                }

                if (!inviteCode) {
                    await createUserPromise;
                }
                
                await signIn(email, password, rememberMe);
                navigate('/');
            } else {
                await signIn(email, password, rememberMe);
                if (inviteCode) {
                    navigate(`/join/${inviteCode}`);
                } else {
                    navigate('/');
                }
            }
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        setError(t.signup.emailInUse);
                        break;
                    case 'auth/weak-password':
                        setError(t.signup.weakPassword);
                        break;
                    case 'auth/invalid-email':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        setError(isSignUp ? t.signup.error : t.login.error);
                        break;
                    case 'auth/too-many-requests':
                        setError(t.login.tooManyAttempts);
                        break;
                    default:
                        setError(isSignUp ? t.signup.error : t.login.error);
                }
            } else {
                setError(isSignUp ? t.signup.error : t.login.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                if (err.code === 'auth/popup-closed-by-user') {
                    return;
                }
                if (err.code === 'auth/cancelled-popup-request') {
                    return;
                }
            }
            setError(t.login.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-blue-100">
            <div className="absolute top-4 right-4">
                <LanguageSelector />
            </div>
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        {isSignUp ? t.signup.title : t.login.title}
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label className="block text-gray-700 mb-2">
                                    {t.signup.name}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-gray-700 mb-2">
                                {t.login.email}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">
                                {t.login.password}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                {t.login.rememberMe}
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2 px-4 rounded text-white font-semibold
                                ${isLoading 
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            {isLoading ? <LoadingSpinner /> : isSignUp ? t.signup.submit : t.login.submit}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    {t.login.continueWith}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <img src="/google.svg" alt="" className="w-5 h-5" />
                                {t.login.google}
                            </button>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        {isSignUp ? (
                            <>
                                {t.signup.haveAccount}{' '}
                                <button
                                    onClick={() => setIsSignUp(false)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    {t.signup.login}
                                </button>
                            </>
                        ) : (
                            <>
                                {t.login.noAccount}{' '}
                                <button
                                    onClick={() => setIsSignUp(true)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    {t.signup.submit}
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
} 