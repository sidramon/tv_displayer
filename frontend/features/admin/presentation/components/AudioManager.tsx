'use client';

import { useAudioUpload } from '../../application/audio/useAudioUpload';

interface AudioManagerProps {
    currentAudio: string;
    onUpdateAudio: (url: string) => void;
}

export default function AudioManager({ currentAudio, onUpdateAudio }: AudioManagerProps) {
    const { isUploading, handleFileChange } = useAudioUpload(onUpdateAudio);

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <h2 className="text-xl font-semibold mb-6">Musique de fond</h2>

            {currentAudio ? (
                <div className="flex flex-col gap-4">
                    <audio controls src={currentAudio} className="w-full" />
                    <button
                        onClick={() => onUpdateAudio('')}
                        className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium transition-colors"
                    >
                        Supprimer la musique
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <svg className="w-6 h-6 mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span className="text-sm text-slate-600">
                        {isUploading ? 'Chargement...' : 'Ajouter une musique (MP3)'}
                    </span>
                    <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} disabled={isUploading} />
                </label>
            )}
        </div>
    );
}