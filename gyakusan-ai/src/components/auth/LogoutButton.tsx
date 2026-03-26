"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { getClientAuth } from "@/lib/firebase/client";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function onLogout() {
    // Cookieを先に捨ててもいいが、破棄→リダイレクトの順で揃える
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);

    try {
      const auth = getClientAuth();
      await signOut(auth);
    } catch {
      // Firebase設定が未完成でもログアウトは続行する
    }

    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={() => void onLogout()}
      className={
        className ??
        "rounded-xl border border-slate-800 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
      }
    >
      ログアウト
    </button>
  );
}

