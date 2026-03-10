// ─────────────────────────────────────────────────────────────
// hooks/usePatientForm.ts
//
// Encapsulates all form state, validation, and the side-effect
// of broadcasting updates to the server (→ Pusher → Staff View).
//
// Separating this logic from the UI component means:
//   • The component stays simple and readable
//   • This hook can be unit-tested independently
// ─────────────────────────────────────────────────────────────

"use client";

import { useState, useRef, useCallback } from "react";
import { validateForm } from "@/lib/validation";
import { ALL_FIELDS } from "@/lib/formConfig";
import type { PatientFormData, PatientStatus } from "@/types/patient";

const INACTIVITY_MS = 6_000;

interface UsePatientFormReturn {
  form: Partial<PatientFormData>;
  errors: Partial<Record<keyof PatientFormData, string>>;
  touched: Partial<Record<keyof PatientFormData, boolean>>;
  submitted: boolean;
  handleChange: (key: keyof PatientFormData, value: string) => void;
  handleBlur: (key: keyof PatientFormData) => void;
  handleSubmit: () => void;
  handleReset: () => void;
}

async function broadcastUpdate(
  sessionId: string,
  data: Partial<PatientFormData>,
  status: PatientStatus
): Promise<void> {
  await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, data, status }),
  });
}

export function usePatientForm(): UsePatientFormReturn {
  // Stable unique ID — persists across tab switches via sessionStorage
  const sessionId = useRef<string>(
    typeof window !== "undefined"
      ? (sessionStorage.getItem("patient-session-id") ?? (() => {
          const id = crypto.randomUUID();
          sessionStorage.setItem("patient-session-id", id);
          return id;
        })())
      : ""
  );

  const [form,      setForm]      = useState<Partial<PatientFormData>>({});
  const [errors,    setErrors]    = useState<Partial<Record<keyof PatientFormData, string>>>({});
  const [touched,   setTouched]   = useState<Partial<Record<keyof PatientFormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const inactiveTimer             = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactiveTimer = useCallback((data: Partial<PatientFormData>) => {
    if (inactiveTimer.current) clearTimeout(inactiveTimer.current);
    inactiveTimer.current = setTimeout(() => {
      broadcastUpdate(sessionId.current, data, "inactive");
    }, INACTIVITY_MS);
  }, []);

  const handleChange = useCallback(
    (key: keyof PatientFormData, value: string) => {
      setForm((prev) => {
        const updated = { ...prev, [key]: value };
        broadcastUpdate(sessionId.current, updated, "filling");
        resetInactiveTimer(updated);
        return updated;
      });

      setTouched((prev) => {
        if (prev[key]) {
          setErrors(validateForm({ ...form, [key]: value }));
        }
        return prev;
      });
    },
    [form, resetInactiveTimer]
  );

  const handleBlur = useCallback(
    (key: keyof PatientFormData) => {
      setTouched((prev) => ({ ...prev, [key]: true }));
      setErrors(validateForm(form));
    },
    [form]
  );

  const handleSubmit = useCallback(() => {
    const allTouched = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, true])) as Record<
      keyof PatientFormData,
      boolean
    >;
    setTouched(allTouched);

    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (inactiveTimer.current) clearTimeout(inactiveTimer.current);
    setSubmitted(true);
    broadcastUpdate(sessionId.current, form, "submitted");
  }, [form]);

  const handleReset = useCallback(() => {
    setForm({});
    setErrors({});
    setTouched({});
    setSubmitted(false);
    broadcastUpdate(sessionId.current, {}, "inactive");
  }, []);

  return { form, errors, touched, submitted, handleChange, handleBlur, handleSubmit, handleReset };
}
