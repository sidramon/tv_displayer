'use client';

import { useAdminLogic } from '../application/useAdminLogic';
import { useAdminPage } from '../application/useAdminPage';
import MediaUploader from './components/MediaUploader';
import AudioManager from './components/AudioManager';
import DisplaySettings from './components/DisplaySettings';
import PlaylistEditor from './components/PlaylistEditor';
import ScheduleSelector from './components/ScheduleSelector';
import DisplayTabs from './components/DisplayTabs';

export default function AdminPage() {
    const { config, isLoading, ...actions } = useAdminLogic();

    if (isLoading) return <div className="p-12 text-slate-900">Chargement...</div>;
    if (!config) return <div className="p-12 text-slate-900">Erreur de connexion à l'API.</div>;

    const {
        activeDisplay, activeTarget, setActiveTarget,
        schedules, activeItems, activeAudio, playlistTitle,
        currentDuration, playVideoAudio,
        handleSelectDisplay, handleCreateDisplay, handleDeleteDisplay,
        handleDeleteSchedule, handleAddMedia, handleDeleteMedia, handleUpdateAudio,
    } = useAdminPage(config, actions);

    return (
        <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden">
            <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full p-8">

                <header className="mb-6 shrink-0 flex flex-col gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Panneau d'administration</h1>
                        <p className="text-slate-500 mt-2">Gestion de l'affichage</p>
                    </div>
                    <DisplayTabs
                        displays={Object.keys(config.displays)}
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
                            onAddScheduleRange={actions.addScheduleRange}
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
                            onDurationChange={actions.updateDuration}
                            playVideoAudio={playVideoAudio}
                            onToggleVideoAudio={actions.toggleVideoAudio}
                        />
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                            <h2 className="text-xl font-semibold mb-6">Ajouter un média</h2>
                            <MediaUploader onUploadComplete={handleAddMedia} />
                        </div>
                        <AudioManager currentAudio={activeAudio} onUpdateAudio={handleUpdateAudio} />
                    </div>
                </div>

            </div>
        </div>
    );
}