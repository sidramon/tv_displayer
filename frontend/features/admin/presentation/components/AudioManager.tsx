// IMPORT SECTION
'use client';

import React, { useState } from 'react';
import { uploadFile } from '@/shared/utils/api';

// INTERFACES SECTION
interface AudioManagerProps {
    currentAudio: string;
    onUpdateAudio: (url: string) => void;
}

// COMPONENT SECTION
export default function AudioManager({ currentAudio, onUpdateAudio }: AudioManagerProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type.startsWith('audio/')) {
                setIsUploading(true);
                const url = await uploadFile(file);
                if (url) {
                    onUpdateAudio(url);
                }
                setIsUploading(false);
            }
        }
        e.target.value = '';
    };

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
                <div className="flex flex-col items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <svg className="w-6 h-6 mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <span className="text-sm text-slate-600">
                                {isUploading ? 'Chargement...' : 'Ajouter une musique (MP3)'}
                            </span>
                        </div>
                        <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} disabled={isUploading} />
                    </label>
                </div>
            )}
        </div>
    );
}