export interface ForecastData {
    day: string;
    tempMax: number;
    tempMin: number;
    desc: string;
}

export interface CurrentWeather {
    temp: string;
    min: string;
    max: string;
    desc: string;
    isDay: boolean;
}