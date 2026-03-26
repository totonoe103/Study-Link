import { redirect } from "next/navigation";

import { navItems } from "@/lib/sampleData";
import { getCurrentUser } from "@/lib/auth/server";

import SidebarNav from "@/components/dashboard/SidebarNav";
import TopBar from "@/components/dashboard/TopBar";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/settings");

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <SidebarNav items={navItems} activeHref="/settings" />

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
              <h1 className="text-2xl font-bold text-slate-50">設定</h1>
              <p className="mt-1 text-sm text-slate-400">
                次の段階では、プロフィール編集や通知設定を追加します。
              </p>
            </div>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="text-sm font-semibold text-slate-200">
                これから実装する項目
              </div>
              <div className="mt-3 text-sm text-slate-400">
                ・プロフィール（表示名 / 学習レベル）編集
                <br />
                ・学習科目 / 期間の設定
                <br />
                ・Firebase連携（メール以外のログイン）拡張
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

