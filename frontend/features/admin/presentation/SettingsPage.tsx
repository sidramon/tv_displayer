'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../application/useSettings';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { uploadFile } from '@/shared/api/api';
import { useTranslation } from '@/shared/i18n/useTranslation';
import IdentitySection from './components/settings/IdentitySection';
import ThemeSelector from './components/settings/ThemeSelector';
import LanguageSelector from './components/settings/LanguageSelector';
import WeatherSection from './components/settings/WeatherSection';
import SecuritySection from './components/settings/SecuritySection';
import LogoutButton from "@/features/admin/presentation/components/settings/LogoutButton";

interface SettingsPageProps {
    config: GlobalConfig;
    handleSave: (config: GlobalConfig) => void;
    onClose: () => void;
    onLogout: () => void;
}

export default function SettingsPage({ config, handleSave, onClose, onLogout }: SettingsPageProps) {
    const { t } = useTranslation();
    const {
        updateCompanyName, updateLogoUrl, updateTheme,
        updateWeatherLocation, updateLocale, changePassword,
        isChangingPassword, passwordError, passwordSuccess,
    } = useSettings({ config, handleSave });

    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const settings = config.settings || {};

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
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.settings.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-8">
                    <IdentitySection settings={settings} isUploadingLogo={isUploadingLogo} onUpdateCompanyName={updateCompanyName} onLogoUpload={handleLogoUpload} />
                    <ThemeSelector settings={settings} onUpdateTheme={updateTheme} />
                    <LanguageSelector settings={settings} onUpdateLocale={updateLocale} />
                    <WeatherSection settings={settings} onUpdateWeatherLocation={updateWeatherLocation} />
                    <SecuritySection isChangingPassword={isChangingPassword} passwordError={passwordError} passwordSuccess={passwordSuccess} onChangePassword={changePassword} />
                    <LogoutButton onLogout={() => { onLogout(); onClose(); }} />
                </div>
            </div>
        </div>
    );
}