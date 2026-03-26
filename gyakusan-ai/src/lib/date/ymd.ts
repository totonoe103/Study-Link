export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseYmdToDate(ymd: string): Date | null {
  // "YYYY-MM-DD" をローカルタイムの00:00として扱う
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  const date = new Date(y, mo - 1, d, 0, 0, 0, 0);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function formatDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const ms = date.getTime() + days * MS_PER_DAY;
  return new Date(ms);
}

// inclusive（開始日と終了日を両方含む）
export function diffDaysInclusive(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const diff = b.getTime() - a.getTime();
  return Math.floor(diff / MS_PER_DAY) + 1;
}

