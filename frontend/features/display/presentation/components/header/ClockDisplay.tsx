interface ClockDisplayProps {
    time: string;
    dateStr: string;
    subTextClass?: string;
}

export default function ClockDisplay({ time, dateStr, subTextClass = 'text-gray-400' }: ClockDisplayProps) {
    return (
        <div className="flex flex-col w-72 shrink-0">
            <div className="text-5xl lg:text-6xl font-semibold tracking-wide">
                {time}
            </div>
            <div className={`text-lg lg:text-xl mt-1 uppercase tracking-wider ${subTextClass}`}>
                {dateStr}
            </div>
        </div>
    );
}