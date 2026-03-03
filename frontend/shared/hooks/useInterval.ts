// shared/hooks/useInterval.ts
import {useEffect} from "react";

export function useInterval(callback: () => void, delay: number) {
    useEffect(() => {
        callback();
        const id = setInterval(callback, delay);
        return () => clearInterval(id);
    }, [callback, delay]);
}