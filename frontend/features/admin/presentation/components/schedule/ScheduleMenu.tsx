'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface ScheduleMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

export default function ScheduleMenu({ onEdit, onDelete }: ScheduleMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
                className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
                <MoreVertical className="w-5 h-5" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden w-40">
                    <button
                        onClick={() => { setOpen(false); onEdit(); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Pencil className="w-4 h-4" /> Modifier
                    </button>
                    <button
                        onClick={() => { setOpen(false); onDelete(); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                </div>
            )}
        </div>
    );
}