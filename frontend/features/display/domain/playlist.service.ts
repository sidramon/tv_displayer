// IMPORT SECTION
import { DisplayConfig, Playlist } from '@/shared/utils/types/config.types';

// SERVICE SECTION
export function getActivePlaylist(config: DisplayConfig, targetDate: Date = new Date()): Playlist {
    const offset = targetDate.getTimezoneOffset() * 60000;
    const localTarget = new Date(targetDate.getTime() - offset);
    const targetTime = localTarget.getTime();

    if (config.schedules) {
        for (const [rangeKey, playlist] of Object.entries(config.schedules)) {
            if (playlist.items.length === 0) continue;

            const [startStr, endStr] = rangeKey.split('_');
            const start = new Date(`${startStr}T00:00:00`).getTime();
            const end = new Date(`${endStr}T23:59:59`).getTime();

            if (targetTime >= start && targetTime <= end) {
                return playlist;
            }
        }
    }

    if (config.settings.rotationReferenceDate) {
        const refDate = new Date(config.settings.rotationReferenceDate);
        const diffTime = Math.abs(targetDate.getTime() - refDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(diffDays / 7);

        const rotationLength = config.settings.rotationLength || 1;
        const rotationIndex = (currentWeek % rotationLength) + 1;
        const rotationKey = rotationIndex.toString();

        if (config.rotations && config.rotations[rotationKey] && config.rotations[rotationKey].items.length > 0) {
            return config.rotations[rotationKey];
        }
    }

    return config.default;
}