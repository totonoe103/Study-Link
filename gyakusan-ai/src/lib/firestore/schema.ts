import type { Timestamp } from "firebase/firestore";

export type Course = {
  id: string;
  title: string;
  description?: string;
  level?: string;
  createdAt?: Timestamp;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  order: number;
  createdAt?: Timestamp;
};

export type Progress = {
  // Firebase Authのuidと一致
  uid: string;
  courseId: string;
  completedLessonIds: string[];
  minutesToday?: number;
  updatedAt?: Timestamp;
};

