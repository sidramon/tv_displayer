// IMPORT SECTION
'use client';

import React, { useState } from 'react';
import { useAdminLogic } from '../application/useAdminLogic';
import MediaUploader from './components/MediaUploader';
import AudioManager from './components/AudioManager';
import DisplaySettings from './components/DisplaySettings';
import PlaylistEditor from './components/PlaylistEditor';
import ScheduleSelector from './components/ScheduleSelector';
import DisplayTabs from './components/DisplayTabs';
import { MediaItem } from '@/shared/utils/types';

// COMPONENT SECTION
export default function AdminPage() {
    const [activeDisplay, setActiveDisplay] = useState<string>('default');
    const [activeTarget, setActiveTarget] = useState<string>('default');

    const {
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
    } = useAdminLogic(activeDisplay);

    if (isLoading) return <div className="p-12 text-slate-900">Chargement...</div>;
    if (!config) return <div className="p-12 text-slate-900">Erreur de connexion à l'API.</div>;

    const displays = Object.keys(config.displays);
    const currentSettings = config.displays[activeDisplay]?.settings;
    const currentDuration = (currentSettings?.slideDuration || 8000) / 1000;
    const playVideoAudio = currentSettings?.playVideoAudio || false;
    const schedules = Object.keys(config.displays[activeDisplay]?.schedules || {});

    let activeItems: MediaItem[] = [];
    let activeAudio: string = "";
    let playlistTitle = `Playlist Globale (${activeDisplay === 'default' ? 'Défaut' : activeDisplay})`;

    if (activeTarget === 'default') {
        activeItems = config.displays[activeDisplay]?.default?.items || [];
        activeAudio = config.displays[activeDisplay]?.default?.audio || "";
    } else if (activeTarget.startsWith('schedule-')) {
        const rangeKey = activeTarget.replace('schedule-', '');
        const [start, end] = rangeKey.split('_');
        activeItems = config.displays[activeDisplay]?.schedules[rangeKey]?.items || [];
        activeAudio = config.displays[activeDisplay]?.schedules[rangeKey]?.audio || "";
        playlistTitle = `Playlist - Du ${start} au ${end}`;
    }

    const handleAddMedia = (item: MediaItem) => {
        addMedia(item, activeTarget);
    };

    const handleDeleteMedia = (index: number) => {
        deleteMedia(index, activeTarget);
    };

    const handleUpdateAudio = (url: string) => {
        updateAudio(url, activeTarget);
    };

    const handleDeleteSchedule = (rangeKey: string) => {
        deleteSchedule(rangeKey);
        if (activeTarget === `schedule-${rangeKey}`) {
            setActiveTarget('default');
        }
    };

    const handleSelectDisplay = (display: string) => {
        setActiveDisplay(display);
        setActiveTarget('default');
    };

    const handleCreateDisplay = (name: string) => {
        createDisplay(name);
        setActiveDisplay(name);
        setActiveTarget('default');
    };

    const handleDeleteDisplay = (name: string) => {
        if (confirm(`Voulez-vous vraiment supprimer l'écran "${name}" et tous ses médias de façon permanente ?`)) {
            deleteDisplay(name);
            setActiveDisplay('default');
            setActiveTarget('default');
        }
    };

    return (
        <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden">
            <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full p-8">

                <header className="mb-6 shrink-0 flex flex-col gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Panneau d'administration</h1>
                        <p className="text-slate-500 mt-2">Gestion de l'affichage</p>
                    </div>

                    <DisplayTabs
                        displays={displays}
                        activeDisplay={activeDisplay}
                        onSelectDisplay={handleSelectDisplay}
                        onCreateDisplay={handleCreateDisplay}
                        onDeleteDisplay={handleDeleteDisplay}
                    />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden min-h-0">

                    <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                        <ScheduleSelector
                            activeTarget={activeTarget}
                            onChangeTarget={setActiveTarget}
                            schedules={schedules}
                            onAddScheduleRange={addScheduleRange}
                            onDeleteSchedule={handleDeleteSchedule}
                        />
                    </div>

                    <div className="lg:col-span-2 h-full min-h-0">
                        <PlaylistEditor
                            title={playlistTitle}
                            items={activeItems}
                            onDeleteMedia={handleDeleteMedia}
                        />
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                        <DisplaySettings
                            duration={currentDuration}
                            onDurationChange={updateDuration}
                            playVideoAudio={playVideoAudio}
                            onToggleVideoAudio={toggleVideoAudio}
                        />

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                            <h2 className="text-xl font-semibold mb-6">Ajouter un média</h2>
                            <MediaUploader onUploadComplete={handleAddMedia}/>
                        </div>

                        <AudioManager
                            currentAudio={activeAudio}
                            onUpdateAudio={handleUpdateAudio}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}