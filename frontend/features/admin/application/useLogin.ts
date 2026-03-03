// features/admin/application/useLogin.ts
import { useState } from 'react';

export function useLogin(onLogin: () => void) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                localStorage.setItem('admin_token', password);
                onLogin();
            } else {
                setError('Mot de passe incorrect.');
            }
        } catch {
            setError('Erreur de connexion au serveur.');
        }

        setIsLoading(false);
    };

    return { password, setPassword, error, isLoading, handleSubmit };
}