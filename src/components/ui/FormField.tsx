"use client";
import { useState } from "react";
import type { FieldConfig, PatientFormData } from "@/types/patient";

interface FormFieldProps {
  field:    FieldConfig;
  value:    string;
  error?:   string;
  touched?: boolean;
  onChange: (key: keyof PatientFormData, value: string) => void;
  onBlur:   (key: keyof PatientFormData) => void;
}

export function FormField({ field, value, error, touched, onChange, onBlur }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const showError = touched && !!error;
  const hasVal    = value.trim() !== "";
  const float     = focused || hasVal;

  const labelClass = ["hc-label", float ? "floating" : "", focused ? "focused" : "", showError ? "!text-red-400" : ""].join(" ");
  const inputClass = ["hc-input", showError ? "error" : "", field.type === "select" ? "is-select" : ""].join(" ");

  const shared = {
    id:      field.key,
    value,
    onFocus: () => setFocused(true),
    onBlur:  () => { setFocused(false); onBlur(field.key); },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange(field.key, e.target.value),
  };

  return (
    <div className="hc-field">
      <label htmlFor={field.key} className={labelClass}>
        {field.label}
        {field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {field.type === "select" ? (
        <div className="relative">
          <select {...shared} className={inputClass}>
            <option value="">—</option>
            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <span className="absolute right-1 bottom-2.5 text-slate-600 pointer-events-none text-[10px]">▼</span>
        </div>
      ) : field.type === "textarea" ? (
        <textarea {...(shared as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={2} className={inputClass} />
      ) : (
        <input
          {...(shared as React.InputHTMLAttributes<HTMLInputElement>)}
          type={field.type}
          className={[inputClass, field.type === "date" && hasVal ? "has-value" : ""].join(" ")}
          style={{ color: field.type === "date" ? "transparent" : undefined, colorScheme: "dark" }}
        />
      )}

      {focused && !showError && <div className="hc-focus-line" />}
      {!field.required && <span className="hc-opt-badge">opt</span>}

      {showError && (
        <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
