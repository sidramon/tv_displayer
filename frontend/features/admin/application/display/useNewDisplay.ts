import { useState } from 'react';
import { useToastContext } from '@/shared/context/ToastContext';
import { useTranslation } from '@/shared/i18n/useTranslation';

export function useNewDisplay(displays: string[], onCreateDisplay: (name: string) => void) {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const { addToast } = useToastContext();
    const { t } = useTranslation();

    const handleNameChange = (value: string) => {
        setName(value.toLowerCase().replace(/[^a-z0-9_-]/g, '').substring(0, 16));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = name.trim();
        if (!clean) return;
        if (displays.includes(clean)) {
            addToast(t.feedback.displayAlreadyExists, 'error');
            return;
        }
        onCreateDisplay(clean);
        cancel();
    };

    const cancel = () => {
        setIsAdding(false);
        setName('');
    };

    return { isAdding, name, setIsAdding, handleNameChange, handleSubmit, cancel };
}