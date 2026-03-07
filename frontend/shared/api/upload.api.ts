import { getAuthHeaders } from './helpers';

export async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { ...getAuthHeaders() },
            body: formData,
        });
        if (!response.ok) throw new Error('Échec du téléversement');
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Erreur upload:', error);
        return null;
    }
}

export async function deleteFile(fileUrl: string): Promise<boolean> {
    try {
        const filename = fileUrl.split('/').pop();
        if (!filename) return false;
        const response = await fetch(`/api/upload/${filename}`, {
            method: 'DELETE',
            headers: { ...getAuthHeaders() },
        });
        return response.ok;
    } catch (error) {
        console.error('Erreur suppression:', error);
        return false;
    }
}