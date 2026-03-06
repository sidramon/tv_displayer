import WeatherIcon from './WeatherIcon';
import ForecastCard from './ForecastCard';
import { useWeather } from '@/features/display/application/useWeather';

export default function WeatherWidget() {
    const { current, forecast } = useWeather();

    if (!current) return null;

    return (
        <div className="flex items-center justify-end w-auto min-w-[350px]">
            {forecast.length > 0 && (
                <div className="flex gap-5 border-r border-gray-700 pr-6 mr-6">
                    {forecast.map((f, i) => (
                        <ForecastCard key={i} {...f} />
                    ))}
                </div>
            )}
            <div className="flex items-center gap-5">
                <WeatherIcon code={current.code} isDay={current.isDay} sizeClasses="w-16 h-16 drop-shadow-lg" />
                <div className="flex flex-col text-right">
                    <span className="text-5xl font-bold leading-none">{current.temp}°</span>
                    <span className="text-lg text-gray-300 mt-1 font-medium">{current.desc}</span>
                    <span className="text-sm text-gray-400 font-semibold mt-0.5 tracking-wide">
                        MAX: <span className="text-white">{current.max}°</span>
                        <span className="mx-1">|</span>
                        MIN: <span className="text-white">{current.min}°</span>
                    </span>
                </div>
            </div>
        </div>
    );
}