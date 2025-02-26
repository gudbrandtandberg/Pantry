import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

interface LoginProps {
    returnTo?: string | null;
}

export default function Login({ returnTo }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const { t } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnPath = returnTo || searchParams.get('returnTo');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signIn(email, password);
            navigate(returnPath || '/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate(returnPath || '/');
        } catch (err) {
            console.error('Google login error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6">{t.login.title}</h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t.login.email}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t.login.password}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {t.login.submit}
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
                    
                    <button
                        onClick={handleGoogleLogin}
                        className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        {t.login.google}
                    </button>
                </div>
                
                <p className="mt-4 text-center text-sm text-gray-600">
                    {t.signup.haveAccount}{' '}
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        {t.signup.submit}
                    </button>
                </p>
            </div>
        </div>
    );
} 