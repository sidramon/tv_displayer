export const getCacheBuster = () => `?t=${new Date().getTime()}`;

export const getAuthHeaders = () => ({
    'X-Admin-Token': localStorage.getItem('admin_token') || '',
});

export async function apiCall<T>(
    fn: () => Promise<T>,
    errorMessage: string,
    addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
): Promise<T | null> {
    try {
        return await fn();
    } catch (error) {
        console.error(error);
        addToast(errorMessage, 'error');
        return null;
    }
}