export default function RankingsTable({
  label,
  top,
}: {
  label: string;
  top: Array<{ name: string; minutes: number }>;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">ランキング（デモ）</h2>
          <p className="mt-1 text-sm text-slate-400">競い合いで“サボり”を減らす。</p>
        </div>
        <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
          {label}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/30">
        <div className="grid grid-cols-[64px_1fr_120px] gap-3 border-b border-slate-800 px-4 py-3 text-xs font-semibold text-slate-400">
          <div>順位</div>
          <div>ユーザー</div>
          <div className="text-right">勉強時間</div>
        </div>

        <div className="divide-y divide-slate-800">
          {top.map((x, idx) => (
            <div
              key={x.name}
              className="grid grid-cols-[64px_1fr_120px] gap-3 px-4 py-3 items-center"
            >
              <div className="text-sm font-bold text-slate-200">
                #{idx + 1}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {x.name}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  {idx === 0 ? "首位" : idx === 1 ? "追撃中" : "継続"}
                </div>
              </div>
              <div className="text-right text-sm font-semibold text-slate-100">
                {x.minutes}分
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-white/5 p-4 ring-1 ring-slate-800">
        <div className="text-xs text-slate-400">Next（デモ）</div>
        <div className="mt-1 text-sm font-semibold">
          チーム対抗戦：5人1組で総学習時間をバトル
        </div>
      </div>
    </section>
  );
}

