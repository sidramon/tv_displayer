import { getAuthHeaders, getCacheBuster } from './helpers';
import { ConfigResponse, GlobalConfig } from '@/shared/utils/types';

export async function getConfig(): Promise<ConfigResponse | null> {
    try {
        const response = await fetch(`/api/config${getCacheBuster()}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store',
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur config:', error);
        return null;
    }
}

export type SaveConfigResult =
    | { status: 'success'; version: number }
    | { status: 'conflict'; current: GlobalConfig; message: string }
    | { status: 'error' };

export async function saveConfig(newConfig: GlobalConfig): Promise<SaveConfigResult> {
    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(newConfig),
        });

        const data = await response.json();

        if (response.status === 409) return { status: 'conflict', ...data };
        if (!response.ok) return { status: 'error' };

        return { status: 'success', version: data.version };
    } catch (error) {
        console.error('Erreur sauvegarde config:', error);
        return { status: 'error' };
    }
}