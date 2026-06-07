import { Filter, X } from "lucide-react";

import { Button } from "@project-management-mockup/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@project-management-mockup/ui/components/dropdown-menu";
import { Label } from "@project-management-mockup/ui/components/label";
import {
  QUARTER_LABELS,
  SEMESTER_LABELS,
  type Quarter,
  type Semester,
  type Subholding,
} from "@/lib/domain";
import { isHoldingWide } from "@/lib/permissions";
import type { DemoUser } from "@/lib/domain";
import { useAppState } from "@/lib/app-state";
import { setGlobalPeriod, setGlobalSubholding } from "@/lib/actions";

const YEARS = [2026, 2025, 2024];

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
        <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <Button variant="outline" size="sm" {...props}>
                {activeSubholding ? activeSubholding.name : "All subholdings"}
              </Button>
            )}
          />
          <DropdownMenuContent align="start" className="min-w-56">
            <DropdownMenuLabel>Subholding</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={state.globalSubholdingId ?? "all"}
              onValueChange={(value) => {
                const next = value === "all" ? undefined : value;
                setState((s) => setGlobalSubholding(s, next));
              }}
            >
              <DropdownMenuRadioItem value="all">All subholdings</DropdownMenuRadioItem>
              {subholdings.map((s) => (
                <DropdownMenuRadioItem key={s.id} value={s.id}>
                  {s.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button variant="outline" size="sm" {...props}>
              {state.globalYear}
            </Button>
          )}
        />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Year</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={String(state.globalYear)}
            onValueChange={(value) => {
              const year = Number(value);
              setState((s) => setGlobalPeriod(s, s.globalPeriod, year, s.globalQuarter, s.globalSemester));
            }}
          >
            {YEARS.map((y) => (
              <DropdownMenuRadioItem key={y} value={String(y)}>
                {y}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button variant="outline" size="sm" {...props}>
              {state.globalPeriod === "quarterly"
                ? QUARTER_LABELS[quarter as Quarter]
                : state.globalPeriod === "semesterly"
                  ? SEMESTER_LABELS[semester as Semester]
                  : "Annually"}
            </Button>
          )}
        />
        <DropdownMenuContent align="start" className="min-w-56">
          <DropdownMenuLabel>Period</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={state.globalPeriod}
            onValueChange={(value) => {
              const period = value as "quarterly" | "semesterly" | "annually";
              setState((s) => setGlobalPeriod(s, period, s.globalYear, s.globalQuarter, s.globalSemester));
            }}
          >
            <DropdownMenuRadioItem value="quarterly">Quarterly</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="semesterly">Semesterly</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="annually">Annually</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          {state.globalPeriod === "quarterly" ? (
            <>
              <DropdownMenuLabel>Quarter</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={quarter}
                onValueChange={(value) => {
                  const q = value as Quarter;
                  setState((s) => setGlobalPeriod(s, "quarterly", s.globalYear, q, s.globalSemester));
                }}
              >
                {(Object.keys(QUARTER_LABELS) as Quarter[]).map((q) => (
                  <DropdownMenuRadioItem key={q} value={q}>
                    {QUARTER_LABELS[q]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </>
          ) : null}
          {state.globalPeriod === "semesterly" ? (
            <>
              <DropdownMenuLabel>Semester</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={semester}
                onValueChange={(value) => {
                  const sem = value as Semester;
                  setState((s) => setGlobalPeriod(s, "semesterly", s.globalYear, s.globalQuarter, sem));
                }}
              >
                {(Object.keys(SEMESTER_LABELS) as Semester[]).map((s2) => (
                  <DropdownMenuRadioItem key={s2} value={s2}>
                    {SEMESTER_LABELS[s2]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

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

      <div className="ml-auto hidden md:flex items-center gap-2 text-[11px] text-muted-foreground">
        <Label>Period reporting</Label>
      </div>
    </div>
  );
}
