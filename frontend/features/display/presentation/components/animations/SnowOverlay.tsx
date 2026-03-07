'use client';

import { useEffect, useRef } from 'react';

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    wind: number;
    opacity: number;
}

export default function SnowOverlay() {
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
        const flakes: Snowflake[] = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 1,
            speed: Math.random() * 1.5 + 0.5,
            wind: Math.random() * 0.8 - 0.4,
            opacity: Math.random() * 0.6 + 0.3,
        }));

        let animId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const f of flakes) {
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
                ctx.fill();

                f.y += f.speed;
                f.x += f.wind;

                if (f.y > canvas.height + 10) {
                    f.y = -10;
                    f.x = Math.random() * canvas.width;
                }
                if (f.x > canvas.width + 10) f.x = -10;
                if (f.x < -10) f.x = canvas.width + 10;
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