"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { SettingsModal } from "@/components/settings-modal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations, mentorPersonalities, examCategoryContent } from "@/lib/settings-context"
import {
  User,
  Bell,
  Sparkles,
  Shield,
  CreditCard,
  GraduationCap,
  Clock,
  Crown,
  Settings as SettingsIcon,
  Palette,
  Globe,
} from "lucide-react"

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const mentor = mentorPersonalities[settings.mentorPersonality]
  const examContent = examCategoryContent[settings.examCategory]

  const [notifications, setNotifications] = useState({
    studyReminder: true,
    dailyReport: true,
    weeklyReport: false,
    friendActivity: true,
    achievements: true,
  })

  const plans = [
    { id: "free", name: "Standard", price: settings.language === "ja" ? "無料" : "Free", features: settings.language === "ja" ? ["基本の逆算スケジュール", "学習記録", "標準的な励まし"] : ["Basic schedule", "Study records", "Standard support"] },
    { id: "plus", name: "Plus", price: settings.language === "ja" ? "¥980/月" : "$9.99/mo", features: settings.language === "ja" ? ["リスケ無制限", "グラフ詳細分析", "性格別コーチング", "広告なし"] : ["Unlimited reschedule", "Detailed analytics", "Personalized coaching", "Ad-free"], recommended: true },
    { id: "premium", name: "High-end", price: settings.language === "ja" ? "¥1,980/月" : "$19.99/mo", features: settings.language === "ja" ? ["苦手分析＆自動修正", "AIによる定着度レポート", "24時間即レス質問箱", "参考書連動テスト"] : ["Weakness analysis", "AI progress reports", "24/7 Q&A", "Book-linked tests"] },
  ]

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", theme.light)}>
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="pt-12 md:pt-0">
            <h1 className="text-2xl font-bold text-slate-800">
              {t.settings} / {settings.language === "ja" ? "設定" : "Settings"}
            </h1>
            <p className="text-slate-500 mt-1">
              {settings.language === "ja" ? "アプリの設定をカスタマイズしましょう" : "Customize your app preferences"}
            </p>
          </div>

          {/* Quick Settings Card */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
            <CardHeader>
              <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                <Palette className="h-5 w-5" />
                {settings.language === "ja" ? "クイック設定" : "Quick Settings"}
              </CardTitle>
              <CardDescription>
                {settings.language === "ja" ? "言語、テーマ、試験カテゴリーを変更" : "Change language, theme, and exam category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsModal />
            </CardContent>
          </Card>

          {/* Current Settings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg bg-gradient-to-r", theme.light)}>
                    <Globe className={cn("h-5 w-5", theme.text)} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{t.language}</p>
                    <p className="font-medium text-slate-800">
                      {settings.language === "en" ? "English" : settings.language === "ja" ? "日本語" : settings.language === "zh" ? "中文" : "한국어"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg bg-gradient-to-r", theme.gradient)}>
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{t.colorTheme}</p>
                    <p className="font-medium text-slate-800 capitalize">{settings.colorTheme}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg bg-gradient-to-r", theme.light)}>
                    <GraduationCap className={cn("h-5 w-5", theme.text)} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{t.examCategory}</p>
                    <p className="font-medium text-slate-800">{examContent.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white/80 border grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="profile" className="gap-1.5">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{settings.language === "ja" ? "プロフィール" : "Profile"}</span>
              </TabsTrigger>
              <TabsTrigger value="mentor" className="gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="hidden md:inline">{t.aiMentor}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1.5">
                <Bell className="h-4 w-4" />
                <span className="hidden md:inline">{settings.language === "ja" ? "通知" : "Notifications"}</span>
              </TabsTrigger>
              <TabsTrigger value="plan" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span className="hidden md:inline">{settings.language === "ja" ? "プラン" : "Plan"}</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-1.5">
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">{settings.language === "ja" ? "プライバシー" : "Privacy"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">{settings.language === "ja" ? "基本情報" : "Basic Info"}</CardTitle>
                  <CardDescription>{settings.language === "ja" ? "あなたのプロフィール情報を管理します" : "Manage your profile information"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-r", theme.gradient)}>
                      U
                    </div>
                    <Button variant="outline" className="bg-white">{settings.language === "ja" ? "画像を変更" : "Change Photo"}</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{settings.language === "ja" ? "名前" : "Name"}</Label>
                      <Input id="name" defaultValue="User" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{settings.language === "ja" ? "メール" : "Email"}</Label>
                      <Input id="email" type="email" defaultValue="user@example.com" className="bg-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button className={cn("bg-gradient-to-r text-white", theme.gradient)}>{t.save}</Button>
              </div>
            </TabsContent>

            {/* AI Mentor Tab */}
            <TabsContent value="mentor" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2", theme.text)}>
                    <Sparkles className="h-5 w-5" />
                    {t.mentorPersonality}
                  </CardTitle>
                  <CardDescription>
                    {settings.language === "ja" ? "あなたの学習スタイルに合わせてAIの性格をカスタマイズできます" : "Customize AI personality to match your learning style"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(["gentle", "strict", "logical", "cheerful"] as const).map((personality) => {
                    const mentorInfo = mentorPersonalities[personality]
                    return (
                      <div
                        key={personality}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          settings.mentorPersonality === personality
                            ? cn("bg-gradient-to-r border-2", theme.light, settings.colorTheme === "sky" ? "border-sky-300" : settings.colorTheme === "violet" ? "border-violet-300" : settings.colorTheme === "emerald" ? "border-emerald-300" : settings.colorTheme === "rose" ? "border-rose-300" : "border-amber-300")
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => updateSettings({ mentorPersonality: personality })}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">
                                {personality === "gentle" ? "🤗" : personality === "strict" ? "💪" : personality === "logical" ? "🧠" : "😄"}
                              </span>
                              <h3 className="font-medium text-slate-800">{mentorInfo.name}</h3>
                              {settings.mentorPersonality === personality && (
                                <Badge className={cn("bg-gradient-to-r text-white border-0", theme.gradient)}>
                                  {settings.language === "ja" ? "選択中" : "Selected"}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{t[personality]}</p>
                          </div>
                        </div>
                        <div className={cn("mt-3 p-3 rounded-lg", settings.mentorPersonality === personality ? "bg-white/70" : "bg-white")}>
                          <p className="text-sm text-slate-600 italic">&ldquo;{mentorInfo.greeting[settings.language]}&rdquo;</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Bell className="h-5 w-5" />
                    {settings.language === "ja" ? "通知設定" : "Notification Settings"}
                  </CardTitle>
                  <CardDescription>
                    {settings.language === "ja" ? "受け取りたい通知を選択してください" : "Choose which notifications to receive"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "studyReminder", label: settings.language === "ja" ? "学習リマインダー" : "Study Reminder", description: settings.language === "ja" ? "設定した時間に学習開始をお知らせします" : "Get notified at your scheduled study time" },
                    { key: "dailyReport", label: settings.language === "ja" ? "デイリーレポート" : "Daily Report", description: settings.language === "ja" ? "毎日の学習成果をまとめてお知らせします" : "Receive daily study summary" },
                    { key: "weeklyReport", label: settings.language === "ja" ? "ウィークリーレポート" : "Weekly Report", description: settings.language === "ja" ? "週間の学習分析をお知らせします" : "Receive weekly analysis" },
                    { key: "achievements", label: settings.language === "ja" ? "達成通知" : "Achievements", description: settings.language === "ja" ? "目標達成時にお知らせします" : "Get notified when you reach goals" },
                  ].map((item) => (
                    <div key={item.key} className={cn("flex items-center justify-between p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-700">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plan Tab */}
            <TabsContent value="plan" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={cn(
                      "bg-white/90 backdrop-blur border-0 shadow-sm relative",
                      plan.recommended && cn("ring-2", settings.colorTheme === "sky" ? "ring-sky-500" : settings.colorTheme === "violet" ? "ring-violet-500" : settings.colorTheme === "emerald" ? "ring-emerald-500" : settings.colorTheme === "rose" ? "ring-rose-500" : "ring-amber-500")
                    )}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className={cn("bg-gradient-to-r text-white border-0", theme.gradient)}>
                          {settings.language === "ja" ? "おすすめ" : "Recommended"}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2 text-slate-800">
                        {plan.id === "premium" && <Crown className="h-5 w-5 text-yellow-500" />}
                        {plan.name}
                      </CardTitle>
                      <p className="text-2xl font-bold text-slate-800">{plan.price}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                            <div className={cn("w-1.5 h-1.5 rounded-full", settings.colorTheme === "sky" ? "bg-sky-500" : settings.colorTheme === "violet" ? "bg-violet-500" : settings.colorTheme === "emerald" ? "bg-emerald-500" : settings.colorTheme === "rose" ? "bg-rose-500" : "bg-amber-500")} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={cn(
                          "w-full",
                          plan.id === "plus" ? cn("bg-gradient-to-r text-white", theme.gradient) : "bg-white"
                        )}
                        variant={plan.id === "plus" ? "default" : "outline"}
                      >
                        {plan.id === "free" ? (settings.language === "ja" ? "現在のプラン" : "Current Plan") : (settings.language === "ja" ? "アップグレード" : "Upgrade")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Shield className="h-5 w-5" />
                    {settings.language === "ja" ? "プライバシー設定" : "Privacy Settings"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: settings.language === "ja" ? "ランキングに表示" : "Show in Rankings", description: settings.language === "ja" ? "学習時間ランキングに自分を表示するかどうか" : "Whether to show yourself in study time rankings" },
                    { label: settings.language === "ja" ? "プロフィールを公開" : "Public Profile", description: settings.language === "ja" ? "他のユーザーからプロフィールを見られるようにする" : "Allow others to view your profile" },
                  ].map((item, i) => (
                    <div key={i} className={cn("flex items-center justify-between p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-700">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-500">{settings.language === "ja" ? "危険な操作" : "Danger Zone"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-700">{settings.language === "ja" ? "データをエクスポート" : "Export Data"}</p>
                      <p className="text-sm text-slate-500">{settings.language === "ja" ? "学習記録をダウンロードします" : "Download your study records"}</p>
                    </div>
                    <Button variant="outline" className="bg-white">{settings.language === "ja" ? "エクスポート" : "Export"}</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-700">{settings.language === "ja" ? "アカウントを削除" : "Delete Account"}</p>
                      <p className="text-sm text-slate-500">{settings.language === "ja" ? "すべてのデータが削除されます" : "All data will be permanently deleted"}</p>
                    </div>
                    <Button variant="destructive">{settings.language === "ja" ? "削除" : "Delete"}</Button>
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
