import { getAdminFirestore } from "@/lib/firebase/admin";
import type { PlannerState } from "@/lib/schedule/state";

const plannerDocPath = (uid: string) =>
  `users/${uid}/planner/state`;

export async function getPlannerStateByUid(uid: string): Promise<PlannerState | null> {
  if (!uid) return null;
  const db = getAdminFirestore();
  const docRef = db.doc(plannerDocPath(uid));
  const snap = await docRef.get();
  if (!snap.exists) return null;
  return snap.data() as PlannerState;
}

export async function savePlannerStateByUid(uid: string, state: PlannerState) {
  const db = getAdminFirestore();
  const docRef = db.doc(plannerDocPath(uid));
  await docRef.set(state, { merge: true });
}

