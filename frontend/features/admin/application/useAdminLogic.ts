// IMPORT SECTION
import { useState, useEffect, useCallback } from 'react';
import { getConfig, saveConfig, deleteFile } from '@/shared/utils/api';
import { GlobalConfig, MediaItem } from '@/shared/utils/types';

// HOOK SECTION
export function useAdminLogic(displayName: string = 'default') {
    const [config, setConfig] = useState<GlobalConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await getConfig();
            if (data?.config) {
                setConfig(data.config);
            }
            setIsLoading(false);
        }
        loadData();
    }, []);

    const handleSave = async (newConfig: GlobalConfig) => {
        setConfig(newConfig);
        await saveConfig(newConfig);
    };

    const addMedia = useCallback((newItem: MediaItem, target: string) => {
        if (!config || !config.displays[displayName]) return;

        const updatedConfig = { ...config };
        const display = updatedConfig.displays[displayName];

        if (target === 'default') {
            display.default.items.push(newItem);
        } else if (target.startsWith('schedule-')) {
            const rangeKey = target.replace('schedule-', '');
            if (!display.schedules[rangeKey]) {
                display.schedules[rangeKey] = { items: [], audio: "" };
            }
            display.schedules[rangeKey].items.push(newItem);
        }

        handleSave(updatedConfig);
    }, [config, displayName]);

    const deleteMedia = useCallback(async (index: number, target: string) => {
        if (!config || !config.displays[displayName]) return;

        const updatedConfig = { ...config };
        const display = updatedConfig.displays[displayName];
        let itemToDelete: MediaItem | undefined;

        if (target === 'default') {
            itemToDelete = display.default.items[index];
            display.default.items.splice(index, 1);
        } else if (target.startsWith('schedule-')) {
            const rangeKey = target.replace('schedule-', '');
            itemToDelete = display.schedules[rangeKey].items[index];
            display.schedules[rangeKey].items.splice(index, 1);
        }

        if (itemToDelete && itemToDelete.url) {
            await deleteFile(itemToDelete.url);
        }

        handleSave(updatedConfig);
    }, [config, displayName]);

    const updateAudio = useCallback(async (url: string, target: string) => {
        if (!config || !config.displays[displayName]) return;

        const updatedConfig = { ...config };
        const display = updatedConfig.displays[displayName];
        let oldUrl = "";

        if (target === 'default') {
            oldUrl = display.default.audio || "";
            display.default.audio = url;
        } else if (target.startsWith('schedule-')) {
            const rangeKey = target.replace('schedule-', '');
            if (display.schedules[rangeKey]) {
                oldUrl = display.schedules[rangeKey].audio || "";
                display.schedules[rangeKey].audio = url;
            }
        }

        if (oldUrl && oldUrl !== url && oldUrl !== "") {
            await deleteFile(oldUrl);
        }

        handleSave(updatedConfig);
    }, [config, displayName]);

    const updateDuration = useCallback((seconds: number) => {
        if (!config || !config.displays[displayName]) return;

        const updatedConfig = { ...config };
        updatedConfig.displays[displayName].settings.slideDuration = seconds * 1000;
        handleSave(updatedConfig);
    }, [config, displayName]);

    const toggleVideoAudio = useCallback((playAudio: boolean) => {
        if (!config || !config.displays[displayName]) return;

        const updatedConfig = { ...config };
        updatedConfig.displays[displayName].settings.playVideoAudio = playAudio;
        handleSave(updatedConfig);
    }, [config, displayName]);

    const addScheduleRange = useCallback((startDate: string, endDate: string) => {
        if (!config || !config.displays[displayName]) return;

        const updatedConfig = { ...config };
        const rangeKey = `${startDate}_${endDate}`;

        if (!updatedConfig.displays[displayName].schedules[rangeKey]) {
            updatedConfig.displays[displayName].schedules[rangeKey] = { items: [], audio: "" };
        }

        handleSave(updatedConfig);
    }, [config, displayName]);

    const deleteSchedule = useCallback(async (rangeKey: string) => {
        if (!config || !config.displays[displayName]) return;

        const updatedConfig = { ...config };
        const scheduleToDelete = updatedConfig.displays[displayName].schedules[rangeKey];

        if (scheduleToDelete && scheduleToDelete.items) {
            for (const item of scheduleToDelete.items) {
                if (item.url) {
                    await deleteFile(item.url);
                }
            }
            if (scheduleToDelete.audio) {
                await deleteFile(scheduleToDelete.audio);
            }
        }

        delete updatedConfig.displays[displayName].schedules[rangeKey];

        handleSave(updatedConfig);
    }, [config, displayName]);

    const createDisplay = useCallback((name: string) => {
        if (!config) return;
        const updatedConfig = { ...config };

        if (!updatedConfig.displays[name]) {
            updatedConfig.displays[name] = {
                settings: { slideDuration: 8000, rotationLength: 2, rotationReferenceDate: "2024-01-07", playVideoAudio: false },
                default: { items: [], audio: "" },
                schedules: {},
                rotations: { "1": { items: [], audio: "" }, "2": { items: [], audio: "" } }
            };
            handleSave(updatedConfig);
        }
    }, [config]);

    const deleteDisplay = useCallback(async (name: string) => {
        if (!config || name === 'default' || !config.displays[name]) return;

        const updatedConfig = { ...config };
        const displayToDelete = updatedConfig.displays[name];

        if (displayToDelete.default) {
            if (displayToDelete.default.items) {
                for (const item of displayToDelete.default.items) {
                    if (item.url) await deleteFile(item.url);
                }
            }
            if (displayToDelete.default.audio) {
                await deleteFile(displayToDelete.default.audio);
            }
        }

        if (displayToDelete.schedules) {
            for (const schedule of Object.values(displayToDelete.schedules)) {
                if (schedule.items) {
                    for (const item of schedule.items) {
                        if (item.url) await deleteFile(item.url);
                    }
                }
                if (schedule.audio) {
                    await deleteFile(schedule.audio);
                }
            }
        }

        if (displayToDelete.rotations) {
            for (const rotation of Object.values(displayToDelete.rotations)) {
                if (rotation.items) {
                    for (const item of rotation.items) {
                        if (item.url) await deleteFile(item.url);
                    }
                }
                if (rotation.audio) {
                    await deleteFile(rotation.audio);
                }
            }
        }

        delete updatedConfig.displays[name];
        handleSave(updatedConfig);
    }, [config]);

    return {
        config,
        isLoading,
        addMedia,
        deleteMedia,
        updateAudio,
        updateDuration,
        toggleVideoAudio,
        addScheduleRange,
        deleteSchedule,
        createDisplay,
        deleteDisplay
    };
}