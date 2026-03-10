// ─────────────────────────────────────────────────────────────
// app/patient/page.tsx
//
// /patient — Patient-facing registration page.
// Lightweight: just imports and renders the <PatientForm>.
// All logic lives in usePatientForm() and sub-components.
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { PatientForm } from "@/components/patient/PatientForm";

export const metadata: Metadata = {
  title: "Patient Registration | Agnos",
};

export default function PatientPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-16">
      {/* Page heading */}
      <div className="mb-8 sm:mb-10">
        <p className="text-brand text-xs font-semibold tracking-widest uppercase mb-2">
          Patient Portal
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-100 leading-tight mb-2">
          Patient Registration
        </h1>
        <p className="text-slate-500 text-sm">
          Fields marked <span className="text-red-400">*</span> are required.
        </p>
      </div>

      <PatientForm />
    </div>
  );
}
