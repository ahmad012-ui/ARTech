import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend,
} from "recharts";
import type { RevenueDataPoint } from "@/lib/types";
import { mockRevenueData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, ArrowUpRight } from "lucide-react";

interface CashFlowChartProps {
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
    payload: RevenueDataPoint & { netCashFlow: number };
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const row = payload[0].payload;
  const netFlow = row.revenue - row.expenses;

  return (
    <div className="rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-2 min-w-[180px]">
      <p className="font-semibold text-foreground border-b border-border/50 pb-1 font-mono">
        {label} 2026 Cash Flow
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Operating Inflows:</span>
          <span className="font-mono text-foreground font-medium">
            {formatCurrency(row.revenue)}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Operating Outflows:</span>
          <span className="font-mono text-foreground font-medium">
            {formatCurrency(row.expenses)}
          </span>
        </div>
        <div className="border-t border-border/40 pt-1.5 flex items-center justify-between font-bold">
          <span>Net Free Cash Flow:</span>
          <span
            className={cn(
              "font-mono",
              netFlow >= 0 ? "text-emerald-400" : "text-destructive"
            )}
          >
            {formatCurrency(netFlow)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CashFlowChart({ data = mockRevenueData, className }: CashFlowChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [viewType, setViewType] = useState<"net" | "split">("net");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute processed data with net flow
  const chartData = data.map((d) => ({
    ...d,
    netCashFlow: d.revenue - d.expenses,
  }));

  const totalNetFlow = chartData.reduce((sum, d) => sum + d.netCashFlow, 0);
  const avgMonthlyFlow = Math.round(totalNetFlow / (chartData.length || 1));
  const peakMonth = [...chartData].sort((a, b) => b.netCashFlow - a.netCashFlow)[0];

  return (
    <Card className={cn("border-border/60 bg-card/40 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-display font-semibold text-foreground">
              Cash Flow Dynamics
            </CardTitle>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1 text-[11px]">
              <ArrowUpRight className="h-3 w-3" />
              Positive Liquidity
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Monthly net cash generation after payroll, vendor hosting, and operational disbursements.
          </CardDescription>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-lg border border-border/40 text-xs">
          <button
            onClick={() => setViewType("net")}
            className={cn(
              "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
              viewType === "net"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Net Flow
          </button>
          <button
            onClick={() => setViewType("split")}
            className={cn(
              "px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer",
              viewType === "split"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Inflow vs Outflow
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 pb-4 mb-2 border-b border-border/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Total Net Flow YTD</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {formatCurrency(totalNetFlow)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Avg Monthly Net Flow</span>
            <span className="font-mono font-bold text-foreground text-sm">
              {formatCurrency(avgMonthlyFlow)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Peak Month</span>
            <span className="font-mono font-bold text-primary text-sm">
              {peakMonth?.month} ({formatCurrency(peakMonth?.netCashFlow || 0)})
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-[280px] w-full min-w-0">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.2)" />

                {viewType === "net" ? (
                  <Bar dataKey="netCashFlow" name="Net Cash Flow" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.netCashFlow >= 0 ? "#10b981" : "#ef4444"}
                        opacity={0.85}
                      />
                    ))}
                  </Bar>
                ) : (
                  <>
                    <Bar
                      dataKey="revenue"
                      name="Inflows (Revenue)"
                      fill="#38bdf8"
                      radius={[4, 4, 0, 0]}
                      opacity={0.85}
                    />
                    <Bar
                      dataKey="expenses"
                      name="Outflows (Expenses)"
                      fill="#f43f5e"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground animate-pulse">
              Loading liquidity metrics...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
