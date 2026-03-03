// IMPORT SECTION
import { useState, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';

// INTERFACES SECTION
interface ForecastData {
    day: string;
    tempMax: number;
    tempMin: number;
    desc: string;
}

// COMPONENT SECTION
export default function WeatherWidget() {
    const [currentTemp, setCurrentTemp] = useState<string>("--");
    const [todayMin, setTodayMin] = useState<string>("--");
    const [todayMax, setTodayMax] = useState<string>("--");
    const [weatherDesc, setWeatherDesc] = useState<string>("Chargement");
    const [isDay, setIsDay] = useState<boolean>(true);
    const [forecast, setForecast] = useState<ForecastData[]>([]);

    const parseWeatherCode = (code: number) => {
        if (code === 0) return "Dégagé";
        if (code >= 1 && code <= 3) return "Nuageux";
        if (code >= 45 && code <= 48) return "Brouillard";
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Pluie";
        if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Neige";
        if (code >= 95) return "Orage";
        return "Inconnu";
    };

    useEffect(() => {
        const updateWeather = async () => {
            try {
                // On récupère la météo actuelle ET les prévisions journalières pour min/max et les 2 prochains jours
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=46.2255&longitude=-72.6175&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America%2FToronto');
                const data = await response.json();

                // Météo Actuelle
                setCurrentTemp(`${Math.round(data.current_weather.temperature)}`);
                setIsDay(data.current_weather.is_day === 1);
                setWeatherDesc(parseWeatherCode(data.current_weather.weathercode));

                if (data.daily) {
                    // Min/Max d'aujourd'hui (index 0)
                    setTodayMin(`${Math.round(data.daily.temperature_2m_min[0])}`);
                    setTodayMax(`${Math.round(data.daily.temperature_2m_max[0])}`);

                    // Prévisions Demain (1) et Après-demain (2)
                    const newForecast: ForecastData[] = [];
                    for (let i = 1; i <= 2; i++) {
                        const date = new Date(data.daily.time[i]);
                        // Ajout du timezone offset pour éviter les décalages de date
                        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                        const dayName = localDate.toLocaleDateString('fr-CA', { weekday: 'short' }).replace('.', '');

                        newForecast.push({
                            day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                            tempMax: Math.round(data.daily.temperature_2m_max[i]),
                            tempMin: Math.round(data.daily.temperature_2m_min[i]),
                            desc: parseWeatherCode(data.daily.weathercode[i])
                        });
                    }
                    setForecast(newForecast);
                }
            } catch (error) {
                console.error("Erreur météo:", error);
            }
        };

        updateWeather();
        const weatherInterval = setInterval(updateWeather, 900000); // 15 minutes
        return () => clearInterval(weatherInterval);
    }, []);

    return (
        <div className="flex items-center justify-end w-auto min-w-[350px]">
            {/* PRÉVISIONS (Demain et Après-demain) */}
            {forecast.length > 0 && (
                <div className="flex gap-5 border-r border-gray-700 pr-6 mr-6">
                    {forecast.map((f, i) => (
                        <div key={i} className="flex flex-col items-center justify-center">
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-wide">{f.day}</span>
                            <WeatherIcon desc={f.desc} isDay={true} sizeClasses="w-7 h-7 my-1" />
                            <div className="flex gap-2 text-sm font-semibold">
                                <span className="text-white">{f.tempMax}°</span>
                                <span className="text-gray-500">{f.tempMin}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MÉTÉO ACTUELLE */}
            <div className="flex items-center gap-5">
                <WeatherIcon desc={weatherDesc} isDay={isDay} sizeClasses="w-16 h-16 drop-shadow-lg" />
                <div className="flex flex-col text-right">
                    <span className="text-5xl font-bold leading-none">{currentTemp}°</span>
                    <span className="text-lg text-gray-300 mt-1 font-medium">{weatherDesc}</span>
                    <span className="text-sm text-gray-400 font-semibold mt-0.5 tracking-wide">
                        MAX: <span className="text-white">{todayMax}°</span> <span className="mx-1">|</span> MIN: <span className="text-white">{todayMin}°</span>
                    </span>
                </div>
            </div>
        </div>
    );
}