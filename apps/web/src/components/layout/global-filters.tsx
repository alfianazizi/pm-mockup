import { Filter, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@project-management-mockup/ui/components/button";
import { cn } from "@project-management-mockup/ui/lib/utils";

import { useAppState } from "@/lib/app-state";
import { setGlobalPeriod, setGlobalSubholding } from "@/lib/actions";
import type { DemoUser, Subholding } from "@/lib/domain";
import { isHoldingWide } from "@/lib/permissions";
import {
  QUARTER_LABELS,
  SEMESTER_LABELS,
  type Quarter,
  type Semester,
} from "@/lib/domain";

const YEARS = [2026, 2025, 2024];

type Period = "quarterly" | "semesterly" | "annually";

export function GlobalFilters({ user, subholdings }: { user: DemoUser; subholdings: Subholding[] }) {
  const { state, setState } = useAppState();
  const showSubholding = isHoldingWide(user);
  const activeSubholding = subholdings.find((s) => s.id === state.globalSubholdingId);
  const quarter = state.globalQuarter ?? "Q1";
  const semester = state.globalSemester ?? "S1";

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 md:px-4 py-2 bg-card border-b border-border text-xs">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Filter className="size-3.5" />
        <span className="font-medium uppercase tracking-wide text-[10px]">Reporting scope</span>
      </div>

      {showSubholding ? (
        <FilterPopover
          label={activeSubholding ? activeSubholding.name : "All subholdings"}
          title="Subholding"
          minWidthClass="min-w-56"
        >
          <FilterOption
            active={!state.globalSubholdingId}
            onSelect={() => setState((s) => setGlobalSubholding(s, undefined))}
            label="All subholdings"
          />
          {subholdings.map((s) => (
            <FilterOption
              key={s.id}
              active={state.globalSubholdingId === s.id}
              onSelect={() => setState((prev) => setGlobalSubholding(prev, s.id))}
              label={s.name}
            />
          ))}
        </FilterPopover>
      ) : null}

      <FilterPopover
        label={String(state.globalYear)}
        title="Year"
      >
        {YEARS.map((y) => (
          <FilterOption
            key={y}
            active={state.globalYear === y}
            onSelect={() =>
              setState((s) => setGlobalPeriod(s, s.globalPeriod, y, s.globalQuarter, s.globalSemester))
            }
            label={String(y)}
          />
        ))}
      </FilterPopover>

      <FilterPopover
        label={
          state.globalPeriod === "quarterly"
            ? QUARTER_LABELS[quarter as Quarter]
            : state.globalPeriod === "semesterly"
              ? SEMESTER_LABELS[semester as Semester]
              : "Annually"
        }
        title="Period"
        minWidthClass="min-w-56"
      >
        <FilterOption
          active={state.globalPeriod === "quarterly"}
          onSelect={() =>
            setState((s) => setGlobalPeriod(s, "quarterly", s.globalYear, s.globalQuarter, s.globalSemester))
          }
          label="Quarterly"
        />
        <FilterOption
          active={state.globalPeriod === "semesterly"}
          onSelect={() =>
            setState((s) => setGlobalPeriod(s, "semesterly", s.globalYear, s.globalQuarter, s.globalSemester))
          }
          label="Semesterly"
        />
        <FilterOption
          active={state.globalPeriod === "annually"}
          onSelect={() =>
            setState((s) => setGlobalPeriod(s, "annually", s.globalYear, s.globalQuarter, s.globalSemester))
          }
          label="Annually"
        />
        {state.globalPeriod === "quarterly" ? (
          <>
            <div className="my-1 h-px bg-border" />
            <FilterSectionLabel>Quarter</FilterSectionLabel>
            {(Object.keys(QUARTER_LABELS) as Quarter[]).map((q) => (
              <FilterOption
                key={q}
                active={quarter === q}
                onSelect={() =>
                  setState((s) => setGlobalPeriod(s, "quarterly", s.globalYear, q, s.globalSemester))
                }
                label={QUARTER_LABELS[q]}
              />
            ))}
          </>
        ) : null}
        {state.globalPeriod === "semesterly" ? (
          <>
            <div className="my-1 h-px bg-border" />
            <FilterSectionLabel>Semester</FilterSectionLabel>
            {(Object.keys(SEMESTER_LABELS) as Semester[]).map((s2) => (
              <FilterOption
                key={s2}
                active={semester === s2}
                onSelect={() =>
                  setState((s) => setGlobalPeriod(s, "semesterly", s.globalYear, s.globalQuarter, s2))
                }
                label={SEMESTER_LABELS[s2]}
              />
            ))}
          </>
        ) : null}
      </FilterPopover>

      {(state.globalSubholdingId || state.globalPeriod !== "quarterly" || state.globalYear !== 2026) ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setState((s) =>
              setGlobalPeriod(setGlobalSubholding(s, undefined), "quarterly", 2026, "Q2", undefined),
            );
          }}
        >
          <X className="size-3.5" /> Clear
        </Button>
      ) : null}
    </div>
  );
}

function FilterSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

function FilterOption({
  active,
  onSelect,
  label,
}: {
  active: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs rounded-none",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground hover:bg-muted",
      )}
    >
      <span>{label}</span>
      {active ? <span className="text-[10px] uppercase tracking-wide text-primary">Selected</span> : null}
    </button>
  );
}

function FilterPopover({
  label,
  title,
  children,
  minWidthClass,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  minWidthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-none border border-input bg-card px-2.5 text-xs text-foreground transition-colors hover:bg-muted",
          open && "bg-muted",
        )}
      >
        {label}
      </button>
      {open ? (
        <div
          ref={containerRef}
          role="menu"
          aria-label={title}
          className={cn(
            "absolute left-0 top-full mt-1 z-40 min-w-48 overflow-hidden rounded-sm border border-border bg-card shadow-md",
            minWidthClass,
          )}
        >
          <FilterSectionLabel>{title}</FilterSectionLabel>
          <div className="py-1">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
