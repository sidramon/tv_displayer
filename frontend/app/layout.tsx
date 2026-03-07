import type { Metadata } from "next";
import "./global.css";
import React from "react";
import { locales, Locale } from "@/shared/i18n";
import 'leaflet/dist/leaflet.css';
import {LocaleProvider} from "@/shared/i18n/LocaleContext";
import {ToastProvider} from "@/shared/context/ToastContext";

export async function generateMetadata(): Promise<Metadata> {
    const locale: Locale = 'fr';
    const t = locales[locale];

    return {
        title: t.home.subtitle,
        description: t.home.subtitle,
    };
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body>
                <LocaleProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </LocaleProvider>
            </body>
        </html>

    );
}