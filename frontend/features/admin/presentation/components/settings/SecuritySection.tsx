import { useState } from 'react';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface Props {
    isChangingPassword: boolean;
    passwordError: string;
    passwordSuccess: boolean;
    onChangePassword: (password: string) => void;
}

export default function SecuritySection({ isChangingPassword, passwordError, passwordSuccess, onChangePassword }: Props) {
    const { t } = useTranslation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = () => {
        if (newPassword.length < 4) { setLocalError(t.settings.passwordMinLength); return; }
        if (newPassword !== confirmPassword) { setLocalError(t.settings.passwordMismatch); return; }
        setLocalError('');
        onChangePassword(newPassword);
    };

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t.settings.security}</h3>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.settings.newPassword}</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500 mb-2"
                    placeholder={t.settings.newPassword}
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                    placeholder={t.settings.confirmPassword}
                />
            </div>
            {(localError || passwordError) && (
                <p className="text-red-500 text-sm">{localError || passwordError}</p>
            )}
            {passwordSuccess && (
                <p className="text-green-600 text-sm">{t.settings.passwordSuccess}</p>
            )}
            <button
                onClick={handleSubmit}
                disabled={isChangingPassword || !newPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 w-fit"
            >
                {isChangingPassword ? t.settings.saving : t.settings.changePassword}
            </button>
        </section>
    );
}