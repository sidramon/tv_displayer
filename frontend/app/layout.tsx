// IMPORT SECTION
import type { Metadata } from "next";
import "./global.css";
import React from "react";

// CONFIGURATION SECTION
export const metadata: Metadata = {
    title: "Interface TV - Résidences Pelletier",
    description: "Système d'affichage dynamique",
};

// COMPONENT SECTION
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body className="antialiased overflow-hidden">
        {children}
        </body>
        </html>
    );
}