// features/display/application/useClock.ts
import {useState, useCallback} from 'react';
import { LOCALE, DATE_OPTIONS } from '@/shared/config/locale';
import {useInterval} from "@/shared/hooks/useInterval";

export function useClock() {
    const [time, setTime] = useState("00:00");
    const [dateStr, setDateStr] = useState("Chargement...");

    const update = useCallback(() => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        setTime(`${h}:${m}`);

        const raw = now.toLocaleDateString(LOCALE, DATE_OPTIONS);
        setDateStr(raw.charAt(0).toUpperCase() + raw.slice(1));
    }, []);

    useInterval(update, 1000);

    return { time, dateStr };
}