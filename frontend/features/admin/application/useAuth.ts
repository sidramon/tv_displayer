import { useState, useEffect } from 'react';
import { verifyToken } from '@/shared/api';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            setIsChecking(false);
            return;
        }

        verifyToken()
            .then(valid => {
                if (!valid) localStorage.removeItem('admin_token');
                setIsAuthenticated(valid);
            })
            .catch(() => {
                localStorage.removeItem('admin_token');
                setIsAuthenticated(false);
            })
            .finally(() => setIsChecking(false));
    }, []);

    return { isAuthenticated, setIsAuthenticated, isChecking };
}