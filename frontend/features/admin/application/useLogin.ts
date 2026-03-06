import { useState } from 'react';

export function useLogin(onLogin: () => void) {
    const [password, setPassword] = useState('');
    const [errorKey, setErrorKey] = useState<'error' | 'connectionError' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setErrorKey(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('admin_token', data.token);
                onLogin();
            } else {
                setErrorKey('error');
            }
        } catch {
            setErrorKey('connectionError');
        }

        setIsLoading(false);
    };

    return { password, setPassword, errorKey, isLoading, handleSubmit };
}