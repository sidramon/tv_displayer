import WeatherWidget from './weather/WeatherWidget';
import ClockDisplay from './ClockDisplay';
import { useClock } from '@/features/display/application/useClock';
import { LOGO_URL } from '@/shared/config/branding';
import { HEADER_THEMES, HeaderThemeKey } from '@/shared/config/headerThemes';
import {useGlobalSettings} from "@/features/display/application/useGlobalSettings";

export default function Header() {
    const { time, dateStr } = useClock();
    const settings = useGlobalSettings();

    const logoSrc = settings?.logoUrl || LOGO_URL;
    const altText = settings?.companyName || 'Logo';
    const themeKey = (settings?.headerThemeKey || 'blue-dark') as HeaderThemeKey;
    const theme = HEADER_THEMES[themeKey] ?? HEADER_THEMES['blue-dark'];

    return (
        <header className={`h-32 ${theme.bg} ${theme.text} border-b ${theme.border} flex items-center justify-between px-8 shadow-2xl shrink-0 z-10 gap-8 overflow-hidden`}>
            <ClockDisplay time={time} dateStr={dateStr} subTextClass={theme.subText} />

            <div className="flex-1 flex justify-center items-center h-full py-2 min-w-0">
                <img
                    src={logoSrc}
                    alt={altText}
                    className="h-full max-h-24 object-contain drop-shadow-xl rounded-2xl"
                />
            </div>

            <div className="shrink-0 flex justify-end">
                <WeatherWidget themeKey={themeKey} />
            </div>
        </header>
    );
}