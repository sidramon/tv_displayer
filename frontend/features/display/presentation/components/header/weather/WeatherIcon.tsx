// IMPORT SECTION
import React from 'react';

// INTERFACES SECTION
interface WeatherIconProps {
    desc: string;
    isDay?: boolean;
    sizeClasses?: string;
}

// COMPONENT SECTION
export default function WeatherIcon({ desc, isDay = true, sizeClasses = "w-14 h-14" }: WeatherIconProps) {
    switch (desc) {
        case "Dégagé":
            return isDay ? (
                // Soleil
                <svg className={`${sizeClasses} text-yellow-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                // Lune
                <svg className={`${sizeClasses} text-blue-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            );
        case "Nuageux":
        case "Brouillard":
            return (
                <svg className={`${sizeClasses} text-gray-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            );
        case "Pluie":
            return (
                <svg className={`${sizeClasses} text-blue-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v2m-4-2v2m8-2v2m-9-2.5a5.5 5.5 0 1110.82-.98A4.5 4.5 0 1114.5 18h-5A4.5 4.5 0 015.5 13.5z" />
                </svg>
            );
        case "Neige":
            return (
                <svg className={`${sizeClasses} text-blue-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0-18l-4 4m4-4l4 4m-4 10l-4 4m4-4l4 4M8 8l8 8m-8 0l8-8" />
                </svg>
            );
        case "Orage":
            return (
                <svg className={`${sizeClasses} text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        default:
            return null;
    }
}