import React from 'react';
import { WeatherCode } from '@/shared/utils/types/weather.types';

interface WeatherIconProps {
    code: WeatherCode;
    isDay?: boolean;
    sizeClasses?: string;
}

export default function WeatherIcon({ code, isDay = true, sizeClasses = "w-14 h-14" }: WeatherIconProps) {
    const baseClasses = `${sizeClasses} shrink-0`;

    switch (code) {
        case 'clear':
            return isDay ? (
                <svg className={`${baseClasses} text-yellow-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg className={`${baseClasses} text-blue-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            );
        case 'cloudy':
        case 'fog':
            return (
                <svg className={`${baseClasses} text-gray-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            );
        case 'rain':
            return (
                <svg className={`${baseClasses} text-blue-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 13z M8 19v2 M12 18v3 M16 19v2" />
                </svg>
            );
        case 'snow':
            return (
                <svg className={`${baseClasses} text-blue-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20 M17 5l-5 5-5-5 M17 19l-5-5-5 5 M2 12h20 M5 7l5 5-5 5 M19 7l-5 5 5 5" />
                </svg>
            );
        case 'storm':
            return (
                <svg className={`${baseClasses} text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        default:
            return null;
    }
}