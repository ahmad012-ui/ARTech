import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenueDataPoint } from "@/lib/types";
import { mockRevenueData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from "lucide-react";

interface RevenueReportProps {
  data?: RevenueDataPoint[];
  className?: string;
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-2 min-w-[170px]">
      <p className="font-semibold text-foreground border-b border-border/50 pb-1.5 font-mono">
        {label} 2026 Financials
      </p>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground capitalize">{item.name}:</span>
          </div>
          <span className="font-mono font-bold text-foreground">
            {formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueReport({ data = mockRevenueData, className }: RevenueReportProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "profit">("all");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const latestMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const momGrowth = previousMonth
    ? (((latestMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1)
    : "0";

  return (
    <Card className={cn("border-border/60 bg-card/40 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-display font-semibold text-foreground">
              Revenue & Profit Trends
            </CardTitle>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1 text-[11px]">
              <TrendingUp className="h-3 w-3" />
              +{momGrowth}% MoM
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Monthly gross billings, operational disbursements, and net retainage.
          </CardDescription>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-lg border border-border/40 text-xs">
          <button
            onClick={() => setViewMode("all")}
            className={cn(
              "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
              viewMode === "all"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Gross vs Net
          </button>
          <button
            onClick={() => setViewMode("profit")}
            className={cn(
              "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
              viewMode === "profit"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Net Margin Focus
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 pb-4 mb-2 border-b border-border/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">YTD Gross</span>
            <span className="font-mono font-bold text-foreground text-sm">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Latest Month ({latestMonth.month})</span>
            <span className="font-mono font-bold text-primary text-sm">
              {formatCurrency(latestMonth.revenue)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Latest Net Profit</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {formatCurrency(latestMonth.profit)}
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[280px] w-full min-w-0">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  {/* Cyan / Primary gradient for Revenue */}
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Emerald gradient for Profit */}
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Rose gradient for Expenses */}
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                />

                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />

                <Tooltip content={<CustomTooltip />} />

                {viewMode === "all" && (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                )}

                {viewMode === "all" && (
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="expenses"
                    stroke="#f43f5e"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#expensesGradient)"
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="profit"
                  name="profit"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground animate-pulse">
              Loading financial trajectory...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
