import React from 'react';
import { MediaItem } from '@/shared/utils/types/config.types';

// INTERFACES SECTION
interface PlaylistEditorProps {
    title: string;
    items: MediaItem[];
    onDeleteMedia: (index: number) => void;
}

// COMPONENT SECTION
export default function PlaylistEditor({ title, items, onDeleteMedia }: PlaylistEditorProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 shrink-0">
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {items.length === 0 ? (
                    <p className="text-slate-500 italic">Aucun média dans la playlist.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-slate-100 aspect-video border border-slate-200">
                                {item.type === 'image' ? (
                                    <img src={item.url} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <video src={item.url} className="w-full h-full object-cover" />
                                )}
                                <button
                                    onClick={() => onDeleteMedia(index)}
                                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-600 shadow-md"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3">
                                    <span className="text-xs uppercase font-bold tracking-wider text-white">{item.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}