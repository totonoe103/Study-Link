import {
  collection,
  getDocs,
  orderBy,
  query,
  type Firestore,
} from "firebase/firestore";

import { getClientFirestore } from "@/lib/firebase/client";
import type { Lesson } from "@/lib/firestore/schema";

function getLessonsCollection(db: Firestore, uid: string, courseId: string) {
  // users/{uid}/courses/{courseId}/lessons
  return collection(db, "users", uid, "courses", courseId, "lessons");
}

export async function listLessons(
  uid: string,
  courseId: string,
): Promise<Lesson[]> {
  if (!uid || !courseId) return [];

  const db = getClientFirestore();
  const lessonsRef = getLessonsCollection(db, uid, courseId);

  const q = query(lessonsRef, orderBy("order", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      courseId,
      title: String(data.title ?? ""),
      content: data.content ? String(data.content) : undefined,
      order: typeof data.order === "number" ? data.order : 0,
      createdAt: data.createdAt,
    };
  });
}

