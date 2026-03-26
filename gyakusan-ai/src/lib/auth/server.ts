import { cookies } from "next/headers";

import { verifySessionCookie } from "@/lib/firebase/admin";

export type AuthedUser = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
};

const SESSION_COOKIE_NAME = "session";

export async function getCurrentUser(): Promise<AuthedUser | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await verifySessionCookie(sessionCookie);
    return {
      uid: decoded.uid,
      email: decoded.email ?? undefined,
      displayName: decoded.name ?? undefined,
      photoURL: decoded.picture ?? undefined,
    };
  } catch {
    // 期限切れ/無効/設定なしなどを想定して、認証失敗は「未ログイン扱い」
    return null;
  }
}

export async function requireCurrentUser(): Promise<AuthedUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  return user;
}

