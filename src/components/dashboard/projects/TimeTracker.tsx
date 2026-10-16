import { useState, useMemo } from "react";
import {
  Clock,
  DollarSign,
  CheckCircle2,
  Calendar,
  User as UserIcon,
  Plus,
  Filter,
  Sparkles,
  TrendingUp,
  Percent,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { TimeEntry, Project } from "@/lib/types";
import { mockTimeEntries, mockProjects, mockUsers } from "@/lib/mock-data";

interface TimeTrackerProps {
  entries?: TimeEntry[];
  projects?: Project[];
  className?: string;
}

export function TimeTracker({
  entries = mockTimeEntries,
  projects = mockProjects,
  className,
}: TimeTrackerProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(entries);
  const [filterProjectId, setFilterProjectId] = useState<string>("all");
  const [filterUserId, setFilterUserId] = useState<string>("all");
  const [isLogOpen, setIsLogOpen] = useState(false);

  // New time entry form state
  const [logProject, setLogProject] = useState<string>(projects[0]?.id || "p1");
  const [logUser, setLogUser] = useState<string>("u4"); // default Priya Sharma
  const [logHours, setLogHours] = useState<number>(4);
  const [logRate, setLogRate] = useState<number>(150);
  const [logDescription, setLogDescription] = useState<string>("");
  const [logBillable, setLogBillable] = useState<boolean>(true);
  const [logDate, setLogDate] = useState<string>("2026-10-16");

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      const matchProject =
        filterProjectId === "all" || entry.projectId === filterProjectId;
      const matchUser = filterUserId === "all" || entry.userId === filterUserId;
      return matchProject && matchUser;
    });
  }, [timeEntries, filterProjectId, filterUserId]);

  // Calculations
  const totalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
  const billableHours = filteredEntries
    .filter((e) => e.billable)
    .reduce((sum, e) => sum + e.hours, 0);
  const totalRevenue = filteredEntries
    .filter((e) => e.billable)
    .reduce((sum, e) => sum + e.hours * e.rate, 0);
  const billableRatio =
    totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0;
  const avgHourlyRate =
    billableHours > 0 ? Math.round(totalRevenue / billableHours) : 0;

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
      });
    } catch {
      return dateStr;
    }
  };

  const getProjectName = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    return proj ? proj.name : projId;
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logDescription || !logHours) return;

    const userObj = mockUsers.find((u) => u.id === logUser);

    const newEntry: TimeEntry = {
      id: `te-${Date.now()}`,
      projectId: logProject,
      userId: logUser,
      userName: userObj ? userObj.name : "Team Member",
      date: logDate || new Date().toISOString().split("T")[0],
      hours: Number(logHours),
      description: logDescription,
      billable: logBillable,
      rate: logBillable ? Number(logRate) : 0,
    };

    setTimeEntries([newEntry, ...timeEntries]);
    setLogDescription("");
    setLogHours(4);
    setIsLogOpen(false);
  };

  return (
    <Card className={cn("border-border/60 bg-card/60 backdrop-blur-md shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </span>
              <CardTitle className="font-display text-base font-semibold tracking-tight text-foreground">
                Time & Billable Hours
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Track engineer hours, billable rates, and consulting revenue
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by project */}
            <Select value={filterProjectId} onValueChange={setFilterProjectId}>
              <SelectTrigger className="h-8 text-xs w-[140px] bg-card/40 border-border/60">
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by user */}
            <Select value={filterUserId} onValueChange={setFilterUserId}>
              <SelectTrigger className="h-8 text-xs w-[130px] bg-card/40 border-border/60">
                <SelectValue placeholder="All members" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Members</SelectItem>
                {mockUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Log Time Dialog */}
            <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Log Time
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-background border-border">
                <form onSubmit={handleCreateEntry}>
                  <DialogHeader>
                    <DialogTitle className="font-display text-lg">Log Project Time</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Record engineering hours and assign billable rates.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="tProject" className="text-xs">Project</Label>
                      <Select value={logProject} onValueChange={setLogProject}>
                        <SelectTrigger id="tProject" className="h-9 text-xs">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="tUser" className="text-xs">Team Member</Label>
                      <Select value={logUser} onValueChange={setLogUser}>
                        <SelectTrigger id="tUser" className="h-9 text-xs">
                          <SelectValue placeholder="Select member" />
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

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="tHours" className="text-xs">Hours Logged</Label>
                        <Input
                          id="tHours"
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={logHours}
                          onChange={(e) => setLogHours(Number(e.target.value))}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="tRate" className="text-xs">Hourly Rate ($)</Label>
                        <Input
                          id="tRate"
                          type="number"
                          value={logRate}
                          onChange={(e) => setLogRate(Number(e.target.value))}
                          disabled={!logBillable}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="tDesc" className="text-xs">Task Description</Label>
                      <Input
                        id="tDesc"
                        placeholder="e.g. Implemented OAuth 2.0 PKCE flow"
                        value={logDescription}
                        onChange={(e) => setLogDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
                      <div className="space-y-0.5">
                        <Label htmlFor="tBillable" className="text-xs font-medium cursor-pointer">
                          Billable Hours
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Invoice this time entry to the client
                        </p>
                      </div>
                      <Switch
                        id="tBillable"
                        checked={logBillable}
                        onCheckedChange={setLogBillable}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                      Save Entry
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 4 Summary Calculation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground/60" />
              Total Hours
            </span>
            <p className="font-display text-xl font-bold text-foreground mt-0.5">
              {totalHours}h
            </p>
          </div>

          <div className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              Billable Hours
            </span>
            <p className="font-display text-xl font-bold text-emerald-400 mt-0.5">
              {billableHours}h
            </p>
          </div>

          <div className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-primary" />
              Billable Revenue
            </span>
            <p className="font-display text-xl font-bold text-foreground mt-0.5">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <div className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <Percent className="h-3 w-3 text-sky-400" />
              Billable Ratio
            </span>
            <p className="font-display text-xl font-bold text-sky-400 mt-0.5">
              {billableRatio}%
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50">
                <TableHead className="text-xs font-medium text-muted-foreground">Member</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Project</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Task Details</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Hours</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Revenue</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                    No time entries found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-border/40 hover:bg-muted/20 text-xs">
                    {/* User */}
                    <TableCell className="py-2.5 font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 text-[10px] bg-primary/10 text-primary">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getUserInitials(entry.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{entry.userName}</span>
                      </div>
                    </TableCell>

                    {/* Project */}
                    <TableCell className="py-2.5 text-muted-foreground">
                      <span className="truncate max-w-[150px] inline-block font-medium text-foreground">
                        {getProjectName(entry.projectId)}
                      </span>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="py-2.5 max-w-[220px] truncate text-muted-foreground">
                      {entry.description}
                    </TableCell>

                    {/* Hours */}
                    <TableCell className="py-2.5 text-center font-mono font-medium text-foreground">
                      {entry.hours.toFixed(1)}h
                    </TableCell>

                    {/* Billable Status */}
                    <TableCell className="py-2.5">
                      {entry.billable ? (
                        <Badge
                          variant="outline"
                          className="h-4 px-1.5 text-[10px] border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-mono"
                        >
                          Billable
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="h-4 px-1.5 text-[10px] border-zinc-500/20 bg-zinc-500/10 text-zinc-400 font-mono"
                        >
                          Non-billable
                        </Badge>
                      )}
                    </TableCell>

                    {/* Revenue */}
                    <TableCell className="py-2.5 text-right font-mono font-medium">
                      {entry.billable ? (
                        <span className="text-foreground">
                          {formatCurrency(entry.hours * entry.rate)}
                          <span className="text-[10px] text-muted-foreground ml-1">
                            (${entry.rate}/h)
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="py-2.5 text-right font-mono text-muted-foreground">
                      {formatDate(entry.date)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
