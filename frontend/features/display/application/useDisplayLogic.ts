// IMPORT SECTION
import { useState, useEffect, useCallback } from 'react';
import { getConfig } from '@/shared/utils/api';
import { Playlist } from '@/shared/utils/types';
import { getActivePlaylist } from '../domain/playlist.service';

// HOOK SECTION
export function useDisplayLogic(displayName: string = 'default') {
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [duration, setDuration] = useState<number>(8000);
    const [playVideoAudio, setPlayVideoAudio] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await getConfig();
            if (data?.config?.displays?.[displayName]) {
                const displayConfig = data.config.displays[displayName];
                setPlaylist(getActivePlaylist(displayConfig));
                setDuration(displayConfig.settings?.slideDuration || 8000);
                setPlayVideoAudio(displayConfig.settings?.playVideoAudio || false);
            }
        };

        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [displayName]);

    const startDisplay = useCallback(() => {
        setIsStarted(true);
    }, []);

    return {
        playlist,
        duration,
        playVideoAudio,
        isStarted,
        startDisplay
    };
}