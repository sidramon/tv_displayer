// features/display/presentation/components/header/ClockDisplay.tsx

interface ClockDisplayProps {
    time: string;
    dateStr: string;
}

export default function ClockDisplay({ time, dateStr }: ClockDisplayProps) {
    return (
        <div className="flex flex-col w-72 shrink-0">
            <div className="text-5xl lg:text-6xl font-semibold tracking-wide">
                {time}
            </div>
            <div className="text-lg lg:text-xl text-gray-400 mt-1 uppercase tracking-wider">
                {dateStr}
            </div>
        </div>
    );
}