import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  DollarSign,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  Flag,
  Timer,
  ArrowUpRight,
  ChevronRight,
  Building2,
  Sparkles,
  PieChart,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/lib/types";
import { mockProjects, mockTimeEntries, mockUsers, mockClients } from "@/lib/mock-data";
import { ProjectTable } from "@/components/dashboard/projects/ProjectTable";
import { MilestoneTracker } from "@/components/dashboard/projects/MilestoneTracker";
import { TimeTracker } from "@/components/dashboard/projects/TimeTracker";

export const Route = createFileRoute("/dashboard/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table" | "milestones" | "time">("grid");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState("");
  const [newClientName, setNewClientName] = useState(mockClients[0]?.company || "");
  const [newBudget, setNewBudget] = useState(50000);
  const [newDescription, setNewDescription] = useState("");
  const [newManager, setNewManager] = useState("u2");
  const [newStartDate, setNewStartDate] = useState("2026-10-16");
  const [newEndDate, setNewEndDate] = useState("2027-01-31");

  // Summary Metrics calculations
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter((p) => p.status === "active").length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const totalBillableHours = mockTimeEntries
    .filter((t) => t.billable)
    .reduce((sum, t) => sum + t.hours, 0);

  // Filter projects by status tab and search
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [projects, statusFilter, searchQuery]);

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
            <Clock className="h-3 w-3" />
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

  const handleOpenDetail = (project: Project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;

    const newProj: Project = {
      id: `p-${Date.now()}`,
      name: newProjectName,
      clientId: "cl1",
      clientName: newClientName,
      status: "planning",
      progress: 0,
      startDate: newStartDate,
      endDate: newEndDate,
      budget: Number(newBudget),
      spent: 0,
      manager: newManager,
      team: ["u4", "u6"],
      description: newDescription || "Software development project.",
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: "Architecture & Sprint 0",
          dueDate: newStartDate,
          completed: false,
        },
        {
          id: `m-${Date.now()}-2`,
          title: "MVP Release",
          dueDate: newEndDate,
          completed: false,
        },
      ],
    };

    setProjects([newProj, ...projects]);
    setNewProjectName("");
    setNewDescription("");
    setIsNewProjectOpen(false);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Project Tracking
          </h1>
          <p className="text-sm text-muted-foreground">
            Track active engineering deliverables, milestones, budget burn, and developer time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* New Project Dialog */}
          <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                <Plus className="mr-1.5 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-background border-border">
              <form onSubmit={handleCreateProject}>
                <DialogHeader>
                  <DialogTitle className="font-display text-lg">Create New Project</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Initialize a client or internal project with milestone goals and budget.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pName" className="text-xs">Project Name</Label>
                    <Input
                      id="pName"
                      placeholder="e.g. Mobile Banking SDK Integration"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="pClient" className="text-xs">Client</Label>
                      <Select value={newClientName} onValueChange={setNewClientName}>
                        <SelectTrigger id="pClient" className="h-9 text-xs">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {mockClients.map((c) => (
                            <SelectItem key={c.id} value={c.company}>
                              {c.company}
                            </SelectItem>
                          ))}
                          <SelectItem value="ARTech (Internal)">ARTech (Internal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="pBudget" className="text-xs">Budget ($)</Label>
                      <Input
                        id="pBudget"
                        type="number"
                        value={newBudget}
                        onChange={(e) => setNewBudget(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="pStart" className="text-xs">Start Date</Label>
                      <Input
                        id="pStart"
                        type="date"
                        value={newStartDate}
                        onChange={(e) => setNewStartDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="pEnd" className="text-xs">Target Delivery</Label>
                      <Input
                        id="pEnd"
                        type="date"
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pManager" className="text-xs">Project Manager</Label>
                    <Select value={newManager} onValueChange={setNewManager}>
                      <SelectTrigger id="pManager" className="h-9 text-xs">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {mockUsers.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name} ({u.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pDesc" className="text-xs">Description</Label>
                    <Input
                      id="pDesc"
                      placeholder="Summary of scope and deliverables..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNewProjectOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                    Create Project
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Projects
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {totalProjects}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">1 completed</span>
              <span>•</span>
              <span className="text-zinc-400 font-medium">1 in planning</span>
            </p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              In Progress
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {inProgressProjects}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
              <span className="text-sky-400 font-medium">FreshFoods</span>
              <span>&</span>
              <span className="text-sky-400 font-medium">TechVentures</span>
            </p>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Budget Utilization
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PieChart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {budgetUtilization}%
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full bg-primary transition-all rounded-full"
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Total Billable Hours */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Billable Hours
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {totalBillableHours} hrs
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">$4,680</span>
              <span>earned across engineering sprints</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main View Switcher & Filters */}
      <Tabs
        value={viewMode}
        onValueChange={(val) => setViewMode(val as "grid" | "table" | "milestones" | "time")}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/50 pb-3">
          {/* View Modes */}
          <TabsList className="bg-muted/40 p-1">
            <TabsTrigger value="grid" className="text-xs flex items-center gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards Grid ({filteredProjects.length})
            </TabsTrigger>
            <TabsTrigger value="table" className="text-xs flex items-center gap-1.5">
              <TableIcon className="h-3.5 w-3.5" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="milestones" className="text-xs flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="time" className="text-xs flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" />
              Time Tracking
            </TabsTrigger>
          </TabsList>

          {/* Status Filter Tabs (for Grid & Table views) */}
          {(viewMode === "grid" || viewMode === "table") && (
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border/60 bg-card/40 p-0.5 text-xs">
                {(["all", "active", "completed", "delayed", "planning"] as const).map((status) => {
                  const count =
                    status === "all"
                      ? projects.length
                      : projects.filter((p) => p.status === status).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cn(
                        "capitalize px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                        statusFilter === status
                          ? "bg-primary/20 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {status} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search bar for grid and table */}
        {(viewMode === "grid" || viewMode === "table") && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Search projects by name, client, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-card/40 border-border/60"
              />
            </div>
          </div>
        )}

        {/* VIEW 1: Project Cards Grid */}
        <TabsContent value="grid" className="space-y-4 mt-0">
          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground border border-border/40 rounded-xl bg-card/20">
              <FolderKanban className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
              <p>No projects match the selected status or search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const completedMilestones = project.milestones.filter((m) => m.completed).length;
                const totalMilestones = project.milestones.length;
                const spentPercentage =
                  project.budget > 0
                    ? Math.round((project.spent / project.budget) * 100)
                    : 0;

                return (
                  <Card
                    key={project.id}
                    onClick={() => handleOpenDetail(project)}
                    className="border-border/60 bg-card/60 backdrop-blur-md shadow-lg hover:border-border hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
                  >
                    <CardHeader className="pb-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <CardTitle className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3 text-muted-foreground/70" />
                            {project.clientName}
                          </CardDescription>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 pb-4">
                      {/* Progress Bar with Percentage */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-mono font-semibold text-foreground">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-1.5 bg-muted/60" />
                      </div>

                      {/* Budget vs Spent */}
                      <div className="space-y-1.5 rounded-lg border border-border/40 bg-muted/20 p-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground/60" />
                            Budget vs Spent
                          </span>
                          <span className="font-mono font-medium text-foreground">
                            {formatCurrency(project.spent)} / {project.budget > 0 ? formatCurrency(project.budget) : "Internal"}
                          </span>
                        </div>
                        {project.budget > 0 && (
                          <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all rounded-full",
                                spentPercentage > 85
                                  ? "bg-rose-500"
                                  : spentPercentage > 60
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              )}
                              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Milestones count and Date range */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                            Milestones
                          </span>
                          <p className="font-mono text-xs font-medium text-foreground">
                            {completedMilestones}/{totalMilestones} completed
                          </p>
                        </div>

                        <div className="space-y-0.5 text-right">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                            Timeline
                          </span>
                          <p className="font-mono text-xs text-muted-foreground">
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>

                    <Separator className="border-border/40" />

                    <CardFooter className="py-3 flex items-center justify-between">
                      {/* Team Member Avatars (Stacked) */}
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {project.team.map((userId) => {
                            const u = getUser(userId);
                            return (
                              <Avatar
                                key={userId}
                                className="h-6 w-6 border-2 border-background bg-primary/20 text-primary text-[10px] font-semibold"
                                title={u ? `${u.name} (${u.role})` : userId}
                              >
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {u ? getUserInitials(u.name) : "U"}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {project.team.length} members
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 text-muted-foreground group-hover:text-primary transition-colors"
                      >
                        Details
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* VIEW 2: Project Table */}
        <TabsContent value="table" className="mt-0">
          <ProjectTable
            projects={filteredProjects}
            onSelectProject={handleOpenDetail}
            onViewMilestones={(p) => {
              setSelectedProject(p);
              setViewMode("milestones");
            }}
            onLogTime={(p) => {
              setSelectedProject(p);
              setViewMode("time");
            }}
          />
        </TabsContent>

        {/* VIEW 3: Milestone Tracker */}
        <TabsContent value="milestones" className="mt-0">
          <MilestoneTracker
            projects={projects}
            selectedProjectId={selectedProject?.id}
          />
        </TabsContent>

        {/* VIEW 4: Time Tracker */}
        <TabsContent value="time" className="mt-0">
          <TimeTracker
            projects={projects}
            entries={mockTimeEntries}
          />
        </TabsContent>
      </Tabs>

      {/* Project Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-xl bg-background border-border overflow-y-auto">
          {selectedProject && (
            <div className="space-y-6 py-4">
              <SheetHeader>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(selectedProject.status)}
                    <span className="text-xs font-mono text-muted-foreground">
                      ID: {selectedProject.id}
                    </span>
                  </div>
                  <SheetTitle className="font-display text-xl pt-1">
                    {selectedProject.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    Client: <span className="font-medium text-foreground">{selectedProject.clientName}</span>
                  </SheetDescription>
                </div>
              </SheetHeader>

              {/* Progress and Budget Metrics */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/40 bg-card/50 p-3.5">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Progress</span>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {selectedProject.progress}%
                  </p>
                  <Progress value={selectedProject.progress} className="h-1.5 bg-muted/60" />
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Budget Spent</span>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {formatCurrency(selectedProject.spent)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {selectedProject.budget > 0 ? formatCurrency(selectedProject.budget) : "Internal"}
                  </p>
                </div>
              </div>

              {/* Project Scope */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Scope & Overview
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed rounded-lg border border-border/40 bg-muted/10 p-3">
                  {selectedProject.description}
                </p>
              </div>

              {/* Milestones list for this project */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Milestones ({selectedProject.milestones.filter(m => m.completed).length}/{selectedProject.milestones.length})
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary"
                    onClick={() => {
                      setIsDetailOpen(false);
                      setViewMode("milestones");
                    }}
                  >
                    Open Timeline
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {selectedProject.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {m.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={cn("font-medium", m.completed && "line-through text-muted-foreground")}>
                          {m.title}
                        </span>
                      </div>
                      <span className="font-mono text-muted-foreground text-[11px]">
                        {formatDate(m.dueDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Assigned Team
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProject.team.map((userId) => {
                    const u = getUser(userId);
                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/40 p-2 text-xs"
                      >
                        <Avatar className="h-7 w-7 text-xs bg-primary/20 text-primary">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {u ? getUserInitials(u.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{u?.name || userId}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{u?.role || "Developer"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
