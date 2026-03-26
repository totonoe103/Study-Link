import { redirect } from "next/navigation";

import { navItems } from "@/lib/sampleData";
import { getCurrentUser } from "@/lib/auth/server";

import SidebarNav from "@/components/dashboard/SidebarNav";
import TopBar from "@/components/dashboard/TopBar";
import LogoutButton from "@/components/auth/LogoutButton";
import LessonsList from "@/components/lessons/LessonsList";

export default async function LessonsPage({
  searchParams,
}: {
  searchParams?: { courseId?: string };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/lessons");

  const courseId = searchParams?.courseId;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <SidebarNav items={navItems} activeHref="/lessons" />

        <div className="flex flex-1 flex-col">
          <TopBar
            name={currentUser.displayName ?? currentUser.email ?? "ユーザー"}
            plan="学習プラン（未設定）"
          />
          <div className="px-4 pb-3 lg:px-6">
            <LogoutButton />
          </div>

          <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-50">レッスン</h1>
              <p className="mt-1 text-sm text-slate-400">
                URLの `courseId` を指定してください（例: `/lessons?courseId=...`）。
              </p>
            </div>

            {courseId ? (
              <LessonsList uid={currentUser.uid} courseId={courseId} />
            ) : (
              <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
                `courseId` が指定されていません。
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

