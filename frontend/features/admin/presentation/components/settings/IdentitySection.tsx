import { Upload } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { GlobalSettings } from '@/shared/utils/types/config.types';

interface Props {
    settings: Partial<GlobalSettings>;
    isUploadingLogo: boolean;
    onUpdateCompanyName: (name: string) => void;
    onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function IdentitySection({ settings, isUploadingLogo, onUpdateCompanyName, onLogoUpload }: Props) {
    const { t } = useTranslation();
    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t.settings.identity}</h3>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.settings.companyName}</label>
                <input
                    type="text"
                    defaultValue={settings.companyName || ''}
                    onBlur={(e) => onUpdateCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                    placeholder={t.settings.companyName}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.settings.logo}</label>
                {settings.logoUrl && (
                    <img src={settings.logoUrl} alt={t.settings.logo} className="h-16 object-contain mb-3 rounded-lg border border-slate-200 dark:border-slate-600 p-2" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg cursor-pointer transition-colors w-fit">
                    <Upload className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {isUploadingLogo ? t.settings.loading : t.settings.changeLogo}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={onLogoUpload} disabled={isUploadingLogo} />
                </label>
            </div>
        </section>
    );
}