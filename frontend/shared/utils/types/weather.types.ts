export type WeatherCode = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm' | 'unknown';

export interface CurrentWeather {
    temp: string;
    min: string;
    max: string;
    desc: string;
    code: WeatherCode;
    isDay: boolean;
}

export interface ForecastData {
    day: string;
    tempMax: number;
    tempMin: number;
    desc: string;
    code: WeatherCode;
}