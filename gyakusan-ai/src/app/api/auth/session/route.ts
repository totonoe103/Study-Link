import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createSessionCookie, verifyIdToken } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const idToken = body?.idToken as string | undefined;
  const rememberMe = Boolean(body?.rememberMe);

  if (!idToken) {
    return NextResponse.json({ error: "MISSING_ID_TOKEN" }, { status: 400 });
  }

  // Firebase ID tokenの検証（改ざん/期限切れを弾く）
  try {
    await verifyIdToken(idToken);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("FIREBASE_ADMIN_NOT_CONFIGURED")) {
      return NextResponse.json(
        { error: "FIREBASE_ADMIN_NOT_CONFIGURED" },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "INVALID_ID_TOKEN" }, { status: 401 });
  }

  // 5日セッション（rememberMeは将来拡張用）
  const expiresInMs = 5 * 24 * 60 * 60 * 1000;
  let sessionCookie: string;
  try {
    sessionCookie = await createSessionCookie(idToken, expiresInMs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("FIREBASE_ADMIN_NOT_CONFIGURED")) {
      return NextResponse.json(
        { error: "FIREBASE_ADMIN_NOT_CONFIGURED" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "SESSION_CREATE_FAILED" },
      { status: 500 },
    );
  }

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(expiresInMs / 1000),
  });

  return NextResponse.json({ ok: true });
}

