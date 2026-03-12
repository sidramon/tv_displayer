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

function parseScheduleTarget(target: string): { id: string; slotIndex: number | null } {
    const raw = target.replace('schedule-', '');
    if (raw.includes('-slot-')) {
        const [id, slotPart] = raw.split('-slot-');
        return { id, slotIndex: parseInt(slotPart ?? '0') };
    }
    return { id: raw, slotIndex: null };
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
        const { id, slotIndex } = parseScheduleTarget(target);
        if (slotIndex !== null) {
            if (!display.schedules[id]?.slots?.[slotIndex]) return;
            display.schedules[id].slots![slotIndex].items.push(newItem);
        } else {
            if (!display.schedules[id]) return;
            display.schedules[id].items = [...(display.schedules[id].items ?? []), newItem];
        }
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
            const { id, slotIndex } = parseScheduleTarget(target);
            if (slotIndex !== null) {
                if (!display.schedules[id]?.slots?.[slotIndex]) return;
                itemToDelete = display.schedules[id].slots![slotIndex].items[index];
                display.schedules[id].slots![slotIndex].items.splice(index, 1);
            } else {
                if (!display.schedules[id]?.items) return;
                itemToDelete = display.schedules[id].items![index];
                display.schedules[id].items!.splice(index, 1);
            }
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