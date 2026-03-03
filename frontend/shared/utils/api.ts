// IMPORT SECTION
import { ConfigResponse, GlobalConfig } from './types';

// CONFIGURATION SECTION
const getCacheBuster = () => `?t=${new Date().getTime()}`;

// FETCH SECTION
export async function getConfig(): Promise<ConfigResponse | null> {
    try {
        const response = await fetch(`/api/config${getCacheBuster()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération de la configuration:", error);
        return null;
    }
}

export async function saveConfig(newConfig: GlobalConfig): Promise<boolean> {
    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newConfig),
        });

        return response.ok;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la configuration:", error);
        return false;
    }
}

// UPLOAD SECTION
export async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Échec du téléversement');

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error("Erreur lors de l'envoi du fichier:", error);
        return null;
    }
}

export async function deleteFile(fileUrl: string): Promise<boolean> {
    try {
        const filename = fileUrl.split('/').pop();
        if (!filename) return false;

        const response = await fetch(`/api/upload/${filename}`, {
            method: 'DELETE',
        });

        return response.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}