import { seedState } from "../data/seed";
import type { AppState } from "./domain";

const STORAGE_KEY = "pmm.appState.v1";

export function loadState(): AppState {
  if (typeof window === "undefined") return seedState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
      return seedState;
    }
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || typeof parsed !== "object" || parsed.version !== seedState.version) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
      return seedState;
    }
    return parsed;
  } catch {
    return seedState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): AppState {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
  }
  return seedState;
}

export function readCurrentUserId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<AppState> | null;
    if (!parsed || typeof parsed !== "object") return undefined;
    const id = parsed.currentUserId;
    return typeof id === "string" && id.length > 0 ? id : undefined;
  } catch {
    return undefined;
  }
}
