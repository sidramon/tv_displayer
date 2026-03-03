// IMPORT SECTION
import DisplayPage from "@/features/display/presentation/DisplayPage";

// INTERFACES SECTION
interface DynamicPageProps {
    params: {
        name: string;
    }
}

// COMPONENT SECTION
export default function DynamicDisplayPage({ params }: DynamicPageProps) {
    return <DisplayPage displayName={params.name} />;
}