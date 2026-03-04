import { useState } from 'react';
import { uploadFile } from '@/shared/api/api';

export function useAudioUpload(onUpdateAudio: (url: string) => void) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file?.type.startsWith('audio/')) return;

        setIsUploading(true);
        const url = await uploadFile(file);
        if (url) onUpdateAudio(url);
        setIsUploading(false);
        e.target.value = '';
    };

    return { isUploading, handleFileChange };
}