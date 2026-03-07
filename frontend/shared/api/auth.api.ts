import { getAuthHeaders } from './helpers';

export async function login(password: string): Promise<string | null> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.token;
    } catch {
        throw new Error('connectionError');
    }
}

export async function logout(): Promise<void> {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { ...getAuthHeaders() },
        });
    } catch {
        // silencieux
    } finally {
        localStorage.removeItem('admin_token');
    }
}

export async function verifyToken(): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/verify', {
            headers: { ...getAuthHeaders() },
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function changePassword(newPassword: string): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ newPassword }),
        });
        return response.ok;
    } catch {
        return false;
    }
}