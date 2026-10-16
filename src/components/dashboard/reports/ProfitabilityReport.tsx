import { useMemo } from "react";
import type { Project } from "@/lib/types";
import { mockProjects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FolderKanban, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ProfitabilityReportProps {
  projects?: Project[];
  className?: string;
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

function getStatusBadge(status: Project["status"]) {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-[11px]">
          Active
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px]">
          Completed
        </Badge>
      );
    case "delayed":
      return (
        <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-400 text-[11px]">
          Delayed
        </Badge>
      );
    case "planning":
    default:
      return (
        <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground text-[11px]">
          Planning
        </Badge>
      );
  }
}

export function ProfitabilityReport({
  projects = mockProjects,
  className,
}: ProfitabilityReportProps) {
  // Aggregate portfolio metrics
  const portfolioSummary = useMemo(() => {
    // Exclude internal projects with 0 budget from margin % calc
    const billableProjects = projects.filter((p) => p.budget > 0);
    const totalBudget = billableProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = billableProjects.reduce((sum, p) => sum + p.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const avgMargin = totalBudget > 0 ? ((totalRemaining / totalBudget) * 100).toFixed(1) : "0";

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      avgMargin,
      count: projects.length,
    };
  }, [projects]);

  return (
    <Card className={cn("border-border/60 bg-card/40 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-display font-semibold text-foreground">
              Profitability by Project
            </CardTitle>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[11px]">
              Avg Margin {portfolioSummary.avgMargin}%
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Budget burn rates, capital expenditures, and project margin performance.
          </CardDescription>
        </div>

        {/* Aggregate Mini Stat Strip */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Allocated Budget</span>
            <span className="font-bold text-foreground">{formatCurrency(portfolioSummary.totalBudget)}</span>
          </div>
          <div className="border-l border-border/50 pl-4">
            <span className="text-muted-foreground block text-[10px] uppercase">Retained Margin</span>
            <span className="font-bold text-emerald-400">{formatCurrency(portfolioSummary.totalRemaining)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/20 hover:bg-muted/20">
                <TableHead className="min-w-[180px] text-xs">Project & Client</TableHead>
                <TableHead className="w-[100px] text-xs">Status</TableHead>
                <TableHead className="w-[110px] text-right text-xs font-mono">Budget</TableHead>
                <TableHead className="w-[110px] text-right text-xs font-mono">Spent</TableHead>
                <TableHead className="w-[110px] text-right text-xs font-mono">Remaining</TableHead>
                <TableHead className="w-[140px] text-xs">Budget Burn %</TableHead>
                <TableHead className="w-[90px] text-right text-xs">Margin %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const isInternal = project.budget === 0;
                const remaining = project.budget - project.spent;
                const burnPct = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
                const marginPct =
                  project.budget > 0
                    ? (((project.budget - project.spent) / project.budget) * 100).toFixed(1)
                    : "N/A";

                const isWarning = burnPct > 75;
                const isCritical = burnPct >= 90;

                return (
                  <TableRow key={project.id} className="border-border/40 hover:bg-muted/30">
                    {/* Project & Client */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground text-sm">
                          {project.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {project.clientName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {getStatusBadge(project.status)}
                    </TableCell>

                    {/* Budget */}
                    <TableCell className="text-right font-mono text-xs text-foreground font-semibold">
                      {isInternal ? (
                        <span className="text-muted-foreground italic font-sans text-[11px]">Internal R&D</span>
                      ) : (
                        formatCurrency(project.budget)
                      )}
                    </TableCell>

                    {/* Spent */}
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {isInternal ? "—" : formatCurrency(project.spent)}
                    </TableCell>

                    {/* Remaining */}
                    <TableCell className="text-right font-mono text-xs font-semibold">
                      {isInternal ? (
                        "—"
                      ) : (
                        <span className={remaining < 0 ? "text-destructive" : "text-emerald-400"}>
                          {formatCurrency(remaining)}
                        </span>
                      )}
                    </TableCell>

                    {/* Budget Burn Progress Bar */}
                    <TableCell>
                      {isInternal ? (
                        <span className="text-xs text-muted-foreground font-mono">No cap</span>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className={cn(isCritical ? "text-destructive font-bold" : isWarning ? "text-amber-400" : "text-muted-foreground")}>
                              {burnPct}%
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              {project.progress}% delivered
                            </span>
                          </div>
                          <Progress
                            value={burnPct}
                            className={cn(
                              "h-1.5 bg-muted",
                              isCritical
                                ? "[&>div]:bg-destructive"
                                : isWarning
                                ? "[&>div]:bg-amber-400"
                                : "[&>div]:bg-primary"
                            )}
                          />
                        </div>
                      )}
                    </TableCell>

                    {/* Profit Margin */}
                    <TableCell className="text-right font-mono text-xs font-bold">
                      {isInternal ? (
                        <span className="text-muted-foreground font-sans font-normal text-xs">—</span>
                      ) : (
                        <span
                          className={cn(
                            Number(marginPct) > 50
                              ? "text-emerald-400"
                              : Number(marginPct) > 20
                              ? "text-primary"
                              : "text-amber-400"
                          )}
                        >
                          +{marginPct}%
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
