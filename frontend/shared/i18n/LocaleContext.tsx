'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale } from './index';

const VALID: Locale[] = ['fr', 'en'];

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({ locale: 'fr', setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('fr');

    useEffect(() => {
        const raw = localStorage.getItem('locale');
        if (VALID.includes(raw as Locale)) setLocaleState(raw as Locale);
    }, []);

    const setLocale = (l: Locale) => {
        localStorage.setItem('locale', l);
        setLocaleState(l);
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}