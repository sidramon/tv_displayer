'use client';

import { useEffect, useRef } from 'react';
import { useWeather } from '@/features/display/application/useWeather';
import { WeatherCode } from '@/shared/utils/types/weather.types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Cloud {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    opacity: number;
}

interface Raindrop {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
}

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    wind: number;
    opacity: number;
    swayAngle: number;
    swaySpeed: number;
}

interface SunRay {
    x: number;
    width: number;
    spread: number;
    opacity: number;
    phase: number;
    phaseSpeed: number;
    speed: number;
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
    const { x, y, width, height, opacity } = cloud;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(200,200,200,0.3)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.ellipse(x, y, width * 0.5, height * 0.5, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width * 0.25, y - height * 0.3, width * 0.35, height * 0.45, 0, 0, Math.PI * 2);
    ctx.ellipse(x - width * 0.2, y - height * 0.15, width * 0.3, height * 0.35, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width * 0.45, y + height * 0.05, width * 0.28, height * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawRain(ctx: CanvasRenderingContext2D, drop: Raindrop) {
    ctx.save();
    ctx.globalAlpha = drop.opacity;
    ctx.strokeStyle = '#a8d4f5';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 1, drop.y + drop.length);
    ctx.stroke();
    ctx.restore();
}

function drawSnow(ctx: CanvasRenderingContext2D, flake: Snowflake) {
    ctx.save();
    ctx.globalAlpha = flake.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawSunRays(ctx: CanvasRenderingContext2D, rays: SunRay[], w: number, h: number) {
    for (const ray of rays) {
        const topLeft  = ray.x - ray.width / 2;
        const topRight = ray.x + ray.width / 2;
        const botLeft  = ray.x - ray.width / 2 - ray.spread;
        const botRight = ray.x + ray.width / 2 + ray.spread;

        const alpha = ray.opacity * (0.6 + 0.4 * Math.sin(ray.phase));
        const grad = ctx.createLinearGradient(ray.x, 0, ray.x, h);
        grad.addColorStop(0,   `rgba(255, 240, 150, ${alpha})`);
        grad.addColorStop(0.5, `rgba(255, 230, 120, ${alpha * 0.3})`);
        grad.addColorStop(1,   `rgba(255, 220, 100, 0)`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(topLeft, 0);
        ctx.lineTo(topRight, 0);
        ctx.lineTo(botRight, h);
        ctx.lineTo(botLeft, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }
}

// ─── Config par météo ─────────────────────────────────────────────────────────

interface SceneConfig {
    clouds: boolean;
    cloudCount: number;
    cloudOpacity: number;
    rain: boolean;
    rainCount: number;
    snow: boolean;
    snowCount: number;
    sun: boolean;
}

function getSceneConfig(code: WeatherCode, isDay: boolean): SceneConfig {
    switch (code) {
        case 'clear':
            return { clouds: false, cloudCount: 0, cloudOpacity: 0, rain: false, rainCount: 0, snow: false, snowCount: 0, sun: isDay };
        case 'cloudy':
            return { clouds: true, cloudCount: 6, cloudOpacity: 0.25, rain: false, rainCount: 0, snow: false, snowCount: 0, sun: false };
        case 'fog':
            return { clouds: true, cloudCount: 10, cloudOpacity: 0.15, rain: false, rainCount: 0, snow: false, snowCount: 0, sun: false };
        case 'rain':
            return { clouds: true, cloudCount: 5, cloudOpacity: 0.2, rain: true, rainCount: 120, snow: false, snowCount: 0, sun: false };
        case 'snow':
            return { clouds: true, cloudCount: 4, cloudOpacity: 0.2, rain: false, rainCount: 0, snow: true, snowCount: 80, sun: false };
        case 'storm':
            return { clouds: true, cloudCount: 8, cloudOpacity: 0.3, rain: true, rainCount: 200, snow: false, snowCount: 0, sun: false };
        default:
            return { clouds: false, cloudCount: 0, cloudOpacity: 0, rain: false, rainCount: 0, snow: false, snowCount: 0, sun: false };
    }
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function WeatherOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { current } = useWeather();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const config = getSceneConfig(current.code, current.isDay);

        // Init clouds
        const clouds: Cloud[] = Array.from({ length: config.cloudCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.35),
            width: Math.random() * 220 + 100,
            height: Math.random() * 60 + 40,
            speed: Math.random() * 0.3 + 0.1,
            opacity: config.cloudOpacity * (Math.random() * 0.5 + 0.7),
        }));

        // Init rain
        const raindrops: Raindrop[] = Array.from({ length: config.rainCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 15 + 8,
            speed: Math.random() * 8 + 10,
            opacity: Math.random() * 0.4 + 0.2,
        }));

        // Init snow
        const snowflakes: Snowflake[] = Array.from({ length: config.snowCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.4,
            wind: Math.random() * 0.4 - 0.2,
            opacity: Math.random() * 0.5 + 0.3,
            swayAngle: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.02 + 0.01,
        }));

        // Init sun rays
        // Init sun rays — remplace l'ancien Array.from sunRays
        const rayCount = 9;
        const sunRays: SunRay[] = Array.from({ length: rayCount }, (_, i) => ({
            x: (canvas.width / rayCount) * i - canvas.width * 0.1,
            width: Math.random() * 50 + 15,
            spread: Math.random() * 400 + 250,
            opacity: Math.random() * 0.10 + 0.04,
            phase: (i / rayCount) * Math.PI * 2,
            phaseSpeed: 0.008 + Math.random() * 0.004,
            speed: 0.4 + Math.random() * 0.3,
        }));

        let animId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (config.sun) {
                drawSunRays(ctx, sunRays, canvas.width, canvas.height);
                for (const ray of sunRays) {
                    ray.phase += ray.phaseSpeed;
                    ray.x += ray.speed;
                    if (ray.x - ray.spread > canvas.width) {
                        ray.x = -ray.spread;
                    }
                }
            }

            if (config.clouds) {
                for (const cloud of clouds) {
                    drawCloud(ctx, cloud);
                    cloud.x += cloud.speed;
                    if (cloud.x - cloud.width > canvas.width) {
                        cloud.x = -cloud.width;
                        cloud.y = Math.random() * (canvas.height * 0.35);
                    }
                }
            }

            if (config.rain) {
                for (const drop of raindrops) {
                    drawRain(ctx, drop);
                    drop.y += drop.speed;
                    drop.x -= 0.5;
                    if (drop.y > canvas.height) {
                        drop.y = -20;
                        drop.x = Math.random() * canvas.width;
                    }
                }
            }

            if (config.snow) {
                for (const flake of snowflakes) {
                    drawSnow(ctx, flake);
                    flake.y += flake.speed;
                    flake.swayAngle += flake.swaySpeed;
                    flake.x += Math.sin(flake.swayAngle) * 0.6 + flake.wind;
                    if (flake.y > canvas.height + 10) {
                        flake.y = -10;
                        flake.x = Math.random() * canvas.width;
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [current?.code, current?.isDay]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-40 pointer-events-none"
        />
    );
}