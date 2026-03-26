"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

const rankings = [
  { rank: 1, name: "佐藤さん", hours: 8.5, change: 0 },
  { rank: 2, name: "鈴木さん", hours: 7.2, change: 1 },
  { rank: 3, name: "田中太郎（あなた）", hours: 6.8, change: -1, isUser: true },
  { rank: 4, name: "山田さん", hours: 6.5, change: 2 },
  { rank: 5, name: "伊藤さん", hours: 6.1, change: -1 },
]

const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-yellow-100 text-yellow-600"
  if (rank === 2) return "bg-gray-100 text-gray-500"
  if (rank === 3) return "bg-amber-100 text-amber-600"
  return "bg-secondary text-muted-foreground"
}

export function RankingCard() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            今日のランキング
          </CardTitle>
          <Link href="/study-room">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Users className="h-4 w-4 mr-1" />
              自習室へ
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {rankings.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 p-2.5 rounded-lg ${
              user.isUser ? "bg-primary/10 ring-1 ring-primary/30" : "bg-secondary/50"
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${getRankStyle(user.rank)}`}>
              {user.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${user.isUser ? "text-primary" : "text-card-foreground"}`}>
                {user.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-card-foreground">{user.hours}h</span>
              <div className={`flex items-center text-xs ${
                user.change > 0 ? "text-primary" : user.change < 0 ? "text-destructive" : "text-muted-foreground"
              }`}>
                {user.change > 0 && <TrendingUp className="h-3 w-3" />}
                {user.change < 0 && <TrendingUp className="h-3 w-3 rotate-180" />}
                {user.change !== 0 && <span>{Math.abs(user.change)}</span>}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
