'use client';

import SnowOverlay from './SnowOverlay';
import AutumnLeavesOverlay from './AutumnLeavesOverlay';
import { DisplayAnimationKey } from '@/shared/config/displayAnimations';
import WeatherOverlay from "@/features/display/presentation/components/animations/WeatherOverlay";
import ConfettiOverlay from "@/features/display/presentation/components/animations/ConfettiOverlay";

interface Props {
    animationKey: DisplayAnimationKey;
}

const ANIMATION_COMPONENTS: Partial<Record<DisplayAnimationKey, React.ComponentType>> = {
    'snow':     SnowOverlay,
    'autumn':   AutumnLeavesOverlay,
    'confetti': ConfettiOverlay,
    'weather':  WeatherOverlay,
};

export default function AnimationOverlay({ animationKey }: Props) {
    const Component = ANIMATION_COMPONENTS[animationKey];
    if (!Component) return null;
    return <Component />;
}