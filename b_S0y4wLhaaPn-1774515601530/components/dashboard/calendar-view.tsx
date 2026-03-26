"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const days = ["日", "月", "火", "水", "木", "金", "土"]

// Seeded random for consistent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate calendar data for current month (deterministic)
const generateCalendarData = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDate = today.getDate()

  const calendar: { day: number | null; studied: boolean; hours: number }[] = []
  
  // Empty cells for days before the first of the month
  for (let i = 0; i < firstDay; i++) {
    calendar.push({ day: null, studied: false, hours: 0 })
  }
  
  // Days of the month with deterministic random values
  for (let i = 1; i <= daysInMonth; i++) {
    const isPast = i < todayDate
    const isToday = i === todayDate
    const seed = year * 10000 + month * 100 + i
    const studied = isPast ? seededRandom(seed) > 0.2 : isToday
    const hours = studied ? Math.floor(seededRandom(seed + 1) * 6) + 2 : 0
    calendar.push({ day: i, studied, hours })
  }
  
  return calendar
}

const calendarData = generateCalendarData()

const getIntensityClass = (hours: number) => {
  if (hours === 0) return "bg-secondary"
  if (hours < 3) return "bg-primary/30"
  if (hours < 5) return "bg-primary/60"
  return "bg-primary"
}

export function CalendarView() {
  const today = new Date().getDate()
  
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-card-foreground">学習カレンダー</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {days.map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar cells */}
          {calendarData.map((cell, index) => (
            <div
              key={index}
              className={cn(
                "aspect-square rounded-md flex items-center justify-center text-xs transition-all cursor-pointer hover:ring-1 hover:ring-primary/50",
                cell.day === null ? "bg-transparent" : getIntensityClass(cell.hours),
                cell.day === today && "ring-2 ring-primary",
                cell.studied && cell.day !== null ? "text-primary-foreground" : "text-muted-foreground"
              )}
              title={cell.day ? `${cell.day}日: ${cell.hours}時間` : ""}
            >
              {cell.day}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>少</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-secondary" />
            <div className="w-3 h-3 rounded bg-primary/30" />
            <div className="w-3 h-3 rounded bg-primary/60" />
            <div className="w-3 h-3 rounded bg-primary" />
          </div>
          <span>多</span>
        </div>
      </CardContent>
    </Card>
  )
}
