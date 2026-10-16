import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Layers,
  Target,
  Trophy,
  TrendingUp,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pipelineSummary, mockKPIMetrics } from "@/lib/mock-data";

interface PipelineChartProps {
  className?: string;
}

const STAGE_COLORS: Record<string, string> = {
  New: "#38bdf8", // Sky
  Contacted: "#60a5fa", // Blue
  Demo: "#a855f7", // Purple
  Proposal: "#f59e0b", // Amber
  Negotiation: "#eab308", // Yellow
  Won: "#10b981", // Emerald
  Lost: "#64748b", // Slate
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="min-w-[180px] rounded-xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STAGE_COLORS[data.name] || "#67c5e3" }}
            />
            <span className="font-display text-sm font-semibold text-foreground">
              {data.name}
            </span>
          </div>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {data.count} {data.count === 1 ? "deal" : "deals"}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Stage Value:</span>
          <span className="font-mono font-bold text-foreground">
            ${data.value.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function PipelineChart({ className }: PipelineChartProps) {
  const [viewMode, setViewMode] = React.useState<"bars" | "list">("bars");
  const stages = pipelineSummary.stages;
  const totalPipelineValue = React.useMemo(
    () => stages.reduce((acc, stage) => acc + stage.value, 0),
    [stages]
  );

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="font-display text-lg tracking-tight">Sales Pipeline</CardTitle>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              <Layers className="mr-1 h-3 w-3" />
              Active Funnel
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Deal velocity and projected pipeline value across deal stages
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/50 bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setViewMode("bars")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === "bars"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chart
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Stages
            </button>
          </div>

          <Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground">
            <Link to="/dashboard/deals">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* KPI Mini Header */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-border/40 bg-muted/20 p-3 sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">Active Deals</div>
              <div className="font-display text-base font-bold text-foreground">
                {mockKPIMetrics.activeDeals}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">Win Rate</div>
              <div className="font-display text-base font-bold text-emerald-400">
                {mockKPIMetrics.winRate}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">Monthly Forecast</div>
              <div className="font-display text-base font-bold text-foreground">
                ${mockKPIMetrics.monthlyForecast.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">Pipeline Value</div>
              <div className="font-display text-base font-bold text-foreground">
                ${(totalPipelineValue / 1000).toFixed(0)}k
              </div>
            </div>
          </div>
        </div>

        {/* Chart View */}
        {viewMode === "bars" ? (
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stages}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="oklch(1 0 0 / 7%)"
                />
                <XAxis
                  type="number"
                  tickFormatter={(val) => `$${val / 1000}k`}
                  stroke="oklch(0.68 0.008 250)"
                  fontSize={11}
                  axisLine={{ stroke: "oklch(1 0 0 / 10%)" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="oklch(0.68 0.008 250)"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                >
                  {stages.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={STAGE_COLORS[entry.name] || "#67c5e3"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* List / Funnel Stage Breakdown */
          <div className="space-y-2.5">
            {stages.map((stage) => {
              const percentage = ((stage.value / totalPipelineValue) * 100).toFixed(1);
              const color = STAGE_COLORS[stage.name] || "#67c5e3";

              return (
                <div
                  key={stage.name}
                  className="group rounded-lg border border-border/30 bg-muted/10 p-2.5 transition-colors hover:border-border/60 hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-foreground">{stage.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        ({stage.count} {stage.count === 1 ? "deal" : "deals"})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        {percentage}%
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        ${stage.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
