// ─────────────────────────────────────────────────────────────
// components/staff/StaffFieldGrid.tsx
//
// Renders one section of patient fields for the Staff View.
// Each card highlights when its value updates in real-time.
// ─────────────────────────────────────────────────────────────

import type { FormSection, PatientFormData } from "@/types/patient";

interface StaffFieldGridProps {
  section: FormSection;
  data: Partial<PatientFormData>;
  updatedKeys: Set<keyof PatientFormData>;
}

export function StaffFieldGrid({ section, data, updatedKeys }: StaffFieldGridProps) {
  return (
    <section>
      {/* Section header */}
      <div className="section-divider py-3">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-600">
          {section.title}
        </h2>
      </div>

      {/* Field cards — 1 col mobile, 2 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.fields.map((field) => {
          const val     = data[field.key];
          const hasFilled = val && String(val).trim() !== "";
          const isUpdated = updatedKeys.has(field.key);

          return (
            <div
              key={field.key}
              className={[
                "staff-field",
                hasFilled ? "filled" : "",
                isUpdated  ? "updated" : "",
                field.half ? "" : "col-span-1 sm:col-span-2",
              ].join(" ")}
            >
              {/* Field label */}
              <div className="text-[10px] font-medium text-slate-600 tracking-widest uppercase mb-1.5">
                {field.label}
                {!field.required && (
                  <span className="text-slate-800 ml-1.5 tracking-normal normal-case">opt.</span>
                )}
              </div>

              {/* Field value */}
              <div
                className="text-sm transition-all duration-300"
                style={{
                  color:      hasFilled ? "#e8edf5" : "#1e2d45",
                  fontStyle:  hasFilled ? "normal"  : "italic",
                  fontWeight: hasFilled ? 400        : 300,
                  animation:  isUpdated ? "slideIn 0.25s ease" : "none",
                }}
              >
                {hasFilled ? String(val) : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
