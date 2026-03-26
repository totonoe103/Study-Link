"use client";

import { useEffect, useState } from "react";

import { listCourses } from "@/lib/firestore/coursesRepo";
import type { Course } from "@/lib/firestore/schema";

export default function CoursesList({ uid }: { uid: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await listCourses(uid);
        if (!cancelled) setCourses(result);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof Error ? e.message : "COURSES_LOAD_FAILED";
          setError(msg);
          setCourses([]);
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
        コースの読み込みに失敗しました: {error}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
        まだコースがありません。Firestoreにデータを入れてください。
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {courses.map((c) => (
        <article
          key={c.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
        >
          <h2 className="text-lg font-bold text-slate-50">{c.title}</h2>
          {c.level ? (
            <div className="mt-2 inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
              {c.level}
            </div>
          ) : null}
          {c.description ? (
            <p className="mt-3 text-sm text-slate-400">{c.description}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

