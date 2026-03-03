// features/admin/presentation/LoginPage.tsx
'use client';

import { useLogin } from '../application/useLogin';

interface LoginPageProps {
    onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const { password, setPassword, error, isLoading, handleSubmit } = useLogin(onLogin);

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Administration</h1>
                <div className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </div>
            </div>
        </div>
    );
}