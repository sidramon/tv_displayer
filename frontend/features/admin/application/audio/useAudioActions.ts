import { useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { deleteFile } from '@/shared/api';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface UseAudioActionsParams {
    config: GlobalConfig | null;
    displayName: string;
    handleSave: (config: GlobalConfig) => void;
}

export function useAudioActions({ config, displayName, handleSave }: UseAudioActionsParams) {
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const updateAudio = useCallback(async (url: string, target: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const display = updated.displays[displayName];
        let oldUrl = '';

        if (target === 'default') {
            oldUrl = display.default.audio || '';
            display.default.audio = url;
        } else if (target.startsWith('schedule-')) {
            const key = target.replace('schedule-', '');
            if (display.schedules[key]) {
                oldUrl = display.schedules[key].audio || '';
                display.schedules[key].audio = url;
            }
        }

        if (oldUrl && oldUrl !== url) {
            const deleted = await deleteFile(oldUrl);
            if (!deleted) addToast(t.feedback.deleteFailed, 'error');
            else if (!url) addToast(t.feedback.audioDeleted, 'success');
        }

        handleSave(updated);
    }, [config, displayName, handleSave, addToast, t]);
    return { updateAudio };
}