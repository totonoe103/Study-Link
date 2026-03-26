"use client";

import { useEffect, useState } from "react";

import { listLessons } from "@/lib/firestore/lessonsRepo";
import type { Lesson } from "@/lib/firestore/schema";

export default function LessonsList({
  uid,
  courseId,
}: {
  uid: string;
  courseId: string;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await listLessons(uid, courseId);
        if (!cancelled) setLessons(result);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "LESSONS_LOAD_FAILED";
          setError(msg);
          setLessons([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [uid, courseId]);

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
        レッスンの読み込みに失敗しました: {error}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
        このコースにはまだレッスンがありません。
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {lessons.map((l) => (
        <article
          key={l.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Lesson {l.order}</div>
              <h2 className="mt-1 text-lg font-bold text-slate-50">{l.title}</h2>
            </div>
            <div className="text-xs text-slate-500">{l.id}</div>
          </div>

          {l.content ? (
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
              {l.content}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

