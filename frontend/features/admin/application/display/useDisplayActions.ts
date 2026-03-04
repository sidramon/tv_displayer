import { useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { deleteFile } from '@/shared/api/api';

interface UseDisplayActionsParams {
    config: GlobalConfig | null;
    displayName: string;
    handleSave: (config: GlobalConfig) => void;
}

const DEFAULT_DISPLAY_CONFIG = {
    settings: { slideDuration: 8000, rotationLength: 2, rotationReferenceDate: "2024-01-07", playVideoAudio: false },
    default: { items: [], audio: "" },
    schedules: {},
    rotations: { "1": { items: [], audio: "" }, "2": { items: [], audio: "" } }
};

export function useDisplayActions({ config, displayName, handleSave }: UseDisplayActionsParams) {
    const updateDuration = useCallback((seconds: number) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        updated.displays[displayName].settings.slideDuration = seconds * 1000;
        handleSave(updated);
    }, [config, displayName, handleSave]);

    const toggleVideoAudio = useCallback((playAudio: boolean) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        updated.displays[displayName].settings.playVideoAudio = playAudio;
        handleSave(updated);
    }, [config, displayName, handleSave]);

    const createDisplay = useCallback((name: string) => {
        if (!config || config.displays[name]) return;
        const updated = { ...config };
        updated.displays[name] = { ...DEFAULT_DISPLAY_CONFIG };
        handleSave(updated);
    }, [config, handleSave]);

    const deleteDisplay = useCallback(async (name: string) => {
        if (!config || name === 'default' || !config.displays[name]) return;
        const updated = { ...config };
        const display = updated.displays[name];

        const deletePlaylistFiles = async (playlist: typeof display.default) => {
            for (const item of playlist?.items ?? []) {
                if (item.url) await deleteFile(item.url);
            }
            if (playlist?.audio) await deleteFile(playlist.audio);
        };

        await deletePlaylistFiles(display.default);
        for (const schedule of Object.values(display.schedules ?? {})) await deletePlaylistFiles(schedule);
        for (const rotation of Object.values(display.rotations ?? {})) await deletePlaylistFiles(rotation);

        delete updated.displays[name];
        handleSave(updated);
    }, [config, handleSave]);

    return { updateDuration, toggleVideoAudio, createDisplay, deleteDisplay };
}