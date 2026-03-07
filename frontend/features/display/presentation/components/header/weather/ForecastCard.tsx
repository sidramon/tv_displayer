import WeatherIcon from './WeatherIcon';
import { ForecastData } from '@/shared/utils/types/weather.types';
import { HEADER_THEMES, HeaderThemeKey } from '@/shared/config/headerThemes';

interface Props extends ForecastData {
    themeKey: HeaderThemeKey;
}

export default function ForecastCard({ day, tempMax, tempMin, desc, code, themeKey }: Props) {
    const theme = HEADER_THEMES[themeKey];

    return (
        <div className="flex flex-col items-center justify-center h-full gap-1">
            <span className={`text-sm ${theme.mutedText2} font-bold uppercase tracking-wide shrink-0`}>{day}</span>
            <div className="flex items-center justify-center w-7 h-7 shrink-0">
                <WeatherIcon code={code} isDay={true} sizeClasses="w-full h-full" />
            </div>
            <div className="flex gap-2 text-sm font-semibold shrink-0">
                <span className={theme.maxMinValue}>{tempMax}°</span>
                <span className={theme.mutedText2}>{tempMin}°</span>
            </div>
        </div>
    );
}