// shared/config/locale.ts
export const LOCALE = 'fr-CA' as const;
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'long', day: 'numeric', month: 'long'
};