"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Language = "en" | "ja" | "zh" | "ko"
export type ColorTheme = "sky" | "violet" | "emerald" | "rose" | "amber" | "kawaii"
export type ExamCategory = "japanese" | "alevel" | "ib" | "sat" | "ap"
export type MentorPersonality = "gentle" | "strict" | "logical" | "cheerful"

interface Settings {
  language: Language
  colorTheme: ColorTheme
  examCategory: ExamCategory
  mentorPersonality: MentorPersonality
  mentorName: string
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  language: "ja",
  colorTheme: "kawaii",
  examCategory: "japanese",
  mentorPersonality: "cheerful",
  mentorName: "Mika",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

// Color theme configurations
export const colorThemes: Record<ColorTheme, { primary: string; gradient: string; light: string; text: string }> = {
  sky: {
    primary: "sky",
    gradient: "from-sky-400 to-cyan-500",
    light: "from-sky-50 via-white to-cyan-50",
    text: "text-sky-500"
  },
  violet: {
    primary: "violet",
    gradient: "from-violet-400 to-purple-500",
    light: "from-violet-50 via-white to-purple-50",
    text: "text-violet-500"
  },
  emerald: {
    primary: "emerald",
    gradient: "from-emerald-400 to-teal-500",
    light: "from-emerald-50 via-white to-teal-50",
    text: "text-emerald-500"
  },
  rose: {
    primary: "rose",
    gradient: "from-rose-400 to-pink-500",
    light: "from-rose-50 via-white to-pink-50",
    text: "text-rose-500"
  },
  amber: {
    primary: "amber",
    gradient: "from-amber-400 to-orange-500",
    light: "from-amber-50 via-white to-orange-50",
    text: "text-amber-500"
  },
  kawaii: {
    primary: "pink",
    gradient: "from-pink-300 via-rose-300 to-pink-400",
    light: "from-pink-50 via-rose-50 to-purple-50",
    text: "text-pink-400"
  },
}

// Language translations
export const translations: Record<Language, Record<string, string>> = {
  en: {
    progressToGoal: "Progress to Goal",
    todaysTopics: "Today's Topics",
    viewAll: "View All",
    predicted: "Predicted",
    pastPapers: "Past Papers",
    daysLeft: "Days Left",
    start: "Start",
    settings: "Settings",
    language: "Language",
    colorTheme: "Color Theme",
    examCategory: "Exam Category",
    aiMentor: "AI Mentor",
    mentorPersonality: "Mentor Personality",
    gentle: "Gentle & Supportive",
    strict: "Strict & Motivating",
    logical: "Logical & Analytical",
    cheerful: "Cheerful & Fun",
    save: "Save",
    home: "Home",
    schedule: "Schedule",
    books: "Books",
    progress: "Progress",
    studyRoute: "Study Route",
    watchAd: "Watch Ad",
    goPremium: "Go Premium",
    unlockPremium: "Unlock with Premium or watch ad",
    askQuestion: "Ask Question",
    getTips: "Get Tips",
    openChat: "Open Chat",
    completed: "completed",
    shareWithTeacher: "Share with Teacher",
    shareWithParent: "Share with Parent",
    shareProgress: "Share Progress",
    shareSuccess: "Link copied!",
  },
  ja: {
    progressToGoal: "合格への進捗",
    todaysTopics: "今日の課題",
    viewAll: "全て見る",
    predicted: "予測",
    pastPapers: "過去問",
    daysLeft: "残り日数",
    start: "開始",
    settings: "設定",
    language: "言語",
    colorTheme: "カラーテーマ",
    examCategory: "試験カテゴリー",
    aiMentor: "AIメンター",
    mentorPersonality: "メンターの性格",
    gentle: "優しい・サポート型",
    strict: "厳格・モチベーション型",
    logical: "論理的・分析型",
    cheerful: "明るい・楽しい型",
    save: "保存",
    home: "ホーム",
    schedule: "スケジュール",
    books: "参考書",
    progress: "進捗",
    studyRoute: "参考書ルート",
    watchAd: "広告を見る",
    goPremium: "プレミアム",
    unlockPremium: "プレミアムまたは広告で解除",
    askQuestion: "質問する",
    getTips: "アドバイス",
    openChat: "チャットを開く",
    completed: "完了",
    shareWithTeacher: "先生と共有",
    shareWithParent: "保護者と共有",
    shareProgress: "進捗を共有",
    shareSuccess: "リンクをコピーしました",
  },
  zh: {
    progressToGoal: "目标进度",
    todaysTopics: "今日任务",
    viewAll: "查看全部",
    predicted: "预测",
    pastPapers: "历年真题",
    daysLeft: "剩余天数",
    start: "开始",
    settings: "设置",
    language: "语言",
    colorTheme: "主题颜色",
    examCategory: "考试类别",
    aiMentor: "AI导师",
    mentorPersonality: "导师性格",
    gentle: "温和支持型",
    strict: "严格激励型",
    logical: "逻辑分析型",
    cheerful: "开朗活泼型",
    save: "保存",
    home: "首页",
    schedule: "日程",
    books: "书籍",
    progress: "进度",
    studyRoute: "学习路线",
    watchAd: "看广告",
    goPremium: "升级会员",
    unlockPremium: "升级会员或观看广告解锁",
    askQuestion: "提问",
    getTips: "获取建议",
    openChat: "打开聊天",
    completed: "已完成",
    shareWithTeacher: "与老师分享",
    shareWithParent: "与家长分享",
    shareProgress: "分享进度",
    shareSuccess: "链接已复制",
  },
  ko: {
    progressToGoal: "목표 진행률",
    todaysTopics: "오늘의 과제",
    viewAll: "전체 보기",
    predicted: "예측",
    pastPapers: "기출문제",
    daysLeft: "남은 일수",
    start: "시작",
    settings: "설정",
    language: "언어",
    colorTheme: "색상 테마",
    examCategory: "시험 카테고리",
    aiMentor: "AI 멘토",
    mentorPersonality: "멘토 성격",
    gentle: "부드럽고 지지적인",
    strict: "엄격하고 동기부여",
    logical: "논리적이고 분석적인",
    cheerful: "밝고 재미있는",
    save: "저장",
    home: "홈",
    schedule: "일정",
    books: "교재",
    progress: "진행",
    studyRoute: "학습 경로",
    watchAd: "광고 보기",
    goPremium: "프리미엄",
    unlockPremium: "프리미엄 또는 광고로 잠금 해제",
    askQuestion: "질문하기",
    getTips: "팁 받기",
    openChat: "채팅 열기",
    completed: "완료",
    shareWithTeacher: "선생님과 공유",
    shareWithParent: "부모님과 공유",
    shareProgress: "진행 상황 공유",
    shareSuccess: "링크가 복사되었습니다",
  },
}

// Exam category content
export const examCategoryContent: Record<ExamCategory, {
  name: string
  nameJa: string
  subjects: Array<{
    id: number
    topic: string
    topicJa: string
    subject: string
    subjectJa: string
    examBoard: string
    progress: number
    timeEstimate: string
    completed: boolean
  }>
}> = {
  japanese: {
    name: "Japanese University Entrance",
    nameJa: "日本の大学入試",
    subjects: [
      { id: 1, topic: "Reading Comprehension", topicJa: "現代文・読解", subject: "Japanese", subjectJa: "国語", examBoard: "共通テスト", progress: 45, timeEstimate: "50 min", completed: false },
      { id: 2, topic: "Calculus II", topicJa: "微分積分II", subject: "Mathematics", subjectJa: "数学", examBoard: "数学II・B", progress: 60, timeEstimate: "60 min", completed: false },
      { id: 3, topic: "Grammar & Reading", topicJa: "文法・長文", subject: "English", subjectJa: "英語", examBoard: "共通テスト", progress: 100, timeEstimate: "40 min", completed: true },
    ]
  },
  alevel: {
    name: "A-Level",
    nameJa: "Aレベル",
    subjects: [
      { id: 1, topic: "Topic 3: Kinematics", topicJa: "運動学", subject: "Physics", subjectJa: "物理", examBoard: "Edexcel", progress: 65, timeEstimate: "45 min", completed: false },
      { id: 2, topic: "Chapter 5: Integration", topicJa: "積分", subject: "Mathematics", subjectJa: "数学", examBoard: "OCR", progress: 40, timeEstimate: "60 min", completed: false },
      { id: 3, topic: "Unit 2: Microeconomics", topicJa: "ミクロ経済学", subject: "Economics", subjectJa: "経済", examBoard: "AQA", progress: 100, timeEstimate: "40 min", completed: true },
    ]
  },
  ib: {
    name: "International Baccalaureate",
    nameJa: "国際バカロレア",
    subjects: [
      { id: 1, topic: "Topic 2: Mechanics", topicJa: "力学", subject: "Physics HL", subjectJa: "物理HL", examBoard: "IB", progress: 55, timeEstimate: "50 min", completed: false },
      { id: 2, topic: "Chapter 7: Vectors", topicJa: "ベクトル", subject: "Math AA HL", subjectJa: "数学AA HL", examBoard: "IB", progress: 35, timeEstimate: "55 min", completed: false },
      { id: 3, topic: "Paper 1 Practice", topicJa: "ペーパー1演習", subject: "English A", subjectJa: "英語A", examBoard: "IB", progress: 100, timeEstimate: "45 min", completed: true },
    ]
  },
  sat: {
    name: "SAT / ACT",
    nameJa: "SAT / ACT",
    subjects: [
      { id: 1, topic: "Math Section: Algebra", topicJa: "代数", subject: "SAT Math", subjectJa: "SAT数学", examBoard: "College Board", progress: 70, timeEstimate: "40 min", completed: false },
      { id: 2, topic: "Reading Passages", topicJa: "読解問題", subject: "SAT Reading", subjectJa: "SAT読解", examBoard: "College Board", progress: 50, timeEstimate: "45 min", completed: false },
      { id: 3, topic: "Writing & Grammar", topicJa: "作文・文法", subject: "SAT Writing", subjectJa: "SAT作文", examBoard: "College Board", progress: 100, timeEstimate: "35 min", completed: true },
    ]
  },
  ap: {
    name: "AP Exams",
    nameJa: "APテスト",
    subjects: [
      { id: 1, topic: "Unit 3: Dynamics", topicJa: "力学", subject: "AP Physics C", subjectJa: "AP物理C", examBoard: "College Board", progress: 60, timeEstimate: "50 min", completed: false },
      { id: 2, topic: "Unit 5: Analytical Apps", topicJa: "解析応用", subject: "AP Calculus BC", subjectJa: "AP微積分BC", examBoard: "College Board", progress: 45, timeEstimate: "55 min", completed: false },
      { id: 3, topic: "Period 4: 1800-1848", topicJa: "1800-1848年", subject: "AP US History", subjectJa: "APアメリカ史", examBoard: "College Board", progress: 100, timeEstimate: "40 min", completed: true },
    ]
  },
}

// Mentor personalities
export const mentorPersonalities: Record<MentorPersonality, {
  name: string
  avatar: string
  greeting: Record<Language, string>
}> = {
  gentle: {
    name: "Sophia",
    avatar: "gentle",
    greeting: {
      en: "Great job today! You're making wonderful progress. Let's keep it up!",
      ja: "今日もよく頑張りましたね！素晴らしい進歩です。この調子で頑張りましょう！",
      zh: "今天做得很棒！你进步很大。让我们继续保��！",
      ko: "오늘 정말 잘했어요! 훌륭한 진전을 보이고 있어요. 계속 힘내요!",
    }
  },
  strict: {
    name: "Marcus",
    avatar: "strict",
    greeting: {
      en: "No excuses. You've got 120 days. Every minute counts. Let's push harder!",
      ja: "言い訳はなし。残り120日。1分1秒が大切です。もっと頑張りましょう！",
      zh: "没有借口。还有120天。每分钟都很重要。让我们更加努力！",
      ko: "변명은 없어요. 120일 남았어요. 매 순간이 소중해요. 더 열심히 해요!",
    }
  },
  logical: {
    name: "Dr. Chen",
    avatar: "logical",
    greeting: {
      en: "Based on your data, focusing on Physics now will maximize your overall score improvement.",
      ja: "データによると、今は物理に集中することで総合スコアを最大化できます。",
      zh: "根据你的数据，现在专注于物理将最大化你的整体分数提升。",
      ko: "데이터에 따르면, 지금 물리학에 집중하면 전체 점수 향상을 극대화할 수 있어요.",
    }
  },
  cheerful: {
    name: "Mika",
    avatar: "cheerful",
    greeting: {
      en: "Hey superstar! Ready to crush some more topics today? Let's make learning fun!",
      ja: "やっほー！今日もトピック制覇しちゃう？楽しく勉強しよう！",
      zh: "嘿，超级明星！今天准备好征服更多主题了吗？让学习变得有趣！",
      ko: "안녕, 슈퍼스타! 오늘도 더 많은 주제를 정복할 준비됐어? 공부를 재미있게 해보자!",
    }
  },
}
