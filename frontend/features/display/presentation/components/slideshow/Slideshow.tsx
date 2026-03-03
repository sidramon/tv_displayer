import { MediaItem } from '@/shared/utils/types/config.types';
import { useSlideshow } from '@/features/display/application/useSlideshow';
import ImageSlide from './ImageSlide';
import VideoSlide from './VideoSlide';

interface SlideshowProps {
    items: MediaItem[];
    slideDuration: number;
    playVideoAudio: boolean;
}

export default function Slideshow({ items, slideDuration, playVideoAudio }: SlideshowProps) {
    const { currentIndex, goToNext } = useSlideshow(items, slideDuration);

    if (!items || items.length === 0) {
        return <main className="flex-1 bg-black w-full" />;
    }

    return (
        <main className="flex-1 relative bg-black w-full flex items-center justify-center overflow-hidden">
            {items.map((item, index) => {
                const isActive = index === currentIndex;
                const baseClasses = "absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out overflow-hidden";

                return (
                    <div key={item.id} className={`${baseClasses} ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                        {item.type === 'image'
                            ? <ImageSlide url={item.url} />
                            : <VideoSlide item={item} isActive={isActive} playVideoAudio={playVideoAudio} onEnded={goToNext} />
                        }
                    </div>
                );
            })}
        </main>
    );
}