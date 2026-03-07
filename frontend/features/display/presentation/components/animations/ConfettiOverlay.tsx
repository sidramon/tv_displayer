'use client';

import { useEffect, useRef } from 'react';

interface Confetto {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    speedX: number;
    speedY: number;
    opacity: number;
    swayAngle: number;
    swaySpeed: number;
}

const COLORS = [
    '#f43f5e', '#ec4899', '#a855f7', '#6366f1',
    '#3b82f6', '#06b6d4', '#10b981', '#f59e0b',
    '#ef4444', '#84cc16',
];

export default function ConfettiOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const count = 120;
        const confetti: Confetto[] = Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight - window.innerHeight,
            width: Math.random() * 10 + 5,
            height: Math.random() * 5 + 3,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 + 1.5,
            opacity: Math.random() * 0.6 + 0.4,
            swayAngle: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.03 + 0.01,
        }));

        let animId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const c of confetti) {
                ctx.save();
                ctx.globalAlpha = c.opacity;
                ctx.translate(c.x, c.y);
                ctx.rotate((c.rotation * Math.PI) / 180);
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
                ctx.restore();

                c.y += c.speedY;
                c.swayAngle += c.swaySpeed;
                c.x += Math.sin(c.swayAngle) * 1.2 + c.speedX;
                c.rotation += c.rotationSpeed;

                if (c.y > canvas.height + 20) {
                    c.y = -20;
                    c.x = Math.random() * canvas.width;
                    c.opacity = Math.random() * 0.6 + 0.4;
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-40 pointer-events-none"
        />
    );
}