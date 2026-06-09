import React, { useState } from 'react';
import { MediaItem } from '@/shared/utils/types/config.types';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface PlaylistEditorProps {
    title: string;
    items: MediaItem[];
    onDeleteMedia: (index: number) => void;
    onUpdateDuration?: (index: number, duration: number | undefined) => void;
}

function DurationBadge({ item, index, defaultDuration, onUpdateDuration }: {
    item: MediaItem;
    index: number;
    defaultDuration?: number;
    onUpdateDuration: (index: number, duration: number | undefined) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState('');
    const { t } = useTranslation();

    const currentSeconds = item.duration != null ? item.duration / 1000 : undefined;
    const displayValue = currentSeconds != null ? `${currentSeconds}s` : t.playlist.defaultDuration;

    const handleOpen = () => {
        setValue(currentSeconds != null ? String(currentSeconds) : '');
        setEditing(true);
    };

    const handleConfirm = () => {
        const num = parseFloat(value);
        if (value === '' || isNaN(num)) {
            onUpdateDuration(index, undefined);
        } else if (num >= 1) {
            onUpdateDuration(index, Math.round(num * 1000));
        }
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') setEditing(false);
    };

    if (editing) {
        return (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                    autoFocus
                    type="number"
                    min="1"
                    step="0.5"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleConfirm}
                    placeholder={defaultDuration != null ? String(defaultDuration / 1000) : ''}
                    className="w-16 px-1.5 py-0.5 text-xs rounded bg-white dark:bg-slate-900 border border-blue-400 text-slate-900 dark:text-white outline-none"
                />
                <span className="text-xs text-white/80">s</span>
            </div>
        );
    }

    return (
        <button
            onClick={(e) => { e.stopPropagation(); handleOpen(); }}
            title={t.playlist.editDuration}
            className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                item.duration != null
                    ? 'bg-blue-500/80 text-white hover:bg-blue-400/90'
                    : 'bg-white/20 text-white hover:bg-white/30'
            }`}
        >
            {displayValue}
        </button>
    );
}

export default function PlaylistEditor({ title, items, onDeleteMedia, onUpdateDuration }: PlaylistEditorProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 shrink-0">
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {items.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 italic">{t.playlist.empty}</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-video border border-slate-200 dark:border-slate-600">
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
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 flex items-center justify-between">
                                    <span className="text-xs uppercase font-bold tracking-wider text-white">{item.type}</span>
                                    {item.type === 'image' && onUpdateDuration && (
                                        <DurationBadge
                                            item={item}
                                            index={index}
                                            onUpdateDuration={onUpdateDuration}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}