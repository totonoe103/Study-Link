"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations, examCategoryContent } from "@/lib/settings-context"
import {
  Target,
  GraduationCap,
  Calendar,
  Clock,
  Plus,
  TrendingUp,
  CheckCircle2,
  Circle,
} from "lucide-react"

export default function GoalsPage() {
  const { settings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const examContent = examCategoryContent[settings.examCategory]

  const mainGoal = {
    university: examContent.name,
    faculty: settings.language === "ja" ? examContent.nameJa : examContent.name,
    examDate: settings.language === "ja" ? "2027年5月" : "May 2027",
    daysRemaining: 336,
    overallProgress: 45,
  }

  const milestones = [
    { id: "1", title: settings.language === "ja" ? "基礎固め完了" : "Foundation Complete", deadline: settings.language === "ja" ? "2026年6月末" : "End of Jun 2026", progress: 80, status: "in-progress" },
    { id: "2", title: settings.language === "ja" ? "応用力強化" : "Advanced Practice", deadline: settings.language === "ja" ? "2026年10月末" : "End of Oct 2026", progress: 0, status: "upcoming" },
    { id: "3", title: settings.language === "ja" ? "過去問演習開始" : "Past Papers", deadline: settings.language === "ja" ? "2026年11月" : "Nov 2026", progress: 0, status: "upcoming" },
    { id: "4", title: settings.language === "ja" ? "最終対策" : "Final Review", deadline: settings.language === "ja" ? "2027年4月" : "Apr 2027", progress: 0, status: "upcoming" },
  ]

  const weeklyGoals = examContent.subjects.map((subject, i) => ({
    id: String(i + 1),
    title: settings.language === "ja" ? `${subject.subjectJa} - ${subject.topicJa}` : `${subject.subject} - ${subject.topic}`,
    progress: subject.progress,
    target: 100,
    current: subject.progress,
    unit: "%"
  }))

  const monthlyGoals = examContent.subjects.map((subject, i) => ({
    id: String(i + 1),
    title: settings.language === "ja" ? `${subject.topicJa} ${subject.examBoard}` : `${subject.topic} ${subject.examBoard}`,
    deadline: settings.language === "ja" ? "3月末" : "End of Mar",
    progress: subject.progress
  }))

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", theme.light)}>
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-12 md:pt-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {settings.language === "ja" ? "目標設定 / Goals" : "Goals"}
              </h1>
              <p className="text-slate-500 mt-1">
                {settings.language === "ja" ? "合格に向けた目標を管理しましょう" : "Manage your goals towards success"}
              </p>
            </div>
            <Button className={cn("gap-2 bg-gradient-to-r text-white", theme.gradient)}>
              <Plus className="h-4 w-4" />
              {settings.language === "ja" ? "目標を追加" : "Add Goal"}
            </Button>
          </div>

          {/* Main Goal Card */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-sm overflow-hidden">
            <div className={cn("p-6 bg-gradient-to-r", theme.light)}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r text-white", theme.gradient)}>
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{settings.language === "ja" ? "第一志望" : "Target"}</p>
                    <h2 className="text-2xl font-bold text-slate-800">{mainGoal.university}</h2>
                    <p className="text-slate-600">{mainGoal.faculty}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">{settings.language === "ja" ? "試験日" : "Exam Date"}</p>
                    <p className="text-lg font-semibold text-slate-700">{mainGoal.examDate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500">{t.daysLeft}</p>
                    <p className={cn("text-3xl font-bold", theme.text)}>{mainGoal.daysRemaining}</p>
                    <p className="text-sm text-slate-500">{settings.language === "ja" ? "日" : "days"}</p>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{settings.language === "ja" ? "全体進捗" : "Overall Progress"}</span>
                  <span className="text-slate-700 font-medium">{mainGoal.overallProgress}%</span>
                </div>
                <Progress value={mainGoal.overallProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Weekly & Monthly Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Goals */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                    <Calendar className="h-5 w-5" />
                    {settings.language === "ja" ? "今週の目標" : "Weekly Goals"}
                  </CardTitle>
                  <Badge variant="outline">{settings.language === "ja" ? "3月24日 - 3月30日" : "Mar 24 - Mar 30"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {goal.progress === 100 ? (
                          <CheckCircle2 className={cn("h-4 w-4", theme.text)} />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-300" />
                        )}
                        <span className={cn(
                          "text-sm font-medium",
                          goal.progress === 100 ? "text-slate-400 line-through" : "text-slate-700"
                        )}>
                          {goal.title}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">
                        {goal.current}/{goal.target}{goal.unit}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monthly Goals */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-500">
                    <Target className="h-5 w-5" />
                    {settings.language === "ja" ? "今月の目標" : "Monthly Goals"}
                  </CardTitle>
                  <Badge variant="outline">{settings.language === "ja" ? "2026年3月" : "March 2026"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyGoals.map((goal) => (
                  <div key={goal.id} className={cn("p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700">{goal.title}</p>
                        <p className="text-sm text-slate-500">{settings.language === "ja" ? "期限" : "Due"}: {goal.deadline}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-xl font-bold",
                          goal.progress >= 80 ? theme.text : goal.progress >= 50 ? "text-amber-500" : "text-red-500"
                        )}>
                          {goal.progress}%
                        </p>
                      </div>
                    </div>
                    <Progress value={goal.progress} className="h-2 mt-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Milestones */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
            <CardHeader>
              <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                <TrendingUp className="h-5 w-5" />
                {settings.language === "ja" ? "マイルストーン" : "Milestones"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2",
                        milestone.status === "in-progress"
                          ? cn("border-2", settings.colorTheme === "sky" ? "bg-sky-500 border-sky-500" : settings.colorTheme === "violet" ? "bg-violet-500 border-violet-500" : settings.colorTheme === "emerald" ? "bg-emerald-500 border-emerald-500" : settings.colorTheme === "rose" ? "bg-rose-500 border-rose-500" : "bg-amber-500 border-amber-500")
                          : milestone.status === "completed"
                          ? cn("border-2", settings.colorTheme === "sky" ? "bg-sky-500 border-sky-500" : settings.colorTheme === "violet" ? "bg-violet-500 border-violet-500" : settings.colorTheme === "emerald" ? "bg-emerald-500 border-emerald-500" : settings.colorTheme === "rose" ? "bg-rose-500 border-rose-500" : "bg-amber-500 border-amber-500")
                          : "bg-white border-slate-300"
                      )} />
                      {index < milestones.length - 1 && (
                        <div className={cn(
                          "w-0.5 flex-1",
                          milestone.status === "completed" ? cn(settings.colorTheme === "sky" ? "bg-sky-500" : settings.colorTheme === "violet" ? "bg-violet-500" : settings.colorTheme === "emerald" ? "bg-emerald-500" : settings.colorTheme === "rose" ? "bg-rose-500" : "bg-amber-500") : "bg-slate-200"
                        )} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={cn(
                      "flex-1 pb-8 -mt-0.5",
                      index === milestones.length - 1 && "pb-0"
                    )}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className={cn(
                            "font-medium",
                            milestone.status === "upcoming" ? "text-slate-400" : "text-slate-700"
                          )}>
                            {milestone.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm text-slate-500">{milestone.deadline}</span>
                          </div>
                        </div>
                        {milestone.status === "in-progress" && (
                          <div className="flex items-center gap-2">
                            <Progress value={milestone.progress} className="w-24 h-2" />
                            <span className={cn("text-sm font-medium", theme.text)}>{milestone.progress}%</span>
                          </div>
                        )}
                        {milestone.status === "completed" && (
                          <Badge className={cn("bg-gradient-to-r text-white border-0", theme.gradient)}>{t.completed}</Badge>
                        )}
                        {milestone.status === "upcoming" && (
                          <Badge variant="outline" className="text-slate-400">{settings.language === "ja" ? "未着手" : "Not started"}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
