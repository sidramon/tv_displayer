import { useTranslation } from '@/shared/i18n/useTranslation';
import { GlobalSettings } from '@/shared/utils/types/config.types';

interface Props {
    settings: Partial<GlobalSettings>;
    onUpdateTheme: (theme: 'dark' | 'light') => void;
}

export default function ThemeSelector({ settings, onUpdateTheme }: Props) {
    const { t } = useTranslation();
    const current = settings.theme || 'light';

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t.settings.display}</h3>

            {/* Conteneur principal du bouton */}
            <div
                onClick={() => onUpdateTheme(current === 'light' ? 'dark' : 'light')}
                className="relative flex items-center justify-between w-20 h-10 bg-slate-100 dark:bg-slate-700 rounded-full cursor-pointer p-1 transition-colors"
            >
                {/* Indicateur de sélection */}
                <div className={`absolute w-8 h-8 bg-blue-600 rounded-full shadow transition-transform duration-300 ${
                    current === 'dark' ? 'translate-x-10' : 'translate-x-0'
                }`} />

                {/* Icône Soleil */}
                <svg
                    className={`relative z-10 w-8 h-8 p-1.5 shrink-0 flex items-center justify-center transition-colors ${
                        current === 'light' ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>

                {/* Icône Lune */}
                <svg
                    className={`relative z-10 w-8 h-8 p-1.5 shrink-0 flex items-center justify-center transition-colors ${
                        current === 'dark' ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
            </div>
        </section>
    );
}