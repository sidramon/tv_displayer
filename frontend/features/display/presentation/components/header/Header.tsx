// features/display/presentation/components/header/Header.tsx
import WeatherWidget from './weather/WeatherWidget';
import ClockDisplay from './ClockDisplay';
import { useClock } from '@/features/display/application/useClock';
import { LOGO_URL } from '@/shared/config/branding';

export default function Header() {
    const { time, dateStr } = useClock();

    return (
        <header className="h-32 bg-blue-950 border-b border-gray-700 flex items-center justify-between px-8 shadow-2xl shrink-0 z-10 gap-8 overflow-hidden">
            <ClockDisplay time={time} dateStr={dateStr} />

            <div className="flex-1 flex justify-center items-center h-full py-2 min-w-0">
                <img
                    src={LOGO_URL}
                    alt="Logo"
                    className="h-full max-h-24 object-contain drop-shadow-xl rounded-2xl"
                />
            </div>

            <div className="shrink-0 flex justify-end">
                <WeatherWidget />
            </div>
        </header>
    );
}