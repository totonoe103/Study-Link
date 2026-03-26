function ProgressRing({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const deg = (pct / 100) * 360;
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-16 w-16 shrink-0 rounded-full bg-slate-900/40 ring-1 ring-slate-800"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#22c55e 0deg ${deg}deg, rgba(15,23,42,0.15) ${deg}deg 360deg)`,
          }}
        />
        <div className="absolute inset-2 rounded-full bg-slate-950" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-50">{pct}%</span>
        </div>
      </div>
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-sm font-semibold">目標まであと {Math.max(0, 100 - pct)}%</div>
      </div>
    </div>
  );
}

export default function ProgressSummary({
  todayMinutes,
  weekMinutes,
  streakDays,
  targetCompletionPct,
}: {
  todayMinutes: number;
  weekMinutes: number;
  streakDays: number;
  targetCompletionPct: number;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">今日の勉強</p>
            <div className="mt-2 text-3xl font-bold tracking-tight">
              {todayMinutes}
              <span className="text-base font-semibold text-slate-400">分</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              今日の最短タスクは次のカードへ。
            </p>
          </div>
          <div className="rounded-xl bg-white/5 p-3 ring-1 ring-slate-800">
            <div className="text-xs text-slate-400">連続</div>
            <div className="mt-1 text-lg font-bold">{streakDays}日</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>今週の合計</span>
            <span>{weekMinutes}分</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/70">
            <div className="h-full w-[62%] rounded-full bg-brand-500" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 lg:col-span-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ProgressRing value={targetCompletionPct} label="逆算進捗（達成率）" />
          <div className="flex gap-3 sm:gap-4">
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-slate-800">
              <div className="text-xs text-slate-400">今日のゴール</div>
              <div className="mt-1 text-sm font-semibold">92分を達成</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-slate-800">
              <div className="text-xs text-slate-400">残りの“学ぶ時間”</div>
              <div className="mt-1 text-sm font-semibold">目安：3時間40分</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { k: "誘惑ブロック", v: "有効" },
            { k: "AIテスト", v: "準備完了" },
            { k: "参考書連動", v: "オン" },
          ].map((x) => (
            <div
              key={x.k}
              className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"
            >
              <div className="text-xs text-slate-400">{x.k}</div>
              <div className="mt-1 text-sm font-semibold text-brand-500">{x.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

