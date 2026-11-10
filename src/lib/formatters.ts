import type { Timestamp } from "firebase/firestore";

export function formatDateTime(value: Timestamp | undefined, language: string): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(value.toDate());
}

export function formatNumber(value: number, language: string): string {
  return new Intl.NumberFormat(language).format(value);
}
