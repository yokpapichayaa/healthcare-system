// ─────────────────────────────────────────────────────────────
// app/staff/page.tsx
//
// /staff — Staff monitoring page.
// Renders the <StaffView> which subscribes to real-time events.
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { StaffView } from "@/components/staff/StaffView";

export const metadata: Metadata = {
  title: "Staff Monitor | Agnos",
};

export default function StaffPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-16">
      {/* Page heading */}
      <div className="mb-8 sm:mb-10">
        <p className="text-brand text-xs font-semibold tracking-widest uppercase mb-2">
          Staff Portal
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-100 leading-tight">
          Live Patient Monitor
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Updates appear here in real-time as the patient fills the form.
        </p>
      </div>

      <StaffView />
    </div>
  );
}
