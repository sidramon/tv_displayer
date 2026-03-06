import { locales } from './index';
import { useLocale } from './LocaleContext';

export function useTranslation() {
    const { locale, setLocale } = useLocale();
    const t = locales[locale];

    function translate(key: string, vars?: Record<string, string>): string {
        const val = key.split('.').reduce((obj: any, k) => obj?.[k], t) as string;
        if (!val) return key;
        if (!vars) return val;
        return Object.entries(vars).reduce(
            (str, [k, v]) => str.replace(`{${k}}`, v), val
        );
    }

    return { t, locale, translate, setLocale };
}