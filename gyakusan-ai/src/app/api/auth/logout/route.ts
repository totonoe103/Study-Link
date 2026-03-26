import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}

