// ─────────────────────────────────────────────────────────────
// app/api/sync/route.ts
//
// POST /api/sync
//
// Receives form updates from the Patient browser tab and
// broadcasts them to all Staff View subscribers via Pusher.
//
// Why server-side? Pusher's APP_SECRET must never be exposed
// to the browser, so we route through this API endpoint.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusherServer";
import { PUSHER_CHANNEL, PUSHER_EVENT } from "@/lib/formConfig";
import type { SyncPayload } from "@/types/patient";

export async function POST(req: NextRequest) {
  try {
    const payload: SyncPayload = await req.json();

    await pusherServer.trigger(PUSHER_CHANNEL, PUSHER_EVENT, payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/sync] Failed to broadcast:", error);
    return NextResponse.json({ ok: false, error: "Broadcast failed" }, { status: 500 });
  }
}
