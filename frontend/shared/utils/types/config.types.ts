// CONFIGURATION TYPES SECTION

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
}

export interface DisplayConfig {
    settings: DisplaySettings;
    default: Playlist;
    schedules: Record<string, Playlist>;
    rotations: Record<string, Playlist>;
}

export interface GlobalSettings {
    companyName: string;
    logoUrl: string;
    theme: 'dark' | 'light';
    weatherLatitude: number;
    weatherLongitude: number;
    locale: 'fr' | 'en';
}

export interface GlobalConfig {
    settings: GlobalSettings;
    displays: Record<string, DisplayConfig>;
}

export interface ConfigResponse {
    config: GlobalConfig;
}