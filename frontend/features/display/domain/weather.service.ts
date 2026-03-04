import { ForecastData, CurrentWeather } from '@/shared/utils/types/weather.types';

function buildWeatherUrl(latitude: number, longitude: number): string {
    const tz = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=${tz}`;
}

export function parseWeatherCode(code: number): string {
    if (code === 0) return "Dégagé";
    if (code >= 1 && code <= 3) return "Nuageux";
    if (code >= 45 && code <= 48) return "Brouillard";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Pluie";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Neige";
    if (code >= 95) return "Orage";
    return "Inconnu";
}

export async function fetchWeather(
    latitude: number,
    longitude: number
): Promise<{ current: CurrentWeather; forecast: ForecastData[] }> {
    const response = await fetch(buildWeatherUrl(latitude, longitude));
    const data = await response.json();

    const current: CurrentWeather = {
        temp: `${Math.round(data.current_weather.temperature)}`,
        min: `${Math.round(data.daily.temperature_2m_min[0])}`,
        max: `${Math.round(data.daily.temperature_2m_max[0])}`,
        desc: parseWeatherCode(data.current_weather.weathercode),
        isDay: data.current_weather.is_day === 1,
    };

    const forecast: ForecastData[] = [1, 2].map((i) => {
        const date = new Date(data.daily.time[i]);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const dayName = localDate.toLocaleDateString('fr-CA', { weekday: 'short' }).replace('.', '');

        return {
            day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            desc: parseWeatherCode(data.daily.weathercode[i]),
        };
    });

    return { current, forecast };
}