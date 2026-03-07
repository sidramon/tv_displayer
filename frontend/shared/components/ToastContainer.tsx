'use client';

import { Toast } from '@/shared/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Props {
    toasts: Toast[];
    onRemove: (id: number) => void;
}

const ICONS = {
    success: <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />,
    error:   <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />,
    info:    <Info className="w-5 h-5 shrink-0 text-blue-500" />,
};

const STYLES = {
    success: 'border-green-200 dark:border-green-800 bg-white dark:bg-slate-800',
    error:   'border-red-200 dark:border-red-800 bg-white dark:bg-slate-800',
    info:    'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800',
};

export default function ToastContainer({ toasts, onRemove }: Props) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in ${STYLES[toast.type]}`}
                >
                    {ICONS[toast.type]}
                    <span className="flex-1 text-sm text-slate-700 dark:text-slate-200 font-medium">
                        {toast.message}
                    </span>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}