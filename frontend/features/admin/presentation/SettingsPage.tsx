'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Upload } from 'lucide-react';
import { useSettings } from '../application/useSettings';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { uploadFile } from '@/shared/api/api';

const LocationPicker = dynamic<{
    latitude: number;
    longitude: number;
    onChange: (lat: number, lng: number) => void;
}>(
    () => import('./components/settings/LocationPicker'),
    { ssr: false }
);

interface SettingsPageProps {
    config: GlobalConfig;
    handleSave: (config: GlobalConfig) => void;
    onClose: () => void;
}

export default function SettingsPage({ config, handleSave, onClose }: SettingsPageProps) {
    const {
        updateCompanyName,
        updateLogoUrl,
        updateTheme,
        updateWeatherLocation,
        changePassword,
        isChangingPassword,
        passwordError,
        passwordSuccess,
    } = useSettings({ config, handleSave });

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    const settings = config.settings || {};

    const handlePasswordSubmit = () => {
        if (newPassword.length < 4) { setLocalError('Minimum 4 caractères.'); return; }
        if (newPassword !== confirmPassword) { setLocalError('Les mots de passe ne correspondent pas.'); return; }
        setLocalError('');
        changePassword(newPassword);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingLogo(true);
        const url = await uploadFile(file);
        if (url) updateLogoUrl(url);
        setIsUploadingLogo(false);
        e.target.value = '';
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Paramètres</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-8">

                    {/* Identité */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Identité</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nom de l'entreprise</label>
                            <input
                                type="text"
                                defaultValue={settings.companyName || ''}
                                onBlur={(e) => updateCompanyName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                                placeholder="Mon Entreprise"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Logo</label>
                            {settings.logoUrl && (
                                <img src={settings.logoUrl} alt="Logo" className="h-16 object-contain mb-3 rounded-lg border border-slate-200 dark:border-slate-600 p-2" />
                            )}
                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg cursor-pointer transition-colors w-fit">
                                <Upload className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {isUploadingLogo ? 'Chargement...' : 'Changer le logo'}
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                            </label>
                        </div>
                    </section>

                    {/* Affichage Panel */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Affichage Panel</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Thème</span>
                            <div className="flex gap-2">
                                {(['dark', 'light'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => updateTheme(t)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            (settings.theme || 'dark') === t
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {t === 'dark' ? 'Sombre' : 'Clair'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Météo */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Météo</h3>
                        <LocationPicker
                            latitude={settings.weatherLatitude || 0}
                            longitude={settings.weatherLongitude || 0}
                            onChange={updateWeatherLocation}
                        />
                    </section>

                    {/* Sécurité */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Sécurité</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500 mb-2"
                                placeholder="Nouveau mot de passe"
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                                placeholder="Confirmer le mot de passe"
                            />
                        </div>
                        {(localError || passwordError) && (
                            <p className="text-red-500 text-sm">{localError || passwordError}</p>
                        )}
                        {passwordSuccess && (
                            <p className="text-green-600 text-sm">Mot de passe modifié avec succès.</p>
                        )}
                        <button
                            onClick={handlePasswordSubmit}
                            disabled={isChangingPassword || !newPassword}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 w-fit"
                        >
                            {isChangingPassword ? 'Enregistrement...' : 'Changer le mot de passe'}
                        </button>
                    </section>

                </div>
            </div>
        </div>
    );
}