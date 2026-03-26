import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/server";
import { addDays } from "@/lib/date/ymd";
import { computeBackwardSchedule } from "@/lib/schedule/calc";

export default async function HomePage() {
  const user = await getCurrentUser();
  const now = new Date();
  const examDate = addDays(now, 120);
  const startDate = now;
  const todayPlan = computeBackwardSchedule({
    examDate,
    startDate,
    delayDays: 0,
    items: [
      {
        id: "target1900",
        label: "ターゲット1900（数学）",
        unitLabel: "問",
        totalUnits: 1900,
        weightProfile: "basic",
      },
      {
        id: "aokiChartExamples",
        label: "青チャート（例題）",
        unitLabel: "例題",
        totalUnits: 420,
        weightProfile: "standard",
      },
      {
        id: "aokiChartExercises",
        label: "青チャート（章末/演習）",
        unitLabel: "演習",
        totalUnits: 300,
        weightProfile: "practice",
      },
    ],
  });
  const todayTotal = todayPlan.dailyTotal[0] ?? 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-slate-300">逆算スケジュール管理アプリ</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Gyakusan AI
            </h1>
            <p className="mt-3 text-slate-300">
              通信制・浪人生の「挫折させない」計画を、あなたの性格と進捗に合わせて伴走。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-600"
              >
                ダッシュボードへ
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-600"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-white/5 px-5 py-3 font-semibold text-slate-50 transition hover:bg-white/10"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>

          <section className="rounded-2xl border border-sky-300/30 bg-sky-400/10 p-5">
            <div className="text-sm font-semibold text-sky-200">今日のノルマ</div>
            <div className="mt-2 text-4xl font-black tracking-tight text-sky-100">
              {todayTotal}
            </div>
            <div className="mt-1 text-sm text-sky-100/80">
              合計タスク量（問 / 例題 / 演習を統合）
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                開始
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center rounded-xl border border-sky-300/50 bg-white/10 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-white/20"
              >
                スケジュールを見る
              </Link>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-sm text-slate-300">① 逆算</div>
              <div className="mt-2 font-semibold">志望校から逆算</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-sm text-slate-300">② 参考書</div>
              <div className="mt-2 font-semibold">ルート提示 + AIテスト</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-sm text-slate-300">③ コーチ</div>
              <div className="mt-2 font-semibold">性格別メンターモード</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

