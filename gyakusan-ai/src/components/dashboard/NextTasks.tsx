export default function NextTasks({
  tasks,
}: {
  tasks: Array<{
    title: string;
    dueLabel: string;
    progressPct: number;
    tag: string;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">次の逆算タスク</h2>
          <p className="mt-1 text-sm text-slate-400">
            “やること”はAIが短く切って出します（誘惑を避けるため）。
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-1 text-xs font-semibold text-slate-200">
            今日の最短ルート
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {tasks.map((t) => (
          <div
            key={t.title}
            className="rounded-xl border border-slate-800 bg-slate-950/30 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{t.title}</div>
                <div className="mt-1 text-xs text-slate-400">{t.dueLabel}</div>
              </div>
              <span className="shrink-0 rounded-full border border-slate-700 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                {t.tag}
              </span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>進捗</span>
                <span>{t.progressPct}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/70">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${Math.max(0, Math.min(100, t.progressPct))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

