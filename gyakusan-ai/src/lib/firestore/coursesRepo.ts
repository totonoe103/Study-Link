import {
  collection,
  getDocs,
  orderBy,
  query,
  type Firestore,
} from "firebase/firestore";

import { getClientFirestore } from "@/lib/firebase/client";
import type { Course } from "@/lib/firestore/schema";

function getCoursesCollection(db: Firestore, uid: string) {
  // 例: users/{uid}/courses/{courseId}
  return collection(db, "users", uid, "courses");
}

export async function listCourses(uid: string): Promise<Course[]> {
  if (!uid) return [];

  const db = getClientFirestore();
  const coursesRef = getCoursesCollection(db, uid);

  const q = query(coursesRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title as string,
      description: data.description as string | undefined,
      level: data.level as string | undefined,
      createdAt: data.createdAt,
    };
  });
}

