import { redirect } from "next/navigation";

import { navItems } from "@/lib/sampleData";
import { getCurrentUser } from "@/lib/auth/server";

import SidebarNav from "@/components/dashboard/SidebarNav";
import TopBar from "@/components/dashboard/TopBar";
import LogoutButton from "@/components/auth/LogoutButton";
import CoursesList from "@/components/courses/CoursesList";

export default async function CoursesPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/courses");

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <SidebarNav items={navItems} activeHref="/courses" />

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
              <h1 className="text-2xl font-bold text-slate-50">コース一覧</h1>
              <p className="mt-1 text-sm text-slate-400">
                Firestoreの `users/{currentUser.uid}/courses` から読み込みます。
              </p>
            </div>

            <CoursesList uid={currentUser.uid} />
          </main>
        </div>
      </div>
    </div>
  );
}

