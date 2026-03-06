import WeatherIcon from './WeatherIcon';
import { ForecastData } from '@/shared/utils/types/weather.types';

export default function ForecastCard({ day, tempMax, tempMin, desc, code }: ForecastData) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-1">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-wide shrink-0">{day}</span>
            <div className="flex items-center justify-center w-7 h-7 shrink-0">
                <WeatherIcon code={code} isDay={true} sizeClasses="w-full h-full" />
            </div>
            <div className="flex gap-2 text-sm font-semibold shrink-0">
                <span className="text-white">{tempMax}°</span>
                <span className="text-gray-500">{tempMin}°</span>
            </div>
        </div>
    );
}