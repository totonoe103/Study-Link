"use client";

import { useEffect, useMemo, useState } from "react";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function FocusPlayerCard({
  title,
  durationLabel,
}: {
  title: string;
  durationLabel: string;
}) {
  const [mode, setMode] = useState<"idle" | "playing">("idle");
  const totalSeconds = useMemo(() => {
    // durationLabel like "12:48"
    const m = durationLabel.split(":").map((x) => Number(x));
    if (m.length !== 2 || Number.isNaN(m[0]) || Number.isNaN(m[1])) return 12 * 60 + 48;
    return m[0] * 60 + m[1];
  }, [durationLabel]);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (mode !== "playing") return;
    const t = setInterval(() => setElapsed((v) => Math.min(totalSeconds, v + 1)), 1000);
    return () => clearInterval(t);
  }, [mode, totalSeconds]);

  useEffect(() => {
    if (elapsed >= totalSeconds) setMode("idle");
  }, [elapsed, totalSeconds]);

  const remaining = Math.max(0, totalSeconds - elapsed);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">集中動画プレイヤー（デモ）</h2>
          <p className="mt-1 text-sm text-slate-400">
            関連動画・おすすめを出さない設計で、勉強から脱線させません。
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-1 text-xs font-semibold text-slate-200">
          誘惑ブロック
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-black/40">
            <div className="aspect-video bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="text-sm font-semibold">{title}</div>
              <div className="mt-1 text-xs text-slate-300">
                動画は「集中モード中のみ」UIに表示（おすすめなし）。
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-slate-800">
                  合計 {durationLabel}
                </span>
                {mode === "playing" ? (
                  <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500 ring-1 ring-brand-500/30">
                    残り {formatTime(remaining)}
                  </span>
                ) : null}
              </div>
            </div>

            {mode === "playing" ? (
              <div className="absolute inset-0 bg-slate-950/10" aria-hidden="true" />
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">操作</div>
          <div className="mt-2 flex gap-2">
            {mode === "idle" ? (
              <button
                onClick={() => {
                  setElapsed(0);
                  setMode("playing");
                }}
                className="flex-1 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-600"
              >
                集中モードで再生
              </button>
            ) : (
              <button
                onClick={() => setMode("idle")}
                className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold ring-1 ring-slate-800 transition hover:bg-white/10"
              >
                停止（デモ）
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-slate-800">
              <div className="text-xs text-slate-400">次のおすすめ</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                なし（脱線防止）
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-slate-800">
              <div className="text-xs text-slate-400">終わったら</div>
              <div className="mt-1 text-sm font-semibold">
                今日のAIテストへ
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

