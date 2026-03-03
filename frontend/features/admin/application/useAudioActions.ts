import { useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { deleteFile } from '@/shared/utils/api';

interface UseAudioActionsParams {
    config: GlobalConfig | null;
    displayName: string;
    handleSave: (config: GlobalConfig) => void;
}

export function useAudioActions({ config, displayName, handleSave }: UseAudioActionsParams) {
    const updateAudio = useCallback(async (url: string, target: string) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        const display = updated.displays[displayName];
        let oldUrl = "";

        if (target === 'default') {
            oldUrl = display.default.audio || "";
            display.default.audio = url;
        } else if (target.startsWith('schedule-')) {
            const key = target.replace('schedule-', '');
            if (display.schedules[key]) {
                oldUrl = display.schedules[key].audio || "";
                display.schedules[key].audio = url;
            }
        }

        if (oldUrl && oldUrl !== url) await deleteFile(oldUrl);
        handleSave(updated);
    }, [config, displayName, handleSave]);

    return { updateAudio };
}