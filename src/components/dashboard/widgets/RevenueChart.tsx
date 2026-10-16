import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRevenueData } from "@/lib/mock-data";
import type { RevenueDataPoint } from "@/lib/types";

interface RevenueChartProps {
  data?: RevenueDataPoint[];
  className?: string;
}

const formatCurrency = (val: number) => {
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(0)}k`;
  }
  return `$${val}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const rev = payload.find((p: any) => p.dataKey === "revenue")?.value || 0;
    const exp = payload.find((p: any) => p.dataKey === "expenses")?.value || 0;
    const prof = payload.find((p: any) => p.dataKey === "profit")?.value || 0;
    const margin = rev > 0 ? ((prof / rev) * 100).toFixed(1) : 0;

    return (
      <div className="min-w-[210px] rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2.5">
          <span className="font-display text-sm font-semibold text-foreground">
            {label} 2026
          </span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-emerald-500/30 text-emerald-400">
            {margin}% margin
          </Badge>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#67c5e3]" />
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <span className="font-mono font-medium text-foreground">
              ${rev.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#f43f5e]" />
              <span className="text-muted-foreground">Expenses</span>
            </div>
            <span className="font-mono font-medium text-foreground">
              ${exp.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span className="font-medium text-emerald-400">Net Profit</span>
            </div>
            <span className="font-mono font-semibold text-emerald-400">
              ${prof.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data = mockRevenueData, className }: RevenueChartProps) {
  const [activeSeries, setActiveSeries] = React.useState<"all" | "revenue" | "profit">("all");

  const totals = React.useMemo(() => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalExpenses = data.reduce((acc, curr) => acc + curr.expenses, 0);
    const totalProfit = data.reduce((acc, curr) => acc + curr.profit, 0);
    const latestMonth = data[data.length - 1];
    const prevMonth = data[data.length - 2];
    const growth =
      prevMonth && prevMonth.revenue
        ? (((latestMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)
        : "0.0";
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      margin: ((totalProfit / totalRevenue) * 100).toFixed(1),
      growth,
    };
  }, [data]);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="font-display text-lg tracking-tight">Financial Performance</CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{totals.growth}% MoM
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Monthly breakdown of gross revenue, operational expenses, and net profit
          </CardDescription>
        </div>

        {/* Quick View Filter */}
        <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setActiveSeries("all")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              activeSeries === "all"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries("revenue")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              activeSeries === "revenue"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries("profit")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              activeSeries === "profit"
                ? "bg-emerald-500 text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profit
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Top Summary Row */}
        <div className="mb-6 grid grid-cols-3 gap-3 border-y border-border/40 py-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Period Revenue
            </div>
            <div className="font-display text-lg font-bold text-foreground">
              ${(totals.totalRevenue / 1000).toFixed(1)}k
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Period Profit
            </div>
            <div className="font-display text-lg font-bold text-emerald-400">
              ${(totals.totalProfit / 1000).toFixed(1)}k
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Avg Margin
            </div>
            <div className="font-display text-lg font-bold text-primary">
              {totals.margin}%
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* Revenue Gradient - Primary #67c5e3 */}
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#67c5e3" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#67c5e3" stopOpacity={0.0} />
                </linearGradient>

                {/* Expenses Gradient - Destructive #f43f5e */}
                <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>

                {/* Profit Gradient - Green #10b981 */}
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="oklch(1 0 0 / 7%)"
              />

              <XAxis
                dataKey="month"
                stroke="oklch(0.68 0.008 250)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "oklch(1 0 0 / 10%)" }}
              />

              <YAxis
                stroke="oklch(0.68 0.008 250)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />

              <Tooltip content={<CustomTooltip />} />

              {(activeSeries === "all" || activeSeries === "revenue") && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#67c5e3"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              )}

              {activeSeries === "all" && (
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expensesGrad)"
                />
              )}

              {(activeSeries === "all" || activeSeries === "profit") && (
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#profitGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend bottom */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#67c5e3]" />
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f43f5e]" />
            <span>Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            <span>Net Profit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
