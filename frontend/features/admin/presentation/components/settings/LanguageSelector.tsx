import { useTranslation } from '@/shared/i18n/useTranslation';
import { GlobalSettings } from '@/shared/utils/types/config.types';

interface Props {
    settings: Partial<GlobalSettings>;
    onUpdateLocale: (locale: 'fr' | 'en') => void;
}

export default function LanguageSelector({ settings, onUpdateLocale }: Props) {
    const { t, setLocale } = useTranslation();
    const current = settings.locale || 'fr';

    const handleToggle = () => {
        const next = current === 'fr' ? 'en' : 'fr';
        setLocale(next);
        onUpdateLocale(next);
    };

    return (
        <section className="flex flex-col gap-4">
            {/* En-tête */}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t.settings.language}</h3>

            {/* Conteneur principal du sélecteur */}
            <div
                onClick={handleToggle}
                className="relative flex items-center justify-between w-36 h-10 bg-slate-100 dark:bg-slate-700 rounded-full cursor-pointer p-1 transition-colors"
            >
                {/* Indicateur de sélection */}
                <div className={`absolute w-16 h-8 bg-blue-600 rounded-full shadow transition-transform duration-300 ${
                    current === 'en' ? 'translate-x-[72px]' : 'translate-x-0'
                }`} />

                {/* Option Français */}
                <span className={`relative z-10 w-16 text-center text-sm font-semibold transition-colors ${
                    current === 'fr' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`}>Français</span>

                {/* Option Anglais */}
                <span className={`relative z-10 w-16 text-center text-sm font-semibold transition-colors ${
                    current === 'en' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`}>English</span>
            </div>
        </section>
    );
}