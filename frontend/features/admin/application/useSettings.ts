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
        handleSave({ ...config, settings: { ...config.settings, companyName: name } });
    }, [config, handleSave]);

    const updateLogoUrl = useCallback((url: string) => {
        if (!config) return;
        handleSave({ ...config, settings: { ...config.settings, logoUrl: url } });
    }, [config, handleSave]);

    const updateTheme = useCallback((theme: 'dark' | 'light') => {
        if (!config) return;
        handleSave({ ...config, settings: { ...config.settings, theme } });
    }, [config, handleSave]);

    const updateWeatherLocation = useCallback((lat: number, lng: number) => {
        if (!config) return;
        handleSave({ ...config, settings: { ...config.settings, weatherLatitude: lat, weatherLongitude: lng } });
    }, [config, handleSave]);

    const updateLocale = useCallback((locale: 'fr' | 'en') => {
        if (!config) return;
        handleSave({ ...config, settings: { ...config.settings, locale } });
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

    return {
        updateCompanyName,
        updateLogoUrl,
        updateTheme,
        updateWeatherLocation,
        updateLocale,
        changePassword,
        isChangingPassword,
        passwordError,
        passwordSuccess,
    };
}