'use client';

import { useState } from 'react';
import { useAdminLogic } from '../application/useAdminLogic';
import { useAdminPage } from '../application/useAdminPage';
import { useAuth } from "@/features/admin/application/useAuth";
import MediaUploader from './components/MediaUploader';
import AudioManager from './components/AudioManager';
import DisplaySettings from './components/DisplaySettings';
import PlaylistEditor from './components/PlaylistEditor';
import ScheduleSelector from './components/ScheduleSelector';
import DisplayTabs from './components/DisplayTabs';
import LiveIndicator from './components/LiveIndicator';
import SettingsButton from './components/SettingsButton';
import SettingsPage from './SettingsPage';
import LoginPage from './LoginPage';

export default function AdminPage() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [activeDisplay, setActiveDisplay] = useState('default');
    const { config, isLoading, handleSave, ...actions } = useAdminLogic(activeDisplay);
    const page = useAdminPage(config, actions, activeDisplay, setActiveDisplay);
    const [showSettings, setShowSettings] = useState(false);

    if (!isAuthenticated) {
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    if (isLoading) return <div className="p-12 text-slate-900">Chargement...</div>;
    if (!config) return <div className="p-12 text-slate-900">Erreur de connexion à l'API.</div>;

    const theme = config.settings?.theme || 'light';

    return (
        <div className={theme}>
            <div className="h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col overflow-hidden">
                {showSettings && (
                    <SettingsPage
                        config={config}
                        handleSave={handleSave}
                        onClose={() => setShowSettings(false)}
                    />
                )}

                <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full p-8">
                    <header className="mb-6 shrink-0 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight">Panneau d'administration</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">Gestion de l'affichage</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <LiveIndicator displayName={page.activeDisplay} />
                                <SettingsButton onClick={() => setShowSettings(true)} />
                            </div>
                        </div>
                        <DisplayTabs
                            displays={Object.keys(config.displays)}
                            activeDisplay={page.activeDisplay}
                            onSelectDisplay={page.handleSelectDisplay}
                            onCreateDisplay={page.handleCreateDisplay}
                            onDeleteDisplay={page.handleDeleteDisplay}
                        />
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden min-h-0">
                        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                            <ScheduleSelector
                                activeTarget={page.activeTarget}
                                onChangeTarget={page.setActiveTarget}
                                schedules={page.schedules}
                                onAddScheduleRange={actions.addScheduleRange}
                                onDeleteSchedule={page.handleDeleteSchedule}
                            />
                        </div>

                        <div className="lg:col-span-2 h-full min-h-0">
                            <PlaylistEditor
                                title={page.playlistTitle}
                                items={page.activeItems}
                                onDeleteMedia={page.handleDeleteMedia}
                            />
                        </div>

                        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                            <DisplaySettings
                                duration={page.currentDuration}
                                onDurationChange={actions.updateDuration}
                                playVideoAudio={page.playVideoAudio}
                                onToggleVideoAudio={actions.toggleVideoAudio}
                            />
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                                <h2 className="text-xl font-semibold mb-6">Ajouter un média</h2>
                                <MediaUploader onUploadComplete={page.handleAddMedia} />
                            </div>
                            <AudioManager currentAudio={page.activeAudio} onUpdateAudio={page.handleUpdateAudio} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}