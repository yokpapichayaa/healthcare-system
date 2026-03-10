// ─────────────────────────────────────────────────────────────
// hooks/useRealtimeSync.ts
//
// Custom hook used by the Staff View to subscribe to real-time
// patient-form updates via Pusher Channels (WebSocket).
//
// Usage:
//   const { data, status } = useRealtimeSync();
// ─────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useRef } from "react";
import { getPusherClient } from "@/lib/pusherClient";
import { PUSHER_CHANNEL, PUSHER_EVENT } from "@/lib/formConfig";
import type { PatientFormData, SyncPayload, PatientSession } from "@/types/patient";

// Remove a session after 2 minutes of no activity
const STALE_MS = 2 * 60 * 1000;

export function useRealtimeSync() {
  const [patients, setPatients] = useState<Map<string, PatientSession>>(new Map());
  // Track per-session highlight timers so we can clear them independently
  const highlightTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // Track stale-removal timers
  const staleTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const pusher  = getPusherClient();
    const channel = pusher.subscribe(PUSHER_CHANNEL);

    channel.bind(PUSHER_EVENT, (payload: SyncPayload) => {
      const { sessionId, data, status } = payload;

      setPatients((prev) => {
        const next = new Map(prev);
        const existing = next.get(sessionId);

        // Diff to find which keys changed (for animation)
        const updatedKeys = new Set<keyof PatientFormData>(
          (Object.keys(data) as (keyof PatientFormData)[]).filter(
            (k) => data[k] !== existing?.data[k]
          )
        );

        next.set(sessionId, {
          sessionId,
          data,
          status,
          updatedKeys,
          lastSeen: Date.now(),
        });

        return next;
      });

      // Clear highlight for this session after 900ms
      const ht = highlightTimers.current;
      if (ht.get(sessionId)) clearTimeout(ht.get(sessionId)!);
      ht.set(sessionId, setTimeout(() => {
        setPatients((prev) => {
          const next = new Map(prev);
          const session = next.get(sessionId);
          if (session) next.set(sessionId, { ...session, updatedKeys: new Set() });
          return next;
        });
      }, 900));

      // Schedule stale removal — reset on every new event from this session
      const st = staleTimers.current;
      if (st.get(sessionId)) clearTimeout(st.get(sessionId)!);
      st.set(sessionId, setTimeout(() => {
        setPatients((prev) => {
          const next = new Map(prev);
          next.delete(sessionId);
          return next;
        });
      }, STALE_MS));
    });

    return () => {
      channel.unbind(PUSHER_EVENT);
      pusher.unsubscribe(PUSHER_CHANNEL);
      // Clear all timers on unmount
      highlightTimers.current.forEach(clearTimeout);
      staleTimers.current.forEach(clearTimeout);
    };
  }, []);

  return { patients };
}
