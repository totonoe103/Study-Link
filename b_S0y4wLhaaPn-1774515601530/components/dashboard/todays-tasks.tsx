"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Clock, RefreshCw, BookOpen } from "lucide-react"

interface Task {
  id: string
  title: string
  subject: string
  duration: string
  completed: boolean
  book?: string
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "英単語帳 Section 15-20",
    subject: "英語",
    duration: "45分",
    completed: true,
    book: "ターゲット1900",
  },
  {
    id: "2",
    title: "数学IA 二次関数 演習問題",
    subject: "数学",
    duration: "60分",
    completed: true,
    book: "青チャート",
  },
  {
    id: "3",
    title: "物理 力学 基礎問題",
    subject: "物理",
    duration: "45分",
    completed: false,
    book: "物理のエッセンス",
  },
  {
    id: "4",
    title: "英文法 関係代名詞",
    subject: "英語",
    duration: "30分",
    completed: false,
    book: "Vintage",
  },
  {
    id: "5",
    title: "現代文 評論読解",
    subject: "国語",
    duration: "40分",
    completed: false,
    book: "現代文キーワード読解",
  },
]

const subjectColors: Record<string, string> = {
  英語: "bg-chart-3/20 text-chart-3",
  数学: "bg-primary/20 text-primary",
  物理: "bg-accent/20 text-accent",
  国語: "bg-chart-4/20 text-chart-4",
}

export function TodaysTasks() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const progressPercent = (completedCount / tasks.length) * 100

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-card-foreground">今日のタスク</CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            リスケ
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">進捗</span>
            <span className="text-foreground font-medium">{completedCount}/{tasks.length} 完了</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg transition-colors",
              task.completed ? "bg-secondary/50" : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                task.completed ? "text-muted-foreground line-through" : "text-card-foreground"
              )}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  subjectColors[task.subject] || "bg-secondary text-muted-foreground"
                )}>
                  {task.subject}
                </span>
                {task.book && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    {task.book}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {task.duration}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
