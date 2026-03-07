import { useCallback } from 'react';
import { GlobalConfig, MediaItem } from '@/shared/utils/types/config.types';
import { deleteFile } from '@/shared/api';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface UseMediaActionsParams {
    config: GlobalConfig | null;
    displayName: string;
    handleSave: (config: GlobalConfig) => void;
}

export function useMediaActions({ config, displayName, handleSave }: UseMediaActionsParams) {
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const addMedia = useCallback((newItem: MediaItem, target: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const display = updated.displays[displayName];

        if (target === 'default') {
            display.default.items.push(newItem);
        } else if (target.startsWith('schedule-')) {
            const key = target.replace('schedule-', '');
            if (!display.schedules[key]) display.schedules[key] = { items: [], audio: '' };
            display.schedules[key].items.push(newItem);
        }

        handleSave(updated);
    }, [config, displayName, handleSave]);

    const deleteMedia = useCallback(async (index: number, target: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const display = updated.displays[displayName];
        let itemToDelete: MediaItem | undefined;

        if (target === 'default') {
            itemToDelete = display.default.items[index];
            display.default.items.splice(index, 1);
        } else if (target.startsWith('schedule-')) {
            const key = target.replace('schedule-', '');
            itemToDelete = display.schedules[key].items[index];
            display.schedules[key].items.splice(index, 1);
        }

        if (itemToDelete?.url) {
            const deleted = await deleteFile(itemToDelete.url);
            if (!deleted) addToast(t.feedback.deleteFailed, 'error');
            else addToast(t.feedback.mediaDeleted, 'success');
        }

        handleSave(updated);
    }, [config, displayName, handleSave, addToast, t]);

    return { addMedia, deleteMedia };
}