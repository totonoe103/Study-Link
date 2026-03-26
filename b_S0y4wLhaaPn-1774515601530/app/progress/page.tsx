"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations, examCategoryContent } from "@/lib/settings-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, Target, BookOpen, Clock, Brain } from "lucide-react"

export default function ProgressPage() {
  const { settings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const examContent = examCategoryContent[settings.examCategory]

  const getThemeColor = () => {
    switch (settings.colorTheme) {
      case "sky": return "#0ea5e9"
      case "violet": return "#8b5cf6"
      case "emerald": return "#10b981"
      case "rose": return "#f43f5e"
      case "amber": return "#f59e0b"
      default: return "#0ea5e9"
    }
  }

  const weeklyData = [
    { day: settings.language === "ja" ? "月" : "Mon", ...Object.fromEntries(examContent.subjects.slice(0, 3).map((s, i) => [settings.language === "ja" ? s.subjectJa : s.subject, 1.5 + i * 0.5])) },
    { day: settings.language === "ja" ? "火" : "Tue", ...Object.fromEntries(examContent.subjects.slice(0, 3).map((s, i) => [settings.language === "ja" ? s.subjectJa : s.subject, 2 + i * 0.3])) },
    { day: settings.language === "ja" ? "水" : "Wed", ...Object.fromEntries(examContent.subjects.slice(0, 3).map((s, i) => [settings.language === "ja" ? s.subjectJa : s.subject, 2.5 + i * 0.2])) },
    { day: settings.language === "ja" ? "木" : "Thu", ...Object.fromEntries(examContent.subjects.slice(0, 3).map((s, i) => [settings.language === "ja" ? s.subjectJa : s.subject, 2 + i * 0.4])) },
    { day: settings.language === "ja" ? "金" : "Fri", ...Object.fromEntries(examContent.subjects.slice(0, 3).map((s, i) => [settings.language === "ja" ? s.subjectJa : s.subject, 1.5 + i * 0.5])) },
    { day: settings.language === "ja" ? "土" : "Sat", ...Object.fromEntries(examContent.subjects.slice(0, 3).map((s, i) => [settings.language === "ja" ? s.subjectJa : s.subject, 3 + i * 0.2])) },
    { day: settings.language === "ja" ? "日" : "Sun", ...Object.fromEntries(examContent.subjects.slice(0, 3).map((s, i) => [settings.language === "ja" ? s.subjectJa : s.subject, 1.5 + i * 0.3])) },
  ]

  const subjectDistribution = examContent.subjects.map((s, i) => ({
    name: settings.language === "ja" ? s.subjectJa : s.subject,
    value: 30 + i * 5,
    color: i === 0 ? getThemeColor() : i === 1 ? "#10b981" : i === 2 ? "#f59e0b" : "#8b5cf6"
  }))

  const monthlyProgress = [
    { month: settings.language === "ja" ? "1月" : "Jan", 達成率: 65 },
    { month: settings.language === "ja" ? "2月" : "Feb", 達成率: 72 },
    { month: settings.language === "ja" ? "3月" : "Mar", 達成率: 82 },
  ]

  const weakPoints = examContent.subjects.filter(s => s.progress < 60).map(s => ({
    subject: settings.language === "ja" ? s.subjectJa : s.subject,
    topic: settings.language === "ja" ? s.topicJa : s.topic,
    accuracy: s.progress,
    trend: s.progress > 50 ? "up" : "down"
  }))

  const strengths = examContent.subjects.filter(s => s.progress >= 60).map(s => ({
    subject: settings.language === "ja" ? s.subjectJa : s.subject,
    topic: settings.language === "ja" ? s.topicJa : s.topic,
    accuracy: s.progress,
    trend: "up"
  }))

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", theme.light)}>
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="pt-12 md:pt-0">
            <h1 className="text-2xl font-bold text-slate-800">
              {t.progress} / {settings.language === "ja" ? "進捗分析" : "Progress Analysis"}
            </h1>
            <p className="text-slate-500 mt-1">
              {settings.language === "ja" ? "AIが学習データを分析してアドバイスします" : "AI analyzes your study data and provides insights"}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: settings.language === "ja" ? "今月の学習時間" : "Monthly Hours", value: "124h", change: "+12%", icon: Clock, positive: true },
              { label: settings.language === "ja" ? "目標達成率" : "Goal Rate", value: "82%", change: "+5%", icon: Target, positive: true },
              { label: settings.language === "ja" ? "完了参考書" : "Books Done", value: "3", change: "+1", icon: BookOpen, positive: true },
              { label: settings.language === "ja" ? "平均正答率" : "Avg Score", value: "76%", change: "-2%", icon: Brain, positive: false },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                      <div className={`flex items-center gap-1 text-xs ${stat.positive ? theme.text : "text-red-500"}`}>
                        {stat.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className={cn("p-2.5 rounded-lg bg-gradient-to-r", theme.light)}>
                      <stat.icon className={cn("h-5 w-5", theme.text)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Study Time by Subject */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">
                  {settings.language === "ja" ? "科目別学習時間（週間）" : "Weekly Study Hours by Subject"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v}h`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      {examContent.subjects.slice(0, 3).map((s, i) => (
                        <Bar 
                          key={s.id}
                          dataKey={settings.language === "ja" ? s.subjectJa : s.subject} 
                          stackId="a" 
                          fill={i === 0 ? getThemeColor() : i === 1 ? "#10b981" : "#f59e0b"} 
                          radius={i === 2 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subject Distribution */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">
                  {settings.language === "ja" ? "科目配分" : "Subject Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjectDistribution.map((subject) => (
                    <div key={subject.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                      <span className="text-slate-500">{subject.name}</span>
                      <span className="text-slate-700 font-medium ml-auto">{subject.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Progress & Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Progress */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">
                  {settings.language === "ja" ? "月別達成率の推移" : "Monthly Progress"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Line type="monotone" dataKey="達成率" stroke={getThemeColor()} strokeWidth={2} dot={{ fill: getThemeColor() }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardHeader>
                <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                  <Brain className="h-5 w-5" />
                  {settings.language === "ja" ? "AIによる分析" : "AI Analysis"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn("p-4 rounded-lg bg-gradient-to-r border", theme.light, settings.colorTheme === "sky" ? "border-sky-200" : settings.colorTheme === "violet" ? "border-violet-200" : settings.colorTheme === "emerald" ? "border-emerald-200" : settings.colorTheme === "rose" ? "border-rose-200" : "border-amber-200")}>
                  <h4 className={cn("font-medium mb-2", theme.text)}>
                    {settings.language === "ja" ? "総評" : "Summary"}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {settings.language === "ja" 
                      ? "今月は順調に学習を進めています。特に数学の理解度が大幅に向上しました。" 
                      : "You're making great progress this month. Your math understanding has significantly improved."}
                  </p>
                </div>
                <div className={cn("p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                  <h4 className="font-medium text-slate-700 mb-2">
                    {settings.language === "ja" ? "来週の推奨学習" : "Next Week Recommendations"}
                  </h4>
                  <ul className="text-sm text-slate-500 space-y-1">
                    <li>1. {examContent.subjects[0] ? (settings.language === "ja" ? examContent.subjects[0].topicJa : examContent.subjects[0].topic) : ""}</li>
                    <li>2. {examContent.subjects[1] ? (settings.language === "ja" ? examContent.subjects[1].topicJa : examContent.subjects[1].topic) : ""}</li>
                    <li>3. {settings.language === "ja" ? "過去問演習" : "Past paper practice"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weak Points & Strengths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weak Points */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-red-500">
                  {settings.language === "ja" ? "苦手分野" : "Areas to Improve"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weakPoints.length > 0 ? weakPoints.map((point, i) => (
                  <div key={i} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-1">{point.subject}</Badge>
                        <p className="font-medium text-slate-700">{point.topic}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-500">{point.accuracy}%</p>
                        <div className={`flex items-center gap-1 text-xs ${
                          point.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}>
                          {point.trend === "up" && <TrendingUp className="h-3 w-3" />}
                          {point.trend === "down" && <TrendingDown className="h-3 w-3" />}
                          {point.trend === "up" ? (settings.language === "ja" ? "改善中" : "Improving") : (settings.language === "ja" ? "要注意" : "Needs work")}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-center py-4">{settings.language === "ja" ? "すべての分野で順調です！" : "All areas are on track!"}</p>
                )}
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardHeader>
                <CardTitle className={cn("text-lg", theme.text)}>
                  {settings.language === "ja" ? "得意分野" : "Strong Areas"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strengths.map((point, i) => (
                  <div key={i} className={cn("p-3 rounded-lg bg-gradient-to-r", theme.light)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-1">{point.subject}</Badge>
                        <p className="font-medium text-slate-700">{point.topic}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-xl font-bold", theme.text)}>{point.accuracy}%</p>
                        <div className="flex items-center gap-1 text-xs text-green-500">
                          <TrendingUp className="h-3 w-3" />
                          {settings.language === "ja" ? "伸び中" : "Growing"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
