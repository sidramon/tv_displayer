'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface ScheduleSelectorProps {
    activeTarget: string;
    onChangeTarget: (target: string) => void;
    schedules: string[];
    onAddScheduleRange: (startDate: string, endDate: string) => void;
    onDeleteSchedule: (rangeKey: string) => void;
    onEditSchedule: (oldKey: string, startDate: string, endDate: string) => void;
}

interface ScheduleMenuProps {
    rangeKey: string;
    onEdit: () => void;
    onDelete: () => void;
}

function ScheduleMenu({ rangeKey, onEdit, onDelete }: ScheduleMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

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
                        <Pencil className="w-4 h-4" />
                        {t.schedule.edit}
                    </button>
                    <button
                        onClick={() => { setOpen(false); onDelete(); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t.schedule.delete}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ScheduleSelector({
                                             activeTarget,
                                             onChangeTarget,
                                             schedules,
                                             onAddScheduleRange,
                                             onDeleteSchedule,
                                             onEditSchedule,
                                         }: ScheduleSelectorProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editStart, setEditStart] = useState('');
    const [editEnd, setEditEnd] = useState('');
    const { t, translate } = useTranslation();

    const handleAdd = () => {
        if (startDate && endDate) {
            onAddScheduleRange(startDate, endDate);
            setStartDate('');
            setEndDate('');
        }
    };

    const handleEditOpen = (rangeKey: string) => {
        const [start, end] = rangeKey.split('_');
        setEditingKey(rangeKey);
        setEditStart(start);
        setEditEnd(end);
    };

    const handleEditSave = () => {
        if (editingKey && editStart && editEnd) {
            onEditSchedule(editingKey, editStart, editEnd);
            setEditingKey(null);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">{t.schedule.title}</h2>

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t.schedule.newSchedule}</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                        />
                        <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!startDate || !endDate}
                        className="w-full py-2 bg-slate-800 dark:bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-500 disabled:opacity-50 transition-colors"
                    >
                        {t.schedule.addRange}
                    </button>
                </div>
            </div>

            {/* Modal édition */}
            {editingKey && (
                <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">{t.schedule.editTitle}</h3>
                        <input
                            type="date"
                            value={editStart}
                            onChange={(e) => setEditStart(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                        />
                        <input
                            type="date"
                            value={editEnd}
                            min={editStart}
                            onChange={(e) => setEditEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setEditingKey(null)}
                                className="px-4 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                {t.schedule.cancel}
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={!editStart || !editEnd}
                                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {t.schedule.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-700 pt-6">
                <button
                    onClick={() => onChangeTarget('default')}
                    className={`px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                        activeTarget === 'default'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                    {t.schedule.defaultDisplay}
                </button>

                {schedules.map((rangeKey) => {
                    const targetKey = `schedule-${rangeKey}`;
                    const isActive = activeTarget === targetKey;
                    const [start, end] = rangeKey.split('_');

                    return (
                        <div key={rangeKey} className="flex gap-2">
                            <button
                                onClick={() => onChangeTarget(targetKey)}
                                className={`flex-1 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                            >
                                {translate('schedule.from', { start, end })}
                            </button>
                            <ScheduleMenu
                                rangeKey={rangeKey}
                                onEdit={() => handleEditOpen(rangeKey)}
                                onDelete={() => onDeleteSchedule(rangeKey)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}