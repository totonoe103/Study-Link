import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/server";
import { getPlannerStateByUid, savePlannerStateByUid } from "@/lib/schedule/server";
import type { PlannerState } from "@/lib/schedule/state";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });

  try {
    const state = await getPlannerStateByUid(user.uid);
    return NextResponse.json({ state });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("FIREBASE_ADMIN_NOT_CONFIGURED")) {
      return NextResponse.json({ error: "FIREBASE_ADMIN_NOT_CONFIGURED" }, { status: 500 });
    }
    return NextResponse.json({ error: "LOAD_FAILED" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { state?: PlannerState } | null;
  if (!body?.state) {
    return NextResponse.json({ error: "INVALID_STATE" }, { status: 400 });
  }

  try {
    await savePlannerStateByUid(user.uid, body.state);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("FIREBASE_ADMIN_NOT_CONFIGURED")) {
      return NextResponse.json({ error: "FIREBASE_ADMIN_NOT_CONFIGURED" }, { status: 500 });
    }
    return NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 });
  }
}

