import { useState } from 'react';

export function useNewDisplay(displays: string[], onCreateDisplay: (name: string) => void) {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');

    const handleNameChange = (value: string) => {
        setName(value.toLowerCase().replace(/[^a-z0-9_-]/g, '').substring(0, 16));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = name.trim();
        if (clean && !displays.includes(clean)) {
            onCreateDisplay(clean);
            cancel();
        }
    };

    const cancel = () => {
        setIsAdding(false);
        setName('');
    };

    return { isAdding, name, setIsAdding, handleNameChange, handleSubmit, cancel };
}