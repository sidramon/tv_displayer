import { useCallback } from 'react';
import { GlobalConfig, MediaItem } from '@/shared/utils/types/config.types';
import { ScheduleDefinition } from '@/shared/utils/types';
import { deleteFile } from '@/shared/api';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface UseScheduleActionsParams {
    config: GlobalConfig | null;
    displayName: string;
    handleSave: (config: GlobalConfig) => void;
}

export function useScheduleActions({ config, displayName, handleSave }: UseScheduleActionsParams) {
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const onAddSchedule = useCallback((id: string, def: ScheduleDefinition) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        updated.displays[displayName].schedules[id] = def;
        handleSave(updated);
        addToast(t.feedback.scheduleCreated, 'success');
    }, [config, displayName, handleSave, addToast, t]);

    const onDeleteSchedule = useCallback(async (id: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const schedule = updated.displays[displayName].schedules[id];

        if (schedule) {
            for (const slot of schedule.slots ?? []) {
                for (const item of slot.items ?? []) {
                    if (item.url) await deleteFile(item.url);
                }
                if (slot.audio) await deleteFile(slot.audio);
            }
        }

        delete updated.displays[displayName].schedules[id];
        handleSave(updated);
        addToast(t.feedback.scheduleDeleted, 'success');
    }, [config, displayName, handleSave, addToast, t]);

    const onEditSchedule = useCallback(async (id: string, def: ScheduleDefinition) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const existing = updated.displays[displayName].schedules[id];
        if (!existing) return;

        const mergedSlots = (def.slots ?? []).map((slot, i) => ({
            ...slot,
            items: existing.slots?.[i]?.items ?? [] as MediaItem[],
            audio: existing.slots?.[i]?.audio ?? '',
        }));

        const removedSlots = (existing.slots ?? []).slice((def.slots ?? []).length);
        for (const slot of removedSlots) {
            for (const item of slot.items ?? []) {
                if (item.url) await deleteFile(item.url);
            }
            if (slot.audio) await deleteFile(slot.audio);
        }

        updated.displays[displayName].schedules[id] = { ...def, slots: mergedSlots };
        handleSave(updated);
        addToast(t.feedback.scheduleUpdated, 'success');
    }, [config, displayName, handleSave, addToast, t]);

    return { onAddSchedule, onDeleteSchedule, onEditSchedule };
}