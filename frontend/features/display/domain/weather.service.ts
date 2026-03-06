import { ForecastData, CurrentWeather, WeatherCode } from '@/shared/utils/types/weather.types';
import { locales, Locale } from '@/shared/i18n';

function buildWeatherUrl(latitude: number, longitude: number): string {
    const tz = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=${tz}`;
}

export function parseWeatherCode(code: number, locale: Locale = 'fr'): { desc: string; code: WeatherCode } {
    const t = locales[locale].weather;
    if (code === 0) return { desc: t.clear, code: 'clear' };
    if (code >= 1 && code <= 3) return { desc: t.cloudy, code: 'cloudy' };
    if (code >= 45 && code <= 48) return { desc: t.fog, code: 'fog' };
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { desc: t.rain, code: 'rain' };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { desc: t.snow, code: 'snow' };
    if (code >= 95) return { desc: t.storm, code: 'storm' };
    return { desc: t.unknown, code: 'unknown' };
}

export async function fetchWeather(
    latitude: number,
    longitude: number,
    locale: Locale = 'fr'
): Promise<{ current: CurrentWeather; forecast: ForecastData[] }> {
    const response = await fetch(buildWeatherUrl(latitude, longitude));
    const data = await response.json();

    const currentParsed = parseWeatherCode(data.current_weather.weathercode, locale);
    const current: CurrentWeather = {
        temp: `${Math.round(data.current_weather.temperature)}`,
        min: `${Math.round(data.daily.temperature_2m_min[0])}`,
        max: `${Math.round(data.daily.temperature_2m_max[0])}`,
        desc: currentParsed.desc,
        code: currentParsed.code,
        isDay: data.current_weather.is_day === 1,
    };

    const forecast: ForecastData[] = [1, 2].map((i) => {
        const date = new Date(data.daily.time[i]);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const dayName = localDate.toLocaleDateString(`${locale}-CA`, { weekday: 'short' }).replace('.', '');
        const parsed = parseWeatherCode(data.daily.weathercode[i], locale);

        return {
            day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            desc: parsed.desc,
            code: parsed.code,
        };
    });

    return { current, forecast };
}