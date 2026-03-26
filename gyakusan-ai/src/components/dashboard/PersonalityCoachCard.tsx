"use client";

import { useMemo, useState } from "react";

type CoachMode =
  | "褒め上手（癒やし）"
  | "スパルタ兄貴"
  | "論理的教授"
  | "短期集中モード";

const coachProfiles: Record<
  CoachMode,
  { tagline: string; sample: string; tone: string }
> = {
  "褒め上手（癒やし）": {
    tagline: "無理しないのに前に進む",
    sample: "偉いよ。できた部分をちゃんと積み上げよう。",
    tone: "癒やし系",
  },
  "スパルタ兄貴": {
    tagline: "迷う暇を消す。最短で勝つ",
    sample: "おい、今日も5分遅れてるぞ。単語帳を開け。",
    tone: "スパルタ",
  },
  "論理的教授": {
    tagline: "現在地を数字で握る",
    sample: "現在の進捗は72%。目標達成にはあと12分の上積みが必要。",
    tone: "論理",
  },
  "短期集中モード": {
    tagline: "ダラけを禁止。短期で爆発",
    sample: "集中は今だけ。25分後に結果を報告して。",
    tone: "短期",
  },
};

function toCoachMode(v: string): CoachMode {
  if (v in coachProfiles) return v as CoachMode;
  return "スパルタ兄貴";
}

export default function PersonalityCoachCard({
  initialCoach,
  modes,
}: {
  initialCoach: string;
  modes: string[];
}) {
  const normalizedModes = modes.map(toCoachMode);
  const [coach, setCoach] = useState<CoachMode>(toCoachMode(initialCoach));

  const profile = useMemo(() => coachProfiles[coach], [coach]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">性格パーソナライズ・AIメンター</h2>
          <p className="mt-1 text-sm text-slate-400">
            あなたの性格に合わせて、通知・ノルマ・言い方を調整します。
          </p>
        </div>
        <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
          Plus機能
        </span>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-400">コーチモード</div>
        <div className="mt-2 flex flex-wrap gap-2">
            {normalizedModes.map((m) => {
              const active = m === coach;
              return (
                <button
                  key={m}
                  onClick={() => setCoach(m)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    active
                      ? "border-brand-500 bg-brand-500/15 text-brand-500"
                      : "border-slate-700 bg-white/5 text-slate-200 hover:bg-white/10",
                  ].join(" ")}
                >
                  {m}
                </button>
              );
            })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
            <div className="text-xs text-slate-400">今のコーチ</div>
            <div className="mt-1 text-sm font-bold">{coach}</div>
            <div className="mt-2 rounded-lg bg-white/5 p-3">
              <div className="text-xs text-slate-400">口調 / トーン</div>
              <div className="mt-1 text-sm font-semibold">{profile.tone}</div>
              <div className="mt-2 text-sm text-slate-300">{profile.tagline}</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
            <div className="text-xs text-slate-400">今日の一言（デモ）</div>
            <div className="mt-2 text-base font-semibold">{profile.sample}</div>
            <div className="mt-3 text-xs text-slate-400">
              通知タイミングや“やり始めの一歩”をこのモードに合わせます。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

