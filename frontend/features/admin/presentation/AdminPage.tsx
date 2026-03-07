'use client';

import { useState } from 'react';
import { useAdminLogic } from '../application/useAdminLogic';
import { useAdminPage } from '../application/useAdminPage';
import { useAuth } from "@/features/admin/application/useAuth";
import { useTranslation } from '@/shared/i18n/useTranslation';
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
import { Palette } from 'lucide-react';
import CustomizationPanel from "@/features/admin/presentation/components/CustumizationPanel";

type MobileTab = 'playlist' | 'schedule' | 'settings';

export default function AdminPage() {
    const { isAuthenticated, setIsAuthenticated, isChecking } = useAuth();
    const [activeDisplay, setActiveDisplay] = useState('default');
    const { config, isLoading, handleSave, ...actions } = useAdminLogic(activeDisplay);
    const page = useAdminPage(config, actions, activeDisplay, setActiveDisplay);
    const [showSettings, setShowSettings] = useState(false);
    const [showCustomization, setShowCustomization] = useState(false);
    const [mobileTab, setMobileTab] = useState<MobileTab>('playlist');
    const { t } = useTranslation();


    if (isChecking) return (
        <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-slate-400 text-sm">{t.display.loading}</div>
        </div>
    );

    if (!isAuthenticated) {
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    if (isLoading) return <div className="p-12 text-slate-900">{t.display.loading}</div>;
    if (!config) return <div className="p-12 text-slate-900">{t.display.connectionError}</div>;

    const theme = config.settings?.theme || 'light';

    const panels = (
        <>
            {showSettings && (
                <SettingsPage
                    config={config}
                    handleSave={handleSave}
                    onClose={() => setShowSettings(false)}
                    onLogout={() => setIsAuthenticated(false)}
                />
            )}
            {showCustomization && (
                <CustomizationPanel
                    config={config}
                    handleSave={handleSave}
                    onClose={() => setShowCustomization(false)}
                />
            )}
        </>
    );

    const headerButtons = (
        <div className="flex items-center gap-2">
            <LiveIndicator displayName={page.activeDisplay} />
            <button
                onClick={() => setShowCustomization(true)}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
                <Palette className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <SettingsButton onClick={() => setShowSettings(true)} />
        </div>
    );

    return (
        <div className={theme}>
            {/* Bureau */}
            <div className="hidden lg:flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex-col overflow-hidden">
                {panels}
                <div className="w-full max-w-[1400px] mx-auto flex flex-col h-full p-8">
                    <header className="mb-6 shrink-0 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight">{t.admin.title}</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">{t.admin.subtitle}</p>
                            </div>
                            {headerButtons}
                        </div>
                        <DisplayTabs
                            displays={Object.keys(config.displays)}
                            activeDisplay={page.activeDisplay}
                            onSelectDisplay={page.handleSelectDisplay}
                            onCreateDisplay={page.handleCreateDisplay}
                            onDeleteDisplay={page.handleDeleteDisplay}
                        />
                    </header>
                    <div className="grid grid-cols-4 gap-8 flex-1 overflow-hidden min-h-0">
                        <div className="col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                            <ScheduleSelector
                                activeTarget={page.activeTarget}
                                onChangeTarget={page.setActiveTarget}
                                schedules={page.schedules}
                                onAddScheduleRange={actions.addScheduleRange}
                                onDeleteSchedule={page.handleDeleteSchedule}
                                onEditSchedule={page.handleEditSchedule}
                            />
                        </div>
                        <div className="col-span-2 h-full min-h-0">
                            <PlaylistEditor
                                title={page.playlistTitle}
                                items={page.activeItems}
                                onDeleteMedia={page.handleDeleteMedia}
                            />
                        </div>
                        <div className="col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                                <h2 className="text-xl font-semibold mb-6">{t.admin.addMedia}</h2>
                                <MediaUploader onUploadComplete={page.handleAddMedia} />
                            </div>
                            <DisplaySettings
                                duration={page.currentDuration}
                                onDurationChange={actions.updateDuration}
                                playVideoAudio={page.playVideoAudio}
                                onToggleVideoAudio={actions.toggleVideoAudio}
                                showAnimations={page.showAnimations}
                                onToggleAnimations={actions.toggleAnimations}
                            />
                            <AudioManager currentAudio={page.activeAudio} onUpdateAudio={page.handleUpdateAudio} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden h-[100dvh] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex-col">
                {panels}
                <div className="sticky top-0 z-10 shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 pt-4 pb-0">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{t.admin.title}</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{t.admin.subtitle}</p>
                        </div>
                        {headerButtons}
                    </div>
                    <DisplayTabs
                        displays={Object.keys(config.displays)}
                        activeDisplay={page.activeDisplay}
                        onSelectDisplay={page.handleSelectDisplay}
                        onCreateDisplay={page.handleCreateDisplay}
                        onDeleteDisplay={page.handleDeleteDisplay}
                    />
                    <div className="flex border-b border-slate-200 dark:border-slate-700 mt-2">
                        {([
                            { key: 'playlist' as MobileTab, label: t.mobile.playlist },
                            { key: 'schedule' as MobileTab, label: t.mobile.schedule },
                            { key: 'settings' as MobileTab, label: t.mobile.settings },
                        ]).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setMobileTab(tab.key)}
                                className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                                    mobileTab === tab.key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {mobileTab === 'playlist' && (
                        <div className="h-full">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 mb-1">
                                <h2 className="text-xl font-semibold mb-6">{t.admin.addMedia}</h2>
                                <MediaUploader onUploadComplete={page.handleAddMedia} />
                            </div>
                            <PlaylistEditor
                                title={page.playlistTitle}
                                items={page.activeItems}
                                onDeleteMedia={page.handleDeleteMedia}
                            />
                        </div>
                    )}
                    {mobileTab === 'schedule' && (
                        <div className="pb-8">
                            <ScheduleSelector
                                activeTarget={page.activeTarget}
                                onChangeTarget={page.setActiveTarget}
                                schedules={page.schedules}
                                onAddScheduleRange={actions.addScheduleRange}
                                onDeleteSchedule={page.handleDeleteSchedule}
                                onEditSchedule={page.handleEditSchedule}
                            />
                        </div>
                    )}
                    {mobileTab === 'settings' && (
                        <div className="flex flex-col gap-4 pb-8">
                            <DisplaySettings
                                duration={page.currentDuration}
                                onDurationChange={actions.updateDuration}
                                playVideoAudio={page.playVideoAudio}
                                onToggleVideoAudio={actions.toggleVideoAudio}
                                showAnimations={page.showAnimations}
                                onToggleAnimations={actions.toggleAnimations}
                            />
                            <AudioManager currentAudio={page.activeAudio} onUpdateAudio={page.handleUpdateAudio} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}