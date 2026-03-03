import { useState, useEffect, useCallback, useRef } from 'react';
import { MediaItem } from '@/shared/utils/types/config.types';

export function useSlideshow(items: MediaItem[], slideDuration: number) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const lastPlayedIndex = useRef<number>(-1);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    // Reset index si la playlist change
    useEffect(() => {
        if (items && currentIndex >= items.length && items.length > 0) {
            setCurrentIndex(0);
        }
    }, [items, currentIndex]);

    // Timer pour les images
    useEffect(() => {
        if (!items || items.length <= 1) return;
        const currentItem = items[currentIndex];
        if (currentItem?.type !== 'image') return;

        const timer = setTimeout(goToNext, slideDuration);
        return () => clearTimeout(timer);
    }, [currentIndex, items, slideDuration, goToNext]);

    // Contrôle lecture vidéo
    useEffect(() => {
        items.forEach((item, index) => {
            if (item.type !== 'video') return;

            const mainVid = document.getElementById(`vid-main-${item.id}`) as HTMLVideoElement;
            const bgVid = document.getElementById(`vid-bg-${item.id}`) as HTMLVideoElement;

            if (index === currentIndex) {
                const isNewSlide = lastPlayedIndex.current !== currentIndex;
                if (isNewSlide) {
                    if (mainVid) { mainVid.currentTime = 0; mainVid.play().catch(() => {}); }
                    if (bgVid) { bgVid.currentTime = 0; bgVid.play().catch(() => {}); }
                } else {
                    if (mainVid?.paused) mainVid.play().catch(() => {});
                    if (bgVid?.paused) bgVid.play().catch(() => {});
                }
            } else {
                setTimeout(() => {
                    if (mainVid && !mainVid.paused) mainVid.pause();
                    if (bgVid && !bgVid.paused) bgVid.pause();
                }, 1500);
            }
        });

        lastPlayedIndex.current = currentIndex;
    }, [currentIndex, items]);

    return { currentIndex, goToNext };
}