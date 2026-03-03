import { useState, useCallback } from 'react';
import { fetchWeather } from '../domain/weather.service';
import { ForecastData, CurrentWeather } from '@/shared/utils/types/config.types';
import { useInterval } from '@/shared/hooks/useInterval';

const FIFTEEN_MINUTES = 900_000;

export function useWeather() {
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    const [forecast, setForecast] = useState<ForecastData[]>([]);

    const load = useCallback(async () => {
        try {
            const { current, forecast } = await fetchWeather();
            setCurrent(current);
            setForecast(forecast);
        } catch (error) {
            console.error("Erreur météo:", error);
        }
    }, []);

    useInterval(load, FIFTEEN_MINUTES);

    return { current, forecast };
}