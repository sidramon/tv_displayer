import { useState } from 'react';
import { login } from '@/shared/api';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

export function useLogin(onLogin: () => void) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const token = await login(password);
            if (token) {
                localStorage.setItem('admin_token', token);
                addToast(t.feedback.loginSuccess, 'success');
                onLogin();
            } else {
                addToast(t.feedback.loginFailed, 'error');
            }
        } catch {
            addToast(t.feedback.connectionError, 'error');
        }
        setIsLoading(false);
    };

    return { password, setPassword, isLoading, handleSubmit };
}