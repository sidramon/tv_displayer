'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface ScheduleSelectorProps {
    activeTarget: string;
    onChangeTarget: (target: string) => void;
    schedules: string[];
    onAddScheduleRange: (startDate: string, endDate: string) => void;
    onDeleteSchedule: (rangeKey: string) => void;
}

export default function ScheduleSelector({
                                             activeTarget,
                                             onChangeTarget,
                                             schedules,
                                             onAddScheduleRange,
                                             onDeleteSchedule
                                         }: ScheduleSelectorProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { t, translate } = useTranslation();

    const handleAdd = () => {
        if (startDate && endDate) {
            onAddScheduleRange(startDate, endDate);
            setStartDate('');
            setEndDate('');
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
                            <button
                                onClick={() => onDeleteSchedule(rangeKey)}
                                className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}