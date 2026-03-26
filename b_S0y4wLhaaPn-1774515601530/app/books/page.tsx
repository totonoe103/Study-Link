"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations, examCategoryContent } from "@/lib/settings-context"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  Camera,
  Sparkles,
  GraduationCap,
} from "lucide-react"

export default function BooksPage() {
  const { settings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const examContent = examCategoryContent[settings.examCategory]

  // Generate books based on exam category
  const books = examContent.subjects.map((subject, index) => ({
    id: String(index + 1),
    title: settings.language === "ja" ? subject.topicJa : subject.topic,
    subject: settings.language === "ja" ? subject.subjectJa : subject.subject,
    progress: subject.progress,
    totalPages: 100 + index * 50,
    currentPage: Math.floor((subject.progress / 100) * (100 + index * 50)),
    estimatedDays: Math.ceil((100 - subject.progress) / 5),
    status: subject.completed ? "completed" as const : subject.progress > 0 ? "in-progress" as const : "upcoming" as const,
    examBoard: subject.examBoard,
  }))

  const inProgressBooks = books.filter((b) => b.status === "in-progress")
  const completedBooks = books.filter((b) => b.status === "completed")
  const upcomingBooks = books.filter((b) => b.status === "upcoming")

  const recommendedRoute = [
    { 
      phase: settings.language === "ja" ? "基礎固め" : "Foundation", 
      period: settings.language === "ja" ? "4月〜6月" : "Apr - Jun", 
      books: examContent.subjects.slice(0, 2).map(s => settings.language === "ja" ? s.topicJa : s.topic)
    },
    { 
      phase: settings.language === "ja" ? "応用力強化" : "Advanced", 
      period: settings.language === "ja" ? "7月〜9月" : "Jul - Sep", 
      books: examContent.subjects.slice(1, 3).map(s => settings.language === "ja" ? s.topicJa : s.topic)
    },
    { 
      phase: settings.language === "ja" ? "実践演習" : "Practice", 
      period: settings.language === "ja" ? "10月〜12月" : "Oct - Dec", 
      books: [settings.language === "ja" ? "過去問演習" : "Past Papers", settings.language === "ja" ? "模試対策" : "Mock Exams"]
    },
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
                {t.studyRoute} / {settings.language === "ja" ? "参考書ルート" : "Study Route"}
              </h1>
              <p className="text-slate-500 mt-1">
                {examContent.name} - {settings.language === "ja" ? examContent.nameJa : examContent.name}
              </p>
            </div>
            <Button className={cn("gap-2 bg-gradient-to-r text-white", theme.gradient)}>
              <Camera className="h-4 w-4" />
              {settings.language === "ja" ? "進捗を記録" : "Record Progress"}
            </Button>
          </div>

          <Tabs defaultValue="progress" className="space-y-6">
            <TabsList className="bg-white/80 border">
              <TabsTrigger value="progress">{settings.language === "ja" ? "進捗管理" : "Progress"}</TabsTrigger>
              <TabsTrigger value="route">{settings.language === "ja" ? "推奨ルート" : "Recommended"}</TabsTrigger>
              <TabsTrigger value="test">{settings.language === "ja" ? "AIテスト" : "AI Test"}</TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2.5 rounded-lg bg-gradient-to-r", theme.light)}>
                        <BookOpen className={cn("h-5 w-5", theme.text)} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{settings.language === "ja" ? "学習中" : "In Progress"}</p>
                        <p className="text-2xl font-bold text-slate-800">{inProgressBooks.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-green-50">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{t.completed}</p>
                        <p className="text-2xl font-bold text-slate-800">{completedBooks.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-amber-50">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{settings.language === "ja" ? "予定" : "Upcoming"}</p>
                        <p className="text-2xl font-bold text-slate-800">{upcomingBooks.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* In Progress */}
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">
                    {settings.language === "ja" ? "学習中の参考書" : "In Progress"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inProgressBooks.map((book) => (
                    <div
                      key={book.id}
                      className={cn("p-4 rounded-lg hover:shadow-md transition-all cursor-pointer bg-gradient-to-r", theme.light)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {book.subject}
                            </Badge>
                            <h3 className="font-medium text-slate-800">{book.title}</h3>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">{settings.language === "ja" ? "進捗" : "Progress"}</span>
                              <span className="text-slate-700">{book.currentPage}/{book.totalPages} ({book.progress}%)</span>
                            </div>
                            <Progress value={book.progress} className="h-2" />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {settings.language === "ja" ? `残り約${book.estimatedDays}日` : `~${book.estimatedDays} days left`}
                            </span>
                            <Badge variant="outline" className="text-xs">{book.examBoard}</Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Completed */}
              {completedBooks.length > 0 && (
                <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      {t.completed}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {completedBooks.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-slate-800">{book.title}</p>
                            <p className="text-sm text-slate-500">{book.subject}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">{t.completed}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Route Tab */}
            <TabsContent value="route" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                    <GraduationCap className="h-5 w-5" />
                    {examContent.name} {settings.language === "ja" ? "合格への参考書ルート" : "Study Route"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {recommendedRoute.map((phase, index) => (
                    <div key={phase.phase} className="relative">
                      {index < recommendedRoute.length - 1 && (
                        <div className="absolute left-4 top-10 w-0.5 h-full bg-slate-200" />
                      )}
                      <div className="flex gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-white",
                          index === 0 ? cn("bg-gradient-to-r", theme.gradient) : "bg-slate-300"
                        )}>
                          {index + 1}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-800">{phase.phase}</h3>
                            <Badge variant="outline" className="text-slate-500">
                              {phase.period}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {phase.books.map((book) => (
                              <div
                                key={book}
                                className={cn("p-3 rounded-lg hover:shadow-sm transition-all cursor-pointer bg-gradient-to-r", theme.light)}
                              >
                                <p className="text-sm font-medium text-slate-700">{book}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Buy Links */}
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">
                    {settings.language === "ja" ? "参考書を購入" : "Purchase Books"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-between bg-white">
                      <span>{settings.language === "ja" ? "Amazonで購入" : "Buy on Amazon"}</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="justify-between bg-white">
                      <span>{settings.language === "ja" ? "メルカリで探す" : "Find Used Books"}</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Test Tab */}
            <TabsContent value="test" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                    <Sparkles className="h-5 w-5" />
                    {settings.language === "ja" ? "AIテスト機能" : "AI Test Feature"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-500">
                    {settings.language === "ja" 
                      ? "勉強した範囲の写真を撮ると、AIが自動で確認テストを生成します。" 
                      : "Take a photo of your study material and AI will generate practice questions."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={cn("p-6 rounded-lg border-2 border-dashed hover:border-solid transition-colors cursor-pointer text-center bg-gradient-to-r", theme.light)}>
                      <Camera className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                      <p className="font-medium text-slate-700">
                        {settings.language === "ja" ? "写真を撮影" : "Take Photo"}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {settings.language === "ja" ? "勉強した範囲を撮影してください" : "Capture your study material"}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700">
                        {settings.language === "ja" ? "最近のテスト" : "Recent Tests"}
                      </h4>
                      {examContent.subjects.slice(0, 3).map((subject, i) => (
                        <div key={i} className={cn("p-3 rounded-lg bg-gradient-to-r", theme.light)}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-slate-700 text-sm">
                                {settings.language === "ja" ? subject.subjectJa : subject.subject}
                              </p>
                              <p className="text-xs text-slate-500">
                                {settings.language === "ja" ? subject.topicJa : subject.topic}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={cn(
                                "font-bold",
                                subject.progress >= 80 ? "text-green-600" : subject.progress >= 60 ? "text-amber-500" : "text-red-500"
                              )}>
                                {subject.progress}%
                              </p>
                              <p className="text-xs text-slate-500">
                                {i === 0 ? (settings.language === "ja" ? "今日" : "Today") : i === 1 ? (settings.language === "ja" ? "昨日" : "Yesterday") : (settings.language === "ja" ? "2日前" : "2 days ago")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
