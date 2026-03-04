'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { X, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationPickerProps {
    latitude: number;
    longitude: number;
    onChange: (lat: number, lng: number) => void;
}

function MapClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onChange(
                Math.round(e.latlng.lat * 10000) / 10000,
                Math.round(e.latlng.lng * 10000) / 10000
            );
        },
    });
    return null;
}

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const hasLocation = latitude !== 0 || longitude !== 0;
    const center: [number, number] = hasLocation ? [latitude, longitude] : [46.8139, -71.2080];

    useEffect(() => { setMounted(true); }, []);

    return (
        <>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors w-fit"
                >
                    <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {hasLocation ? 'Modifier l\'emplacement' : 'Choisir un emplacement'}
                    </span>
                </button>

                {hasLocation && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {latitude}, {longitude}
                    </span>
                )}
            </div>

            {isOpen && mounted && (
                <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">

                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Emplacement météo</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Cliquez sur la carte pour définir l'emplacement.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        <div className="h-[60vh]">
                            <MapContainer
                                center={center}
                                zoom={hasLocation ? 10 : 5}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapClickHandler onChange={onChange} />
                                {hasLocation && <Marker position={[latitude, longitude]} icon={icon} />}
                            </MapContainer>
                        </div>

                        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {hasLocation ? `${latitude}, ${longitude}` : 'Aucun emplacement sélectionné'}
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                                Confirmer
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}