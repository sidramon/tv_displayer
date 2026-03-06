import { useState, useCallback } from 'react';
import { useInterval } from "@/shared/hooks/useInterval";
import { useTranslation } from '@/shared/i18n/useTranslation';

export function useClock() {
    const [time, setTime] = useState("00:00");
    const [dateStr, setDateStr] = useState("...");
    const { locale } = useTranslation();

    const update = useCallback(() => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        setTime(`${h}:${m}`);

        const raw = now.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setDateStr(raw.charAt(0).toUpperCase() + raw.slice(1));
    }, [locale]);

    useInterval(update, 1000);

    return { time, dateStr };
}