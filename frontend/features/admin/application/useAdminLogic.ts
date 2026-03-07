import { useState, useEffect, useCallback } from 'react';
import { getConfig, saveConfig } from '@/shared/api';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { useMediaActions } from './media/useMediaActions';
import { useAudioActions } from './audio/useAudioActions';
import { useScheduleActions } from './useScheduleActions';
import { useDisplayActions } from './display/useDisplayActions';

export function useAdminLogic(displayName: string = 'default') {
    const [config, setConfig] = useState<GlobalConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await getConfig();
            if (data?.config) setConfig(data.config);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const handleSave = useCallback(async (newConfig: GlobalConfig) => {
        setConfig(newConfig);
        await saveConfig(newConfig);
    }, []);

    const params = { config, displayName, handleSave };

    return {
        config,
        isLoading,
        handleSave,
        ...useMediaActions(params),
        ...useAudioActions(params),
        ...useScheduleActions(params),
        ...useDisplayActions(params),
    };
}