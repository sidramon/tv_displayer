// features/admin/application/useAuth.ts
import { useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => !!localStorage.getItem('admin_token')
    );
    return { isAuthenticated, setIsAuthenticated };
}