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

const ACCENT  = "#00c896";
const ACCENT2 = "#0ea5e9";

export function FormField({ field, value, error, touched, onChange, onBlur }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const showError = touched && !!error;
  const hasVal    = value.trim() !== "";
  const float     = focused || hasVal;

  const shared = {
    id:       field.key,
    value,
    onFocus:  () => setFocused(true),
    onBlur:   () => { setFocused(false); onBlur(field.key); },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange(field.key, e.target.value),
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: showError
      ? "2px solid #f87171"
      : focused
        ? `2px solid ${ACCENT}`
        : "1px solid rgba(255,255,255,0.1)",
    borderRadius: 0,
    color: "#f0f4f8",
    padding: "8px 0",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ position: "relative", paddingTop: 22, marginBottom: 8 }}>

      {/* Floating label */}
      <label htmlFor={field.key} style={{
        position: "absolute",
        left: 0,
        top: float ? 0 : 28,
        fontSize: float ? 10 : 14,
        fontWeight: float ? 600 : 400,
        letterSpacing: float ? "0.07em" : "0",
        textTransform: float ? "uppercase" : "none",
        color: showError ? "#f87171" : focused ? ACCENT : float ? "#4a8070" : "#2d4a5a",
        transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}>
        {field.label}
        {field.required && <span style={{ color: "#f87171", marginLeft: 2 }}>*</span>}
      </label>

      {/* Input */}
      {field.type === "select" ? (
        <div style={{ position: "relative" }}>
          <select {...shared} style={{
            ...inputStyle,
            background: "#0a0f1a",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
            paddingRight: 20,
            color: hasVal ? "#f0f4f8" : "transparent",
          }}>
            <option value="" style={{ background: "#0f1624", color: "#6b7280" }}>—</option>
            {field.options?.map(o => (
              <option key={o} value={o} style={{ background: "#0f1624", color: "#f0f4f8" }}>{o}</option>
            ))}
          </select>
          <span style={{
            position: "absolute", right: 2, bottom: 10,
            color: "#4a5568", pointerEvents: "none", fontSize: 10,
          }}>▼</span>
        </div>

      ) : field.type === "textarea" ? (
        <textarea
          {...(shared as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={2}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
        />

      ) : (
        <input
          {...(shared as React.InputHTMLAttributes<HTMLInputElement>)}
          type={field.type}
          className={field.type === "date" && hasVal ? "has-value" : ""}
          style={{
            ...inputStyle,
            color: field.type === "date" ? "transparent" : "#f0f4f8",
            colorScheme: "dark" as React.CSSProperties["colorScheme"],
          }}
        />
      )}

      {/* Shimmer line on focus */}
      {focused && !showError && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2}, ${ACCENT})`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s linear infinite",
          borderRadius: 1,
          pointerEvents: "none",
        }} />
      )}

      {/* opt badge */}
      {!field.required && (
        <span style={{
          position: "absolute", right: 0, top: 0,
          fontSize: 9, color: "#2d4a5a",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>opt</span>
      )}

      {/* Error msg */}
      {showError && (
        <p style={{ color: "#f87171", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
