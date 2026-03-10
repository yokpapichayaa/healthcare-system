"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/patient", label: "Patient Form", short: "Patient", icon: "👤" },
  { href: "/staff",   label: "Staff View",   short: "Staff",   icon: "🖥" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50" style={{
      background: "rgba(10,15,26,0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <nav className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/patient" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
            background: "linear-gradient(135deg, #00c896, #0ea5e9)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="hidden xs:block">
            <div className="text-sm font-bold text-slate-100 leading-none" style={{ fontFamily: "var(--font-sora)" }}>
              Health Care
            </div>
            <div className="text-[9px] text-slate-600 tracking-widest uppercase leading-none mt-0.5">
              Management System
            </div>
          </div>
        </Link>

        {/* Tabs */}
        <div className="flex rounded-xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)" }}>
          {NAV.map(({ href, label, short, icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`tab-btn rounded-lg font-semibold no-underline transition-all duration-200 px-3 py-1.5 text-xs sm:text-sm ${active ? "" : "text-slate-500 hover:text-slate-300"}`}
                style={{
                  background: active ? "linear-gradient(135deg, #00c896, #0ea5e9)" : "transparent",
                  color: active ? "white" : undefined,
                  boxShadow: active ? "0 2px 12px rgba(0,200,150,0.3)" : "none",
                }}>
                <span className="sm:hidden">{icon}</span>
                <span className="hidden sm:inline md:hidden">{icon} {short}</span>
                <span className="hidden md:inline">{icon} {label}</span>
              </Link>
            );
          })}
        </div>

        {/* Live dot */}
        <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0" style={{ color: "#00c896" }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#00c896", animation: "glowPulse 1.5s ease infinite" }} />
          <span className="hidden sm:inline">Live</span>
        </div>
      </nav>
    </header>
  );
}
