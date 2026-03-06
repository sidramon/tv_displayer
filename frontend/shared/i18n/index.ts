import { fr } from './locales/fr';
import { en } from './locales/en';

export const locales = { fr, en } as const;
export type Locale = keyof typeof locales;
export type Translations = typeof fr;