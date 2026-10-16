import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Plus,
  FolderKanban,
  AlertCircle,
  Check,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Project, Milestone } from "@/lib/types";
import { mockProjects } from "@/lib/mock-data";

interface MilestoneTrackerProps {
  projects?: Project[];
  selectedProjectId?: string;
  className?: string;
  onMilestoneToggle?: (projectId: string, milestoneId: string, completed: boolean) => void;
}

interface FlattenedMilestone extends Milestone {
  projectId: string;
  projectName: string;
  clientName: string;
}

export function MilestoneTracker({
  projects = mockProjects,
  selectedProjectId: initialProjectId,
  className,
  onMilestoneToggle,
}: MilestoneTrackerProps) {
  const [filterProjectId, setFilterProjectId] = useState<string>(
    initialProjectId || "all"
  );
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || "");

  // Flatten milestones across projects or selected project
  const allMilestones: FlattenedMilestone[] = projectList.flatMap((proj) =>
    proj.milestones.map((m) => ({
      ...m,
      projectId: proj.id,
      projectName: proj.name,
      clientName: proj.clientName,
    }))
  );

  const displayedMilestones =
    filterProjectId === "all"
      ? allMilestones
      : allMilestones.filter((m) => m.projectId === filterProjectId);

  const totalMilestones = displayedMilestones.length;
  const completedMilestones = displayedMilestones.filter((m) => m.completed).length;
  const completionPercent =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  const handleToggle = (projectId: string, milestoneId: string) => {
    setProjectList((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          milestones: proj.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            const updated = !m.completed;
            onMilestoneToggle?.(projectId, milestoneId, updated);
            return { ...m, completed: updated };
          }),
        };
      })
    );
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newProjectId) return;

    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      title: newTitle,
      dueDate: newDueDate || new Date().toISOString().split("T")[0],
      completed: false,
    };

    setProjectList((prev) =>
      prev.map((proj) => {
        if (proj.id !== newProjectId) return proj;
        return {
          ...proj,
          milestones: [...proj.milestones, newMilestone],
        };
      })
    );

    setNewTitle("");
    setNewDueDate("");
    setIsAddOpen(false);
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

  const getDueStatus = (dueDateStr: string, isCompleted: boolean) => {
    if (isCompleted) return { label: "Completed", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" };
    const now = new Date("2026-10-16").getTime();
    const due = new Date(dueDateStr).getTime();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: "text-rose-400 border-rose-500/20 bg-rose-500/10" };
    }
    if (diffDays <= 7) {
      return { label: `Due in ${diffDays}d`, color: "text-amber-400 border-amber-500/20 bg-amber-500/10" };
    }
    return { label: `Due ${formatDate(dueDateStr)}`, color: "text-muted-foreground border-border/40 bg-muted/20" };
  };

  return (
    <Card className={cn("border-border/60 bg-card/60 backdrop-blur-md shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FolderKanban className="h-4 w-4" />
              </span>
              <CardTitle className="font-display text-base font-semibold tracking-tight text-foreground">
                Milestone Roadmap
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Deliverables and sprint milestones across projects
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Project Filter Select */}
            <Select value={filterProjectId} onValueChange={setFilterProjectId}>
              <SelectTrigger className="h-8 text-xs w-[170px] bg-card/40 border-border/60">
                <SelectValue placeholder="Filter project" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Projects</SelectItem>
                {projectList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add Milestone Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 text-xs border-border/60">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-background border-border">
                <form onSubmit={handleAddMilestone}>
                  <DialogHeader>
                    <DialogTitle className="font-display text-lg">Add Project Milestone</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Define a key deliverable or target date for the engineering team.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="mProject" className="text-xs">Project</Label>
                      <Select value={newProjectId} onValueChange={setNewProjectId}>
                        <SelectTrigger id="mProject" className="h-9 text-xs">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {projectList.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.clientName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="mTitle" className="text-xs">Milestone Title</Label>
                      <Input
                        id="mTitle"
                        placeholder="e.g. Production Load Testing"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="mDueDate" className="text-xs">Target Due Date</Label>
                      <Input
                        id="mDueDate"
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                      Save Milestone
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Progress summary banner */}
        <div className="mt-3 rounded-lg border border-border/40 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <span>Overall Completion</span>
              <span className="font-mono text-muted-foreground">
                ({completedMilestones}/{totalMilestones})
              </span>
            </span>
            <span className="font-mono font-semibold text-foreground">
              {completionPercent}%
            </span>
          </div>
          <Progress value={completionPercent} className="h-2 bg-muted/60" />
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {displayedMilestones.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No milestones found for this selection.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-border/60">
            {displayedMilestones.map((milestone) => {
              const dueStatus = getDueStatus(milestone.dueDate, milestone.completed);
              return (
                <div key={milestone.id} className="relative group">
                  {/* Timeline dot */}
                  <button
                    onClick={() => handleToggle(milestone.projectId, milestone.id)}
                    className={cn(
                      "absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border transition-all cursor-pointer",
                      milestone.completed
                        ? "border-emerald-500 bg-emerald-500 text-black shadow-sm shadow-emerald-500/30"
                        : "border-border/80 bg-background hover:border-primary text-transparent hover:text-muted-foreground"
                    )}
                    title={milestone.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </button>

                  {/* Milestone Card */}
                  <div
                    onClick={() => handleToggle(milestone.projectId, milestone.id)}
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-all",
                      milestone.completed
                        ? "border-border/30 bg-muted/10 opacity-75 hover:opacity-100"
                        : "border-border/60 bg-card/40 hover:border-primary/40 hover:bg-muted/20"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "text-sm font-medium text-foreground transition-all",
                              milestone.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {milestone.title}
                          </p>
                          {milestone.completed && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            >
                              Done
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span>{milestone.projectName}</span>
                          <span>•</span>
                          <span className="text-muted-foreground/70">{milestone.clientName}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <Badge
                          variant="outline"
                          className={cn("text-[11px] font-mono h-5 px-2", dueStatus.color)}
                        >
                          <Calendar className="mr-1 h-3 w-3" />
                          {dueStatus.label}
                        </Badge>
                      </div>
                    </div>
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
