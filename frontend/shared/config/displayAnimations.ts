export const DISPLAY_ANIMATIONS = {
    'none':      { labelFr: 'Aucune',              labelEn: 'None',             icon: '—'  },
    'snow':      { labelFr: 'Flocons de neige',    labelEn: 'Snowfall',         icon: '❄️' },
    'autumn':    { labelFr: 'Feuilles d\'automne', labelEn: 'Autumn leaves',    icon: '🍂' },
    'confetti':  { labelFr: 'Confettis',           labelEn: 'Confetti',         icon: '🎉' },
    'weather':   { labelFr: 'Météo animée',        labelEn: 'Animated weather', icon: '🌤️' },
} as const;

export type DisplayAnimationKey = keyof typeof DISPLAY_ANIMATIONS;