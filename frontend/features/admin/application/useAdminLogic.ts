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
        const result = await saveConfig(newConfig);

        if (result.status === 'success') {
            setConfig({ ...newConfig, version: result.version });

        } else if (result.status === 'conflict') {
            setConfig(result.current);
            // TODO: afficher une bannière/toast de conflit dans l'UI
            console.warn('Conflit de version — config locale mise à jour avec la version serveur.');
            alert(`Conflit détecté : ${result.message}\nLa configuration a été rechargée.`);

        } else {
            console.error('Échec de la sauvegarde.');
        }
    }, []);

    const params = { config, displayName, handleSave };

    const { onAddSchedule, onDeleteSchedule, onEditSchedule } = useScheduleActions(params);

    return {
        config,
        isLoading,
        handleSave,
        onAddSchedule,
        onDeleteSchedule,
        onEditSchedule,
        ...useMediaActions(params),
        ...useAudioActions(params),
        ...useDisplayActions(params),
    };
}