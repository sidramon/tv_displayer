import { useState, useEffect } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('admin_token'));
    }, []);

    return { isAuthenticated, setIsAuthenticated };
}