import PlayCircleIcon from "@/shared/components/icons/PlayCircularIcon";
import { useTranslation } from "@/shared/i18n/useTranslation";

export interface OverlayProps {
    onStart: () => void;
    isStarted: boolean;
}

export default function Overlay({ onStart, isStarted }: OverlayProps) {
    const { t } = useTranslation();

    if (isStarted) return null;

    return (
        <div
            onClick={onStart}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center cursor-pointer transition-opacity duration-500"
        >
            <div className="text-center text-white bg-slate-900 p-12 rounded-2xl border border-white/10 shadow-2xl">
                <PlayCircleIcon />
                <h2 className="text-4xl font-bold mb-4 tracking-tight">{t.display.ready}</h2>
                <p className="text-xl text-slate-400">{t.display.start}</p>
            </div>
        </div>
    );
}