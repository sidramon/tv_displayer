import { DisplayConfig, Playlist } from '@/shared/utils/types/config.types';
import {ScheduleDefinition, getActiveSlotIndex, isSimpleSchedule, isScheduleActive} from '@/shared/utils/types';

export function getActivePlaylist(config: DisplayConfig, targetDate: Date = new Date()): Playlist {
    const offset = targetDate.getTimezoneOffset() * 60000;
    const localTarget = new Date(targetDate.getTime() - offset);

    const activeSlots: { items: Playlist['items']; audio: string }[] = [];

    if (config.schedules) {
        for (const schedule of Object.values(config.schedules) as ScheduleDefinition[]) {
            if (!schedule?.startDate) continue;
            if (!isScheduleActive(schedule, localTarget)) continue;

            if (isSimpleSchedule(schedule)) {
                if (!schedule.items?.length) continue;
                activeSlots.push({ items: schedule.items, audio: schedule.audio ?? '' });
            } else {
                if (!schedule.slots?.length || !schedule.cycleLength) continue;
                const slotIndex = getActiveSlotIndex(schedule);
                const slot = schedule.slots[slotIndex];
                if (!slot?.items?.length) continue;
                activeSlots.push({ items: slot.items, audio: slot.audio });
            }
        }
    }

    if (activeSlots.length > 0) {
        const mergedItems = activeSlots.flatMap(s => s.items);
        const mergedAudio = activeSlots.find(s => s.audio)?.audio ?? '';


        return {
            items: [...config.default.items, ...mergedItems],
            audio: mergedAudio || config.default.audio,
        };
    }

    if (config.settings.rotationReferenceDate) {
        const refDate = new Date(config.settings.rotationReferenceDate);
        const diffDays = Math.floor(Math.abs(targetDate.getTime() - refDate.getTime()) / 86_400_000);
        const rotationIndex = (Math.floor(diffDays / 7) % (config.settings.rotationLength || 1)) + 1;
        const rotation = config.rotations?.[rotationIndex.toString()];
        if (rotation?.items?.length) return rotation;
    }

    return config.default;
}