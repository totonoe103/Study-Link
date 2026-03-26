"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, Flame, Target, BookOpen } from "lucide-react"

const stats = [
  {
    label: "今日の学習時間",
    value: "4時間32分",
    subtext: "目標: 6時間",
    icon: Clock,
    color: "text-[#4AC1E0]",
    bgColor: "bg-[#4AC1E0]/10",
  },
  {
    label: "連続学習日数",
    value: "23日",
    subtext: "過去最高: 45日",
    icon: Flame,
    color: "text-[#FF9F43]",
    bgColor: "bg-[#FF9F43]/10",
  },
  {
    label: "目標達成率",
    value: "82%",
    subtext: "先週比 +5%",
    icon: Target,
    color: "text-[#54D98C]",
    bgColor: "bg-[#54D98C]/10",
  },
  {
    label: "完了した参考書",
    value: "12冊",
    subtext: "残り: 8冊",
    icon: BookOpen,
    color: "text-[#A78BFA]",
    bgColor: "bg-[#A78BFA]/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-white border-gray-100 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.subtext}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
