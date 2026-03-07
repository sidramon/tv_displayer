import { useState, useCallback } from 'react';
import { getConfig } from '@/shared/api';
import { GlobalSettings } from '@/shared/utils/types/config.types';
import { useInterval } from '@/shared/hooks/useInterval';

export function useGlobalSettings() {
    const [settings, setSettings] = useState<GlobalSettings | null>(null);

    const load = useCallback(async () => {
        const data = await getConfig();
        if (data?.config?.settings) setSettings(data.config.settings);
    }, []);

    useInterval(load, 30000);

    return settings;
}