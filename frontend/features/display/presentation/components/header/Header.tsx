// IMPORT SECTION
import { useState, useEffect } from 'react';
import WeatherWidget from './WeatherWidget';

// COMPONENT SECTION
export default function Header() {
    const [time, setTime] = useState<string>("00:00");
    const [dateStr, setDateStr] = useState<string>("Chargement...");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setTime(`${hours}:${minutes}`);

            const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
            let dStr = now.toLocaleDateString('fr-CA', options);
            setDateStr(dStr.charAt(0).toUpperCase() + dStr.slice(1));
        };

        updateClock();
        const clockInterval = setInterval(updateClock, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    return (
        <header className="h-32 bg-blue-950 border-b border-gray-700 flex items-center justify-between px-8 shadow-2xl shrink-0 z-10 gap-8 overflow-hidden">
            <div className="flex flex-col w-72 shrink-0">
                <div className="text-5xl lg:text-6xl font-semibold tracking-wide">{time}</div>
                <div className="text-lg lg:text-xl text-gray-400 mt-1 uppercase tracking-wider">{dateStr}</div>
            </div>

            <div className="flex-1 flex justify-center items-center h-full py-2 min-w-0">
                <img
                    src="https://residencespelletier.ca/wp/wp-content/uploads/2019/07/TEF-Les-residences-Pelletier-Open-graph.png"
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