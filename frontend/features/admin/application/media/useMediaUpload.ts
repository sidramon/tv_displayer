import { useState, useCallback } from 'react';
import { uploadFile } from '@/shared/api';
import getCroppedImg, { PixelCrop } from '@/shared/utils/cropImage';
import { MediaItem } from '@/shared/utils/types/config.types';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

export function useMediaUpload(onUploadComplete: (item: MediaItem) => void) {
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const onCropComplete = useCallback((_: any, pixels: PixelCrop) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const processQueue = useCallback(async (files: File[]) => {
        if (files.length === 0) {
            setImageSrc(null);
            setCurrentFile(null);
            setIsUploading(false);
            setPendingFiles([]);
            return;
        }

        const [next, ...rest] = files;

        if (next.type.startsWith('video/')) {
            setIsUploading(true);
            const url = await uploadFile(next);
            if (url) {
                onUploadComplete({ id: Date.now().toString(), type: 'video', url });
                addToast(t.feedback.uploadSuccess, 'success');
            } else {
                addToast(t.feedback.uploadFailed, 'error');
            }
            processQueue(rest);
        } else if (next.type.startsWith('image/')) {
            setCurrentFile(next);
            setPendingFiles(rest);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || null);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setIsUploading(false);
            });
            reader.readAsDataURL(next);
        } else {
            processQueue(rest);
        }
    }, [onUploadComplete, addToast, t]);

    const handleUploadCrop = async () => {
        if (!imageSrc || !croppedAreaPixels || !currentFile) return;
        setIsUploading(true);
        try {
            const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (blob) {
                const url = await uploadFile(new File([blob], currentFile.name, { type: 'image/jpeg' }));
                if (url) {
                    onUploadComplete({ id: Date.now().toString(), type: 'image', url });
                    addToast(t.feedback.uploadSuccess, 'success');
                } else {
                    addToast(t.feedback.uploadFailed, 'error');
                }
            }
        } catch (e) {
            console.error(e);
            addToast(t.feedback.uploadFailed, 'error');
        }
        processQueue(pendingFiles);
    };

    const handleUploadOriginal = async () => {
        if (!currentFile) return;
        setIsUploading(true);
        try {
            const url = await uploadFile(currentFile);
            if (url) {
                onUploadComplete({ id: Date.now().toString(), type: 'image', url });
                addToast(t.feedback.uploadSuccess, 'success');
            } else {
                addToast(t.feedback.uploadFailed, 'error');
            }
        } catch (e) {
            console.error(e);
            addToast(t.feedback.uploadFailed, 'error');
        }
        processQueue(pendingFiles);
    };

    return {
        imageSrc, crop, zoom, isUploading,
        pendingCount: pendingFiles.length,
        setCrop, setZoom, onCropComplete,
        handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.length) processQueue(Array.from(e.target.files));
            e.target.value = '';
        },
        handleUploadCrop,
        handleUploadOriginal,
        handleSkip: () => processQueue(pendingFiles),
        handleCancelAll: () => processQueue([]),
    };
}