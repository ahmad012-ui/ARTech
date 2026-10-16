import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  mockRevenueData,
  mockProjects,
  mockExpenses,
  mockInvoices,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RevenueReport } from "@/components/dashboard/reports/RevenueReport";
import { ProfitabilityReport } from "@/components/dashboard/reports/ProfitabilityReport";
import { CashFlowChart } from "@/components/dashboard/reports/CashFlowChart";

export const Route = createFileRoute("/dashboard/reports/")({
  component: FinancialReportsPage,
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

// Category colors for the Expense Breakdown PieChart
const CATEGORY_COLORS: Record<string, string> = {
  "Freelancer": "#38bdf8",
  "Cloud Infrastructure": "#a855f7",
  "Travel": "#f59e0b",
  "Marketing": "#ec4899",
  "Software Licenses": "#10b981",
};

export function FinancialReportsPage() {
  const [timeframe, setTimeframe] = useState<string>("ytd");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Summary KPIs calculated dynamically from mock data
  const summaryKPIs = useMemo(() => {
    const totalRev = mockRevenueData.reduce((sum, d) => sum + d.revenue, 0);
    const totalExp = mockRevenueData.reduce((sum, d) => sum + d.expenses, 0);
    const netProf = totalRev - totalExp;
    const marginPct = totalRev > 0 ? ((netProf / totalRev) * 100).toFixed(1) : "0";

    return {
      revenueYTD: totalRev,
      totalExpenses: totalExp,
      netProfit: netProf,
      profitMargin: marginPct,
    };
  }, []);

  // Grouped expenses by category
  const expenseBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const exp of mockExpenses) {
      const current = map.get(exp.category) || 0;
      map.set(exp.category, current + exp.amount);
    }

    const total = Array.from(map.values()).reduce((sum, v) => sum + v, 0);

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
        color: CATEGORY_COLORS[name] || "#71717a",
      }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const totalCategorizedExpenses = useMemo(() => {
    return expenseBreakdown.reduce((sum, item) => sum + item.value, 0);
  }, [expenseBreakdown]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
              Financial Intelligence & Reports
            </h1>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
              GAAP Calibrated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Executive revenue analytics, cash flow trajectories, project margins, and expenditure breakdowns.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px] bg-card/40 border-border/60 text-xs h-9">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">YTD 2026</SelectItem>
              <SelectItem value="q3">Q3 2026</SelectItem>
              <SelectItem value="q2">Q2 2026</SelectItem>
              <SelectItem value="annual">FY 2025-2026</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs bg-card/40 border-border/60"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 text-primary" />
            Export Statement
          </Button>
        </div>
      </div>

      {/* Summary KPIs Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue YTD */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/90">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Revenue YTD
              </p>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-foreground">
                {formatCurrency(summaryKPIs.revenueYTD)}
              </h3>
              <p className="text-xs text-primary mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15.2% ARR expansion
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:border-border hover:bg-card/90">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Expenses
              </p>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-foreground">
                {formatCurrency(summaryKPIs.totalExpenses)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Operating disbursements</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-muted-foreground">
              <Layers className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="border-emerald-500/30 bg-emerald-500/[0.04] backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-500/[0.08]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                Net Profit
              </p>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-emerald-400">
                {formatCurrency(summaryKPIs.netProfit)}
              </h3>
              <p className="text-xs text-emerald-400/80 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Positive retained earnings
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/15 p-3 text-emerald-400">
              <BarChart3 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Profit Margin % */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/90">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Profit Margin %
              </p>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-primary">
                {summaryKPIs.profitMargin}%
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Above top-quartile SaaS benchmark</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
              <Percent className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Revenue Overview + Expense Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Overview (AreaChart) - takes 2 cols on lg */}
        <div className="lg:col-span-2">
          <RevenueReport data={mockRevenueData} />
        </div>

        {/* Expense Breakdown (PieChart + Grouped Table) - takes 1 col on lg */}
        <Card className="border-border/60 bg-card/40 backdrop-blur-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display font-semibold text-foreground">
                Expense Breakdown
              </CardTitle>
              <span className="font-mono text-xs font-bold text-foreground">
                {formatCurrency(totalCategorizedExpenses)}
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Categorized operations and contractor spend.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Donut Chart */}
            <div className="h-[180px] w-full min-w-0">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-border bg-card p-2 text-xs shadow-md">
                            <span className="font-semibold text-foreground">{data.name}</span>
                            <div className="font-mono text-primary font-bold mt-0.5">
                              {formatCurrency(data.value)} ({data.percentage}%)
                            </div>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground animate-pulse">
                  Loading breakdown...
                </div>
              )}
            </div>

            {/* Category List */}
            <div className="divide-y divide-border/40 text-xs">
              {expenseBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-foreground/90 font-medium truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-muted-foreground">{item.percentage}%</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Cash Flow (BarChart) */}
      <CashFlowChart data={mockRevenueData} />

      {/* Row 3: Profitability by Project */}
      <ProfitabilityReport projects={mockProjects} />
    </div>
  );
}
