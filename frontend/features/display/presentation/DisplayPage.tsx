// IMPORT SECTION
'use client';

import { useEffect, useRef } from 'react';
import { useDisplayLogic } from '../application/useDisplayLogic';
import Header from './components/header/Header';
import Overlay from './components/Overlay';
import Slideshow from './components/Slideshow';

// INTERFACES SECTION
interface DisplayPageProps {
    displayName: string;
}

// COMPONENT SECTION
export default function DisplayPage({ displayName }: DisplayPageProps) {
    const { playlist, duration, playVideoAudio, isStarted, startDisplay } = useDisplayLogic(displayName);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (isStarted && playlist?.audio && audioRef.current) {
            audioRef.current.src = playlist.audio;
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        } else if (audioRef.current && (!playlist || !playlist.audio)) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    }, [playlist?.audio, isStarted]);

    return (
        <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col font-sans z-50">
            <Overlay onStart={startDisplay} isStarted={isStarted} />

            <audio ref={audioRef} loop />

            <Header />

            <Slideshow items={playlist?.items || []} slideDuration={duration} playVideoAudio={playVideoAudio} />
        </div>
    );
}