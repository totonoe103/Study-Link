import Link from "next/link";
import type { NavItem } from "@/lib/sampleData";

function Icon({ kind }: { kind: string }) {
  // Minimal inline icons (no dependencies)
  switch (kind) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M4 13.5V20h6v-6.5H4Zm10 0V20h6v-6.5h-6ZM4 4v7h6V4H4Zm10 0v7h6V4h-6Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M7 4v14" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "mentor":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M4 20a8 8 0 0 1 16 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M10 8.5v7l7-3.5-7-3.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 2 2 7l10 5 10-5-10-5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M2 17l10 5 10-5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function iconKind(label: string) {
  if (label.includes("ダッシュ")) return "dashboard";
  if (label.includes("スケジュール")) return "play";
  if (label.includes("コース")) return "book";
  if (label.includes("進捗")) return "dashboard";
  if (label.includes("参考書")) return "book";
  if (label.includes("AIメンター")) return "mentor";
  if (label.includes("動画")) return "play";
  return "default";
}

export default function SidebarNav({
  items,
  activeHref,
}: {
  items: NavItem[];
  activeHref: string;
}) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950/40 lg:block">
      <div className="flex h-full flex-col p-4">
        <div className="mb-4 px-2">
          <div className="text-xs font-semibold tracking-wide text-slate-400">
            GYAKUSAN AI
          </div>
          <div className="mt-1 text-sm font-bold">ダッシュボード</div>
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const active = it.href === activeHref;
            return (
              <Link
                key={it.label}
                href={it.href}
                className={[
                  "group flex items-center justify-between rounded-xl px-3 py-2 transition",
                  active
                    ? "bg-white/10 text-slate-50"
                    : "text-slate-300 hover:bg-white/5 hover:text-slate-50",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={[
                      "inline-flex items-center justify-center rounded-lg p-2",
                      active ? "bg-brand-500/15 text-brand-500" : "bg-slate-800 text-slate-400",
                    ].join(" ")}
                  >
                    <Icon kind={iconKind(it.label)} />
                  </span>
                  <span className="text-sm font-medium">{it.label}</span>
                </span>
                {it.badge ? (
                  <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold text-brand-500">
                    {it.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-2 pb-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
            <div className="text-xs text-slate-400">今日の合言葉</div>
            <div className="mt-1 text-sm font-semibold">「次の1問だけやれ」</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

