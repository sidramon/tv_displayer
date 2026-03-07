import { useCallback } from 'react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { deleteFile } from '@/shared/api';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface UseDisplayActionsParams {
    config: GlobalConfig | null;
    displayName: string;
    handleSave: (config: GlobalConfig) => void;
}

const DEFAULT_DISPLAY_CONFIG = {
    settings: {
        slideDuration: 8000,
        rotationLength: 2,
        rotationReferenceDate: "2024-01-07",
        playVideoAudio: false,
        showAnimations: true,
    },
    default: { items: [], audio: "" },
    schedules: {},
    rotations: { "1": { items: [], audio: "" }, "2": { items: [], audio: "" } }
};

export function useDisplayActions({ config, displayName, handleSave }: UseDisplayActionsParams) {
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const updateDuration = useCallback((seconds: number) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        updated.displays[displayName].settings.slideDuration = seconds * 1000;
        handleSave(updated);
        addToast(t.feedback.durationUpdated, 'success');
    }, [config, displayName, handleSave, addToast, t]);

    const toggleVideoAudio = useCallback((playAudio: boolean) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        updated.displays[displayName].settings.playVideoAudio = playAudio;
        handleSave(updated);
        addToast(playAudio ? t.feedback.audioEnabled : t.feedback.audioDisabled, 'success');
    }, [config, displayName, handleSave, addToast, t]);

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
                if (item.url) {
                    const deleted = await deleteFile(item.url);
                    if (!deleted) addToast(t.feedback.deleteFailed, 'error');
                }
            }
            if (playlist?.audio) {
                const deleted = await deleteFile(playlist.audio);
                if (!deleted) addToast(t.feedback.deleteFailed, 'error');
            }
        };

        await deletePlaylistFiles(display.default);
        for (const schedule of Object.values(display.schedules ?? {})) await deletePlaylistFiles(schedule);
        for (const rotation of Object.values(display.rotations ?? {})) await deletePlaylistFiles(rotation);

        delete updated.displays[name];
        handleSave(updated);
    }, [config, handleSave, addToast, t]);

    const toggleAnimations = useCallback((show: boolean) => {
        if (!config?.displays[displayName]) return;
        const updated = { ...config };
        updated.displays[displayName].settings.showAnimations = show;
        handleSave(updated);
        addToast(show ? t.feedback.animationsEnabled : t.feedback.animationsDisabled, 'success');
    }, [config, displayName, handleSave, addToast, t]);

    return { updateDuration, toggleVideoAudio, toggleAnimations, createDisplay, deleteDisplay };
}