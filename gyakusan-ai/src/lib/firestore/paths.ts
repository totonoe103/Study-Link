export const userRootPath = (uid: string) => `users/${uid}`;

export const coursesCollectionPath = (uid: string) =>
  `${userRootPath(uid)}/courses`;

export const courseDocPath = (uid: string, courseId: string) =>
  `${coursesCollectionPath(uid)}/${courseId}`;

export const lessonsCollectionPath = (uid: string, courseId: string) =>
  `${courseDocPath(uid, courseId)}/lessons`;

export const progressCollectionPath = (uid: string) =>
  `${userRootPath(uid)}/progress`;

export const progressDocPath = (uid: string) =>
  `${progressCollectionPath(uid)}/current`;

