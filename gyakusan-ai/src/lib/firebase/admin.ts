import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { App as FirebaseAdminApp } from "firebase-admin/app";

function getServiceAccountFromEnv():
  | {
      projectId: string;
      clientEmail: string;
      privateKey: string;
    }
  | null {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) return null;

  // "\"n" ではなく実際の改行に直す（.env上では \n を使う想定）
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  return { projectId, clientEmail, privateKey };
}

let cachedApp: FirebaseAdminApp | null = null;

function getOrCreateAdminApp() {
  if (cachedApp) return cachedApp;
  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) return null;

  if (getApps().length === 0) {
    cachedApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    cachedApp = getApps()[0]!;
  }

  return cachedApp;
}

export function isAdminConfigured() {
  return Boolean(getServiceAccountFromEnv());
}

export async function verifyIdToken(idToken: string) {
  const app = getOrCreateAdminApp();
  if (!app) throw new Error("FIREBASE_ADMIN_NOT_CONFIGURED");

  const auth = getAuth(app);
  return auth.verifyIdToken(idToken);
}

export async function createSessionCookie(idToken: string, expiresInMs: number) {
  const app = getOrCreateAdminApp();
  if (!app) throw new Error("FIREBASE_ADMIN_NOT_CONFIGURED");

  const auth = getAuth(app);
  return auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
}

export async function verifySessionCookie(sessionCookie: string) {
  const app = getOrCreateAdminApp();
  if (!app) throw new Error("FIREBASE_ADMIN_NOT_CONFIGURED");

  const auth = getAuth(app);
  return auth.verifySessionCookie(sessionCookie, true);
}

export function getAdminFirestore() {
  const app = getOrCreateAdminApp();
  if (!app) throw new Error("FIREBASE_ADMIN_NOT_CONFIGURED");
  return getFirestore(app);
}

