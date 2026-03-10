"use client";
import { useState }          from "react";
import { useRealtimeSync }   from "@/hooks/useRealtimeSync";
import { FORM_SECTIONS, ALL_FIELDS } from "@/lib/formConfig";
import { StaffFieldGrid }    from "@/components/staff/StaffFieldGrid";
import type { PatientSession, PatientStatus } from "@/types/patient";

const STATUS_CFG: Record<PatientStatus, { label: string; color: string; bg: string; border: string }> = {
  filling:   { label: "Filling In", color: "#f59e0b", bg: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(15,22,36,0.95))", border: "rgba(245,158,11,0.25)" },
  inactive:  { label: "Waiting",    color: "#6b7280", bg: "#131c2e",                                                               border: "rgba(255,255,255,0.07)" },
  submitted: { label: "Submitted",  color: "#10b981", bg: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(15,22,36,0.95))",  border: "rgba(16,185,129,0.2)"   },
};

function Ring({ pct, color }: { pct: number; color: string }) {
  const R = 18; const circ = 2 * Math.PI * R;
  return (
    <svg width="48" height="48" className="-rotate-90 shrink-0">
      <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
      <circle cx="24" cy="24" r={R} fill="none" stroke={color} strokeWidth="3.5"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex w-2.5 h-2.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ background: color }} />
      <span className="relative inline-flex rounded-full w-2.5 h-2.5" style={{ background: color }} />
    </span>
  );
}

function PatientCard({ session, num }: { session: PatientSession; num: number }) {
  const [open, setOpen] = useState(true);
  const { data, status, updatedKeys } = session;
  const cfg = STATUS_CFG[status];
  const filled = ALL_FIELDS.filter(({ key }) => data[key]?.trim?.()).length;
  const pct    = Math.round((filled / ALL_FIELDS.length) * 100);
  const firstName = data.firstName ?? "";
  const lastName  = data.lastName  ?? "";

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ border: `1px solid ${cfg.border}`, background: cfg.bg,
        boxShadow: status === "filling" ? "0 4px 32px rgba(245,158,11,0.07)" : "none" }}>

      {/* Header */}
      <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-center gap-4 px-5 py-4">
        <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
          style={{ background: `${cfg.color}18`, border: `1.5px solid ${cfg.color}35`, color: cfg.color,
            fontFamily: "var(--font-sora)" }}>
          {num}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {status === "filling" ? <PulseDot color={cfg.color} /> :
              <span className="w-2 h-2 rounded-full shrink-0 inline-block" style={{ background: cfg.color }} />}
            <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          <div className="text-sm text-slate-500 truncate">
            Patient {num}
            {(firstName || lastName) && (
              <span className="text-slate-200 font-medium ml-2">· {firstName} {lastName}</span>
            )}
          </div>
        </div>

        <div className="relative shrink-0">
          <Ring pct={pct} color={cfg.color} />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: cfg.color }}>
            {pct}%
          </div>
        </div>

        <span className="text-slate-700 text-[10px] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </button>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}aa, ${cfg.color})` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-[11px] text-slate-700">
          <span>{filled} of {ALL_FIELDS.length} fields</span>
          <span>{ALL_FIELDS.length - filled} remaining</span>
        </div>
      </div>

      {/* Fields */}
      {open && (
        <div className="border-t px-5 py-4 space-y-5" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {FORM_SECTIONS.map(s => (
            <StaffFieldGrid key={s.title} section={s} data={data} updatedKeys={updatedKeys} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StaffView() {
  const { patients } = useRealtimeSync();
  const ORDER: Record<PatientStatus, number> = { filling: 0, inactive: 1, submitted: 2 };
  const sorted = Array.from(patients.values()).sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const activeCt    = sorted.filter(p => p.status === "filling").length;
  const submittedCt = sorted.filter(p => p.status === "submitted").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Connected",  value: sorted.length, color: "#f0f4f8" },
          { label: "Filling In", value: activeCt,       color: "#f59e0b" },
          { label: "Submitted",  value: submittedCt,    color: "#10b981" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl py-3 text-center"
            style={{ background: "#131c2e", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-2xl font-bold" style={{ color, fontFamily: "var(--font-sora)" }}>{value}</div>
            <div className="text-[11px] mt-1 uppercase tracking-widest text-slate-600">{label}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((s, i) => <PatientCard key={s.sessionId} session={s} num={i + 1} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-700">
          <div className="text-4xl mb-4 opacity-30">◌</div>
          <p className="text-sm">Waiting for patients to start the form…</p>
          <p className="text-xs mt-2 text-slate-800">Cards appear automatically when a patient opens the form</p>
        </div>
      )}

      {sorted.length > 0 && (
        <p className="text-center text-[11px] text-slate-800">
          Cards auto-remove after 2 minutes of inactivity · Click to expand / collapse
        </p>
      )}
    </div>
  );
}
