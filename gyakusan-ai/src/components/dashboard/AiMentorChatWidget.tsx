"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

function generateAssistantReply(userText: string, coachSummary: string) {
  const t = userText.toLowerCase();
  if (t.includes("不安") || t.includes("やば") || t.includes("間に合"))
    return "大丈夫。逆算は“間に合うように作るもの”。今日やるのは最短の1セットだけでOK。今から行こう。";
  if (t.includes("参考書") || t.includes("ルート") || t.includes("本"))
    return "参考書ルートはブレないほど強い。いまの範囲（P.54-72）だけ写真→ミニテストで“わかったつもり”を潰そう。";
  if (t.includes("サボ") || t.includes("スマホ") || t.includes("動画"))
    return "誘惑が来たら負けじゃない。1回だけ“集中モード”に逃げろ。次の1問を開いて、そこで勝負。";

  // default
  return `了解。${coachSummary} まずは「次の1問」から。終わったら92分達成に更新しよう。`;
}

export default function AiMentorChatWidget({
  quickSuggestions,
  systemPromptSummary,
}: {
  quickSuggestions: string[];
  systemPromptSummary: string;
}) {
  const initial = useMemo<ChatMessage[]>(
    () => [
      {
        id: "a1",
        role: "assistant",
        text: `コーチ：スパルタ兄貴。誘惑は断ち切って、今日の最短ルートだけやろう。`,
      },
      {
        id: "a2",
        role: "assistant",
        text: `いまの逆算進捗は72%。「不安」か「参考書ルート」どっちから聞く？`,
      },
    ],
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [text, setText] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: v };
    const reply = generateAssistantReply(v, systemPromptSummary);
    const assistantMsg: ChatMessage = {
      id: `as-${Date.now() + 1}`,
      role: "assistant",
      text: reply,
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setText("");
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">AIメンター（デモ）</h2>
          <p className="mt-1 text-sm text-slate-400">性格に合わせて、口調と提案を変えます。</p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-1 text-xs font-semibold text-slate-200">
          即レス
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="rounded-xl border border-slate-800 bg-slate-950/30">
          <div className="h-64 space-y-3 overflow-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={[
                    "inline-block max-w-[90%] rounded-2xl px-4 py-2 text-sm ring-1",
                    m.role === "user"
                      ? "bg-brand-500/15 text-brand-500 ring-brand-500/25"
                      : "bg-white/5 text-slate-50 ring-slate-800",
                  ].join(" ")}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 p-4">
            <form onSubmit={submit} className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="例：サボりそう。どうする？"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm outline-none ring-brand-500/0 focus:ring-2 focus:ring-brand-500/50"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-600"
              >
                送信
              </button>
            </form>
            <div className="mt-2 text-xs text-slate-400">{systemPromptSummary}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">クイック質問</div>
          <div className="mt-3 space-y-2">
            {quickSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setText(s)}
                className="w-full rounded-xl border border-slate-800 bg-white/5 px-3 py-2 text-left text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-white/5 p-3 ring-1 ring-slate-800">
            <div className="text-xs text-slate-400">使い方</div>
            <div className="mt-1 text-sm font-semibold">
              迷ったら「今日の最短セット」を聞く。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

