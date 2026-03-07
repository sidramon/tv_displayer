import { LogOut } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { logout } from '@/shared/api';

interface Props {
    onLogout: () => void;
}

export default function LogoutButton({ onLogout }: Props) {
    const { t } = useTranslation();

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
            >
                <LogOut className="w-4 h-4" />
                {t.settings.logout}
            </button>
        </div>
    );
}