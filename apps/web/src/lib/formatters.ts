export function formatIDRBillions(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1) {
    return `${sign}Rp ${abs.toFixed(abs >= 10 ? 1 : 2)}B`;
  }
  return `${sign}Rp ${(abs * 1000).toFixed(0)}M`;
}

export function formatIDRPlain(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  return `Rp ${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}B`;
}

export function formatPercent(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatDate(value?: string): string {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

export function formatDateTime(value?: string): string {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return value;
  }
}

export function daysBetween(from: string, to: string): number {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function relativeDays(value: string): string {
  const today = new Date();
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return value;
  const days = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days > 0) return `in ${days} day${days === 1 ? "" : "s"}`;
  return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}
