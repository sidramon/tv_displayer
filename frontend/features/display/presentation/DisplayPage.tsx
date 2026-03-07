'use client';

import { useDisplayLogic } from '../application/useDisplayLogic';
import { useAudio } from '../application/useAudio';
import Header from './components/header/Header';
import Overlay from './components/Overlay';
import Slideshow from './components/slideshow/Slideshow';
import { useGlobalSettings } from '@/features/display/application/useGlobalSettings';
import AnimationOverlay from '@/features/display/presentation/components/animations/AnimationOverlay';
import { DisplayAnimationKey } from '@/shared/config/displayAnimations';

interface DisplayPageProps {
    displayName: string;
}

export default function DisplayPage({ displayName }: DisplayPageProps) {
    const { playlist, duration, playVideoAudio, showAnimations, isStarted, startDisplay } = useDisplayLogic(displayName);
    const audioRef = useAudio(playlist?.audio, isStarted);
    const settings = useGlobalSettings();
    const animation = settings?.displayAnimationKey || 'none';

    return (
        <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col font-sans z-50">
            <Overlay onStart={startDisplay} isStarted={isStarted} />
            <audio ref={audioRef} loop />
            {showAnimations && <AnimationOverlay animationKey={animation as DisplayAnimationKey} />}
            <Header />
            <Slideshow items={playlist?.items || []} slideDuration={duration} playVideoAudio={playVideoAudio} />
        </div>
    );
}