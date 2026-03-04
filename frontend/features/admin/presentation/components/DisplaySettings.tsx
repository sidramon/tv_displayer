import React from 'react';

interface DisplaySettingsProps {
    duration: number;
    onDurationChange: (seconds: number) => void;
    playVideoAudio: boolean;
    onToggleVideoAudio: (playAudio: boolean) => void;
}

export default function DisplaySettings({
                                            duration,
                                            onDurationChange,
                                            playVideoAudio,
                                            onToggleVideoAudio
                                        }: DisplaySettingsProps) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Paramètres de la Playlist</h2>

            <div className="flex flex-col gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Durée d'une diapositive (secondes)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={duration}
                        onChange={(e) => onDurationChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Jouer le son des vidéos</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={playVideoAudio}
                            onChange={(e) => onToggleVideoAudio(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}