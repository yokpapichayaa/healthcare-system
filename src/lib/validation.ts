// ─────────────────────────────────────────────────────────────
// lib/validation.ts
//
// Pure validation functions with no side-effects.
// Returns a Record<fieldKey, errorMessage> — empty means valid.
// ─────────────────────────────────────────────────────────────

import type { PatientFormData } from "@/types/patient";
import { REQUIRED_FIELD_KEYS } from "@/lib/formConfig";

type ValidationErrors = Partial<Record<keyof PatientFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

/**
 * Validates the full form data object.
 * @returns An object where each key is a field with an error message.
 *          An empty object means the form is valid and ready to submit.
 */
export function validateForm(form: Partial<PatientFormData>): ValidationErrors {
  const errors: ValidationErrors = {};

  // 1. Required fields
  for (const key of REQUIRED_FIELD_KEYS) {
    const value = form[key as keyof PatientFormData];
    if (!value || String(value).trim() === "") {
      errors[key as keyof PatientFormData] = "This field is required";
    }
  }

  // 2. Email format
  if (form.email && !EMAIL_REGEX.test(form.email)) {
    errors.email = "Enter a valid email address";
  }

  // 3. Phone format
  if (form.phone && !PHONE_REGEX.test(form.phone)) {
    errors.phone = "Enter a valid phone number (7–15 digits)";
  }

  return errors;
}

/** Convenience helper — returns true when validateForm returns no errors */
export function isFormValid(form: Partial<PatientFormData>): boolean {
  return Object.keys(validateForm(form)).length === 0;
}
