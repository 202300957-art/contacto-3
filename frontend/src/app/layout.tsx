import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- Importación de la barra de menú

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Contactos UJMD",
  description: "Sistema de gestión de contactos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"> 
    {/* Cambiamos el idioma a español */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        {/* La barra de menú siempre estará visible en todas las pantallas */}
        <Navbar /> 
        
        {/* Aquí se inyectarán las páginas (Login, Contactos, etc.) */}
        <main className="container mx-auto p-6 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}