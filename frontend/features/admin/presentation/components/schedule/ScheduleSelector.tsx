'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScheduleDefinition, getActiveSlotIndex, getSlotDateRange, fmtDate, isSimpleSchedule, isScheduleActive } from '@/shared/utils/types';
import ScheduleForm from './ScheduleForm';
import ScheduleMenu from './ScheduleMenu';

interface ScheduleSelectorProps {
    activeTarget: string;
    onChangeTarget: (target: string) => void;
    schedules: Record<string, ScheduleDefinition>;
    onAddSchedule: (id: string, def: ScheduleDefinition) => void;
    onDeleteSchedule: (id: string) => void;
    onEditSchedule: (id: string, def: ScheduleDefinition) => void;
}

export default function ScheduleSelector({
                                             activeTarget,
                                             onChangeTarget,
                                             schedules,
                                             onAddSchedule,
                                             onDeleteSchedule,
                                             onEditSchedule,
                                         }: ScheduleSelectorProps) {
    const [showForm, setShowForm]   = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expanded, setExpanded]   = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!activeTarget.startsWith('schedule-')) return;
        const id = activeTarget.replace('schedule-', '').split('-slot-')[0];
        setExpanded(prev => ({ ...prev, [id]: true }));
    }, [activeTarget]);

    const handleAdd = (def: ScheduleDefinition) => {
        onAddSchedule(Date.now().toString(), def);
        setShowForm(false);
    };

    const now = new Date();

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Programmation</h2>

            <button
                onClick={() => setShowForm(o => !o)}
                className="flex items-center justify-between w-full px-4 py-2.5 mb-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
                Nouvelle programmation
                {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showForm && (
                <div className="mb-6">
                    <ScheduleForm
                        onSave={handleAdd}
                        onCancel={() => setShowForm(false)}
                        saveLabel="Ajouter"
                    />
                </div>
            )}

            {editingId && schedules[editingId] && (
                <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold">Modifier la programmation</h3>
                        <ScheduleForm
                            initial={schedules[editingId]}
                            onSave={(def) => { onEditSchedule(editingId, def); setEditingId(null); }}
                            onCancel={() => setEditingId(null)}
                            saveLabel="Enregistrer"
                        />
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
                    Affichage par défaut
                </button>

                {Object.entries(schedules).map(([id, def]) => {
                    if (!def?.startDate) return null;
                    const simple = isSimpleSchedule(def);

                    if (simple) {
                        // ── Mode simple ──────────────────────────────────────
                        const targetKey = `schedule-${id}`;
                        const isActive  = activeTarget === targetKey;
                        const active    = isScheduleActive(def, now);
                        const start     = new Date(def.startDate + 'T00:00:00');
                        const end       = def.endDate ? new Date(def.endDate + 'T00:00:00') : null;

                        return (
                            <div key={id} className="flex gap-2">
                                <button
                                    onClick={() => onChangeTarget(targetKey)}
                                    className={`flex-1 px-4 py-3 rounded-xl text-left transition-colors ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{def.name}</span>
                                        {active && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-blue-500 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                                                en cours
                                            </span>
                                        )}
                                    </div>
                                    <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {fmtDate(start)}{end ? ` → ${fmtDate(end)}` : ' · permanent'}
                                    </div>
                                </button>
                                <ScheduleMenu
                                    onEdit={() => setEditingId(id)}
                                    onDelete={() => onDeleteSchedule(id)}
                                />
                            </div>
                        );
                    }

                    // ── Mode périodes ────────────────────────────────────────
                    if (!def.slots?.length) return null;
                    const isOpen         = expanded[id] ?? false;
                    const activeSlotIdx  = getActiveSlotIndex(def);
                    const isThisSchedule = activeTarget.startsWith(`schedule-${id}-slot-`);

                    return (
                        <div key={id} className="flex flex-col gap-1">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))}
                                    className={`flex-1 px-4 py-3 rounded-xl text-left transition-colors ${
                                        isThisSchedule
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`font-medium text-sm ${isThisSchedule ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {def.name}
                                        </span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isThisSchedule ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'}`}>
                                                {def.slots.length} période{def.slots.length > 1 ? 's' : ''}
                                            </span>
                                            {isOpen
                                                ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                                                : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                            }
                                        </div>
                                    </div>
                                    <div className={`text-xs mt-0.5 ${isThisSchedule ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        Maintenant : {def.slots[activeSlotIdx]?.name ?? `Période ${activeSlotIdx + 1}`}
                                    </div>
                                </button>
                                <ScheduleMenu
                                    onEdit={() => setEditingId(id)}
                                    onDelete={() => onDeleteSchedule(id)}
                                />
                            </div>

                            {isOpen && (
                                <div className="flex flex-col gap-1 pl-4">
                                    {def.slots.map((slot, slotIndex) => {
                                        const targetKey = `schedule-${id}-slot-${slotIndex}`;
                                        const isActive  = activeTarget === targetKey;
                                        const isCurrent = slotIndex === activeSlotIdx;
                                        const { start, end } = getSlotDateRange(def, slotIndex);

                                        return (
                                            <button
                                                key={slotIndex}
                                                onClick={() => onChangeTarget(targetKey)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${
                                                    isCurrent
                                                        ? isActive ? 'bg-white' : 'bg-blue-500'
                                                        : isActive ? 'bg-blue-300' : 'bg-slate-300 dark:bg-slate-500'
                                                }`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {slot.name}
                                                        {isCurrent && (
                                                            <span className={`ml-2 text-xs font-normal ${isActive ? 'text-blue-200' : 'text-blue-500 dark:text-blue-400'}`}>
                                                                · en cours
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                                        {fmtDate(start)} → {fmtDate(end)}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}