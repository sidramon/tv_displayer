'use client';

import { useEffect, useRef } from 'react';

interface Leaf {
    x: number;
    y: number;
    size: number;
    speed: number;
    wind: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    color: string;
    swayAngle: number;
    swaySpeed: number;
}

const LEAF_COLORS = [
    '#c0392b', // rouge
    '#e74c3c', // rouge vif
    '#e67e22', // orange
    '#f39c12', // orange doré
    '#d35400', // orange foncé
    '#f1c40f', // jaune
    '#8B4513', // brun
    '#a93226', // bordeaux
];

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate((leaf.rotation * Math.PI) / 180);
    ctx.globalAlpha = leaf.opacity;
    ctx.fillStyle = leaf.color;
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.5;

    // Forme de feuille ovale pointue
    ctx.beginPath();
    ctx.moveTo(0, -leaf.size);
    ctx.bezierCurveTo(leaf.size * 0.8, -leaf.size * 0.5, leaf.size * 0.8, leaf.size * 0.5, 0, leaf.size);
    ctx.bezierCurveTo(-leaf.size * 0.8, leaf.size * 0.5, -leaf.size * 0.8, -leaf.size * 0.5, 0, -leaf.size);
    ctx.fill();
    ctx.stroke();

    // Nervure centrale
    ctx.beginPath();
    ctx.moveTo(0, -leaf.size);
    ctx.lineTo(0, leaf.size);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
}

export default function AutumnLeavesOverlay() {
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

        const count = 40;
        const leaves: Leaf[] = Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 10 + 6,
            speed: Math.random() * 1.2 + 0.4,
            wind: Math.random() * 0.6 - 0.3,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            opacity: Math.random() * 0.5 + 0.4,
            color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
            swayAngle: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.02 + 0.01,
        }));

        let animId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const leaf of leaves) {
                drawLeaf(ctx, leaf);

                leaf.y += leaf.speed;
                leaf.swayAngle += leaf.swaySpeed;
                leaf.x += Math.sin(leaf.swayAngle) * 0.8 + leaf.wind;
                leaf.rotation += leaf.rotationSpeed;

                if (leaf.y > canvas.height + 20) {
                    leaf.y = -20;
                    leaf.x = Math.random() * canvas.width;
                }
                if (leaf.x > canvas.width + 20) leaf.x = -20;
                if (leaf.x < -20) leaf.x = canvas.width + 20;
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