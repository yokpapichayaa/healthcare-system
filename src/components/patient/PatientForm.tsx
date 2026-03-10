"use client";
import { usePatientForm } from "@/hooks/usePatientForm";
import { FORM_SECTIONS }  from "@/lib/formConfig";
import { FormField }      from "@/components/ui/FormField";
import { SuccessScreen }  from "@/components/patient/SuccessScreen";

const SECTION_ICONS: Record<string, string> = {
  person:  "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z",
  contact: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z",
  shield:  "M12 1L3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4z",
};

export function PatientForm() {
  const { form, errors, touched, submitted, handleChange, handleBlur, handleSubmit, handleReset } = usePatientForm();

  if (submitted) return <SuccessScreen onReset={handleReset} />;

  const filledCount = Object.values(form).filter(v => v && String(v).trim()).length;
  const requiredCount = FORM_SECTIONS.flatMap(s => s.fields).filter(f => f.required).length;
  const pct = Math.min(100, Math.round((filledCount / requiredCount) * 100));

  return (
    <div className="space-y-8">

      {/* Progress bar */}
      <div className="rounded-2xl p-4" style={{ background: "#131c2e", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex justify-between mb-2">
          <span className="text-xs text-slate-500">Form Progress</span>
          <span className="text-xs font-semibold" style={{ color: "#00c896" }}>{filledCount} / {requiredCount} required</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #00c896, #0ea5e9)" }} />
        </div>
      </div>

      {/* Sections */}
      {FORM_SECTIONS.map((section) => (
        <section key={section.title}>
          <div className="section-header">
            <div className="section-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#00c896">
                <path d={SECTION_ICONS[section.icon]} />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-200 tracking-widest uppercase">
              {section.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {section.fields.map((field) => (
              <div key={field.key} className={field.half ? "" : "col-span-1 sm:col-span-2"}>
                <FormField
                  field={field}
                  value={form[field.key] ?? ""}
                  error={errors[field.key]}
                  touched={!!touched[field.key]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Actions */}
      <div className="flex gap-3 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button className="btn-ghost" onClick={handleReset} type="button">Clear Form</button>
        <button className="btn-primary" onClick={handleSubmit} type="button">Submit Registration →</button>
      </div>
    </div>
  );
}
