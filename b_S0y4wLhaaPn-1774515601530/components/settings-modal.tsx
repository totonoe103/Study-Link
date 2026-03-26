"use client"

import { useState } from "react"
import { Settings, X, Globe, Palette, GraduationCap, Bot, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useSettings,
  colorThemes,
  translations,
  type Language,
  type ColorTheme,
  type ExamCategory,
  type MentorPersonality,
} from "@/lib/settings-context"

const languages: Array<{ code: Language; name: string; flag: string }> = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
]

const examCategories: Array<{ code: ExamCategory; name: string; nameJa: string }> = [
  { code: "japanese", name: "Japanese Entrance", nameJa: "日本の大学入試" },
  { code: "alevel", name: "A-Level", nameJa: "Aレベル" },
  { code: "ib", name: "IB", nameJa: "国際バカロレア" },
  { code: "sat", name: "SAT / ACT", nameJa: "SAT / ACT" },
  { code: "ap", name: "AP Exams", nameJa: "APテスト" },
]

const mentorTypes: Array<{ code: MentorPersonality; name: string; nameJa: string }> = [
  { code: "gentle", name: "Gentle & Supportive", nameJa: "優しい・サポート型" },
  { code: "strict", name: "Strict & Motivating", nameJa: "厳格・モチベーション型" },
  { code: "logical", name: "Logical & Analytical", nameJa: "論理的・分析型" },
  { code: "cheerful", name: "Cheerful & Fun", nameJa: "明るい・楽しい型" },
]

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSettings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 rounded-full hover:bg-white/50"
      >
        <Settings className="w-5 h-5 text-slate-600" />
      </Button>
    )
  }

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      {/* Modal - True Center */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div 
          className="w-full max-w-md pointer-events-auto bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Fixed Header */}
          <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} flex items-center justify-between shrink-0`}>
            <h2 className="text-lg font-semibold text-white">{t.settings}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Language Selection */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">{t.language}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => updateSettings({ language: lang.code })}
                    className={`p-3 rounded-xl border-2 transition-all text-left flex items-center gap-2 ${
                      settings.language === lang.code
                        ? "border-sky-400 bg-sky-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className={`text-sm font-medium ${settings.language === lang.code ? "text-sky-600" : "text-slate-700"}`}>
                      {lang.name}
                    </span>
                    {settings.language === lang.code && (
                      <Check className="w-4 h-4 ml-auto text-sky-500" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Color Theme Selection */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">{t.colorTheme}</h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {(Object.keys(colorThemes) as ColorTheme[]).map((themeKey) => (
                  <button
                    key={themeKey}
                    onClick={() => updateSettings({ colorTheme: themeKey })}
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${colorThemes[themeKey].gradient} transition-all ${
                      settings.colorTheme === themeKey
                        ? "ring-4 ring-offset-2 ring-slate-300 scale-110"
                        : "hover:scale-105"
                    }`}
                    aria-label={`Select ${themeKey} theme`}
                  />
                ))}
              </div>
            </section>

            {/* Exam Category Selection */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">{t.examCategory}</h3>
              </div>
              <div className="space-y-2">
                {examCategories
                  .filter((cat) => {
                    // Hide Japanese Entrance Exam for Korean and Chinese users
                    if ((settings.language === 'ko' || settings.language === 'zh') && cat.code === 'japanese') {
                      return false
                    }
                    return true
                  })
                  .map((cat) => (
                  <button
                    key={cat.code}
                    onClick={() => updateSettings({ examCategory: cat.code })}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                      settings.examCategory === cat.code
                        ? "border-sky-400 bg-sky-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-medium ${settings.examCategory === cat.code ? "text-sky-600" : "text-slate-700"}`}>
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-500">{cat.nameJa}</p>
                    </div>
                    {settings.examCategory === cat.code && (
                      <Check className="w-4 h-4 text-sky-500" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* AI Mentor Personality */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">{t.aiMentor}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mentorTypes.map((mentor) => (
                  <button
                    key={mentor.code}
                    onClick={() => updateSettings({ mentorPersonality: mentor.code })}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      settings.mentorPersonality === mentor.code
                        ? "border-sky-400 bg-sky-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center text-xl ${
                      mentor.code === "gentle" ? "bg-pink-100" :
                      mentor.code === "strict" ? "bg-orange-100" :
                      mentor.code === "logical" ? "bg-blue-100" :
                      "bg-yellow-100"
                    }`}>
                      {mentor.code === "gentle" ? "🤗" : mentor.code === "strict" ? "💪" : mentor.code === "logical" ? "🧠" : "😄"}
                    </div>
                    <p className={`text-xs font-medium leading-tight ${settings.mentorPersonality === mentor.code ? "text-sky-600" : "text-slate-700"}`}>
                      {settings.language === "ja" ? mentor.nameJa : mentor.name}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Fixed Footer */}
          <div className="px-5 py-4 border-t border-slate-100 shrink-0 bg-white">
            <Button
              onClick={() => setIsOpen(false)}
              className={`w-full bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white rounded-xl h-11 font-medium`}
            >
              {t.save}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
