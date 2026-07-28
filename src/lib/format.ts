/** Small display helpers. Pure, no dependencies. */

/** "Jan 2026" + "Present" -> "Jan 2026 – Present". Collapses same-value ranges. */
export function dateRange(start: string, end?: string): string {
  if (!end || end === start) return start;
  return `${start} – ${end}`;
}

/** "2026-04-15" → sortable number, day defaulting to 1. */
export function sortKeyToNumber(key: string): number {
  const [y, m, d = "01"] = key.split("-");
  return Number(y) * 10000 + Number(m) * 100 + Number(d);
}

/** "2026-04-29T12:00:00Z" → "Apr 2026". */
export function monthYear(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** 1234 → "1.2k". Leaves small numbers alone. */
export function compactNumber(n: number): string {
  if (n < 1000) return String(n);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Zero-padded index for numbered lists: 1 → "01". */
export function ordinal(i: number, pad = 2): string {
  return String(i + 1).padStart(pad, "0");
}
