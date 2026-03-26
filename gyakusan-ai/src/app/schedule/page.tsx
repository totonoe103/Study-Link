import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/server";
import { getPlannerStateByUid } from "@/lib/schedule/server";

import LogoutButton from "@/components/auth/LogoutButton";
import SchedulePlanner from "@/components/schedule/SchedulePlanner";

export default async function SchedulePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/schedule");

  let initialState = null;
  try {
    initialState = await getPlannerStateByUid(currentUser.uid);
  } catch {
    initialState = null;
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="border-b border-sky-200/70 bg-white/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              学習管理
            </div>
            <div className="text-xs text-slate-600">
              {currentUser.displayName ?? currentUser.email ?? "ユーザー"}
            </div>
          </div>
          <LogoutButton className="bg-sky-50 border-sky-200 text-slate-900 hover:bg-sky-100" />
        </div>
      </div>

      <div className="py-8">
        <SchedulePlanner initialState={initialState} />
      </div>
    </div>
  );
}

