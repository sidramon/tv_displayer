// IMPORT SECTION
import React, { useState } from 'react';

// INTERFACES SECTION
interface DisplayTabsProps {
    displays: string[];
    activeDisplay: string;
    onSelectDisplay: (display: string) => void;
    onCreateDisplay: (name: string) => void;
    onDeleteDisplay: (name: string) => void;
}

// COMPONENT SECTION
export default function DisplayTabs({
                                        displays,
                                        activeDisplay,
                                        onSelectDisplay,
                                        onCreateDisplay,
                                        onDeleteDisplay
                                    }: DisplayTabsProps) {
    const [isAddingDisplay, setIsAddingDisplay] = useState<boolean>(false);
    const [newDisplayName, setNewDisplayName] = useState<string>('');

    const sortedDisplays = [
        'default',
        ...displays.filter(d => d !== 'default').sort()
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanName = newDisplayName.trim().toLowerCase();
        if (cleanName && !displays.includes(cleanName)) {
            onCreateDisplay(cleanName);
            setIsAddingDisplay(false);
            setNewDisplayName('');
        }
    };

    return (
        <div className="flex border-b border-slate-200 overflow-x-auto custom-scrollbar pt-2">
            {sortedDisplays.map(display => (
                <div
                    key={display}
                    className={`flex items-center border-b-2 transition-colors ${
                        activeDisplay === display
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <button
                        onClick={() => onSelectDisplay(display)}
                        className="px-6 py-3 font-semibold whitespace-nowrap"
                    >
                        {display === 'default' ? 'Global (Défaut)' : display}
                    </button>
                    {display !== 'default' && activeDisplay === display && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDeleteDisplay(display); }}
                            className="pr-4 text-slate-400 hover:text-red-600 transition-colors"
                            title="Supprimer cet écran"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}

            {isAddingDisplay ? (
                <form onSubmit={handleSubmit} className="flex items-center px-4 pb-2 border-b-2 border-transparent">
                    <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '').substring(0, 16))}
                        placeholder="Nom (max 16)"
                        maxLength={16}
                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-md outline-none focus:border-blue-500 w-36 shadow-sm"
                        autoFocus
                    />
                    <button type="submit" className="ml-2 text-green-600 font-bold p-1 hover:bg-green-50 rounded transition-colors">✓</button>
                    <button type="button" onClick={() => {setIsAddingDisplay(false); setNewDisplayName('');}} className="ml-1 text-red-500 font-bold p-1 hover:bg-red-50 rounded transition-colors">✕</button>
                </form>
            ) : (
                <button
                    onClick={() => setIsAddingDisplay(true)}
                    className="px-5 py-3 font-bold text-slate-400 hover:text-blue-600 border-b-2 border-transparent transition-colors"
                    title="Ajouter un écran"
                >
                    +
                </button>
            )}
        </div>
    );
}