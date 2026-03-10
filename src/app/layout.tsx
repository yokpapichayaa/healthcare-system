import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Sora } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const sora   = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = { title: "Health Care | Patient System" };

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sora.variable}`}>
      <body style={{ margin: 0, background: "#0a0f1a", fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <div aria-hidden className="fixed inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,200,150,0.08), transparent)",
          zIndex: 0,
        }} />
        <Navbar />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
