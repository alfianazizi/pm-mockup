import type { ReactNode } from "react";

import { cn } from "@project-management-mockup/ui/lib/utils";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  className?: string;
}

export function defineColumns<T>(columns: Column<T>[]): Column<T>[] {
  return columns;
}

export function DataTable<T>({
  columns,
  rows,
  empty,
  rowKey,
  onRowClick,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: ReactNode;
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  className?: string;
}) {
  if (rows.length === 0 && empty) {
    return <div>{empty}</div>;
  }
  return (
    <div className={cn("overflow-hidden rounded-sm ring-1 ring-foreground/10 bg-card", className)}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-2 text-[11px] font-medium uppercase tracking-wide whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    !col.align && "text-left",
                    col.className,
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={rowKey(row, idx)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-t border-border",
                  idx % 2 === 1 ? "bg-muted/30" : "bg-card",
                  onRowClick && "cursor-pointer hover:bg-muted/60",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-3 py-2 align-middle",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
