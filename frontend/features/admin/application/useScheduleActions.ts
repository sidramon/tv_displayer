import { useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
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

    const addScheduleRange = useCallback((startDate: string, endDate: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const key = `${startDate}_${endDate}`;

        if (updated.displays[displayName].schedules[key]) {
            addToast(t.feedback.scheduleAlreadyExists, 'error');
            return;
        }

        updated.displays[displayName].schedules[key] = { items: [], audio: '' };
        handleSave(updated);
        addToast(t.feedback.scheduleCreated, 'success');
    }, [config, displayName, handleSave, addToast, t]);

    const deleteSchedule = useCallback(async (rangeKey: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const schedule = updated.displays[displayName].schedules[rangeKey];

        if (schedule) {
            for (const item of schedule.items ?? []) {
                if (item.url) await deleteFile(item.url);
            }
            if (schedule.audio) await deleteFile(schedule.audio);
        }

        delete updated.displays[displayName].schedules[rangeKey];
        handleSave(updated);
    }, [config, displayName, handleSave]);

    const editSchedule = useCallback((oldKey: string, startDate: string, endDate: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const newKey = `${startDate}_${endDate}`;
        if (oldKey === newKey) return;

        const existing = updated.displays[displayName].schedules[oldKey];
        updated.displays[displayName].schedules[newKey] = existing;
        delete updated.displays[displayName].schedules[oldKey];

        handleSave(updated);
    }, [config, displayName, handleSave]);

    return { addScheduleRange, deleteSchedule, editSchedule };
}