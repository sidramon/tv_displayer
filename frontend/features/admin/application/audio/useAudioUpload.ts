import { useState } from 'react';
import { uploadFile } from '@/shared/api';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

export function useAudioUpload(onUpdateAudio: (url: string) => void) {
    const [isUploading, setIsUploading] = useState(false);
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file?.type.startsWith('audio/')) return;

        setIsUploading(true);
        const url = await uploadFile(file);
        if (url) {
            onUpdateAudio(url);
            addToast(t.feedback.audioUpdated, 'success');
        } else {
            addToast(t.feedback.uploadFailed, 'error');
        }
        setIsUploading(false);
        e.target.value = '';
    };

    return { isUploading, handleFileChange };
}