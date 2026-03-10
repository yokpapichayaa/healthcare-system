// ─────────────────────────────────────────────────────────────
// types/patient.ts
//
// Shared TypeScript types used across the entire application.
// Having types in one place makes refactoring safe and easy.
// ─────────────────────────────────────────────────────────────

/** All fields collected from the patient registration form */
export interface PatientFormData {
  // Personal
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: string;
  nationality: string;

  // Contact
  phone: string;
  email: string;
  address: string;
  language: string;

  // Emergency & other (all optional)
  emergencyName?: string;
  emergencyRelation?: string;
  religion?: string;
}

/** Real-time status of the patient on the form */
export type PatientStatus = "inactive" | "filling" | "submitted";

/** Shape of the Pusher event payload sent over the channel */
export interface SyncPayload {
  sessionId: string;           // unique ID per patient session
  data: Partial<PatientFormData>;
  status: PatientStatus;
}

/** One patient's full state as tracked by the Staff View */
export interface PatientSession {
  sessionId: string;
  data: Partial<PatientFormData>;
  status: PatientStatus;
  updatedKeys: Set<keyof PatientFormData>;
  lastSeen: number;            // Date.now() — used to auto-remove stale sessions
}

/** A single form field descriptor used to build the form dynamically */
export interface FieldConfig {
  key: keyof PatientFormData;
  label: string;
  type: "text" | "email" | "tel" | "date" | "select" | "textarea";
  required: boolean;
  half?: boolean; // renders in half-width column when true
  options?: string[]; // only for type === "select"
  placeholder?: string;
}

/** A logical section grouping related fields together */
export interface FormSection {
  title: string;
  icon: string;
  fields: FieldConfig[];
}
