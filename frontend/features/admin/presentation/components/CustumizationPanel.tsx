'use client';

import { X, Palette } from 'lucide-react';
import { GlobalConfig } from '@/shared/utils/types/config.types';
import { HEADER_THEMES, HeaderThemeKey } from '@/shared/config/headerThemes';
import { DISPLAY_ANIMATIONS, DisplayAnimationKey } from '@/shared/config/displayAnimations';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { useCustomization } from '../../application/useCustomization';
import { LOGO_URL } from '@/shared/config/branding';

interface Props {
    config: GlobalConfig;
    handleSave: (config: GlobalConfig) => void;
    onClose: () => void;
}

function HeaderPreview({ themeKey, logoSrc, companyName }: { themeKey: HeaderThemeKey; logoSrc: string; companyName: string }) {
    const theme = HEADER_THEMES[themeKey];
    return (
        <div className={`rounded-xl overflow-hidden border ${theme.border} shadow-md`}>
            <header className={`h-20 ${theme.bg} ${theme.text} flex items-center justify-between px-6 gap-4`}>
                <div className="flex flex-col">
                    <span className="text-2xl font-bold leading-none">09:41</span>
                    <span className="text-xs opacity-70 mt-1">VENDREDI, 7 MARS</span>
                </div>
                <div className="flex-1 flex justify-center">
                    <img src={logoSrc} alt={companyName} className="h-12 object-contain rounded-lg" />
                </div>
                <div className="flex items-center gap-3 opacity-80">
                    <div className="text-right">
                        <div className="text-2xl font-bold leading-none">-7°</div>
                        <div className="text-xs opacity-70">Dégagé</div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default function CustomizationPanel({ config, handleSave, onClose }: Props) {
    const { t, locale } = useTranslation();
    const { updateHeaderTheme, updateDisplayAnimation } = useCustomization({ config, handleSave });

    const settings = config.settings || {};
    const currentTheme = (settings.headerThemeKey || 'blue-dark') as HeaderThemeKey;
    const currentAnimation = (settings.displayAnimationKey || 'none') as DisplayAnimationKey;
    const logoSrc = settings.logoUrl || LOGO_URL;
    const companyName = settings.companyName || '';

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white dark:bg-slate-800 w-full sm:rounded-2xl sm:max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.customization.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-8">

                    {/* Aperçu */}
                    <section className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{t.customization.preview}</h3>
                        <HeaderPreview themeKey={currentTheme} logoSrc={logoSrc} companyName={companyName} />
                    </section>

                    {/* Thème header */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{t.customization.colorTheme}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(Object.entries(HEADER_THEMES) as [HeaderThemeKey, typeof HEADER_THEMES[HeaderThemeKey]][]).map(([key, th]) => (
                                <button
                                    key={key}
                                    onClick={() => updateHeaderTheme(key)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                        currentTheme === key
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <div className={`w-full h-10 rounded-lg ${th.preview} flex items-center justify-center`}>
                                        <span className={`text-xs font-bold ${th.text}`}>Aa</span>
                                    </div>
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {locale === 'fr' ? th.labelFr : th.labelEn}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Animations display */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{t.customization.animations}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">{t.customization.animationsHint}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(Object.entries(DISPLAY_ANIMATIONS) as [DisplayAnimationKey, typeof DISPLAY_ANIMATIONS[DisplayAnimationKey]][]).map(([key, anim]) => (
                                <button
                                    key={key}
                                    onClick={() => updateDisplayAnimation(key)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                        currentAnimation === key
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <span className="text-2xl">{anim.icon}</span>
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {locale === 'fr' ? anim.labelFr : anim.labelEn}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}