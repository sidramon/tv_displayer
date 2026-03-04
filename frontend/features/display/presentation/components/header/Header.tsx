import WeatherWidget from './weather/WeatherWidget';
import ClockDisplay from './ClockDisplay';
import { useClock } from '@/features/display/application/useClock';
import { useGlobalSettings } from '@/features/display/application/useGlobalSettings';
import { LOGO_URL } from '@/shared/config/branding';

export default function Header() {
    const { time, dateStr } = useClock();
    const settings = useGlobalSettings();

    const logoSrc = settings?.logoUrl || LOGO_URL;
    const altText = settings?.companyName || 'Logo';

    return (
        <header className="h-32 bg-blue-950 border-b border-gray-700 flex items-center justify-between px-8 shadow-2xl shrink-0 z-10 gap-8 overflow-hidden">
            <ClockDisplay time={time} dateStr={dateStr} />

            <div className="flex-1 flex justify-center items-center h-full py-2 min-w-0">
                <img
                    src={logoSrc}
                    alt={altText}
                    className="h-full max-h-24 object-contain drop-shadow-xl rounded-2xl"
                />
            </div>

            <div className="shrink-0 flex justify-end">
                <WeatherWidget />
            </div>
        </header>
    );
}