"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "月", 学習時間: 4.5, 目標: 6 },
  { day: "火", 学習時間: 5.2, 目標: 6 },
  { day: "水", 学習時間: 6.1, 目標: 6 },
  { day: "木", 学習時間: 4.8, 目標: 6 },
  { day: "金", 学習時間: 5.5, 目標: 6 },
  { day: "土", 学習時間: 7.2, 目標: 6 },
  { day: "日", 学習時間: 4.3, 目標: 6 },
]

export function ProgressChart() {
  return (
    <Card className="bg-white border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-800">週間学習時間</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4AC1E0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4AC1E0" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: "#374151",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ color: "#6B7280" }}
              />
              <Area
                type="monotone"
                dataKey="学習時間"
                stroke="#4AC1E0"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorStudy)"
              />
              <Area
                type="monotone"
                dataKey="目標"
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="5 5"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
