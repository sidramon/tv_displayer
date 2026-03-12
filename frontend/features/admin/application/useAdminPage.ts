import { useState } from 'react';
import { MediaItem, GlobalConfig } from '@/shared/utils/types/config.types';
import { ScheduleDefinition } from '@/shared/utils/types';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

export function useAdminPage(
    config: GlobalConfig | null,
    actions: {
        addMedia: (item: MediaItem, target: string) => void;
        deleteMedia: (index: number, target: string) => void;
        updateAudio: (url: string, target: string) => void;
        onDeleteSchedule: (id: string) => void;
        onEditSchedule: (id: string, def: ScheduleDefinition) => void;
        createDisplay: (name: string) => void;
        deleteDisplay: (name: string) => void;
        toggleAnimations: (show: boolean) => void;
        renameDisplay: (oldName: string, newName: string) => void;
    },
    activeDisplay: string,
    setActiveDisplay: (name: string) => void,
) {
    const [activeTarget, setActiveTarget] = useState('default');
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const display  = config?.displays[activeDisplay];
    const settings = display?.settings;
    const schedules = display?.schedules || {};

    // ── Résolution de la cible active ──────────────────────────────────────────
    let activeItems: MediaItem[] = [];
    let activeAudio = '';
    let playlistTitle = `Playlist Globale (${activeDisplay === 'default' ? 'Défaut' : activeDisplay})`;

    if (activeTarget === 'default') {
        activeItems = display?.default?.items || [];
        activeAudio = display?.default?.audio || '';

    } else if (activeTarget.startsWith('schedule-')) {
        const raw = activeTarget.replace('schedule-', '');

        if (raw.includes('-slot-')) {
            // Mode périodes : schedule-{id}-slot-{slotIndex}
            const [id, slotPart] = raw.split('-slot-');
            const slotIndex = parseInt(slotPart ?? '0');
            const schedule  = display?.schedules[id];
            const slot      = schedule?.slots?.[slotIndex];

            activeItems   = slot?.items || [];
            activeAudio   = slot?.audio || '';
            playlistTitle = schedule
                ? `${schedule.name} · ${slot?.name || `Période ${slotIndex + 1}`}`
                : activeTarget;
        } else {
            // Mode simple : schedule-{id}
            const schedule = display?.schedules[raw];
            activeItems   = schedule?.items || [];
            activeAudio   = schedule?.audio || '';
            playlistTitle = schedule?.name ?? activeTarget;
        }
    }

    // ── Handlers display ───────────────────────────────────────────────────────
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

    // ── Handlers schedule ──────────────────────────────────────────────────────
    const handleDeleteSchedule = (id: string) => {
        actions.onDeleteSchedule(id);
        if (
            activeTarget === `schedule-${id}` ||
            activeTarget.startsWith(`schedule-${id}-slot-`)
        ) setActiveTarget('default');
        addToast(t.feedback.scheduleDeleted, 'success');
    };

    const handleEditSchedule = (id: string, def: ScheduleDefinition) => {
        actions.onEditSchedule(id, def);
        addToast(t.feedback.scheduleUpdated, 'success');
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
        playVideoAudio:  settings?.playVideoAudio || false,
        showAnimations:  settings?.showAnimations ?? true,
        handleSelectDisplay,
        handleCreateDisplay,
        handleDeleteDisplay,
        handleDeleteSchedule,
        handleEditSchedule,
        handleAddMedia:    (item: MediaItem) => actions.addMedia(item, activeTarget),
        handleDeleteMedia: (index: number) => actions.deleteMedia(index, activeTarget),
        handleUpdateAudio: (url: string) => actions.updateAudio(url, activeTarget),
        handleRenameDisplay: (oldName: string, newName: string) => {
            actions.renameDisplay(oldName, newName);
            if (activeDisplay === oldName) setActiveDisplay(newName);
            addToast(t.feedback.displayRenamed, 'success');
        },
    };
}