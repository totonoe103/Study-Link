"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations, examCategoryContent } from "@/lib/settings-context"
import {
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageSquare,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Crown,
  Flame,
} from "lucide-react"

export default function StudyRoomPage() {
  const { settings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const examContent = examCategoryContent[settings.examCategory]

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [inRoom, setInRoom] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOff, setIsVideoOff] = useState(true)

  const studyRooms = [
    { id: "1", name: settings.language === "ja" ? `${examContent.nameJa} もくもく自習室` : `${examContent.name} Study Room`, category: examContent.name, participants: 23, maxParticipants: 50, isLive: true },
    { id: "2", name: settings.language === "ja" ? "集中部屋" : "Focus Room", category: "General", participants: 45, maxParticipants: 50, isLive: true },
    { id: "3", name: settings.language === "ja" ? "深夜自習室" : "Late Night Study", category: "Night", participants: 12, maxParticipants: 30, isLive: true },
    { id: "4", name: settings.language === "ja" ? "数学特訓部屋" : "Math Practice", category: "Subject", participants: 31, maxParticipants: 40, isLive: true },
  ]

  const dailyRanking = [
    { rank: 1, name: settings.language === "ja" ? "佐藤さん" : "User A", hours: 8.5, change: 0, avatar: "A" },
    { rank: 2, name: settings.language === "ja" ? "鈴木さん" : "User B", hours: 7.2, change: 1, avatar: "B" },
    { rank: 3, name: settings.language === "ja" ? "あなた" : "You", hours: 6.8, change: -1, avatar: "U", isUser: true },
    { rank: 4, name: settings.language === "ja" ? "山田さん" : "User D", hours: 6.5, change: 2, avatar: "D" },
    { rank: 5, name: settings.language === "ja" ? "伊藤さん" : "User E", hours: 6.1, change: -1, avatar: "E" },
  ]

  const categories = [
    { id: "all", label: settings.language === "ja" ? "すべて" : "All" },
    { id: examContent.name, label: examContent.name },
    { id: "General", label: settings.language === "ja" ? "一般" : "General" },
    { id: "Subject", label: settings.language === "ja" ? "科目別" : "By Subject" },
  ]

  const filteredRooms = selectedCategory === "all"
    ? studyRooms
    : studyRooms.filter((room) => room.category === selectedCategory)

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-600 border-yellow-300"
    if (rank === 2) return "bg-gray-100 text-gray-500 border-gray-300"
    if (rank === 3) return "bg-amber-100 text-amber-600 border-amber-300"
    return "bg-slate-100 text-slate-500 border-slate-200"
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", theme.light)}>
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="pt-12 md:pt-0">
            <h1 className="text-2xl font-bold text-slate-800">
              {settings.language === "ja" ? "自習室 / Study Room" : "Study Room"}
            </h1>
            <p className="text-slate-500 mt-1">
              {settings.language === "ja" ? "仲間と一緒に勉強しよう" : "Study together with others"}
            </p>
          </div>

          <Tabs defaultValue="rooms" className="space-y-6">
            <TabsList className="bg-white/80 border">
              <TabsTrigger value="rooms">{settings.language === "ja" ? "自習室" : "Rooms"}</TabsTrigger>
              <TabsTrigger value="ranking">{settings.language === "ja" ? "ランキング" : "Ranking"}</TabsTrigger>
              <TabsTrigger value="team">{settings.language === "ja" ? "チーム対抗戦" : "Team Battle"}</TabsTrigger>
            </TabsList>

            {/* Rooms Tab */}
            <TabsContent value="rooms" className="space-y-6">
              {/* Active Room */}
              {inRoom && (
                <Card className={cn("bg-white/90 backdrop-blur border-0 shadow-sm ring-2", settings.colorTheme === "sky" ? "ring-sky-500" : settings.colorTheme === "violet" ? "ring-violet-500" : settings.colorTheme === "emerald" ? "ring-emerald-500" : settings.colorTheme === "rose" ? "ring-rose-500" : "ring-amber-500")}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {studyRooms[0].name}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-600 border-0">
                        {settings.language === "ja" ? "参加中" : "In Room"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {["A", "B", "C", "D", "E"].map((avatar, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600"
                          >
                            {avatar}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                          +18
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">
                        {settings.language === "ja" ? "23人が参加中" : "23 participants"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={isMuted ? "secondary" : "default"}
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                        className={!isMuted ? cn("bg-gradient-to-r text-white", theme.gradient) : ""}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={isVideoOff ? "secondary" : "default"}
                        size="icon"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={!isVideoOff ? cn("bg-gradient-to-r text-white", theme.gradient) : ""}
                      >
                        {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      </Button>
                      <Button variant="secondary" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant="destructive"
                        onClick={() => setInRoom(false)}
                        className="gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {settings.language === "ja" ? "退出" : "Leave"}
                      </Button>
                    </div>

                    <div className={cn("p-3 rounded-lg bg-gradient-to-r", theme.light)}>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className={cn("h-4 w-4", theme.text)} />
                        <span className="text-slate-500">{settings.language === "ja" ? "参加時間:" : "Time:"}</span>
                        <span className="font-medium text-slate-700">1h 32min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "shrink-0",
                      selectedCategory === category.id ? cn("bg-gradient-to-r text-white", theme.gradient) : "bg-white"
                    )}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Room List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRooms.map((room) => (
                  <Card key={room.id} className="bg-white/90 backdrop-blur border-0 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <h3 className="font-medium text-slate-800">{room.name}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {room.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Users className="h-4 w-4" />
                            <span>{room.participants}/{room.maxParticipants}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => setInRoom(true)}
                          disabled={inRoom}
                          className={cn("bg-gradient-to-r text-white", theme.gradient)}
                        >
                          {settings.language === "ja" ? "参加" : "Join"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Ranking Tab */}
            <TabsContent value="ranking" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Ranking */}
                <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-yellow-600">
                      <Trophy className="h-5 w-5" />
                      {settings.language === "ja" ? "今日のランキング" : "Today's Ranking"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dailyRanking.map((user) => (
                      <div
                        key={user.rank}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg",
                          user.isUser ? cn("ring-2 bg-gradient-to-r", theme.light, settings.colorTheme === "sky" ? "ring-sky-300" : settings.colorTheme === "violet" ? "ring-violet-300" : settings.colorTheme === "emerald" ? "ring-emerald-300" : settings.colorTheme === "rose" ? "ring-rose-300" : "ring-amber-300") : "bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border",
                          getRankStyle(user.rank)
                        )}>
                          {user.rank <= 3 ? <Crown className="h-4 w-4" /> : user.rank}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                          {user.avatar}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-medium",
                            user.isUser ? theme.text : "text-slate-700"
                          )}>
                            {user.name}
                            {user.isUser && <span className="text-xs text-slate-400 ml-1">({settings.language === "ja" ? "あなた" : "You"})</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{user.hours}h</span>
                          <div className={cn(
                            "flex items-center text-xs",
                            user.change > 0 ? "text-green-500" : user.change < 0 ? "text-red-500" : "text-slate-400"
                          )}>
                            {user.change > 0 && <TrendingUp className="h-3 w-3" />}
                            {user.change < 0 && <TrendingUp className="h-3 w-3 rotate-180" />}
                            {user.change !== 0 && <span>{Math.abs(user.change)}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Weekly Stats */}
                <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-orange-500">
                      <Flame className="h-5 w-5" />
                      {settings.language === "ja" ? "あなたの記録" : "Your Stats"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={cn("p-4 rounded-lg text-center bg-gradient-to-r", theme.light)}>
                        <p className="text-sm text-slate-500">{settings.language === "ja" ? "今日の順位" : "Today's Rank"}</p>
                        <p className={cn("text-3xl font-bold", theme.text)}>3rd</p>
                        <p className="text-xs text-slate-400 mt-1">{settings.language === "ja" ? "全国 1,234人中" : "of 1,234"}</p>
                      </div>
                      <div className={cn("p-4 rounded-lg text-center bg-gradient-to-r", theme.light)}>
                        <p className="text-sm text-slate-500">{settings.language === "ja" ? "今日の学習" : "Today"}</p>
                        <p className="text-3xl font-bold text-slate-700">6.8h</p>
                        <p className={cn("text-xs mt-1", theme.text)}>{settings.language === "ja" ? "目標達成!" : "Goal reached!"}</p>
                      </div>
                    </div>
                    <div className={cn("p-4 rounded-lg bg-gradient-to-r", theme.light)}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">{settings.language === "ja" ? "週間学習時間" : "Weekly Hours"}</p>
                        <p className="text-sm font-medium text-slate-700">32.5h / 42h</p>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full bg-gradient-to-r", theme.gradient)} style={{ width: "77%" }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: settings.language === "ja" ? "連続学習" : "Streak", value: "23", icon: Flame },
                        { label: settings.language === "ja" ? "累計時間" : "Total", value: "245h", icon: Clock },
                        { label: settings.language === "ja" ? "最高順位" : "Best", value: "1st", icon: Trophy },
                      ].map((stat) => (
                        <div key={stat.label} className={cn("p-3 rounded-lg text-center bg-gradient-to-r", theme.light)}>
                          <stat.icon className={cn("h-4 w-4 mx-auto mb-1", theme.text)} />
                          <p className="text-lg font-bold text-slate-700">{stat.value}</p>
                          <p className="text-xs text-slate-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Team Battle Tab */}
            <TabsContent value="team" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className={cn("text-lg flex items-center gap-2", theme.text)}>
                    <Users className="h-5 w-5" />
                    {settings.language === "ja" ? "チーム対抗戦" : "Team Battle"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-500">
                    {settings.language === "ja" 
                      ? "5人1組のチームで他のチームと学習時間を競います。" 
                      : "Compete with other teams in study hours. 5 members per team."}
                  </p>

                  {/* Battle Card */}
                  <div className={cn("p-6 rounded-xl bg-gradient-to-r", theme.light)}>
                    <div className="grid grid-cols-3 gap-4 items-center">
                      {/* My Team */}
                      <div className="text-center">
                        <Badge className={cn("mb-2 bg-gradient-to-r text-white border-0", theme.gradient)}>
                          {settings.language === "ja" ? "あなたのチーム" : "Your Team"}
                        </Badge>
                        <h3 className="text-xl font-bold text-slate-800">Team A</h3>
                        <p className={cn("text-3xl font-bold mt-2", theme.text)}>32.5h</p>
                        <div className="flex -space-x-2 justify-center mt-3">
                          {["A", "B", "C", "D", "E"].map((member, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-xs font-medium text-slate-600"
                            >
                              {member}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* VS */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-orange-500">VS</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                          {settings.language === "ja" ? "残り 2日" : "2 days left"}
                        </p>
                      </div>

                      {/* Opponent */}
                      <div className="text-center">
                        <Badge className="mb-2 bg-slate-200 text-slate-600 border-0">
                          {settings.language === "ja" ? "相手チーム" : "Opponent"}
                        </Badge>
                        <h3 className="text-xl font-bold text-slate-800">Team B</h3>
                        <p className="text-3xl font-bold text-slate-500 mt-2">35.2h</p>
                        <p className="text-sm text-orange-500 mt-3">
                          {settings.language === "ja" ? "2.7h リード中" : "Leading by 2.7h"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">
                      {settings.language === "ja" ? "チームメンバー" : "Team Members"}
                    </h4>
                    <div className="space-y-2">
                      {["Alice", "Bob", "Charlie", "David", "You"].map((member, i) => (
                        <div key={i} className={cn("flex items-center justify-between p-3 rounded-lg bg-gradient-to-r", theme.light)}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-medium text-slate-600">
                              {member.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {member}
                              {member === "You" && <span className="text-xs text-slate-400 ml-1">({settings.language === "ja" ? "あなた" : "You"})</span>}
                            </span>
                          </div>
                          <span className="text-sm text-slate-500">{(6 + i * 0.5).toFixed(1)}h</span>
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
