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
