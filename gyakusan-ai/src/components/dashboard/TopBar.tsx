export default function TopBar({
  name,
  plan,
}: {
  name: string;
  plan: string;
}) {
  const planTone =
    plan.includes("Plus") || plan.includes("中級")
      ? "bg-brand-500/15 text-brand-500 border-brand-500/30"
      : "bg-white/5 text-slate-200 border-slate-700";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/70 px-4 py-3 backdrop-blur lg:px-6">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/5 ring-1 ring-slate-800/60" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">こんにちは、{name}</p>
            <p className="truncate text-xs text-slate-400">
              逆算スケジュールをアップデート
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${planTone}`}>
          {plan}
        </span>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-9 w-9 rounded-full bg-white/5 ring-1 ring-slate-800/70" />
          <div className="text-sm font-semibold">学習中</div>
        </div>
      </div>
    </header>
  );
}

