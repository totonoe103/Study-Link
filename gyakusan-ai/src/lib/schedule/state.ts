export type ExamCategory = "japanese" | "alevel" | "ib";
export type PacePreset = "steady" | "sprint";
export type LanguageSetting = "ja" | "en" | "zh" | "ko";
export type ColorTheme = "sky" | "violet" | "emerald" | "rose" | "amber";
export type MentorPersonality = "gentle" | "strict" | "logical" | "cheerful";

export type PlannerItemSelection = {
  selected: boolean;
  totalUnits: number;
};

export type PlannerState = {
  examDate: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  appliedDelayDays: number;
  examCategory: ExamCategory;
  pacePreset: PacePreset;
  language: LanguageSetting;
  colorTheme: ColorTheme;
  mentorPersonality: MentorPersonality;
  selections: Record<string, PlannerItemSelection>;
  updatedAt: string; // ISO
};

