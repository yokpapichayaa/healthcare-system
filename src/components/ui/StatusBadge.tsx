// ─────────────────────────────────────────────────────────────
// components/ui/StatusBadge.tsx
//
// Displays the patient's current status (inactive / filling /
// submitted) with an animated dot, label, and SVG progress ring.
// Used exclusively by <StaffView>.
// ─────────────────────────────────────────────────────────────

import type { PatientStatus } from "@/types/patient";

const STATUS_CONFIG: Record<PatientStatus, { label: string; color: string; description: string }> = {
  inactive:  { label: "Waiting",     color: "#5a7090", description: "Awaiting patient activity" },
  filling:   { label: "Filling In",  color: "#f59e0b", description: "Patient is actively entering data" },
  submitted: { label: "Submitted",   color: "#38bd8c", description: "Patient has completed registration" },
};

interface StatusBadgeProps {
  status: PatientStatus;
  filledCount: number;
  totalCount: number;
}

/** Animated blinking dots shown while status === "filling" */
function DotLoader() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-dot-blink inline-block"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}

export function StatusBadge({ status, filledCount, totalCount }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const pct = Math.round((filledCount / totalCount) * 100);

  // SVG ring geometry
  const R = 22;
  const circumference = 2 * Math.PI * R;
  const dash = circumference * (1 - pct / 100);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl px-5 py-4 mb-6 border transition-all duration-400 gap-4"
      style={{
        background: `color-mix(in srgb, ${cfg.color} 8%, #080c14)`,
        borderColor: `${cfg.color}33`,
      }}
    >
      {/* Left: dot + label */}
      <div className="flex items-center gap-4">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{
            background: cfg.color,
            boxShadow: `0 0 8px ${cfg.color}`,
            animation: status === "filling" ? "pulse-ring 1.5s infinite" : "none",
          }}
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
            {status === "filling" && <DotLoader />}
          </div>
          <p className="text-xs text-slate-600 mt-0.5">{cfg.description}</p>
        </div>
      </div>

      {/* Right: SVG progress ring */}
      <div className="relative w-14 h-14 shrink-0">
        <svg width="56" height="56" className="-rotate-90">
          <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="28" cy="28" r={R} fill="none"
            stroke={cfg.color} strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={dash}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[13px] font-bold" style={{ color: cfg.color }}>{pct}%</span>
        </div>
      </div>

      {/* Progress bar (full width below) */}
      <style>{`
        .status-progress { display: none; }
      `}</style>
    </div>
  );
}
