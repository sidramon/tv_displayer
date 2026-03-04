import { useState, useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';

interface UseSettingsParams {
    config: GlobalConfig | null;
    handleSave: (config: GlobalConfig) => void;
}

export function useSettings({ config, handleSave }: UseSettingsParams) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const updateCompanyName = useCallback((name: string) => {
        if (!config) return;
        const updated = { ...config, settings: { ...config.settings, companyName: name } };
        handleSave(updated);
    }, [config, handleSave]);

    const updateLogoUrl = useCallback((url: string) => {
        if (!config) return;
        const updated = { ...config, settings: { ...config.settings, logoUrl: url } };
        handleSave(updated);
    }, [config, handleSave]);

    const updateTheme = useCallback((theme: 'dark' | 'light') => {
        if (!config) return;
        const updated = { ...config, settings: { ...config.settings, theme } };
        handleSave(updated);
    }, [config, handleSave]);

    const changePassword = useCallback(async (newPassword: string) => {
        setIsChangingPassword(true);
        setPasswordError('');
        setPasswordSuccess(false);
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Token': localStorage.getItem('admin_token') || '',
                },
                body: JSON.stringify({ newPassword }),
            });
            if (response.ok) {
                localStorage.setItem('admin_token', newPassword);
                setPasswordSuccess(true);
            } else {
                setPasswordError('Erreur lors du changement de mot de passe.');
            }
        } catch {
            setPasswordError('Erreur de connexion au serveur.');
        }
        setIsChangingPassword(false);
    }, []);

    const updateWeatherLocation = useCallback((lat: number, lng: number) => {
        if (!config) return;
        const updated = {
            ...config,
            settings: { ...config.settings, weatherLatitude: lat, weatherLongitude: lng }
        };
        handleSave(updated);
    }, [config, handleSave]);

    return {
        updateCompanyName,
        updateLogoUrl,
        updateTheme,
        changePassword,
        isChangingPassword,
        passwordError,
        passwordSuccess,
        updateWeatherLocation,
    };
}