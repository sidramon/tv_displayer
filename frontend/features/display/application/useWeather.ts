import { useState, useCallback } from 'react';
import { fetchWeather } from '../domain/weather.service';
import { ForecastData, CurrentWeather } from '@/shared/utils/types/weather.types';
import { useInterval } from '@/shared/hooks/useInterval';
import { useGlobalSettings } from './useGlobalSettings';
import { useTranslation } from '@/shared/i18n/useTranslation';

const FIFTEEN_MINUTES = 900_000;

export function useWeather() {
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    const [forecast, setForecast] = useState<ForecastData[]>([]);
    const settings = useGlobalSettings();
    const { locale } = useTranslation();

    const load = useCallback(async () => {
        if (!settings?.weatherLatitude || !settings?.weatherLongitude) return;
        try {
            const { current, forecast } = await fetchWeather(
                settings.weatherLatitude,
                settings.weatherLongitude,
                locale
            );
            setCurrent(current);
            setForecast(forecast);
        } catch (error) {
            console.error("Weather error:", error);
        }
    }, [settings?.weatherLatitude, settings?.weatherLongitude, locale]);

    useInterval(load, FIFTEEN_MINUTES);

    return { current, forecast };
}