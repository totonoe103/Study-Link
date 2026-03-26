"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSettings, colorThemes, translations } from "@/lib/settings-context"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  BookOpen,
  Target,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { settings } = useSettings()
  const t = translations[settings.language]
  const theme = colorThemes[settings.colorTheme]

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: t.home },
    { href: "/schedule", icon: Calendar, label: t.schedule },
    { href: "/books", icon: BookOpen, label: t.books },
    { href: "/ai-mentor", icon: MessageSquare, label: t.aiMentor },
    { href: "/study-room", icon: Users, label: "Study Room" },
    { href: "/progress", icon: TrendingUp, label: t.progress },
    { href: "/goals", icon: Target, label: "Goals" },
    { href: "/settings", icon: Settings, label: t.settings },
  ]

  // Dynamic color classes based on theme
  const getThemeClasses = () => {
    switch (settings.colorTheme) {
      case "sky":
        return { bg: "bg-sky-500", hover: "hover:bg-sky-600", text: "text-sky-500" }
      case "violet":
        return { bg: "bg-violet-500", hover: "hover:bg-violet-600", text: "text-violet-500" }
      case "emerald":
        return { bg: "bg-emerald-500", hover: "hover:bg-emerald-600", text: "text-emerald-500" }
      case "rose":
        return { bg: "bg-rose-500", hover: "hover:bg-rose-600", text: "text-rose-500" }
      case "amber":
        return { bg: "bg-amber-500", hover: "hover:bg-amber-600", text: "text-amber-500" }
      case "kawaii":
        return { bg: "bg-gradient-to-br from-pink-300 to-rose-400", hover: "hover:from-pink-400 hover:to-rose-500", text: "text-pink-500" }
      default:
        return { bg: "bg-sky-500", hover: "hover:bg-sky-600", text: "text-sky-500" }
    }
  }

  const themeClasses = getThemeClasses()

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn("fixed top-4 left-4 z-50 md:hidden text-white", themeClasses.bg, themeClasses.hover)}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar with dynamic color */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 transition-transform duration-300 md:translate-x-0",
          themeClasses.bg,
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">逆算AI</h1>
              <p className="text-xs text-white/80">Gyakusan AI</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? cn("bg-white", themeClasses.text)
                      : "text-white hover:bg-white/20"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/20">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className={cn("text-xs font-bold", themeClasses.text)}>U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">User</p>
                <p className="text-xs text-white/80">Premium</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
