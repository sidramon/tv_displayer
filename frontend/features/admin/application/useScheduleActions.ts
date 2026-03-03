import { useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { deleteFile } from '@/shared/utils/api';

interface UseScheduleActionsParams {
    config: GlobalConfig | null;
    displayName: string;
    handleSave: (config: GlobalConfig) => void;
}

export function useScheduleActions({ config, displayName, handleSave }: UseScheduleActionsParams) {
    const addScheduleRange = useCallback((startDate: string, endDate: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const key = `${startDate}_${endDate}`;

        if (!updated.displays[displayName].schedules[key]) {
            updated.displays[displayName].schedules[key] = { items: [], audio: "" };
        }

        handleSave(updated);
    }, [config, displayName, handleSave]);

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

    return { addScheduleRange, deleteSchedule };
}