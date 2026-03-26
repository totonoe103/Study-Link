export type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

export const navItems: NavItem[] = [
  { label: "ダッシュボード", href: "/dashboard" },
  { label: "スケジュール", href: "/schedule" },
  { label: "コース", href: "/courses" },
  { label: "進捗", href: "/progress", badge: "NEW" },
  { label: "設定", href: "/settings" },
];

export const dashboardData = {
  user: {
    name: "山田 花子",
    plan: "中級（Plus）",
    coachName: "スパルタ兄貴",
  },
  target: {
    school: "東京大学（文科三類）",
    examDate: "2026-02-25",
    startDate: "2025-11-01",
  },
  progress: {
    todayMinutes: 92,
    weekMinutes: 481,
    streakDays: 18,
    targetCompletionPct: 72,
  },
  nextTasks: [
    {
      title: "数学IA・微積分：例題20-35",
      dueLabel: "今日 21:00まで",
      progressPct: 35,
      tag: "計画通り",
    },
    {
      title: "英語：長文（第2回）",
      dueLabel: "明日 18:00まで",
      progressPct: 10,
      tag: "やり始め",
    },
    {
      title: "国語：古文単語（暗記）",
      dueLabel: "明後日まで",
      progressPct: 60,
      tag: "積み上げ",
    },
  ],
  referenceRoute: {
    currentBook: "『共通テスト 現代文 攻略』",
    currentRange: "第3章：設問タイプ別（P.54-72）",
    nextBook: "『青本：東大国語（2025）』",
    aiTestStatus: "準備完了（写真待ち）",
  },
  coachModes: [
    "褒め上手（癒やし）",
    "スパルタ兄貴",
    "論理的教授",
    "短期集中モード",
  ],
  focusPlayer: {
    title: "講義：微積分の導入（最重要ポイント）",
    durationLabel: "12:48",
  },
  calendar: {
    // 直近28日ぶん（デモ）。0=未学習、数値=分数
    minutes: [
      0, 0, 25, 30, 60, 40, 0, 75, 90, 110, 0, 55, 65, 30, 0, 20, 40,
      95, 100, 0, 30, 45, 60, 0, 25, 50, 0, 92,
    ],
  },
  rankings: {
    label: "集中時間ランキング（今日）",
    top: [
      { name: "さとう", minutes: 180 },
      { name: "あきら", minutes: 142 },
      { name: "まなみ", minutes: 120 },
      { name: "ゆうすけ", minutes: 105 },
      { name: "山田 花子（あなた）", minutes: 92 },
    ],
  },
  mentorChat: {
    quickSuggestions: ["今日はサボり癖が出そう", "逆算計画が不安", "参考書ルートは何から？"],
    systemPromptSummary:
      "コーチ：スパルタ兄貴。誘惑は断ち切って、今日の最短ルートだけやろう。",
  },
};

