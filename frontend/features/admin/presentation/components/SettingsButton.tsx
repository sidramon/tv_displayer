import { Settings } from 'lucide-react';

interface SettingsButtonProps {
    onClick: () => void;
}

export default function SettingsButton({ onClick }: SettingsButtonProps) {
    return (
        <button
            onClick={onClick}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-shadow"
            title="Paramètres"
        >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
    );
}