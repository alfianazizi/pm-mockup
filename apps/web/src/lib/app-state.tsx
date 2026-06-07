import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { AppState } from "./domain";
import { loadState, resetState, saveState } from "./storage";

interface AppStateContextValue {
  state: AppState;
  setState: (updater: (s: AppState) => AppState) => void;
  reset: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setState = useCallback((updater: (s: AppState) => AppState) => {
    setStateInternal((prev) => updater(prev));
  }, []);

  const reset = useCallback(() => {
    const fresh = resetState();
    setStateInternal(fresh);
  }, []);

  const value = useMemo(() => ({ state, setState, reset }), [state, setState, reset]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}
