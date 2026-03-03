import { MediaItem } from '@/shared/utils/types/config.types';

interface VideoSlideProps {
    item: MediaItem;
    isActive: boolean;
    playVideoAudio: boolean;
    onEnded: () => void;
}

export default function VideoSlide({ item, isActive, playVideoAudio, onEnded }: VideoSlideProps) {
    return (
        <>
            <video
                id={`vid-bg-${item.id}`}
                src={item.url}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 brightness-50"
            />
            <video
                id={`vid-main-${item.id}`}
                src={item.url}
                muted={!playVideoAudio}
                playsInline
                onEnded={isActive ? onEnded : undefined}
                className="relative z-10 w-full h-full object-contain object-center"
            />
        </>
    );
}