import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
];

export function BudgetVsSpendingChart({ data }: { data: Array<{ name: string; approved: number; spending: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }}
          labelStyle={{ color: "var(--foreground)" }}
          formatter={(value) => `Rp ${Number(value ?? 0).toFixed(1)}B`}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
        <Bar dataKey="approved" name="Approved budget" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="spending" name="Actual spending" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjectStatusChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function QuarterlyTrendChart({ data }: { data: Array<{ label: string; spending: number; committed: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }}
          formatter={(value) => `Rp ${Number(value ?? 0).toFixed(1)}B`}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
        <Line type="monotone" dataKey="spending" name="Actual spending" stroke="var(--chart-3)" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="committed" name="Committed cost" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryUtilizationChart({ data }: { data: Array<{ category: string; utilization: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 24, bottom: 8 }}>
        <CartesianGrid stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
        <YAxis type="category" dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
        <Tooltip
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }}
          formatter={(value) => `${(Number(value ?? 0) * 100).toFixed(0)}%`}
        />
        <Bar dataKey="utilization" name="Utilization" fill="var(--chart-2)" radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopProjectsByBudgetChart({ data }: { data: Array<{ name: string; budget: number; spending: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }}
          formatter={(value) => `Rp ${Number(value ?? 0).toFixed(1)}B`}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
        <Bar dataKey="budget" name="Approved budget" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="spending" name="Actual spending" fill="var(--chart-5)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MilestoneCompletionChart({ data }: { data: Array<{ label: string; completed: number; inProgress: number; remaining: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }} stackOffset="expand">
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
        <Tooltip
          contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }}
          formatter={(value, name) => [`${(Number(value ?? 0) * 100).toFixed(0)}%`, name as string]}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
        <Bar dataKey="completed" stackId="a" name="Completed" fill="var(--chart-3)" />
        <Bar dataKey="inProgress" stackId="a" name="In progress" fill="var(--chart-2)" />
        <Bar dataKey="remaining" stackId="a" name="Remaining" fill="var(--border)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
