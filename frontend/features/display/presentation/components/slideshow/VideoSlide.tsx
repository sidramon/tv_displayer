import { MediaItem } from '@/shared/utils/types/config.types';
import { useRef, useEffect } from 'react';

const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

interface VideoSlideProps {
    item: MediaItem;
    isActive: boolean;
    playVideoAudio: boolean;
    onEnded: () => void;
}

export default function VideoSlide({ item, isActive, playVideoAudio, onEnded }: VideoSlideProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // BACKGROUND RENDERING
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId: number;
        let lastDrawTime = 0;

        const drawFrame = (timestamp: number) => {
            if (!video.paused && !video.ended && ctx) {
                if (timestamp - lastDrawTime > 66) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    lastDrawTime = timestamp;
                }
            }
            animationFrameId = requestAnimationFrame(drawFrame);
        };

        video.addEventListener('play', () => {
            animationFrameId = requestAnimationFrame(drawFrame);
        });

        return () => {
            video.removeEventListener('play', () => {});
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // VIDEO LIFECYCLE
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            video.currentTime = 0;
            video.play().catch((error) => {
                console.error("Échec de la lecture sur la TV:", error);
                onEnded();
            });
        } else {
            video.pause();
        }
    }, [isActive, onEnded]);

    // RENDER
    return (
        <>
            <canvas
                id={`canvas-bg-${item.id}`}
                ref={canvasRef}
                width={213}
                height={120}
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 brightness-50"
            />

            <video
                id={`vid-main-${item.id}`}
                ref={videoRef}
                src={isActive ? item.url : ""}
                poster={TRANSPARENT_PIXEL}
                muted={!playVideoAudio}
                playsInline
                preload="none"
                onEnded={isActive ? onEnded : undefined}
                className="relative z-10 w-full h-full object-contain object-center"
                style={{ pointerEvents: 'none' }}
            />
        </>
    );
}