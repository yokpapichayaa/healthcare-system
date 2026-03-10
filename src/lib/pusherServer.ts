// ─────────────────────────────────────────────────────────────
// lib/pusherServer.ts
//
// Server-side Pusher instance (Node.js only).
// Uses a module-level singleton so we don't re-initialise on
// every API call in development (hot-reload safe).
// ─────────────────────────────────────────────────────────────

import Pusher from "pusher";

declare global {
  // eslint-disable-next-line no-var
  var _pusherServer: Pusher | undefined;
}

function createPusherServer(): Pusher {
  const required = {
    appId:   process.env.PUSHER_APP_ID,
    key:     process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret:  process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  };

  for (const [name, value] of Object.entries(required)) {
    if (!value) throw new Error(`Missing Pusher env variable: ${name}`);
  }

  return new Pusher({
    appId:   required.appId!,
    key:     required.key!,
    secret:  required.secret!,
    cluster: required.cluster!,
    useTLS:  true,
  });
}

// Re-use singleton across hot reloads in development
export const pusherServer: Pusher =
  globalThis._pusherServer ?? (globalThis._pusherServer = createPusherServer());
