"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations, examCategoryContent } from "@/lib/settings-context"
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Clock,
  BookOpen,
  Target,
  Calendar as CalendarIcon,
} from "lucide-react"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { settings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const examContent = examCategoryContent[settings.examCategory]

  const formatDate = (date: Date) => {
    const locale = settings.language === "ja" ? "ja-JP" : settings.language === "zh" ? "zh-CN" : settings.language === "ko" ? "ko-KR" : "en-US"
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  // Generate schedule based on exam category
  const todaySchedule = examContent.subjects.map((subject, index) => ({
    id: String(index + 1),
    time: `${9 + index * 2}:00`,
    title: settings.language === "ja" ? subject.topicJa : subject.topic,
    subject: settings.language === "ja" ? subject.subjectJa : subject.subject,
    duration: subject.timeEstimate,
    book: subject.examBoard,
    completed: subject.completed,
  }))

  const weekSchedule = [
    { day: settings.language === "ja" ? "月" : "Mon", date: 24, subjects: examContent.subjects.slice(0, 2).map(s => settings.language === "ja" ? s.subjectJa : s.subject), totalHours: 6 },
    { day: settings.language === "ja" ? "火" : "Tue", date: 25, subjects: examContent.subjects.slice(1, 3).map(s => settings.language === "ja" ? s.subjectJa : s.subject), totalHours: 6.5 },
    { day: settings.language === "ja" ? "水" : "Wed", date: 26, subjects: examContent.subjects.map(s => settings.language === "ja" ? s.subjectJa : s.subject), totalHours: 7, isToday: true },
    { day: settings.language === "ja" ? "木" : "Thu", date: 27, subjects: examContent.subjects.slice(0, 2).map(s => settings.language === "ja" ? s.subjectJa : s.subject), totalHours: 6 },
    { day: settings.language === "ja" ? "金" : "Fri", date: 28, subjects: examContent.subjects.slice(1, 3).map(s => settings.language === "ja" ? s.subjectJa : s.subject), totalHours: 5.5 },
    { day: settings.language === "ja" ? "土" : "Sat", date: 29, subjects: [settings.language === "ja" ? "過去問演習" : "Past Papers"], totalHours: 8 },
    { day: settings.language === "ja" ? "日" : "Sun", date: 30, subjects: [settings.language === "ja" ? "復習" : "Review"], totalHours: 5 },
  ]

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", theme.light)}>
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-12 md:pt-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {t.schedule} / {settings.language === "ja" ? "スケジュール" : "Schedule"}
              </h1>
              <p className="text-slate-500 mt-1">
                {examContent.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 bg-white/80">
                <RefreshCw className="h-4 w-4" />
                {settings.language === "ja" ? "リスケジュール" : "Reschedule"}
              </Button>
              <Button className={cn("gap-2 bg-gradient-to-r text-white", theme.gradient)}>
                <Plus className="h-4 w-4" />
                {settings.language === "ja" ? "タスク追加" : "Add Task"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList className="bg-white/80 border">
              <TabsTrigger value="daily">{settings.language === "ja" ? "日別" : "Daily"}</TabsTrigger>
              <TabsTrigger value="weekly">{settings.language === "ja" ? "週間" : "Weekly"}</TabsTrigger>
              <TabsTrigger value="monthly">{settings.language === "ja" ? "月間" : "Monthly"}</TabsTrigger>
            </TabsList>

            {/* Daily View */}
            <TabsContent value="daily" className="space-y-6">
              {/* Date Navigation */}
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-800">{formatDate(selectedDate)}</p>
                      <p className="text-sm text-slate-500">
                        {settings.language === "ja" ? "予定学習時間" : "Planned Study"}: 7h 30min
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">
                    {settings.language === "ja" ? "タイムライン" : "Timeline"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  {todaySchedule.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 shrink-0 text-right">
                        <span className="text-sm font-medium text-slate-400">{item.time}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full border-2",
                          item.completed 
                            ? cn("border-2", settings.colorTheme === "sky" ? "bg-sky-500 border-sky-500" : settings.colorTheme === "violet" ? "bg-violet-500 border-violet-500" : settings.colorTheme === "emerald" ? "bg-emerald-500 border-emerald-500" : settings.colorTheme === "rose" ? "bg-rose-500 border-rose-500" : "bg-amber-500 border-amber-500")
                            : "bg-white border-slate-300"
                        )} />
                        {index < todaySchedule.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-6 -mt-1">
                        <div className={cn(
                          "p-4 rounded-lg border",
                          item.completed
                            ? cn("bg-gradient-to-r border-0", theme.light)
                            : "bg-white border-slate-200"
                        )}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <p className={cn(
                                "font-medium",
                                item.completed ? "text-slate-400 line-through" : "text-slate-800"
                              )}>
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {item.subject}
                                </Badge>
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                  <Clock className="h-3 w-3" />
                                  {item.duration}
                                </span>
                                {item.book && (
                                  <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <BookOpen className="h-3 w-3" />
                                    {item.book}
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.completed && (
                              <Badge className={cn("bg-gradient-to-r text-white border-0", theme.gradient)}>
                                {t.completed}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weekly View */}
            <TabsContent value="weekly" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {weekSchedule.map((day) => (
                  <Card
                    key={day.day}
                    className={cn(
                      "bg-white/90 backdrop-blur border-0 shadow-sm",
                      day.isToday && cn("ring-2", settings.colorTheme === "sky" ? "ring-sky-500" : settings.colorTheme === "violet" ? "ring-violet-500" : settings.colorTheme === "emerald" ? "ring-emerald-500" : settings.colorTheme === "rose" ? "ring-rose-500" : "ring-amber-500")
                    )}
                  >
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="text-center">
                        <p className="text-xs text-slate-500">{day.day}</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          day.isToday ? theme.text : "text-slate-800"
                        )}>
                          {day.date}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-4 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {day.subjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant="outline"
                            className="text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{day.totalHours}h</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Weekly Summary */}
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                    <Target className="h-5 w-5" />
                    {settings.language === "ja" ? "今週の目標" : "This Week's Goals"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={cn("p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                      <p className="text-sm text-slate-500">{settings.language === "ja" ? "総学習時間" : "Total Hours"}</p>
                      <p className="text-2xl font-bold text-slate-800">44h</p>
                      <p className={cn("text-xs", theme.text)}>{settings.language === "ja" ? "目標: 42時間" : "Goal: 42h"}</p>
                    </div>
                    <div className={cn("p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                      <p className="text-sm text-slate-500">{settings.language === "ja" ? "完了タスク" : "Tasks Done"}</p>
                      <p className="text-2xl font-bold text-slate-800">28/35</p>
                      <p className="text-xs text-slate-500">80%</p>
                    </div>
                    <div className={cn("p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                      <p className="text-sm text-slate-500">{settings.language === "ja" ? "参考書進捗" : "Book Progress"}</p>
                      <p className="text-2xl font-bold text-slate-800">+12%</p>
                      <p className={cn("text-xs", theme.text)}>{settings.language === "ja" ? "順調です" : "On track"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Monthly View */}
            <TabsContent value="monthly" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                      <CalendarIcon className="h-5 w-5" />
                      {settings.language === "ja" ? "2026年3月" : "March 2026"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <MonthlyCalendar colorTheme={settings.colorTheme} language={settings.language} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function MonthlyCalendar({ colorTheme, language }: { colorTheme: string; language: string }) {
  const days = language === "ja" 
    ? ["日", "月", "火", "水", "木", "金", "土"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = 26

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const calendarDays = []
  for (let i = 1; i <= 31; i++) {
    const seed = 2026 * 10000 + 3 * 100 + i
    calendarDays.push({
      day: i,
      hasStudy: seededRandom(seed) > 0.1,
      hours: Math.floor(seededRandom(seed + 1) * 8) + 2,
      isToday: i === today,
    })
  }

  const getThemeRing = () => {
    switch (colorTheme) {
      case "sky": return "ring-sky-500"
      case "violet": return "ring-violet-500"
      case "emerald": return "ring-emerald-500"
      case "rose": return "ring-rose-500"
      case "amber": return "ring-amber-500"
      default: return "ring-sky-500"
    }
  }

  const getThemeText = () => {
    switch (colorTheme) {
      case "sky": return "text-sky-500"
      case "violet": return "text-violet-500"
      case "emerald": return "text-emerald-500"
      case "rose": return "text-rose-500"
      case "amber": return "text-amber-500"
      default: return "text-sky-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((cell) => (
          <div
            key={cell.day}
            className={cn(
              "aspect-square p-2 rounded-lg border transition-colors cursor-pointer hover:bg-slate-50",
              cell.isToday
                ? cn("ring-2", getThemeRing())
                : cell.hasStudy
                ? "bg-slate-50 border-slate-200"
                : "border-slate-100"
            )}
          >
            <div className="h-full flex flex-col">
              <span className={cn(
                "text-sm font-medium",
                cell.isToday ? getThemeText() : "text-slate-700"
              )}>
                {cell.day}
              </span>
              {cell.hasStudy && (
                <span className="text-xs text-slate-400 mt-auto">{cell.hours}h</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
