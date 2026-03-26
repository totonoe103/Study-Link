"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"

export function AIMentorPreview() {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AIメンター
          </CardTitle>
          <Link href="/ai-mentor">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              チャットを開く
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="bg-secondary rounded-lg rounded-tl-none p-3 text-sm text-card-foreground">
            <p>お疲れさまです！今日も順調に学習を進めていますね。</p>
            <p className="mt-2">現在の進捗から見ると、<span className="text-primary font-medium">数学の二次関数</span>の理解度が高まっています。次は物理の力学に取り組んでみましょう!</p>
          </div>
        </div>
        
        <div className="flex gap-2 ml-11">
          <Button size="sm" variant="outline" className="text-xs">
            今日の計画を見る
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            苦手分析をする
          </Button>
        </div>
        
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>現在のメンタータイプ: <span className="text-primary font-medium">癒やし系お姉さん</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
