"use client";

import { useMemo, useState, useEffect, useRef } from "react";

import {
  computeBackwardSchedule,
  defaultWeightTuning,
  type PlanItem,
  type WeightTuning,
} from "@/lib/schedule/calc";
import { addDays, formatDateInputValue, parseYmdToDate } from "@/lib/date/ymd";
import type { PlannerState } from "@/lib/schedule/state";

type Mode = "jp" | "alevel";
type AlevelBoard = "alevel" | "ib";
type PacePreset = "steady" | "sprint";

export default function SchedulePlanner({
  initialState,
}: {
  initialState: PlannerState | null;
}) {
  const mountedRef = useRef(false);
  const lastSavedPayloadRef = useRef<string>("");
  const now = useMemo(() => new Date(), []);
  const defaultExam = useMemo(
    () => addDays(now, 120),
    [now],
  );
  const defaultStart = useMemo(() => now, [now]);

  const [mode, setMode] = useState<Mode>(() =>
    initialState?.examCategory === "japanese" ? "jp" : "alevel",
  );
  const [alevelBoard, setAlevelBoard] = useState<AlevelBoard>(() =>
    initialState?.examCategory === "ib" ? "ib" : "alevel",
  );
  const [pacePreset, setPacePreset] = useState<PacePreset>(
    initialState?.pacePreset ?? "steady",
  );
  const [language, setLanguage] = useState<PlannerState["language"]>(
    initialState?.language ?? "ja",
  );
  const [colorTheme, setColorTheme] = useState<PlannerState["colorTheme"]>(
    initialState?.colorTheme ?? "sky",
  );
  const [mentorPersonality, setMentorPersonality] = useState<
    PlannerState["mentorPersonality"]
  >(initialState?.mentorPersonality ?? "gentle");

  const [examDateStr, setExamDateStr] = useState(
    initialState?.examDate ?? formatDateInputValue(defaultExam),
  );
  const [startDateStr, setStartDateStr] = useState(
    initialState?.startDate ?? formatDateInputValue(defaultStart),
  );

  // リスケジュール用（予定開始が遅れている日数）
  const [delayInputDays, setDelayInputDays] = useState<number>(
    initialState?.appliedDelayDays ?? 0,
  );
  const [appliedDelayDays, setAppliedDelayDays] = useState<number>(
    initialState?.appliedDelayDays ?? 0,
  );
  const [rescheduleFeedback, setRescheduleFeedback] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // ---------------------------
  // Japanese University Admission
  // ---------------------------
  const jpDefinitions = useMemo(
    () => [
      {
        id: "target1900",
        label: "ターゲット1900（数学）",
        unitLabel: "問",
        defaultTotal: 1900,
        weightProfile: "basic",
      },
      {
        id: "aokiChartExamples",
        label: "青チャート（例題）",
        unitLabel: "例題",
        defaultTotal: 420,
        weightProfile: "standard",
      },
      {
        id: "aokiChartExercises",
        label: "青チャート（章末/演習）",
        unitLabel: "演習",
        defaultTotal: 300,
        weightProfile: "practice",
      },
    ],
    [],
  );

  const [jpSelected, setJpSelected] = useState<Record<string, boolean>>(() => ({
    target1900: initialState?.selections?.target1900?.selected ?? true,
    aokiChartExamples: initialState?.selections?.aokiChartExamples?.selected ?? true,
    aokiChartExercises: initialState?.selections?.aokiChartExercises?.selected ?? false,
  }));

  const [jpTotals, setJpTotals] = useState<Record<string, number>>(() => ({
    target1900: initialState?.selections?.target1900?.totalUnits ?? 1900,
    aokiChartExamples: initialState?.selections?.aokiChartExamples?.totalUnits ?? 420,
    aokiChartExercises: initialState?.selections?.aokiChartExercises?.totalUnits ?? 300,
  }));

  // ---------------------------
  // A-Level / IB
  // ---------------------------
  const alevelDefinitions = useMemo(
    () => [
      {
        id: "math",
        label: "Mathematics",
        unitLabel: "時間",
        defaultTotal: 160,
      },
      {
        id: "physics",
        label: "Physics",
        unitLabel: "時間",
        defaultTotal: 90,
      },
      {
        id: "chemistry",
        label: "Chemistry",
        unitLabel: "時間",
        defaultTotal: 90,
      },
      {
        id: "english",
        label: "English / Language",
        unitLabel: "時間",
        defaultTotal: 80,
      },
    ],
    [],
  );

  const [alevelSelected, setAlevelSelected] = useState<Record<string, boolean>>(
    () => ({
      math: initialState?.selections?.math?.selected ?? true,
      physics: initialState?.selections?.physics?.selected ?? true,
      chemistry: initialState?.selections?.chemistry?.selected ?? false,
      english: initialState?.selections?.english?.selected ?? true,
    }),
  );

  const [alevelTotals, setAlevelTotals] = useState<Record<string, number>>(
    () => ({
      math: initialState?.selections?.math?.totalUnits ?? 160,
      physics: initialState?.selections?.physics?.totalUnits ?? 90,
      chemistry: initialState?.selections?.chemistry?.totalUnits ?? 90,
      english: initialState?.selections?.english?.totalUnits ?? 80,
    }),
  );

  const ibDefinitions = useMemo(
    () => [
      {
        id: "mathAAHL",
        label: "Math AA HL",
        unitLabel: "時間",
        defaultTotal: 120,
      },
      {
        id: "physicsHL",
        label: "Physics HL",
        unitLabel: "時間",
        defaultTotal: 90,
      },
      {
        id: "chemistryHL",
        label: "Chemistry HL",
        unitLabel: "時間",
        defaultTotal: 70,
      },
      {
        id: "englishA",
        label: "English A",
        unitLabel: "時間",
        defaultTotal: 60,
      },
    ],
    [],
  );

  const [ibSelected, setIbSelected] = useState<Record<string, boolean>>(() => ({
    mathAAHL: initialState?.selections?.mathAAHL?.selected ?? true,
    physicsHL: initialState?.selections?.physicsHL?.selected ?? true,
    chemistryHL: initialState?.selections?.chemistryHL?.selected ?? false,
    englishA: initialState?.selections?.englishA?.selected ?? true,
  }));

  const [ibTotals, setIbTotals] = useState<Record<string, number>>(() => ({
    mathAAHL: initialState?.selections?.mathAAHL?.totalUnits ?? 120,
    physicsHL: initialState?.selections?.physicsHL?.totalUnits ?? 90,
    chemistryHL: initialState?.selections?.chemistryHL?.totalUnits ?? 70,
    englishA: initialState?.selections?.englishA?.totalUnits ?? 60,
  }));

  const parsed = useMemo(() => {
    const examDate = parseYmdToDate(examDateStr);
    const startDate = parseYmdToDate(startDateStr);
    return { examDate, startDate };
  }, [examDateStr, startDateStr]);

  const selectedItems: PlanItem[] = useMemo(() => {
    if (mode === "jp") {
      return jpDefinitions
        .filter((d) => jpSelected[d.id])
        .map((d) => ({
          id: d.id,
          label: d.label,
          unitLabel: d.unitLabel,
          totalUnits: Number(jpTotals[d.id] ?? d.defaultTotal),
          weightProfile: d.weightProfile,
        }));
    }

    const defs = alevelBoard === "alevel" ? alevelDefinitions : ibDefinitions;
    const selected =
      alevelBoard === "alevel" ? alevelSelected : ibSelected;
    const totals = alevelBoard === "alevel" ? alevelTotals : ibTotals;

    return defs
      .filter((d) => selected[d.id])
      .map((d) => ({
        id: d.id,
        label: d.label,
        unitLabel: d.unitLabel,
        totalUnits: Number(totals[d.id] ?? d.defaultTotal),
      }));
  }, [
    alevelDefinitions,
    alevelSelected,
    alevelTotals,
    alevelBoard,
    jpDefinitions,
    jpSelected,
    jpTotals,
    mode,
    ibDefinitions,
    ibSelected,
    ibTotals,
  ]);

  const paceTuning: WeightTuning = useMemo(
    () =>
      pacePreset === "steady"
        ? defaultWeightTuning
        : {
            ...defaultWeightTuning,
            // 短期集中: 後半の負荷をやや強める
            profileRange: {
              basic: { start: 1.0, end: 0.9 },
              standard: { start: 1.0, end: 1.28 },
              practice: { start: 1.0, end: 1.62 },
            },
          },
    [pacePreset],
  );

  const schedule = useMemo(() => {
    if (!parsed.examDate || !parsed.startDate) return null;
    if (selectedItems.length === 0) return null;

    const delayDays = Math.max(0, Math.floor(appliedDelayDays));

    // 逆算ロジック：開始日を遅らせ、残り期間で総量を割り当てる
    return computeBackwardSchedule({
      examDate: parsed.examDate,
      startDate: parsed.startDate,
      delayDays,
      items: selectedItems,
      tuning: paceTuning,
    });
  }, [appliedDelayDays, paceTuning, parsed.examDate, parsed.startDate, selectedItems]);

  const baselineSchedule = useMemo(() => {
    if (!parsed.examDate || !parsed.startDate) return null;
    if (selectedItems.length === 0) return null;
    return computeBackwardSchedule({
      examDate: parsed.examDate,
      startDate: parsed.startDate,
      delayDays: 0,
      items: selectedItems,
      tuning: paceTuning,
    });
  }, [paceTuning, parsed.examDate, parsed.startDate, selectedItems]);

  const skipTodaySchedule = useMemo(() => {
    if (!parsed.examDate || !parsed.startDate) return null;
    if (selectedItems.length === 0) return null;
    return computeBackwardSchedule({
      examDate: parsed.examDate,
      startDate: parsed.startDate,
      delayDays: appliedDelayDays + 1,
      items: selectedItems,
      tuning: paceTuning,
    });
  }, [
    appliedDelayDays,
    paceTuning,
    parsed.examDate,
    parsed.startDate,
    selectedItems,
  ]);

  const tableDays = 14;
  const firstDays = useMemo(() => {
    if (!schedule) return null;
    return {
      count: Math.min(tableDays, schedule.remainingDays),
    };
  }, [schedule]);

  const effectiveStart = schedule?.effectiveStart;
  const remainingDays = schedule?.remainingDays;
  const averagePerDay = schedule?.averagePerDay;
  const overloadRatio =
    schedule && baselineSchedule && baselineSchedule.averagePerDay > 0
      ? schedule.averagePerDay / baselineSchedule.averagePerDay
      : 1;

  const risk = overloadRatio >= 1.35 ? "high" : overloadRatio >= 1.15 ? "medium" : "low";
  const skipImpact =
    schedule && skipTodaySchedule && schedule.averagePerDay > 0
      ? {
          before: schedule.averagePerDay,
          after: skipTodaySchedule.averagePerDay,
          delta: skipTodaySchedule.averagePerDay - schedule.averagePerDay,
          ratio: skipTodaySchedule.averagePerDay / schedule.averagePerDay,
        }
      : null;

  const examCategory: PlannerState["examCategory"] =
    mode === "jp" ? "japanese" : alevelBoard;

  const allSelections = useMemo<PlannerState["selections"]>(
    () => ({
      target1900: { selected: !!jpSelected.target1900, totalUnits: jpTotals.target1900 ?? 1900 },
      aokiChartExamples: {
        selected: !!jpSelected.aokiChartExamples,
        totalUnits: jpTotals.aokiChartExamples ?? 420,
      },
      aokiChartExercises: {
        selected: !!jpSelected.aokiChartExercises,
        totalUnits: jpTotals.aokiChartExercises ?? 300,
      },
      math: { selected: !!alevelSelected.math, totalUnits: alevelTotals.math ?? 160 },
      physics: { selected: !!alevelSelected.physics, totalUnits: alevelTotals.physics ?? 90 },
      chemistry: {
        selected: !!alevelSelected.chemistry,
        totalUnits: alevelTotals.chemistry ?? 90,
      },
      english: { selected: !!alevelSelected.english, totalUnits: alevelTotals.english ?? 80 },
      mathAAHL: { selected: !!ibSelected.mathAAHL, totalUnits: ibTotals.mathAAHL ?? 120 },
      physicsHL: { selected: !!ibSelected.physicsHL, totalUnits: ibTotals.physicsHL ?? 90 },
      chemistryHL: {
        selected: !!ibSelected.chemistryHL,
        totalUnits: ibTotals.chemistryHL ?? 70,
      },
      englishA: { selected: !!ibSelected.englishA, totalUnits: ibTotals.englishA ?? 60 },
    }),
    [
      alevelSelected.chemistry,
      alevelSelected.english,
      alevelSelected.math,
      alevelSelected.physics,
      alevelTotals.chemistry,
      alevelTotals.english,
      alevelTotals.math,
      alevelTotals.physics,
      ibSelected.chemistryHL,
      ibSelected.englishA,
      ibSelected.mathAAHL,
      ibSelected.physicsHL,
      ibTotals.chemistryHL,
      ibTotals.englishA,
      ibTotals.mathAAHL,
      ibTotals.physicsHL,
      jpSelected.aokiChartExamples,
      jpSelected.aokiChartExercises,
      jpSelected.target1900,
      jpTotals.aokiChartExamples,
      jpTotals.aokiChartExercises,
      jpTotals.target1900,
    ],
  );

  const plannerStatePayload = useMemo<PlannerState>(
    () => ({
      examDate: examDateStr,
      startDate: startDateStr,
      appliedDelayDays,
      examCategory,
      pacePreset,
      language,
      colorTheme,
      mentorPersonality,
      selections: allSelections,
      updatedAt: new Date().toISOString(),
    }),
    [
      allSelections,
      appliedDelayDays,
      colorTheme,
      examCategory,
      examDateStr,
      language,
      mentorPersonality,
      pacePreset,
      startDateStr,
    ],
  );

  async function postPlannerStateWithRetry(
    state: PlannerState,
    maxAttempts = 4,
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    let lastError = "UNKNOWN_ERROR";

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch("/api/planner-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state }),
        });

        if (res.ok) return { ok: true };

        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        lastError = body?.error ?? `HTTP_${res.status}`;
      } catch {
        lastError = "NETWORK_ERROR";
      }

      if (attempt < maxAttempts) {
        // exponential backoff: 400ms, 800ms, 1600ms ...
        const waitMs = 400 * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    return { ok: false, error: lastError };
  }

  async function savePlannerState(mode: "manual" | "auto" = "manual") {
    const state: PlannerState = {
      ...plannerStatePayload,
      updatedAt: new Date().toISOString(),
    };

    setSaveFeedback(null);
    const result = await postPlannerStateWithRetry(state);
    if (result.ok) {
      setSaveFeedback(mode === "auto" ? "自動保存しました" : "保存しました");
      lastSavedPayloadRef.current = JSON.stringify({
        ...state,
        updatedAt: "",
      });
      return;
    }
    setSaveFeedback(`保存に失敗しました: ${result.error}`);
  }

  useEffect(() => {
    if (!rescheduleFeedback) return;
    const t = setTimeout(() => setRescheduleFeedback(null), 2600);
    return () => clearTimeout(t);
  }, [rescheduleFeedback]);

  useEffect(() => {
    if (!saveFeedback) return;
    const t = setTimeout(() => setSaveFeedback(null), 3200);
    return () => clearTimeout(t);
  }, [saveFeedback]);

  useEffect(() => {
    const normalizedPayload = JSON.stringify({
      ...plannerStatePayload,
      updatedAt: "",
    });

    // 初回表示時は自動保存しない
    if (!mountedRef.current) {
      mountedRef.current = true;
      lastSavedPayloadRef.current = normalizedPayload;
      return;
    }

    // 実質差分がない場合は保存しない
    if (normalizedPayload === lastSavedPayloadRef.current) return;

    const timer = setTimeout(() => {
      void savePlannerState("auto");
    }, 1000);

    return () => clearTimeout(timer);
  }, [plannerStatePayload]);

  const tableRows = useMemo(() => {
    if (!schedule || !firstDays) return [];
    const { count } = firstDays;

    return new Array(count).fill(0).map((_, dayIdx) => {
      const date = schedule.dates[dayIdx]!;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const ymd = `${y}-${m}-${d}`;

      const items = schedule.dailyByItem;
      const perItem = schedule.dates.length
        ? selectedItems.map((it) => ({
            id: it.id,
            label: it.label,
            value: items[it.id]?.[dayIdx] ?? 0,
            unitLabel: it.unitLabel,
          }))
        : [];

      return {
        dayIdx,
        ymd,
        total: schedule.dailyTotal[dayIdx] ?? 0,
        perItem,
      };
    });
  }, [firstDays, schedule, selectedItems]);

  type ViewTab = "daily" | "weekly" | "monthly";
  const [viewTab, setViewTab] = useState<ViewTab>("daily");

  const weeklyGroups = useMemo(() => {
    if (!schedule) return [];
    const totalDays = schedule.dates.length;
    const maxWeeks = 8;
    const weekCount = Math.min(maxWeeks, Math.ceil(totalDays / 7));

    return new Array(weekCount).fill(0).map((_, w) => {
      const dayStart = w * 7;
      const dayEnd = Math.min(dayStart + 6, totalDays - 1);
      const from = schedule.dates[dayStart]!;
      const to = schedule.dates[dayEnd]!;

      const perItem = selectedItems.map((it) => {
        const arr = schedule.dailyByItem[it.id] ?? [];
        const sum = arr
          .slice(dayStart, dayEnd + 1)
          .reduce((a, b) => a + b, 0);
        return { id: it.id, label: it.label, value: sum, unitLabel: it.unitLabel };
      });

      const total = schedule.dailyTotal
        .slice(dayStart, dayEnd + 1)
        .reduce((a, b) => a + b, 0);

      return {
        weekIdx: w,
        ymdFrom: formatDateInputValue(from),
        ymdTo: formatDateInputValue(to),
        total,
        perItem,
      };
    });
  }, [schedule, selectedItems]);

  const monthlyGroups = useMemo(() => {
    if (!schedule) return [];
    const maxMonths = 6;
    const groups = new Map<string, number[]>();

    schedule.dates.forEach((date, idx) => {
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const arr = groups.get(key) ?? [];
      arr.push(idx);
      groups.set(key, arr);
    });

    const entries = Array.from(groups.entries()).slice(0, maxMonths);

    return entries.map(([key, indices]) => {
      const [y, m] = key.split("-").map((v) => Number(v));
      const perItem = selectedItems.map((it) => {
        const arr = schedule.dailyByItem[it.id] ?? [];
        const sum = indices.reduce((acc, i) => acc + (arr[i] ?? 0), 0);
        return { id: it.id, label: it.label, value: sum, unitLabel: it.unitLabel };
      });

      const total = indices.reduce(
        (acc, i) => acc + (schedule.dailyTotal[i] ?? 0),
        0,
      );

      return {
        key,
        ymdLabel: `${y}年${m}月`,
        total,
        perItem,
      };
    });
  }, [schedule, selectedItems]);

  function toggleItem(id: string) {
    if (mode === "jp") {
      setJpSelected((prev) => ({ ...prev, [id]: !prev[id] }));
      return;
    }

    if (alevelBoard === "alevel") {
      setAlevelSelected((prev) => ({ ...prev, [id]: !prev[id] }));
      return;
    }

    setIbSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function setItemTotal(id: string, value: number) {
    if (mode === "jp") {
      setJpTotals((prev) => ({ ...prev, [id]: Math.max(0, Math.floor(value)) }));
      return;
    }

    if (alevelBoard === "alevel") {
      setAlevelTotals((prev) => ({
        ...prev,
        [id]: Math.max(0, Math.floor(value)),
      }));
      return;
    }

    setIbTotals((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.floor(value)),
    }));
  }

  const selectedCount = selectedItems.length;

  const headerSubtitle =
    mode === "jp"
      ? "ターゲット1900・青チャート等を選んで、入試日からノルマを逆算します。"
      : "科目（A-Level/IB）を選び、入試日から必要時間/ノルマを逆算します。";

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="rounded-3xl border border-sky-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              スケジュール管理
            </h1>
            <p className="mt-1 text-sm text-slate-600">{headerSubtitle}</p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("jp")}
                className={[
                  "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                  mode === "jp"
                    ? "border-sky-300 bg-sky-600 text-white"
                    : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
                ].join(" ")}
              >
                日本の大学入試
              </button>
              <button
                type="button"
                onClick={() => setMode("alevel")}
                className={[
                  "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                  mode === "alevel"
                    ? "border-sky-300 bg-sky-600 text-white"
                    : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
                ].join(" ")}
              >
                A-Level / IB
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void savePlannerState()}
                className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                設定を保存
              </button>
              {saveFeedback ? (
                <span className="text-xs font-semibold text-slate-600">{saveFeedback}</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[340px_1fr]">
          <section className="rounded-3xl border border-sky-200/70 bg-white/55 p-5">
            <h2 className="text-sm font-semibold text-slate-800">逆算条件</h2>

            <div className="mt-4 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-700">
                  入試日
                </span>
                <input
                  type="date"
                  value={examDateStr}
                  onChange={(e) => setExamDateStr(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-700">
                  逆算開始日
                </span>
                <input
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-700">
                  遅れ（反映する日数）
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={delayInputDays}
                    onChange={(e) =>
                      setDelayInputDays(Number(e.target.value || 0))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400"
                  />
                  <span className="shrink-0 text-xs font-semibold text-slate-600">
                    日
                  </span>
                </div>
              </label>

              <div className="grid gap-1">
                <span className="text-xs font-medium text-slate-700">
                  配分スタイル（将来の個別最適化向け）
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPacePreset("steady")}
                    className={[
                      "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
                      pacePreset === "steady"
                        ? "border-sky-300 bg-sky-600 text-white"
                        : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
                    ].join(" ")}
                  >
                    コツコツ型
                  </button>
                  <button
                    type="button"
                    onClick={() => setPacePreset("sprint")}
                    className={[
                      "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
                      pacePreset === "sprint"
                        ? "border-sky-300 bg-sky-600 text-white"
                        : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
                    ].join(" ")}
                  >
                    短期集中型
                  </button>
                </div>
              </div>

              <div className="grid gap-1">
                <span className="text-xs font-medium text-slate-700">言語設定</span>
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as PlannerState["language"])
                  }
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400"
                >
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                </select>
              </div>

              <div className="grid gap-1">
                <span className="text-xs font-medium text-slate-700">カラーテーマ</span>
                <select
                  value={colorTheme}
                  onChange={(e) =>
                    setColorTheme(e.target.value as PlannerState["colorTheme"])
                  }
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400"
                >
                  <option value="sky">Sky</option>
                  <option value="violet">Violet</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                  <option value="amber">Amber</option>
                </select>
              </div>

              <div className="grid gap-1">
                <span className="text-xs font-medium text-slate-700">
                  AIメンター性格
                </span>
                <select
                  value={mentorPersonality}
                  onChange={(e) =>
                    setMentorPersonality(
                      e.target.value as PlannerState["mentorPersonality"],
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400"
                >
                  <option value="gentle">優しい・サポート型</option>
                  <option value="strict">厳格・モチベーション型</option>
                  <option value="logical">論理的・分析型</option>
                  <option value="cheerful">明るい・楽しい型</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAppliedDelayDays(delayInputDays);
                    setRescheduleFeedback(
                      `再計算しました（遅れ ${Math.max(0, Math.floor(delayInputDays))} 日を反映）`,
                    );
                  }}
                  disabled={!schedule && selectedItems.length === 0}
                  className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
                >
                  リスケジュール
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedDelayDays(0);
                    setRescheduleFeedback("遅れをリセットして再計算しました");
                  }}
                  className="rounded-2xl border border-slate-200 bg-white/40 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/70"
                >
                  遅れをリセット
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewTab("daily");
                    const el = document.getElementById("today-plan");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="rounded-2xl border border-sky-300 bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
                >
                  開始
                </button>
              </div>

              {rescheduleFeedback ? (
                <div className="mt-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
                  {rescheduleFeedback}
                </div>
              ) : null}

              <div className="mt-2 rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="text-xs font-semibold text-slate-700">
                  計算結果（要約）
                </div>

                {schedule ? (
                  <>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <div className="text-xs text-slate-600">
                          有効開始日（遅れ反映後）
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {effectiveStart
                            ? formatDateInputValue(effectiveStart)
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600">
                          残り日数
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {remainingDays}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-slate-600">
                        1日あたり（平均・総量）
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {selectedItems.length === 0 ? "-" : Math.ceil(averagePerDay)}
                        <span className="ml-1 text-xs font-semibold text-slate-600">
                          （単位は科目/教材ごと）
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-slate-600">進捗危険度</div>
                      <div
                        className={[
                          "mt-1 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
                          risk === "high"
                            ? "border-red-200 bg-red-100 text-red-700"
                            : risk === "medium"
                              ? "border-amber-200 bg-amber-100 text-amber-700"
                              : "border-sky-200 bg-sky-100 text-sky-700",
                        ].join(" ")}
                      >
                        {risk === "high"
                          ? "赤: 危険（再計画推奨）"
                          : risk === "medium"
                            ? "黄: 注意（前倒し推奨）"
                            : "青: 安定（計画通り）"}
                      </div>
                    </div>
                    {skipImpact ? (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                        <div className="text-xs font-bold text-red-700">
                          今日やらない場合の影響
                        </div>
                        <div className="mt-1 text-sm font-semibold text-red-800">
                          明日以降の1日平均負荷:{" "}
                          {Math.ceil(skipImpact.before)} → {Math.ceil(skipImpact.after)}
                          <span className="ml-1">
                            （+{Math.ceil(skipImpact.delta)} /{" "}
                            {Math.round((skipImpact.ratio - 1) * 100)}%）
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-red-700">
                          先送りすると、後半のノルマが重くなります。
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="mt-2 text-sm text-slate-600">
                    入試日・開始日・教材/科目を選択してください。
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-sky-200/70 bg-white/55 p-5">
            <h2 className="text-sm font-semibold text-slate-800">教材 / 科目選択</h2>

            <div className="mt-4 grid gap-3">
              {mode === "jp" ? (
                jpDefinitions.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white/70 px-4 py-3"
                  >
                    <label className="flex flex-1 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(jpSelected[d.id])}
                        onChange={() => toggleItem(d.id)}
                        className="h-4 w-4 accent-sky-600"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {d.label}
                        </div>
                        <div className="text-xs text-slate-600">
                          合計：{d.unitLabel}
                        </div>
                      </div>
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={jpTotals[d.id]}
                        disabled={!jpSelected[d.id]}
                        onChange={(e) => setItemTotal(d.id, Number(e.target.value || 0))}
                        className="w-28 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none focus:border-sky-400 disabled:opacity-60"
                      />
                      <span className="shrink-0 text-xs font-semibold text-slate-600">
                        {d.unitLabel}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="mb-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAlevelBoard("alevel")}
                      className={[
                        "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                        alevelBoard === "alevel"
                          ? "border-sky-300 bg-sky-600 text-white"
                          : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
                      ].join(" ")}
                    >
                      A-Level
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlevelBoard("ib")}
                      className={[
                        "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                        alevelBoard === "ib"
                          ? "border-sky-300 bg-sky-600 text-white"
                          : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
                      ].join(" ")}
                    >
                      IB
                    </button>
                  </div>

                  {(alevelBoard === "alevel" ? alevelDefinitions : ibDefinitions).map(
                    (d) => {
                      const selected =
                        alevelBoard === "alevel"
                          ? alevelSelected[d.id]
                          : ibSelected[d.id];
                      const totals =
                        alevelBoard === "alevel"
                          ? alevelTotals[d.id]
                          : ibTotals[d.id];

                      return (
                        <div
                          key={d.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white/70 px-4 py-3"
                        >
                          <label className="flex flex-1 cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={Boolean(selected)}
                              onChange={() => toggleItem(d.id)}
                              className="h-4 w-4 accent-sky-600"
                            />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-900">
                                {d.label}
                              </div>
                              <div className="text-xs text-slate-600">
                                合計：{d.unitLabel}
                              </div>
                            </div>
                          </label>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={totals}
                              disabled={!selected}
                              onChange={(e) =>
                                setItemTotal(d.id, Number(e.target.value || 0))
                              }
                              className="w-28 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none focus:border-sky-400 disabled:opacity-60"
                            />
                            <span className="shrink-0 text-xs font-semibold text-slate-600">
                              {d.unitLabel}
                            </span>
                          </div>
                        </div>
                      );
                    },
                  )}
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  if (mode === "jp") {
                    const all = Object.fromEntries(
                      jpDefinitions.map((d) => [d.id, true]),
                    );
                    setJpSelected(all);
                  } else {
                    if (alevelBoard === "alevel") {
                      const all = Object.fromEntries(
                        alevelDefinitions.map((d) => [d.id, true]),
                      );
                      setAlevelSelected(all);
                    } else {
                      const all = Object.fromEntries(
                        ibDefinitions.map((d) => [d.id, true]),
                      );
                      setIbSelected(all);
                    }
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white/40 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/70"
              >
                全部選択
              </button>
              <button
                type="button"
                onClick={() => {
                  if (mode === "jp") {
                    const all = Object.fromEntries(
                      jpDefinitions.map((d) => [d.id, false]),
                    );
                    setJpSelected(all);
                  } else {
                    if (alevelBoard === "alevel") {
                      const all = Object.fromEntries(
                        alevelDefinitions.map((d) => [d.id, false]),
                      );
                      setAlevelSelected(all);
                    } else {
                      const all = Object.fromEntries(
                        ibDefinitions.map((d) => [d.id, false]),
                      );
                      setIbSelected(all);
                    }
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white/40 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/70"
              >
                選択解除
              </button>

              {selectedCount > 0 ? (
                <span className="ml-auto self-center text-xs font-semibold text-slate-600">
                  選択中：{selectedCount} 件
                </span>
              ) : null}
            </div>
          </section>
        </div>

        <section
          id="today-plan"
          className="mt-6 rounded-3xl border border-sky-200/70 bg-white/55 p-5"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {viewTab === "daily"
                  ? "日別ノルマ（サンプル）"
                  : viewTab === "weekly"
                    ? "週間ノルマ（サンプル）"
                    : "月間ノルマ（サンプル）"}
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                {viewTab === "daily"
                  ? `逆算の計算結果から、最初の${tableDays}日分を表示します（横スクロール可）。`
                  : viewTab === "weekly"
                    ? "逆算の計算結果から、最初の数週間分を集計して表示します。"
                    : "逆算の計算結果から、最初の数ヶ月分を集計して表示します。"}
              </p>
            </div>

            <div className="text-xs font-semibold text-slate-600">
              {schedule ? (
                <>
                  残り{schedule.remainingDays}日 / 有効開始日{" "}
                  {formatDateInputValue(schedule.effectiveStart)}
                </>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewTab("daily")}
              className={[
                "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                viewTab === "daily"
                  ? "border-sky-300 bg-sky-600 text-white"
                  : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
              ].join(" ")}
            >
              日別
            </button>
            <button
              type="button"
              onClick={() => setViewTab("weekly")}
              className={[
                "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                viewTab === "weekly"
                  ? "border-sky-300 bg-sky-600 text-white"
                  : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
              ].join(" ")}
            >
              週間
            </button>
            <button
              type="button"
              onClick={() => setViewTab("monthly")}
              className={[
                "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                viewTab === "monthly"
                  ? "border-sky-300 bg-sky-600 text-white"
                  : "border-slate-200 bg-white/40 text-slate-700 hover:bg-white/70",
              ].join(" ")}
            >
              月間
            </button>
          </div>

          {schedule ? (
            viewTab === "daily" ? (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-sky-100 bg-white/70">
                <div
                  className="min-w-[680px]"
                  style={{
                    minWidth: 140 + selectedItems.length * 140,
                  }}
                >
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-none">
                    <div
                      className="bg-sky-50 p-3 text-xs font-bold text-sky-900"
                      style={{
                        display: "grid",
                        gridTemplateColumns: `140px repeat(${selectedItems.length}, minmax(140px, 1fr))`,
                      }}
                    >
                      <div>日付</div>
                      {selectedItems.map((it) => (
                        <div key={it.id} className="text-left">
                          {it.label}
                        </div>
                      ))}
                    </div>

                    <div>
                      {tableRows.map((row) => (
                        <div
                          key={row.ymd}
                          className="border-t border-slate-100 p-3 text-sm text-slate-800"
                          style={{
                            display: "grid",
                            gridTemplateColumns: `140px repeat(${selectedItems.length}, minmax(140px, 1fr))`,
                          }}
                        >
                          <div className="font-semibold text-slate-900">
                            {row.ymd}
                          </div>

                          {selectedItems.map((it) => {
                            const cell = row.perItem.find((p) => p.id === it.id);
                            return (
                              <div key={it.id} className="text-left">
                                {cell ? cell.value : 0}
                                <span className="ml-1 text-xs font-semibold text-slate-600">
                                  {it.unitLabel}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 p-3 text-xs text-slate-600">
                  ※ 選択した全ての教科/教材を表示します。
                </div>
              </div>
            ) : viewTab === "weekly" ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {weeklyGroups.map((w) => (
                  <div
                    key={w.weekIdx}
                    className="rounded-2xl border border-sky-100 bg-white/70 p-5"
                  >
                    <div className="text-xs font-semibold text-slate-600">
                      Week {w.weekIdx + 1}
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {w.ymdFrom} 〜 {w.ymdTo}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-700">
                      総ノルマ（集計）: {w.total}
                    </div>
                    <div className="mt-3 grid gap-2">
                      {w.perItem.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm text-slate-800">
                            {it.label}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {it.value}{" "}
                            <span className="text-xs font-semibold text-slate-600">
                              {it.unitLabel}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {weeklyGroups.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 text-sm text-slate-600">
                    表示する週がありません。
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {monthlyGroups.map((m) => (
                  <div
                    key={m.key}
                    className="rounded-2xl border border-sky-100 bg-white/70 p-5"
                  >
                    <div className="text-xs font-semibold text-slate-600">Month</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {m.ymdLabel}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-700">
                      総ノルマ（集計）: {m.total}
                    </div>
                    <div className="mt-3 grid gap-2">
                      {m.perItem.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm text-slate-800">
                            {it.label}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {it.value}{" "}
                            <span className="text-xs font-semibold text-slate-600">
                              {it.unitLabel}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {monthlyGroups.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 text-sm text-slate-600">
                    表示する月がありません。
                  </div>
                ) : null}
              </div>
            )
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/60 p-6 text-sm text-slate-600">
              入試日・逆算開始日・教材/科目を選択すると、ノルマが表示されます。
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

