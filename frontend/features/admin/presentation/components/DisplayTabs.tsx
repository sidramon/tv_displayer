import React, { useState } from 'react';
import { useNewDisplay } from '../../application/display/useNewDisplay';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface DisplayTabsProps {
    displays: string[];
    activeDisplay: string;
    onSelectDisplay: (display: string) => void;
    onCreateDisplay: (name: string) => void;
    onDeleteDisplay: (name: string) => void;
    onRenameDisplay: (oldName: string, newName: string) => void;
}

export default function DisplayTabs({ displays, activeDisplay, onSelectDisplay, onCreateDisplay, onDeleteDisplay, onRenameDisplay }: DisplayTabsProps) {
    const { isAdding, name, setIsAdding, handleNameChange, handleSubmit, cancel } = useNewDisplay(displays, onCreateDisplay);
    const [editingDisplay, setEditingDisplay] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const { t } = useTranslation();

    const sortedDisplays = ['default', ...displays.filter(d => d !== 'default').sort()];

    const handleEditStart = (display: string) => {
        setEditingDisplay(display);
        setEditName(display);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = editName.toLowerCase().replace(/[^a-z0-9_-]/g, '').substring(0, 16).trim();
        if (clean && clean !== editingDisplay && !displays.includes(clean)) {
            onRenameDisplay(editingDisplay!, clean);
        }
        setEditingDisplay(null);
    };

    const handleEditCancel = () => setEditingDisplay(null);

    return (
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar pt-2">
            {sortedDisplays.map(display => (
                <div
                    key={display}
                    className={`flex items-center border-b-2 transition-colors ${
                        activeDisplay === display
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
                    }`}
                >
                    {editingDisplay === display ? (
                        <form onSubmit={handleEditSubmit} className="flex items-center px-2 py-2">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '').substring(0, 16))}
                                className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md outline-none focus:border-blue-500 w-32 shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                autoFocus
                            />
                            <button type="submit" className="ml-2 text-green-600 font-bold p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors">✓</button>
                            <button type="button" onClick={handleEditCancel} className="ml-1 text-red-500 font-bold p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">✕</button>
                        </form>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setEditingDisplay(null);
                                    if (display !== 'default' && activeDisplay === display) {
                                        handleEditStart(display);
                                    } else {
                                        onSelectDisplay(display);
                                    }
                                }}
                                className="px-6 py-3 font-semibold whitespace-nowrap"
                            >
                                {display === 'default' ? t.schedule.defaultDisplay : display}
                            </button>
                            {display !== 'default' && activeDisplay === display && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteDisplay(display); }}
                                    className="pr-4 text-slate-400 hover:text-red-600 transition-colors"
                                >✕</button>
                            )}
                        </>
                    )}
                </div>
            ))}

            {isAdding ? (
                <form onSubmit={handleSubmit} className="flex items-center px-4 pb-2 border-b-2 border-transparent">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder={t.displays.namePlaceholder}
                        maxLength={16}
                        className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md outline-none focus:border-blue-500 w-36 shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        autoFocus
                    />
                    <button type="submit" className="ml-2 text-green-600 font-bold p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors">✓</button>
                    <button type="button" onClick={cancel} className="ml-1 text-red-500 font-bold p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">✕</button>
                </form>
            ) : (
                <button
                    onClick={() => { setEditingDisplay(null); setIsAdding(true); }}
                    className="px-5 py-3 font-bold text-slate-400 hover:text-blue-600 border-b-2 border-transparent transition-colors"
                >+</button>
            )}
        </div>
    );
}