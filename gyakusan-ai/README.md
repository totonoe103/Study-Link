# Gyakusan AI (Study Management Base)

Next.js (App Router) + Tailwind CSS の土台に、Firebase Auth（ログイン）と Firestore（学習データ）をつなぐための最小構成を追加しています。

## セットアップ

1. 依存関係のインストール
   - `npm install`
2. 環境変数の準備
   - `.env.local.example` を `.env.local` にコピーして埋めます
   - クライアント用: `NEXT_PUBLIC_FIREBASE_*`
   - サーバ用(Admin SDK): `FIREBASE_ADMIN_*`
3. 開発サーバ起動
   - `npm run dev`

## 認証（ログイン/セッション）

- ログイン画面: `GET /login`
- 新規登録: `GET /signup`
- 保護ページ: `/dashboard`, `/courses`, `/lessons`, `/progress`, `/settings`
- ログイン成功時:
  - Firebase Authでサインイン
  - `POST /api/auth/session` に `idToken` を渡して、`HttpOnly` Cookie（`session`）を発行

※ Firebase Admin SDK が未設定だと、保護ページは未ログイン扱いになります。

## Firestore スキーマ（例）

ユーザー配下に学習データを保持します。

- コース
  - `users/{uid}/courses/{courseId}`
  - 推奨フィールド: `title`, `description`, `level`, `createdAt`
- レッスン
  - `users/{uid}/courses/{courseId}/lessons/{lessonId}`
  - 推奨フィールド: `title`, `content`（任意）, `order`, `createdAt`
- 進捗
  - `users/{uid}/progress/current`
  - 推奨フィールド: `courseId`, `completedLessonIds`, `minutesToday`（任意）, `updatedAt`（任意）

## 実装の場所

- Firebase Client 初期化: `src/lib/firebase/client.ts`
- Firebase Admin 初期化: `src/lib/firebase/admin.ts`
- 認証ユーティリティ: `src/lib/auth/server.ts`
- 認証API:
  - `src/app/api/auth/session/route.ts`
  - `src/app/api/auth/me/route.ts`
  - `src/app/api/auth/logout/route.ts`
- 画面:
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/signup/page.tsx`
  - `src/app/courses/page.tsx`
  - `src/app/lessons/page.tsx`
  - `src/app/progress/page.tsx`
  - `src/app/settings/page.tsx`

