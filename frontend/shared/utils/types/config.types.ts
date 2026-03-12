// CONFIGURATION TYPES SECTION
import { ScheduleDefinition } from "@/shared/utils/types";

export interface MediaItem {
    id: string;
    type: 'image' | 'video';
    url: string;
    duration?: number;
}

export interface Playlist {
    items: MediaItem[];
    audio: string;
}

export interface DisplaySettings {
    slideDuration: number;
    rotationLength: number;
    rotationReferenceDate: string;
    playVideoAudio?: boolean;
    showAnimations: boolean;
}

export interface DisplayConfig {
    settings: DisplaySettings;
    default: Playlist & { mergeWithSchedules?: boolean };
    schedules: Record<string, ScheduleDefinition>;
    rotations: Record<string, Playlist>;
}

export interface GlobalSettings {
    companyName: string;
    logoUrl: string;
    theme: 'dark' | 'light';
    weatherLatitude: number;
    weatherLongitude: number;
    locale: 'fr' | 'en';
    headerThemeKey: string;
    displayAnimationKey: string;
}

export interface GlobalConfig {
    settings: GlobalSettings;
    displays: Record<string, DisplayConfig>;
    version?: number;
}

export interface ConfigResponse {
    config: GlobalConfig;
}