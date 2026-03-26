export default function ReferenceBookRouteCard({
  currentBook,
  currentRange,
  nextBook,
  aiTestStatus,
}: {
  currentBook: string;
  currentRange: string;
  nextBook: string;
  aiTestStatus: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">参考書ルート & AIテスト</h2>
          <p className="mt-1 text-sm text-slate-400">
            “わかったつもり”を潰すために、写真→確認テストへ。
          </p>
        </div>
        <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
          独自機能
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">いまの参考書</div>
          <div className="mt-1 text-sm font-semibold">{currentBook}</div>
          <div className="mt-2 rounded-lg bg-white/5 p-3">
            <div className="text-xs text-slate-400">担当範囲</div>
            <div className="mt-1 text-sm font-semibold">{currentRange}</div>
          </div>

          <div className="mt-3">
            <button className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-600">
              この範囲をテスト作成（デモ）
            </button>
            <div className="mt-2 text-xs text-slate-400">
              写真はここにアップロード（実装は次フェーズ）。
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">次の参考書</div>
          <div className="mt-1 text-sm font-semibold">{nextBook}</div>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">AIテスト状態</div>
              <span className="rounded-full border border-slate-700 bg-slate-950/30 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                {aiTestStatus}
              </span>
            </div>

            <div className="mt-3 rounded-lg bg-white/5 p-3">
              <div className="text-xs text-slate-400">テスト方針</div>
              <div className="mt-1 text-sm font-semibold">
                出題→採点→“穴”を次回タスクへ反映
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Plus/High-end では難所の自動修正まで行います（デモ）。
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

