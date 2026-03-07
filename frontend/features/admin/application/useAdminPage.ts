import { useState } from 'react';
import { MediaItem, GlobalConfig } from '@/shared/utils/types/config.types';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

export function useAdminPage(
    config: GlobalConfig | null,
    actions: {
        addMedia: (item: MediaItem, target: string) => void;
        deleteMedia: (index: number, target: string) => void;
        updateAudio: (url: string, target: string) => void;
        deleteSchedule: (key: string) => void;
        editSchedule: (oldKey: string, startDate: string, endDate: string) => void;
        createDisplay: (name: string) => void;
        deleteDisplay: (name: string) => void;
        toggleAnimations: (show: boolean) => void;
    },
    activeDisplay: string,
    setActiveDisplay: (name: string) => void,
) {
    const [activeTarget, setActiveTarget] = useState('default');
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const display = config?.displays[activeDisplay];
    const settings = display?.settings;
    const schedules = Object.keys(display?.schedules || {});

    let activeItems: MediaItem[] = [];
    let activeAudio = '';
    let playlistTitle = `Playlist Globale (${activeDisplay === 'default' ? 'Défaut' : activeDisplay})`;

    if (activeTarget === 'default') {
        activeItems = display?.default?.items || [];
        activeAudio = display?.default?.audio || '';
    } else if (activeTarget.startsWith('schedule-')) {
        const key = activeTarget.replace('schedule-', '');
        const [start, end] = key.split('_');
        activeItems = display?.schedules[key]?.items || [];
        activeAudio = display?.schedules[key]?.audio || '';
        playlistTitle = `Playlist - Du ${start} au ${end}`;
    }

    const handleSelectDisplay = (name: string) => {
        setActiveDisplay(name);
        setActiveTarget('default');
    };

    const handleCreateDisplay = (name: string) => {
        actions.createDisplay(name);
        setActiveDisplay(name);
        setActiveTarget('default');
        addToast(t.feedback.displayCreated, 'success');
    };

    const handleDeleteDisplay = (name: string) => {
        if (!confirm(`Voulez-vous vraiment supprimer l'écran "${name}" et tous ses médias de façon permanente ?`)) return;
        actions.deleteDisplay(name);
        setActiveDisplay('default');
        setActiveTarget('default');
        addToast(t.feedback.displayDeleted, 'success');
    };

    const handleDeleteSchedule = (key: string) => {
        actions.deleteSchedule(key);
        if (activeTarget === `schedule-${key}`) setActiveTarget('default');
        addToast(t.feedback.scheduleDeleted, 'success');
    };

    return {
        activeDisplay,
        activeTarget,
        setActiveTarget,
        schedules,
        activeItems,
        activeAudio,
        playlistTitle,
        currentDuration: (settings?.slideDuration || 8000) / 1000,
        playVideoAudio: settings?.playVideoAudio || false,
        showAnimations: settings?.showAnimations ?? true,
        handleSelectDisplay,
        handleCreateDisplay,
        handleDeleteDisplay,
        handleDeleteSchedule,
        handleAddMedia: (item: MediaItem) => actions.addMedia(item, activeTarget),
        handleDeleteMedia: (index: number) => actions.deleteMedia(index, activeTarget),
        handleUpdateAudio: (url: string) => actions.updateAudio(url, activeTarget),
        handleEditSchedule: (oldKey: string, start: string, end: string) => {
            actions.editSchedule(oldKey, start, end);
            const newKey = `${start}_${end}`;
            if (activeTarget === `schedule-${oldKey}`) setActiveTarget(`schedule-${newKey}`);
            addToast(t.feedback.scheduleUpdated, 'success');
        },
    };
}