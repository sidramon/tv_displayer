// IMPORT SECTION
import { useState, useEffect, useCallback, useRef } from 'react';
import { MediaItem } from '@/shared/utils/types';

// INTERFACES SECTION
interface SlideshowProps {
    items: MediaItem[];
    slideDuration: number;
    playVideoAudio: boolean;
}

// COMPONENT SECTION
export default function Slideshow({ items, slideDuration, playVideoAudio }: SlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const lastPlayedIndex = useRef<number>(-1);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    useEffect(() => {
        if (items && currentIndex >= items.length && items.length > 0) {
            setCurrentIndex(0);
        }
    }, [items, currentIndex]);

    useEffect(() => {
        if (!items || items.length <= 1) return;

        const currentItem = items[currentIndex];
        let timer: NodeJS.Timeout;

        if (currentItem && currentItem.type === 'image') {
            timer = setTimeout(goToNext, slideDuration);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [currentIndex, items, slideDuration, goToNext]);

    useEffect(() => {
        items.forEach((item, index) => {
            if (item.type === 'video') {
                const mainVid = document.getElementById(`vid-main-${item.id}`) as HTMLVideoElement;
                const bgVid = document.getElementById(`vid-bg-${item.id}`) as HTMLVideoElement;

                if (index === currentIndex) {
                    if (lastPlayedIndex.current !== currentIndex) {
                        // Nouvelle diapositive : on la remet au début
                        if (mainVid) { mainVid.currentTime = 0; mainVid.play().catch(()=>{}); }
                        if (bgVid) { bgVid.currentTime = 0; bgVid.play().catch(()=>{}); }
                    } else {
                        // Même diapositive (rafraîchissement des données) : on s'assure juste qu'elle joue
                        if (mainVid && mainVid.paused) mainVid.play().catch(()=>{});
                        if (bgVid && bgVid.paused) bgVid.play().catch(()=>{});
                    }
                } else {
                    // Diapositive inactive : on met en pause après la transition
                    setTimeout(() => {
                        if (mainVid && !mainVid.paused) mainVid.pause();
                        if (bgVid && !bgVid.paused) bgVid.pause();
                    }, 1500);
                }
            }
        });

        lastPlayedIndex.current = currentIndex;
    }, [currentIndex, items]);

    if (!items || items.length === 0) {
        return <main className="flex-1 bg-black w-full" />;
    }

    return (
        <main className="flex-1 relative bg-black w-full flex items-center justify-center overflow-hidden">
            {items.map((item, index) => {
                const isActive = index === currentIndex;
                const baseClasses = "absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out overflow-hidden";
                const activeClasses = isActive ? "opacity-100 z-10" : "opacity-0 z-0";

                return (
                    <div key={item.id} className={`${baseClasses} ${activeClasses}`}>
                        {item.type === 'image' ? (
                            <>
                                <img src={item.url} className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 brightness-50" alt="" />
                                <img src={item.url} className="relative z-10 w-full h-full object-contain object-center" alt="" />
                            </>
                        ) : (
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
                                    onEnded={(e) => {
                                        if (isActive) {
                                            if (items.length > 1) {
                                                goToNext();
                                            } else {
                                                const vid = e.target as HTMLVideoElement;
                                                vid.currentTime = 0;
                                                vid.play().catch(()=>{});
                                                const bgVid = document.getElementById(`vid-bg-${item.id}`) as HTMLVideoElement;
                                                if (bgVid) { bgVid.currentTime = 0; bgVid.play().catch(()=>{}); }
                                            }
                                        }
                                    }}
                                    className="relative z-10 w-full h-full object-contain object-center"
                                />
                            </>
                        )}
                    </div>
                );
            })}
        </main>
    );
}