import { useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface UseCustomizationParams {
    config: GlobalConfig;
    handleSave: (config: GlobalConfig) => void;
}

export function useCustomization({ config, handleSave }: UseCustomizationParams) {
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const updateHeaderTheme = useCallback((headerThemeKey: string) => {
        handleSave({ ...config, settings: { ...config.settings, headerThemeKey } });
        addToast(t.feedback.themeSaved, 'success');
    }, [config, handleSave, addToast, t]);

    const updateDisplayAnimation = useCallback((displayAnimationKey: string) => {
        handleSave({ ...config, settings: { ...config.settings, displayAnimationKey } });
        addToast(t.feedback.animationSaved, 'success');
    }, [config, handleSave, addToast, t]);

    return { updateHeaderTheme, updateDisplayAnimation };
}