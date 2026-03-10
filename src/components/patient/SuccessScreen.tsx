// ─────────────────────────────────────────────────────────────
// components/patient/SuccessScreen.tsx
//
// Shown to the patient after a successful form submission.
// Separated from <PatientForm> to keep each file focused.
// ─────────────────────────────────────────────────────────────

interface SuccessScreenProps {
  onReset: () => void;
}

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] gap-6 animate-fade-up">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2"
        style={{
          background: "rgba(56,189,140,0.12)",
          borderColor: "rgba(56,189,140,0.4)",
        }}
      >
        ✓
      </div>

      {/* Message */}
      <div className="text-center">
        <h2 className="font-serif text-3xl text-brand mb-2">Registration Complete</h2>
        <p className="text-slate-500 text-sm">
          Your information has been sent to the medical staff.
        </p>
      </div>

      <button className="btn-primary" onClick={onReset} type="button">
        Register Another Patient
      </button>
    </div>
  );
}
