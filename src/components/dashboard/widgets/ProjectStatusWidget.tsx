import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  FolderKanban,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { mockProjects, projectStatusSummary } from "@/lib/mock-data";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectStatusWidgetProps {
  className?: string;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  active: {
    label: "Active",
    badgeClass: "bg-primary/10 text-primary border-primary/30",
    dotClass: "bg-primary",
  },
  delayed: {
    label: "Delayed",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dotClass: "bg-rose-500 animate-pulse",
  },
  planning: {
    label: "Planning",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dotClass: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dotClass: "bg-emerald-500",
  },
  on_hold: {
    label: "On Hold",
    badgeClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
  },
};

export function ProjectStatusWidget({ className }: ProjectStatusWidgetProps) {
  // Top 3 active or delayed projects prioritizing delayed first
  const highlightedProjects = React.useMemo(() => {
    return [...mockProjects]
      .filter((p) => p.status === "active" || p.status === "delayed")
      .sort((a, b) => {
        if (a.status === "delayed" && b.status !== "delayed") return -1;
        if (b.status === "delayed" && a.status !== "delayed") return 1;
        return b.progress - a.progress;
      })
      .slice(0, 3);
  }, []);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="font-display text-lg tracking-tight">Project Health</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {mockProjects.length} Total
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Status overview and top priority project deliverables
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Link to="/dashboard/projects">
            All Projects <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Status Count Badges Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-medium text-foreground">Active</span>
            </div>
            <span className="font-mono text-sm font-bold text-primary">
              {projectStatusSummary.active}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-medium text-foreground">Delayed</span>
            </div>
            <span className="font-mono text-sm font-bold text-rose-400">
              {projectStatusSummary.delayed}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-foreground">Planning</span>
            </div>
            <span className="font-mono text-sm font-bold text-amber-400">
              {projectStatusSummary.planning}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-foreground">Completed</span>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {projectStatusSummary.completed}
            </span>
          </div>
        </div>

        {/* Top 3 Projects */}
        <div className="space-y-3.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Critical Active Projects
          </div>

          {highlightedProjects.map((project) => {
            const statusInfo = statusConfig[project.status] || statusConfig.active;
            const completedMilestones = project.milestones.filter((m) => m.completed).length;
            const spentPercent = project.budget > 0
              ? Math.round((project.spent / project.budget) * 100)
              : 0;

            return (
              <div
                key={project.id}
                className="group relative rounded-xl border border-border/40 bg-card/40 p-4 transition-all duration-200 hover:border-border hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-2 py-0.5", statusInfo.badgeClass)}
                      >
                        <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", statusInfo.dotClass)} />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Client: <span className="text-foreground/90 font-medium">{project.clientName}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {project.progress}%
                    </span>
                    <div className="text-[10px] text-muted-foreground">
                      {completedMilestones}/{project.milestones.length} milestones
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        project.status === "delayed"
                          ? "bg-rose-500"
                          : project.progress >= 60
                            ? "bg-emerald-400"
                            : "bg-primary"
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta footer: Budget & End Date */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3 w-3 text-primary" />
                    <span>
                      ${(project.spent / 1000).toFixed(1)}k / ${(project.budget / 1000).toFixed(0)}k ({spentPercent}% spent)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>Due {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
