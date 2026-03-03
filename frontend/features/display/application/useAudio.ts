import { useEffect, useRef } from 'react';

export function useAudio(audioSrc: string | undefined, isStarted: boolean) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isStarted && audioSrc) {
            audioRef.current.src = audioSrc;
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        } else {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    }, [audioSrc, isStarted]);

    return audioRef;
}