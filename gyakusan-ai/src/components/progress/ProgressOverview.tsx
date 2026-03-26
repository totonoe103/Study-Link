"use client";

import { useEffect, useState } from "react";

import { getProgress } from "@/lib/firestore/progressRepo";
import type { Progress } from "@/lib/firestore/schema";

export default function ProgressOverview({ uid }: { uid: string }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const p = await getProgress(uid);
        if (!cancelled) setProgress(p);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "PROGRESS_LOAD_FAILED");
          setProgress(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
        進捗の読み込みに失敗しました: {error}
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
        まだ進捗データがありません。まずは `progress/current` を作成してください。
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="text-xs text-slate-400">今日の学習時間</div>
        <div className="mt-2 text-3xl font-bold text-slate-50">
          {progress.minutesToday ?? 0} 分
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="text-xs text-slate-400">完了レッスン数</div>
        <div className="mt-2 text-3xl font-bold text-slate-50">
          {progress.completedLessonIds.length} 件
        </div>
      </div>
    </div>
  );
}

