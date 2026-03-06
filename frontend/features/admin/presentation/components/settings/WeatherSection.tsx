import dynamic from 'next/dynamic';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { GlobalSettings } from '@/shared/utils/types/config.types';

const LocationPicker = dynamic<{
    latitude: number;
    longitude: number;
    onChange: (lat: number, lng: number) => void;
}>(
    () => import('./LocationPicker'),
    { ssr: false }
);

interface Props {
    settings: Partial<GlobalSettings>;
    onUpdateWeatherLocation: (lat: number, lng: number) => void;
}

export default function WeatherSection({ settings, onUpdateWeatherLocation }: Props) {
    const { t } = useTranslation();
    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t.settings.weather}</h3>
            <LocationPicker
                latitude={settings.weatherLatitude || 0}
                longitude={settings.weatherLongitude || 0}
                onChange={onUpdateWeatherLocation}
            />
        </section>
    );
}