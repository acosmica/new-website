import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323, Caveat, Bodoni_Moda, Fraunces } from "next/font/google";
import "./globals.css";
import CRTOverlay from "@/components/shared/CRTOverlay";
import PixelCursor from "@/components/shared/PixelCursor";
import Taskbar from "@/components/desktop/Taskbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixel = VT323({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const handwriting = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Fraunces acts as the dreamy-serif fallback behind the self-hosted
// Dreamer font defined in globals.css. Drop a Dreamer.woff2 into
// /public/fonts/ to activate the licensed face.
const dreamerFallback = Fraunces({
  variable: "--font-dreamer-fallback",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "Micaelle Lages — Multimedia Designer",
  description:
    "Portfolio of Micaelle Lages, multimedia designer. Welcome to MicaelleOS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixel.variable} ${handwriting.variable} ${bodoni.variable} ${dreamerFallback.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="relative min-h-full overflow-hidden bg-desktop text-ink"
        suppressHydrationWarning
      >
        {children}
        <Taskbar />
        <CRTOverlay />
        <PixelCursor />
      </body>
    </html>
  );
}
