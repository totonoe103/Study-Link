import { addDays, diffDaysInclusive, MS_PER_DAY } from "@/lib/date/ymd";

export type PlanItem = {
  id: string;
  label: string;
  unitLabel: string;
  totalUnits: number;
  // 学習の性質に応じた配分（前半/後半の寄り方）
  // 例: 基礎(basic)は前半に多め、演習(practice)は後半に多め
  weightProfile?: "basic" | "standard" | "practice";
};

export type WeightProfile = NonNullable<PlanItem["weightProfile"]>;

export type WeightTuning = {
  // 曲線の滑らかさ（0~1）
  smoothness: number;
  // 各プロファイルの開始倍率と終了倍率
  profileRange: Record<
    WeightProfile,
    {
      start: number;
      end: number;
    }
  >;
};

export const defaultWeightTuning: WeightTuning = {
  smoothness: 1,
  profileRange: {
    basic: { start: 1.0, end: 0.95 },
    standard: { start: 1.0, end: 1.2 },
    // 要望: 後半(practice)は前半(basic)の約1.5倍
    practice: { start: 1.0, end: 1.5 },
  },
};

export function makeEndLoadedWeights(days: number) {
  const d = Math.max(1, Math.floor(days));
  if (d === 1) return [1];

  // 前半: 軽め（1.0）, 中盤: 標準, 後半: 重め（最大2.0）
  // pos^2 による滑らかな増加で「試験直前ほど重い」配分になる
  return new Array(d).fill(0).map((_, idx) => {
    const pos = idx / (d - 1);
    return 1 + Math.pow(pos, 2) * 1; // 1 -> 2
  });
}

function clamp01(v: number) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function smoothStep(t: number) {
  // 0 -> 1 を滑らかに遷移（急激な立ち上がりを抑える）
  return t * t * (3 - 2 * t);
}

export function makeProfileWeights(
  days: number,
  profile: WeightProfile,
  tuning: WeightTuning = defaultWeightTuning,
) {
  const d = Math.max(1, Math.floor(days));
  if (d === 1) return [1];

  const range = tuning.profileRange[profile];
  const smoothness = clamp01(tuning.smoothness);

  return new Array(d).fill(0).map((_, idx) => {
    const pos = idx / (d - 1); // 0(前半) -> 1(後半)

    // 線形とsmoothstepをブレンドして、将来の調整を容易にする
    const curved = pos * (1 - smoothness) + smoothStep(pos) * smoothness;
    return range.start + (range.end - range.start) * curved;
  });
}

function distributeTotalByWeights(total: number, weights: number[]) {
  const t = Math.max(0, Math.floor(total));
  const n = Math.max(1, weights.length);

  const safeWeights =
    weights.length === n ? weights : new Array(n).fill(1).map((_, i) => weights[i] ?? 1);

  const weightSum = safeWeights.reduce((acc, w) => acc + w, 0);
  if (weightSum <= 0) {
    // フォールバック: 均等配分
    const base = Math.floor(t / n);
    const rem = t % n;
    return new Array(n).fill(0).map((_, i) => base + (i < rem ? 1 : 0));
  }

  const exact = safeWeights.map((w) => (t * w) / weightSum);
  const floors = exact.map((v) => Math.floor(v));
  const sumFloors = floors.reduce((a, b) => a + b, 0);
  let rem = t - sumFloors;

  // 端数は、小数部分が大きい日から順に+1していく
  const fracOrder = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  const arr = floors.slice();
  for (let k = 0; k < fracOrder.length && rem > 0; k++) {
    arr[fracOrder[k]!.i] += 1;
    rem -= 1;
  }

  return arr;
}

export function computeBackwardSchedule(params: {
  examDate: Date;
  startDate: Date;
  delayDays: number;
  items: PlanItem[];
  tuning?: WeightTuning;
}) {
  const { examDate, startDate, delayDays, items, tuning = defaultWeightTuning } = params;

  const effectiveStart = addDays(startDate, Math.max(0, Math.floor(delayDays)));
  const remainingDays = diffDaysInclusive(effectiveStart, examDate);

  const safeDays = Math.max(1, remainingDays);
  const dailyByItem: Record<string, number[]> = {};

  let dailyTotalSum = 0;
  for (const it of items) {
    const weights = makeProfileWeights(
      safeDays,
      it.weightProfile ?? "standard",
      tuning,
    );
    dailyByItem[it.id] = distributeTotalByWeights(it.totalUnits, weights);
    // 合計値を軽く検算（表示用）
    dailyTotalSum += it.totalUnits;
  }

  const dailyTotal: number[] = new Array(safeDays)
    .fill(0)
    .map((_, dayIdx) =>
      items.reduce((acc, it) => acc + (dailyByItem[it.id]?.[dayIdx] ?? 0), 0),
    );

  // 計算の表示用
  const averagePerDay = dailyTotalSum / safeDays;
  const endDate = examDate;

  // 日付配列（safeDays分）
  const dates: Date[] = new Array(safeDays).fill(0).map((_, dayIdx) => addDays(effectiveStart, dayIdx));

  return {
    effectiveStart,
    remainingDays: safeDays,
    endDate,
    averagePerDay,
    dailyByItem,
    dailyTotal,
    dates,
  };
}

export function daysBetweenMillis(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

