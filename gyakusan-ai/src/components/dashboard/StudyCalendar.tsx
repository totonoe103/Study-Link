export default function StudyCalendar({
  minutes,
}: {
  minutes: number[];
}) {
  const cells = minutes.slice(-28);
  const intensities = cells.map((m) => {
    if (m <= 0) return "empty";
    if (m < 30) return "light";
    if (m < 60) return "mid";
    return "high";
  });

  const cellClass = (k: string) => {
    switch (k) {
      case "empty":
        return "bg-slate-900/30 ring-1 ring-slate-800/40";
      case "light":
        return "bg-brand-500/15 ring-1 ring-brand-500/20";
      case "mid":
        return "bg-brand-500/25 ring-1 ring-brand-500/25";
      case "high":
        return "bg-brand-500/35 ring-1 ring-brand-500/30";
      default:
        return "bg-slate-900/30 ring-1 ring-slate-800/40";
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">残りの進捗可視化（デモ）</h2>
          <p className="mt-1 text-sm text-slate-400">
            日を押して日記・振り返りにつなげる設計（この画面は見た目デモ）。
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-1 text-xs font-semibold text-slate-200">
          カレンダー色塗り
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">直近28日</span>
            <span>・</span>
            <span>学習分数に応じて色が変わります</span>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2">
            {cells.map((m, idx) => {
              const k = intensities[idx] ?? "empty";
              return (
                <div
                  key={`${idx}-${m}`}
                  title={`Day ${idx + 1}: ${m}分`}
                  className={[
                    "h-10 rounded-lg transition",
                    cellClass(k),
                    "hover:scale-[1.02] hover:brightness-110",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">凡例</div>
          <div className="mt-3 space-y-3">
            {[
              { label: "未学習", key: "empty" },
              { label: "〜29分", key: "light" },
              { label: "30〜59分", key: "mid" },
              { label: "60分以上", key: "high" },
            ].map((x) => (
              <div key={x.key} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`h-3.5 w-8 rounded bg-brand-500/25 ${cellClass(x.key)}`} />
                  <span className="text-sm font-semibold">{x.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-white/5 p-3 ring-1 ring-slate-800">
            <div className="text-xs text-slate-400">提案（デモ）</div>
            <div className="mt-1 text-sm font-semibold">
              曜日×参考書を固定すると継続率が上がります
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

