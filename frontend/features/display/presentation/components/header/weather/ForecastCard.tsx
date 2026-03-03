import WeatherIcon from './WeatherIcon';
import { ForecastData } from '@/shared/utils/types';

export default function ForecastCard({ day, tempMax, tempMin, desc }: ForecastData) {
    return (
        <div className="flex flex-col items-center justify-center">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-wide">{day}</span>
            <WeatherIcon desc={desc} isDay={true} sizeClasses="w-7 h-7 my-1" />
            <div className="flex gap-2 text-sm font-semibold">
                <span className="text-white">{tempMax}°</span>
                <span className="text-gray-500">{tempMin}°</span>
            </div>
        </div>
    );
}