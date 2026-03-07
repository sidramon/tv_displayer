'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast, Toast, ToastType } from '@/shared/hooks/useToast';
import ToastContainer from '@/shared/components/ToastContainer';

interface ToastContextValue {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
    const { toasts, addToast, removeToast } = useToast();

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToastContext() {
    return useContext(ToastContext);
}