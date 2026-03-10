// ─────────────────────────────────────────────────────────────
// lib/pusherClient.ts
//
// Browser-side Pusher.js instance.
// Imported only by client components (hooks/useRealtimeSync.ts).
// ─────────────────────────────────────────────────────────────

import PusherJS from "pusher-js";

let pusherClient: PusherJS | null = null;

export function getPusherClient(): PusherJS {
  if (pusherClient) return pusherClient;

  pusherClient = new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });

  return pusherClient;
}
