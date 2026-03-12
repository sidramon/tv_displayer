'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ScheduleDefinition, CycleUnit, addDays, isSimpleSchedule } from '@/shared/utils/types';
import { useTranslation } from '@/shared/i18n/useTranslation';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );
}

interface ScheduleFormProps {
    initial?: ScheduleDefinition;
    onSave: (def: ScheduleDefinition) => void;
    onCancel?: () => void;
    saveLabel?: string;
}

export default function ScheduleForm({ initial, onSave, onCancel, saveLabel }: ScheduleFormProps) {
    const { t, translate } = useTranslation();

    const defaultSlotName = (i: number) => translate('schedule.defaultPeriodName', { n: String(i + 1) });

    const [name, setName]               = useState(initial?.name ?? '');
    const [startDate, setStartDate]     = useState(initial?.startDate ?? '');
    const [useSlots, setUseSlots]       = useState(initial ? !isSimpleSchedule(initial) : false);
    const [endDate, setEndDate]         = useState(initial?.endDate ?? '');
    const [cycleLength, setCycleLength] = useState(initial?.cycleLength ?? 1);
    const [cycleUnit, setCycleUnit]     = useState<CycleUnit>(initial?.cycleUnit ?? 'weeks');
    const [slotNames, setSlotNames]     = useState<string[]>(
        initial?.slots?.map(s => s.name) ?? [defaultSlotName(0)]
    );

    const cycleUnitOptions = [
        { value: 'days'   as CycleUnit, label: t.cycleUnits.days },
        { value: 'weeks'  as CycleUnit, label: t.cycleUnits.weeks },
        { value: 'months' as CycleUnit, label: t.cycleUnits.months },
    ];

    const canSave = name.trim() && startDate && (
        useSlots ? cycleLength >= 1 && slotNames.length >= 1 : true
    );

    const updateSlotName = (i: number, value: string) =>
        setSlotNames(prev => prev.map((s, idx) => idx === i ? value : s));

    const addSlot = () =>
        setSlotNames(prev => [...prev, defaultSlotName(prev.length)]);

    const removeSlot = (i: number) => {
        if (slotNames.length <= 1) return;
        setSlotNames(prev => prev.filter((_, idx) => idx !== i));
    };

    const handleSave = () => {
        if (!canSave) return;

        const def: ScheduleDefinition = useSlots
            ? {
                name: name.trim(),
                startDate,
                cycleLength,
                cycleUnit,
                slots: slotNames.map((slotName, i) => ({
                    name: slotName.trim() || defaultSlotName(i),
                    items: initial?.slots?.[i]?.items ?? [],
                    audio: initial?.slots?.[i]?.audio ?? '',
                })),
            }
            : {
                name: name.trim(),
                startDate,
                endDate: endDate || undefined,
                items: initial?.items ?? [],
                audio: initial?.audio ?? '',
            };

        onSave(def);

        if (!initial) {
            setName('');
            setStartDate('');
            setEndDate('');
            setCycleLength(1);
            setCycleUnit('weeks');
            setSlotNames([defaultSlotName(0)]);
        }
    };

    const cycleEndPreview = (() => {
        if (!startDate || !useSlots) return null;
        const start = new Date(startDate + 'T00:00:00');
        if (cycleUnit === 'months') {
            const end = new Date(start);
            end.setMonth(end.getMonth() + cycleLength * slotNames.length);
            end.setDate(end.getDate() - 1);
            return end;
        }
        const days = cycleUnit === 'weeks'
            ? cycleLength * 7 * slotNames.length
            : cycleLength * slotNames.length;
        return addDays(start, days - 1);
    })();

    return (
        <div className="flex flex-col gap-3">

            {/* Nom */}
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.schedule.namePlaceholder}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
            />

            {/* Date de début */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t.schedule.startDate}
                </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                />
            </div>

            {/* Toggle mode */}
            <div className="flex items-center justify-between py-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t.schedule.divideIntoPeriods}
                </span>
                <Toggle checked={useSlots} onChange={setUseSlots} />
            </div>

            {/* Mode simple */}
            {!useSlots && (
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t.schedule.endDate}{' '}
                        <span className="font-normal text-slate-400">{t.schedule.endDateOptional}</span>
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                    />
                    {!endDate && (
                        <p className="text-xs text-slate-400">{t.schedule.endDatePermanent}</p>
                    )}
                </div>
            )}

            {/* Mode périodes */}
            {useSlots && (
                <>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {t.schedule.periodDuration}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min={1}
                                value={cycleLength}
                                onChange={e => setCycleLength(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                            />
                            <select
                                value={cycleUnit}
                                onChange={e => setCycleUnit(e.target.value as CycleUnit)}
                                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                            >
                                {cycleUnitOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        {cycleEndPreview && (
                            <p className="text-xs text-slate-400">
                                {translate('schedule.cyclePreview', {
                                    count: String(slotNames.length),
                                    plural: slotNames.length > 1 ? 's' : '',
                                    date: cycleEndPreview.toLocaleDateString(t.schedule.startDate === 'Start date' ? 'en-CA' : 'fr-FR', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    }),
                                })}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {translate('schedule.periodsLabel', { count: String(slotNames.length) })}
                            </label>
                            <button
                                onClick={addSlot}
                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <Plus className="w-3 h-3" /> {t.schedule.addPeriod}
                            </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {slotNames.map((slotName, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 w-4 text-right shrink-0">{i + 1}</span>
                                    <input
                                        type="text"
                                        value={slotName}
                                        onChange={e => updateSlotName(i, e.target.value)}
                                        placeholder={defaultSlotName(i)}
                                        className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={() => removeSlot(i)}
                                        disabled={slotNames.length <= 1}
                                        className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        {t.schedule.cancel}
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className="flex-1 py-2 bg-slate-800 dark:bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-500 disabled:opacity-50 transition-colors"
                >
                    {saveLabel ?? t.schedule.save}
                </button>
            </div>
        </div>
    );
}