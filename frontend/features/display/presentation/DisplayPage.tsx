'use client';

import { useDisplayLogic } from '../application/useDisplayLogic';
import { useAudio } from '../application/useAudio';
import Header from './components/header/Header';
import Overlay from './components/Overlay';
import Slideshow from './components/slideshow/Slideshow';

interface DisplayPageProps {
    displayName: string;
}

export default function DisplayPage({ displayName }: DisplayPageProps) {
    const { playlist, duration, playVideoAudio, isStarted, startDisplay } = useDisplayLogic(displayName);
    const audioRef = useAudio(playlist?.audio, isStarted);

    return (
        <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col font-sans z-50">
            <Overlay onStart={startDisplay} isStarted={isStarted} />
            <audio ref={audioRef} loop />
            <Header />
            <Slideshow items={playlist?.items || []} slideDuration={duration} playVideoAudio={playVideoAudio} />
        </div>
    );
}