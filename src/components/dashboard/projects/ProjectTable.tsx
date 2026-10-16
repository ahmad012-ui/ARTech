import { useState } from "react";
import {
  FolderKanban,
  MoreHorizontal,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  Calendar,
  DollarSign,
  Users,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";

interface ProjectTableProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onViewMilestones?: (project: Project) => void;
  onLogTime?: (project: Project) => void;
  className?: string;
}

export function ProjectTable({
  projects,
  onSelectProject,
  onViewMilestones,
  onLogTime,
  className,
}: ProjectTableProps) {
  const [sortField, setSortField] = useState<keyof Project>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Status badge styling: active=blue, completed=green, delayed=red, planning=gray, on_hold=yellow
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="border-sky-500/30 bg-sky-500/10 text-sky-400 capitalize text-xs font-medium flex items-center gap-1.5"
          >
            <Clock className="h-3 w-3" />
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 capitalize text-xs font-medium flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "delayed":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-400 capitalize text-xs font-medium flex items-center gap-1.5"
          >
            <AlertTriangle className="h-3 w-3" />
            Delayed
          </Badge>
        );
      case "planning":
        return (
          <Badge
            variant="outline"
            className="border-zinc-500/30 bg-zinc-500/10 text-zinc-400 capitalize text-xs font-medium flex items-center gap-1.5"
          >
            <Calendar className="h-3 w-3" />
            Planning
          </Badge>
        );
      case "on_hold":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400 capitalize text-xs font-medium flex items-center gap-1.5"
          >
            <PauseCircle className="h-3 w-3" />
            On Hold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUser = (userId: string) => {
    return mockUsers.find((u) => u.id === userId);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden shadow-sm",
        className
      )}
    >
      <div className="relative w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Project & Client</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">
                Status
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground min-w-[130px]"
                onClick={() => toggleSort("progress")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Progress</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground text-right"
                onClick={() => toggleSort("budget")}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Budget & Spent</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">
                Team
              </TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">
                Milestones
              </TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">
                Timeline
              </TableHead>
              <TableHead className="w-[50px] text-right font-medium text-xs text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedProjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FolderKanban className="h-7 w-7 text-muted-foreground/40" />
                    <p>No projects found matching criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedProjects.map((project) => {
                const completedMilestones = project.milestones.filter((m) => m.completed).length;
                const totalMilestones = project.milestones.length;
                const spentPercentage =
                  project.budget > 0
                    ? Math.round((project.spent / project.budget) * 100)
                    : 0;

                return (
                  <TableRow
                    key={project.id}
                    className="border-border/40 hover:bg-muted/20 cursor-pointer transition-colors group"
                    onClick={() => onSelectProject?.(project)}
                  >
                    {/* Project & Client */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span>{project.clientName}</span>
                        </p>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3">
                      {getStatusBadge(project.status)}
                    </TableCell>

                    {/* Progress */}
                    <TableCell className="py-3">
                      <div className="space-y-1.5 max-w-[120px]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-medium text-foreground">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-1.5 bg-muted/60" />
                      </div>
                    </TableCell>

                    {/* Budget & Spent */}
                    <TableCell className="py-3 text-right">
                      {project.budget > 0 ? (
                        <div className="space-y-0.5">
                          <p className="font-mono text-xs font-semibold text-foreground">
                            {formatCurrency(project.spent)}
                            <span className="text-[11px] font-normal text-muted-foreground">
                              {" "}
                              / {formatCurrency(project.budget)}
                            </span>
                          </p>
                          <p
                            className={cn(
                              "text-[10px] font-mono",
                              spentPercentage > 85
                                ? "text-rose-400 font-medium"
                                : spentPercentage > 60
                                ? "text-amber-400"
                                : "text-muted-foreground"
                            )}
                          >
                            {spentPercentage}% utilized
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">Internal</span>
                      )}
                    </TableCell>

                    {/* Team avatars */}
                    <TableCell className="py-3">
                      <div className="flex -space-x-2 overflow-hidden">
                        {project.team.map((userId) => {
                          const u = getUser(userId);
                          return (
                            <Avatar
                              key={userId}
                              className="h-7 w-7 border-2 border-background bg-primary/20 text-primary text-[10px] font-semibold"
                              title={u ? `${u.name} (${u.role})` : userId}
                            >
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {u ? getUserInitials(u.name) : "U"}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                      </div>
                    </TableCell>

                    {/* Milestones */}
                    <TableCell className="py-3">
                      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-mono font-medium text-foreground">
                          {completedMilestones}/{totalMilestones}
                        </span>
                        <span className="text-[11px] text-muted-foreground/70">done</span>
                      </div>
                    </TableCell>

                    {/* Timeline */}
                    <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                      <span>{formatDate(project.startDate)}</span>
                      <span className="text-muted-foreground/50 mx-1">→</span>
                      <span>{formatDate(project.endDate)}</span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      className="text-right py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44 bg-background border-border shadow-xl"
                        >
                          <DropdownMenuLabel className="text-xs font-semibold">
                            Project Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-xs cursor-pointer"
                            onClick={() => onSelectProject?.(project)}
                          >
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            View Overview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs cursor-pointer"
                            onClick={() => onViewMilestones?.(project)}
                          >
                            <FolderKanban className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            Milestones
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs cursor-pointer"
                            onClick={() => onLogTime?.(project)}
                          >
                            <Clock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            Log Hours
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
