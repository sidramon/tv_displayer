import WeatherIcon from './WeatherIcon';
import ForecastCard from './ForecastCard';
import { useWeather } from '@/features/display/application/useWeather';
import { HEADER_THEMES, HeaderThemeKey } from '@/shared/config/headerThemes';

interface Props {
    themeKey: HeaderThemeKey;
}

export default function WeatherWidget({ themeKey }: Props) {
    const { current, forecast } = useWeather();
    const theme = HEADER_THEMES[themeKey];

    if (!current) return null;

    return (
        <div className="flex items-center justify-end w-auto min-w-[350px]">
            {forecast.length > 0 && (
                <div className={`flex gap-5 border-r ${theme.borderColor} pr-6 mr-6`}>
                    {forecast.map((f, i) => (
                        <ForecastCard key={i} {...f} themeKey={themeKey} />
                    ))}
                </div>
            )}
            <div className="flex items-center gap-5">
                <WeatherIcon code={current.code} isDay={current.isDay} sizeClasses="w-16 h-16 drop-shadow-lg" />
                <div className="flex flex-col text-right">
                    <span className="text-5xl font-bold leading-none">{current.temp}°</span>
                    <span className={`text-lg ${theme.mutedText} mt-1 font-medium`}>{current.desc}</span>
                    <span className={`text-sm ${theme.mutedText2} font-semibold mt-0.5 tracking-wide`}>
                        MAX: <span className={theme.maxMinValue}>{current.max}°</span>
                        <span className="mx-1">|</span>
                        MIN: <span className={theme.maxMinValue}>{current.min}°</span>
                    </span>
                </div>
            </div>
        </div>
    );
}