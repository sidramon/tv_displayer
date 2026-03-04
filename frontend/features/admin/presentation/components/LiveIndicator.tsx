interface LiveIndicatorProps {
    displayName: string;
}

export default function LiveIndicator({ displayName }: LiveIndicatorProps) {
    const href = `/display/${displayName === 'default' ? '' : displayName}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">En diffusion</span>
            {displayName !== 'default' && (
                <span className="text-xs text-slate-400 dark:text-slate-500">({displayName})</span>
            )}
        </a>
    );
}