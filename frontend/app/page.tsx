// IMPORT SECTION
'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getConfig } from '@/shared/api/api';
import { GlobalSettings } from '@/shared/utils/types/config.types';

export default function HomePage() {
    const [displays, setDisplays] = useState<string[]>([]);
    const [settings, setSettings] = useState<GlobalSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadConfig() {
            try {
                const data = await getConfig();
                if (data?.config?.displays) {
                    setDisplays(Object.keys(data.config.displays).filter(d => d !== 'default'));
                }
                if (data?.config?.settings) {
                    setSettings(data.config.settings);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des configurations:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadConfig();
    }, []);

    const companyName = settings?.companyName || '';

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white font-sans p-8">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-bold tracking-tight mb-4">{companyName}</h1>
                <p className="text-xl text-slate-400">Système d'affichage dynamique</p>
            </div>

            <div className="flex gap-8 mb-16">
                <Link
                    href="/display"
                    className="flex flex-col items-center justify-center p-8 bg-blue-600 hover:bg-blue-500 transition-colors rounded-2xl shadow-lg w-64 h-64"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-2xl font-bold text-center">Écran Principal<br/><span className="text-sm font-normal opacity-75">(Défaut)</span></span>
                </Link>

                <Link
                    href="/admin"
                    className="flex flex-col items-center justify-center p-8 bg-slate-800 hover:bg-slate-700 transition-colors rounded-2xl shadow-lg border border-slate-700 w-64 h-64"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-2xl font-bold">Administration</span>
                </Link>
            </div>

            {!isLoading && displays.length > 0 && (
                <div className="flex flex-col items-center w-full max-w-3xl animate-fade-in">
                    <div className="w-full h-px bg-slate-800 mb-8"></div>
                    <h2 className="text-xl font-semibold text-slate-400 mb-6">Autres écrans configurés</h2>

                    <div className="flex flex-wrap justify-center gap-4">
                        {displays.sort().map(display => (
                            <Link
                                key={display}
                                href={`/display/${display}`}
                                className="flex items-center gap-3 px-6 py-4 bg-slate-800/50 hover:bg-slate-700 transition-colors rounded-xl border border-slate-700 hover:border-blue-500/50 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium text-lg capitalize">{display}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}