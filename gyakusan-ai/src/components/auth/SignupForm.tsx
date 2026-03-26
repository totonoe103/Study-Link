"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { getClientAuth } from "@/lib/firebase/client";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const auth = getClientAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const idToken = await userCredential.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "SESSION_CREATE_FAILED");
      }

      router.push(next);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "SIGNUP_FAILED (unknown error)",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <h1 className="text-xl font-bold">新規登録</h1>
      <p className="mt-1 text-sm text-slate-400">
        Firebase Authでアカウントを作成します。
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-200">メール</span>
          <input
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm outline-none focus:border-brand-500"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@example.com"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-200">パスワード</span>
          <input
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm outline-none focus:border-brand-500"
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <button
          className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-600 disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "処理中..." : "登録"}
        </button>

        <button
          className="rounded-xl border border-slate-800 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          type="button"
          onClick={() => router.push("/login")}
        >
          ログインに戻る
        </button>
      </form>
    </div>
  );
}

