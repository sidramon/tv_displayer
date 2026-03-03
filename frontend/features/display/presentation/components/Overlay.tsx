// INTERFACES SECTION
interface OverlayProps {
    onStart: () => void;
    isStarted: boolean;
}

// COMPONENT SECTION
export default function Overlay({ onStart, isStarted }: OverlayProps) {
    if (isStarted) return null;

    return (
        <div
            onClick={onStart}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center cursor-pointer transition-opacity duration-500"
        >
            <div className="text-center text-white bg-slate-900 p-12 rounded-2xl border border-white/10 shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-6 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-4xl font-bold mb-4 tracking-tight">Système Prêt</h2>
                <p className="text-xl text-slate-400">Cliquez n'importe où pour initialiser l'affichage</p>
            </div>
        </div>
    );
}