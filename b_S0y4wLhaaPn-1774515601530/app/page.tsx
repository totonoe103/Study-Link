"use client"

import { useState } from "react"
import { Book, MessageCircle, ChevronRight, Clock, Target, Flame, Calendar, TrendingUp, CheckCircle2, FileText, GraduationCap, Lock, Share2, Users, UserCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SettingsModal } from "@/components/settings-modal"
import {
  useSettings,
  colorThemes,
  translations,
  examCategoryContent,
  mentorPersonalities,
} from "@/lib/settings-context"

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const { settings } = useSettings()
  
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]
  const categoryContent = examCategoryContent[settings.examCategory]
  const mentor = mentorPersonalities[settings.mentorPersonality]

  // Task colors based on theme
  const taskColors = [
    `bg-${theme.primary}-500`,
    `bg-${theme.primary}-400`,
    `bg-${theme.primary}-600`,
  ]

  const progressToGoal = 67
  const daysUntilExam = 120
  const studyStreak = 14
  const predictedGrade = "A*"

  const pastPapers = {
    completed: 8,
    total: 25,
    percentage: 32
  }

  // Only show bilingual text when not Japanese
  const showBilingual = settings.language !== 'ja'

  const handleShare = (type: 'teacher' | 'parent') => {
    // Generate a shareable link (mock implementation)
    const shareLink = `https://reverse-ai.app/share/${type}/${Date.now()}`
    navigator.clipboard.writeText(shareLink)
    setShareSuccess(true)
    setTimeout(() => {
      setShareSuccess(false)
      setShareOpen(false)
    }, 2000)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.light}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">{settings.language === 'ja' ? '逆算AI' : 'Reverse AI'}</h1>
              {showBilingual && <p className={`text-xs ${theme.text}`}>逆算AI</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 px-3 py-1.5 rounded-full text-sm font-medium">
              <Flame className="w-4 h-4" />
              <span>{studyStreak} {settings.language === 'ja' ? '日連続' : 'days'}</span>
            </div>
            {/* Share Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShareOpen(!shareOpen)}
                className={`w-9 h-9 rounded-full ${theme.text} hover:bg-slate-100`}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              
              {/* Share Dropdown */}
              {shareOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className={`bg-gradient-to-r ${theme.gradient} p-3`}>
                    <h3 className="text-white font-semibold text-sm">{t.shareProgress}</h3>
                  </div>
                  {shareSuccess ? (
                    <div className="p-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-700">{t.shareSuccess}</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => handleShare('teacher')}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                          <UserCheck className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-slate-800">{t.shareWithTeacher}</p>
                          <p className="text-xs text-slate-400">{settings.language === 'ja' ? '進捗レポートを送信' : 'Send progress report'}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => handleShare('parent')}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center`}>
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-slate-800">{t.shareWithParent}</p>
                          <p className="text-xs text-slate-400">{settings.language === 'ja' ? '進捗レポートを送信' : 'Send progress report'}</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <SettingsModal />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-28">
        {/* Exam Category Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${theme.gradient} text-white`}>
            <GraduationCap className="w-3.5 h-3.5" />
            {settings.language === 'ja' ? categoryContent.nameJa : showBilingual ? `${categoryContent.name} / ${categoryContent.nameJa}` : categoryContent.name}
          </span>
        </div>

        {/* Progress to Goal */}
        <section className="mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-100/50 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">{t.progressToGoal}</h2>
                  {showBilingual && <p className={`text-sm ${theme.text}`}>Progress to Goal</p>}
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>{progressToGoal}%</p>
                  <p className="text-xs text-slate-400">{daysUntilExam} {t.daysLeft}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${progressToGoal}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className={`text-center p-3 bg-gradient-to-br ${theme.light} rounded-2xl`}>
                  <GraduationCap className={`w-5 h-5 ${theme.text} mx-auto mb-1`} />
                  <p className="text-xl font-bold text-slate-800">{predictedGrade}</p>
                  <p className="text-[10px] text-slate-500">{t.predicted}</p>
                </div>
                <div className={`text-center p-3 bg-gradient-to-br ${theme.light} rounded-2xl`}>
                  <FileText className={`w-5 h-5 ${theme.text} mx-auto mb-1`} />
                  <p className="text-xl font-bold text-slate-800">{pastPapers.completed}/{pastPapers.total}</p>
                  <p className="text-[10px] text-slate-500">{t.pastPapers}</p>
                </div>
                <div className={`text-center p-3 bg-gradient-to-br ${theme.light} rounded-2xl`}>
                  <Calendar className={`w-5 h-5 ${theme.text} mx-auto mb-1`} />
                  <p className="text-xl font-bold text-slate-800">{daysUntilExam}</p>
                  <p className="text-[10px] text-slate-500">{t.daysLeft}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Today's Topics */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-800">{t.todaysTopics}</h2>
              {showBilingual && <p className={`text-xs ${theme.text}`}>Today&apos;s Topics</p>}
            </div>
            <Link href="/schedule" className={`${theme.text} text-xs flex items-center gap-0.5 hover:opacity-70`}>
              {t.viewAll} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {categoryContent.subjects.map((task, index) => (
              <Card 
                key={task.id} 
                className={`bg-white/80 backdrop-blur-sm border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${task.completed ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    <div className={`w-1.5 ${index === 0 ? `bg-${theme.primary}-500` : index === 1 ? `bg-${theme.primary}-400` : `bg-${theme.primary}-300`}`} />
                    
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Subject & Exam Board */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-white bg-gradient-to-r ${theme.gradient}`}>
                              {task.subject}
                            </span>
                            <span className={`text-[10px] ${theme.text} bg-slate-50 px-2 py-0.5 rounded-full`}>
                              {task.examBoard}
                            </span>
                          </div>

                          {/* Topic Title */}
                          <h3 className={`text-base font-semibold mb-0.5 ${task.completed ? 'line-through text-slate-300' : 'text-slate-800'}`}>
                            {settings.language === 'ja' ? task.topicJa : task.topic}
                          </h3>
                          {showBilingual && <p className="text-xs text-slate-400 mb-2">{task.topicJa}</p>}

                          {/* Progress Bar */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className={`text-[10px] ${theme.text} font-medium`}>{task.progress}%</span>
                          </div>
                        </div>

                        {/* Time & Action */}
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.timeEstimate}
                          </span>
                          {task.completed ? (
                            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                          ) : (
                            <Button 
                              size="sm"
                              className={`bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white rounded-xl text-xs h-9 px-4`}
                            >
                              {t.start}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Paper Tracker */}
        <section className="mb-6">
          <Card className={`bg-gradient-to-r ${theme.gradient} border-0 shadow-lg overflow-hidden`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-white/80 text-xs mb-0.5">{t.pastPapers}{showBilingual ? ' / Past Paper Progress' : ''}</p>
                  <p className="text-2xl font-bold">{pastPapers.completed} / {pastPapers.total}</p>
                  <p className="text-white/80 text-xs">{pastPapers.percentage}% {t.completed}</p>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white/90 text-slate-700 hover:bg-white rounded-xl text-sm"
                >
                  {t.viewAll}
                </Button>
              </div>
              <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${pastPapers.percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Study Route - Premium */}
        <section>
          <Card className="bg-white/60 backdrop-blur-sm border-slate-100/50 shadow-sm overflow-hidden">
            <CardContent className="p-5 relative">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">{t.studyRoute}</p>
                  <p className="text-xs text-slate-500 mb-3">{t.unlockPremium}</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" className="text-xs border-slate-200 text-slate-600 rounded-xl">
                      {t.watchAd}
                    </Button>
                    <Button size="sm" className={`text-xs bg-gradient-to-r ${theme.gradient} text-white rounded-xl`}>
                      {t.goPremium}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="opacity-30">
                <h3 className="text-base font-semibold text-slate-800 mb-3">Recommended Route</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-slate-200 rounded" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">Physics Textbook</p>
                      <p className="text-xs text-slate-500">Step 1 of 5</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* AI Mentor Chat Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-br ${theme.gradient} hover:opacity-90 shadow-lg flex items-center justify-center border-2 border-white`}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
        
        {/* Chat Popup */}
        {chatOpen && (
          <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${theme.gradient} p-3`}>
              <h3 className="text-white font-semibold text-sm">{mentor.name} - {t.aiMentor}</h3>
              {showBilingual && <p className="text-white/80 text-xs">AIメンター</p>}
            </div>
            <div className="p-3 space-y-2">
              <div className={`bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700`}>
                {mentor.greeting[settings.language]}
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className={`text-[10px] border-slate-200 text-slate-600 hover:bg-slate-50 h-7 px-2`}>
                  {t.askQuestion}
                </Button>
                <Button size="sm" variant="outline" className={`text-[10px] border-slate-200 text-slate-600 hover:bg-slate-50 h-7 px-2`}>
                  {t.getTips}
                </Button>
              </div>
              <Link href="/ai-mentor">
                <Button className={`w-full bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white text-xs h-8 rounded-xl`}>
                  {t.openChat}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100/50 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <Link href="/" className={`flex flex-col items-center gap-0.5 ${theme.text} py-1 px-4`}>
              <Target className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t.home}</span>
            </Link>
            <Link href="/schedule" className={`flex flex-col items-center gap-0.5 text-slate-300 hover:${theme.text} py-1 px-4`}>
              <Calendar className="w-5 h-5" />
              <span className="text-[10px]">{t.schedule}</span>
            </Link>
            <Link href="/books" className={`flex flex-col items-center gap-0.5 text-slate-300 hover:${theme.text} py-1 px-4`}>
              <Book className="w-5 h-5" />
              <span className="text-[10px]">{t.books}</span>
            </Link>
            <Link href="/progress" className={`flex flex-col items-center gap-0.5 text-slate-300 hover:${theme.text} py-1 px-4`}>
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px]">{t.progress}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
