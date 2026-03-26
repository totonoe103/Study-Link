"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations, mentorPersonalities } from "@/lib/settings-context"
import {
  Send,
  Sparkles,
  Settings,
  BookOpen,
  Target,
  TrendingUp,
  MessageSquare,
  Mic,
  Paperclip,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  { icon: BookOpen, labelKey: "askQuestion" },
  { icon: Target, labelKey: "getTips" },
  { icon: TrendingUp, labelKey: "progress" },
  { icon: MessageSquare, labelKey: "openChat" },
]

export default function AIMentorPage() {
  const { settings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const mentor = mentorPersonalities[settings.mentorPersonality]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: mentor.greeting[settings.language],
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update greeting when mentor personality changes
  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: mentor.greeting[settings.language],
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
    ])
  }, [settings.mentorPersonality, settings.language, mentor.greeting])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const responses = {
        en: [
          "That's a great question! Let me help you with that. Based on your progress, I recommend focusing on the topics we discussed earlier.",
          "You're doing amazing! Take a short break if needed, then continue with renewed energy.",
          "Looking at your data, you're making excellent progress. Keep up the great work!",
        ],
        ja: [
          "素晴らしい質問ですね！お手伝いしますね。進捗を見ると、先ほど話し合ったトピックに集中することをお勧めします。",
          "素晴らしい頑張りです！必要なら短い休憩を取って、新たな気持ちで続けましょう。",
          "データを見ると、素晴らしい進歩をしています。この調子で頑張りましょう！",
        ],
        zh: [
          "这是个好问题！让我来帮助你。根据你的进度，我建议专注于我们之前讨论的主题。",
          "你做得很棒！如果需要的话休息一下，然后以新的活力继续。",
          "看你的数据，你进步很大。继续保持！",
        ],
        ko: [
          "좋은 질문이에요! 도와드릴게요. 진행 상황을 보면, 앞서 이야기한 주제에 집중하는 것이 좋을 것 같아요.",
          "정말 잘하고 있어요! 필요하다면 잠시 쉬고, 새로운 에너지로 계속하세요.",
          "데이터를 보니 훌륭한 진전을 보이고 있어요. 계속 힘내세요!",
        ],
      }
      
      const langResponses = responses[settings.language] || responses.en
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: langResponses[Math.floor(Math.random() * langResponses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMentorAvatar = () => {
    switch (settings.mentorPersonality) {
      case "gentle": return "🤗"
      case "strict": return "💪"
      case "logical": return "🧠"
      case "cheerful": return "😄"
      default: return "🤗"
    }
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", theme.light)}>
      <Sidebar />
      <main className="md:ml-64 flex flex-col h-screen">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between pt-12 md:pt-0">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-r", theme.gradient)}>
                  {getMentorAvatar()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    {t.aiMentor} / {settings.language === "ja" ? "AIメンター" : "AI Mentor"}
                  </h1>
                  <p className="text-sm text-slate-500">{mentor.name} - {t[settings.mentorPersonality]}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {/* Mentor Type Selection */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {(["gentle", "strict", "logical", "cheerful"] as const).map((personality) => (
                <Button
                  key={personality}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "shrink-0 bg-white",
                    settings.mentorPersonality === personality && cn("ring-2", settings.colorTheme === "sky" ? "ring-sky-500" : settings.colorTheme === "violet" ? "ring-violet-500" : settings.colorTheme === "emerald" ? "ring-emerald-500" : settings.colorTheme === "rose" ? "ring-rose-500" : "ring-amber-500")
                  )}
                >
                  <span className="mr-2">
                    {personality === "gentle" ? "🤗" : personality === "strict" ? "💪" : personality === "logical" ? "🧠" : "😄"}
                  </span>
                  {t[personality]}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                {message.role === "assistant" && (
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg bg-gradient-to-r", theme.gradient)}>
                    {getMentorAvatar()}
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? cn("rounded-tr-sm text-white bg-gradient-to-r", theme.gradient)
                      : "bg-white text-slate-700 rounded-tl-sm shadow-sm"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1.5",
                    message.role === "user" ? "text-white/70" : "text-slate-400"
                  )}>
                    {message.timestamp.toLocaleTimeString(settings.language === "ja" ? "ja-JP" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg bg-gradient-to-r", theme.gradient)}>
                  {getMentorAvatar()}
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className={cn("w-2 h-2 rounded-full animate-bounce", settings.colorTheme === "sky" ? "bg-sky-400" : settings.colorTheme === "violet" ? "bg-violet-400" : settings.colorTheme === "emerald" ? "bg-emerald-400" : settings.colorTheme === "rose" ? "bg-rose-400" : "bg-amber-400")} style={{ animationDelay: "0ms" }} />
                    <span className={cn("w-2 h-2 rounded-full animate-bounce", settings.colorTheme === "sky" ? "bg-sky-400" : settings.colorTheme === "violet" ? "bg-violet-400" : settings.colorTheme === "emerald" ? "bg-emerald-400" : settings.colorTheme === "rose" ? "bg-rose-400" : "bg-amber-400")} style={{ animationDelay: "150ms" }} />
                    <span className={cn("w-2 h-2 rounded-full animate-bounce", settings.colorTheme === "sky" ? "bg-sky-400" : settings.colorTheme === "violet" ? "bg-violet-400" : settings.colorTheme === "emerald" ? "bg-emerald-400" : settings.colorTheme === "rose" ? "bg-rose-400" : "bg-amber-400")} style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 md:px-6 py-2 bg-white/50">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action) => (
                <Button
                  key={action.labelKey}
                  variant="outline"
                  size="sm"
                  className="shrink-0 bg-white"
                  onClick={() => setInput(t[action.labelKey])}
                >
                  <action.icon className="h-4 w-4 mr-1.5" />
                  {t[action.labelKey]}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 md:p-6 border-t border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={settings.language === "ja" ? "メッセージを入力..." : "Type a message..."}
                className="flex-1 bg-white"
              />
              <Button variant="ghost" size="icon" className="shrink-0">
                <Mic className="h-5 w-5" />
              </Button>
              <Button onClick={handleSend} disabled={!input.trim()} className={cn("shrink-0 bg-gradient-to-r text-white", theme.gradient)}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
