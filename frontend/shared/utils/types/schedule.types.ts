import { MediaItem } from '@/shared/utils/types/config.types';

export type CycleUnit = 'days' | 'weeks' | 'months';

export interface ScheduleSlot {
    name: string;
    items: MediaItem[];
    audio: string;
}

export interface ScheduleDefinition {
    name: string;
    startDate: string;
    // Mode simple
    endDate?: string;
    items?: MediaItem[];
    audio?: string;
    // Mode périodes
    cycleLength?: number;
    cycleUnit?: CycleUnit;
    slots?: ScheduleSlot[];
}

export const CYCLE_UNIT_OPTIONS: { value: CycleUnit; label: string }[] = [
    { value: 'days',   label: 'jour(s)' },
    { value: 'weeks',  label: 'semaine(s)' },
    { value: 'months', label: 'mois' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function isSimpleSchedule(def: ScheduleDefinition): boolean {
    return !def.slots?.length;
}

export function isScheduleActive(def: ScheduleDefinition, localTarget: Date): boolean {
    const start = new Date(def.startDate + 'T00:00:00').getTime();
    if (localTarget.getTime() < start) return false;

    // Range fixe sans récurrence
    if (def.endDate && !def.cycleLength) {
        const end = new Date(def.endDate + 'T23:59:59').getTime();
        return localTarget.getTime() <= end;
    }

    return true;
}

export function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export function getActiveSlotIndex(def: ScheduleDefinition): number {
    if (!def?.slots?.length || def.slots.length <= 1) return 0;
    if (!def.cycleLength || !def.cycleUnit) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(def.startDate + 'T00:00:00');
    if (today < start) return 0;

    if (def.cycleUnit === 'months') {
        let periods = 0;
        const cursor = new Date(start);
        while (true) {
            cursor.setMonth(cursor.getMonth() + def.cycleLength);
            if (cursor > today) break;
            periods++;
        }
        return periods % def.slots.length;
    }

    const msPerDay = 86_400_000;
    const msPerPeriod = def.cycleUnit === 'weeks'
        ? def.cycleLength * 7 * msPerDay
        : def.cycleLength * msPerDay;

    const elapsed = today.getTime() - start.getTime();
    return Math.floor(elapsed / msPerPeriod) % def.slots.length;
}

export function fmtDate(d: Date): string {
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getSlotDateRange(def: ScheduleDefinition, slotIndex: number): { start: Date; end: Date } {
    const fallback = { start: new Date(), end: new Date() };
    if (!def?.startDate || !def.cycleLength || !def.cycleUnit || !def.slots?.length) return fallback;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const origin = new Date(def.startDate + 'T00:00:00');
    let currentCycle = 0;

    if (def.cycleUnit === 'months') {
        const cursor = new Date(origin);
        while (true) {
            const cycleEnd = new Date(cursor);
            cycleEnd.setMonth(cycleEnd.getMonth() + def.cycleLength * def.slots.length);
            if (cycleEnd > today) break;
            cursor.setMonth(cursor.getMonth() + def.cycleLength * def.slots.length);
            currentCycle++;
        }

        const slotStart = new Date(origin);
        slotStart.setMonth(
            slotStart.getMonth() +
            (currentCycle * def.slots.length + slotIndex) * def.cycleLength
        );
        const slotEnd = new Date(slotStart);
        slotEnd.setMonth(slotEnd.getMonth() + def.cycleLength);
        slotEnd.setDate(slotEnd.getDate() - 1);
        return { start: slotStart, end: slotEnd };
    }

    const msPerDay    = 86_400_000;
    const msPerPeriod = def.cycleUnit === 'weeks'
        ? def.cycleLength * 7 * msPerDay
        : def.cycleLength * msPerDay;
    const msPerCycle  = msPerPeriod * def.slots.length;

    const elapsed = Math.max(0, today.getTime() - origin.getTime());
    currentCycle  = Math.floor(elapsed / msPerCycle);

    const slotStart = new Date(origin.getTime() + (currentCycle * def.slots.length + slotIndex) * msPerPeriod);
    const slotEnd   = new Date(slotStart.getTime() + msPerPeriod - msPerDay);
    return { start: slotStart, end: slotEnd };
}