'use client';

import { useAudioUpload } from '../../application/audio/useAudioUpload';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface AudioManagerProps {
    currentAudio: string;
    onUpdateAudio: (url: string) => void;
}

export default function AudioManager({ currentAudio, onUpdateAudio }: AudioManagerProps) {
    const { isUploading, handleFileChange } = useAudioUpload(onUpdateAudio);
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <h2 className="text-xl font-semibold mb-6">{t.audio.title}</h2>

            {currentAudio ? (
                <div className="flex flex-col gap-4">
                    <audio controls src={currentAudio} className="w-full" />
                    <button
                        onClick={() => onUpdateAudio('')}
                        className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 font-medium transition-colors"
                    >
                        {t.audio.delete}
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <svg className="w-6 h-6 mb-2 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                        {isUploading ? t.settings.loading : t.audio.add}
                    </span>
                    <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} disabled={isUploading} />
                </label>
            )}
        </div>
    );
}