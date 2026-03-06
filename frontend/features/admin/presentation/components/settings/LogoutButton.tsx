import { LogOut } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface Props {
    onLogout: () => void;
}

export default function LogoutButton({ onLogout }: Props) {
    const { t } = useTranslation();

    const handleLogout = async () => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'X-Admin-Token': token },
            });
        }
        localStorage.removeItem('admin_token');
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