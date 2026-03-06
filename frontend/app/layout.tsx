import type { Metadata } from "next";
import "./global.css";
import React from "react";
import { locales, Locale } from "@/shared/i18n";
import {LocaleProvider} from "@/shared/i18n/LocaleContext";

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
        <html lang="fr">
        <body className="antialiased overflow-hidden">
        <LocaleProvider>
            {children}
        </LocaleProvider>
        </body>
        </html>
    );
}