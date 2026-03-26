import { doc, getDoc } from "firebase/firestore";

import { getClientFirestore } from "@/lib/firebase/client";
import type { Progress } from "@/lib/firestore/schema";

export async function getProgress(uid: string): Promise<Progress | null> {
  if (!uid) return null;

  const db = getClientFirestore();
  // users/{uid}/progress/current
  const progressRef = doc(db, "users", uid, "progress", "current");
  const snap = await getDoc(progressRef);
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  return {
    uid,
    courseId: String(data.courseId ?? ""),
    completedLessonIds: Array.isArray(data.completedLessonIds)
      ? (data.completedLessonIds as unknown[]).map(String)
      : [],
    minutesToday:
      typeof data.minutesToday === "number" ? data.minutesToday : undefined,
    updatedAt: data.updatedAt as any,
  };
}

