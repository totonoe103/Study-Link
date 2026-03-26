import { navItems, dashboardData } from "@/lib/sampleData";

import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

import SidebarNav from "@/components/dashboard/SidebarNav";
import TopBar from "@/components/dashboard/TopBar";
import ProgressSummary from "@/components/dashboard/ProgressSummary";
import NextTasks from "@/components/dashboard/NextTasks";
import ReferenceBookRouteCard from "@/components/dashboard/ReferenceBookRouteCard";
import PersonalityCoachCard from "@/components/dashboard/PersonalityCoachCard";
import FocusPlayerCard from "@/components/dashboard/FocusPlayerCard";
import StudyCalendar from "@/components/dashboard/StudyCalendar";
import RankingsTable from "@/components/dashboard/RankingsTable";
import AiMentorChatWidget from "@/components/dashboard/AiMentorChatWidget";
import LogoutButton from "@/components/auth/LogoutButton";

const msPerDay = 24 * 60 * 60 * 1000;

function TargetCard() {
  const { user, target, progress } = dashboardData;
  const today = new Date();
  const exam = new Date(target.examDate);
  const daysLeft = Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / msPerDay));

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">志望校からの逆算</h2>
          <p className="mt-1 text-sm text-slate-400">
            迷った瞬間に戻れる“基準”です。
          </p>
        </div>
        <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
          {user.coachName}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-white/5 p-4 ring-1 ring-slate-800">
        <div className="text-xs text-slate-400">志望校</div>
        <div className="mt-1 text-sm font-semibold">{target.school}</div>

        <div className="mt-3 grid gap-3">
          <div>
            <div className="text-xs text-slate-400">逆算開始日</div>
            <div className="mt-1 text-sm font-semibold">{target.startDate}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">試験日</div>
            <div className="mt-1 text-sm font-semibold">{target.examDate}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">残り</div>
          <div className="mt-1 text-2xl font-bold">{daysLeft}</div>
          <div className="mt-1 text-xs text-slate-400">日（デモ）</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">今日の最短セット</div>
          <div className="mt-1 text-sm font-semibold">
            {progress.todayMinutes}分 x 1セット
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4">
        <div className="text-xs text-slate-400">メッセージ（デモ）</div>
        <div className="mt-1 text-sm font-semibold">
          「最初の5分」を終えたら勝ち。あとは流れに乗るだけ。
        </div>
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard");

  const {
    user: demoUser,
    progress,
    nextTasks,
    referenceRoute,
    calendar,
    rankings,
    mentorChat,
  } = dashboardData;

  const user = {
    ...demoUser,
    name:
      currentUser.displayName ??
      currentUser.email ??
      demoUser.name,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <SidebarNav items={navItems} activeHref="/dashboard" />

        <div className="flex flex-1 flex-col">
          <TopBar name={user.name} plan={user.plan} />
          <div className="px-4 pb-3 lg:px-6">
            <LogoutButton />
          </div>

          <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
            <div className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                <TargetCard />
                <ProgressSummary
                  todayMinutes={progress.todayMinutes}
                  weekMinutes={progress.weekMinutes}
                  streakDays={progress.streakDays}
                  targetCompletionPct={progress.targetCompletionPct}
                />
              </div>

              <NextTasks tasks={nextTasks} />

              <div className="grid gap-4 lg:grid-cols-2">
                <ReferenceBookRouteCard
                  currentBook={referenceRoute.currentBook}
                  currentRange={referenceRoute.currentRange}
                  nextBook={referenceRoute.nextBook}
                  aiTestStatus={referenceRoute.aiTestStatus}
                />
                <PersonalityCoachCard
                  initialCoach={user.coachName}
                  modes={dashboardData.coachModes}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <FocusPlayerCard
                  title={dashboardData.focusPlayer.title}
                  durationLabel={dashboardData.focusPlayer.durationLabel}
                />
                <StudyCalendar minutes={calendar.minutes} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <RankingsTable label={rankings.label} top={rankings.top} />
                <AiMentorChatWidget
                  quickSuggestions={mentorChat.quickSuggestions}
                  systemPromptSummary={mentorChat.systemPromptSummary}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

