import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  TicketCheck,
  CircleDot,
  Hourglass,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { mockTickets } from "@/lib/mock-data";
import type { Ticket, Priority, TicketStatus, TicketCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TicketTable } from "@/components/dashboard/tickets/TicketTable";

export const Route = createFileRoute("/dashboard/tickets/")({
  component: TicketsPage,
});

function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New ticket form state
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("TechVentures");
  const [newCategory, setNewCategory] = useState<TicketCategory>("bug");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [newDescription, setNewDescription] = useState("");

  // Calculate summary stats dynamically from data
  const stats = useMemo(() => {
    const openCount = tickets.filter((t) => t.status === "open").length;
    const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
    const waitingCount = tickets.filter((t) => t.status === "waiting").length;
    const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
    const slaBreachCount = tickets.filter((t) => t.slaBreach).length;
    return {
      open: openCount,
      inProgress: inProgressCount,
      waiting: waitingCount,
      resolved: resolvedCount,
      slaBreach: slaBreachCount,
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status tab filter
      if (selectedStatusTab !== "all" && ticket.status !== selectedStatusTab) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "all" && ticket.category !== categoryFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ticket.title.toLowerCase().includes(query);
        const matchesClient = ticket.clientName.toLowerCase().includes(query);
        const matchesId = ticket.id.toLowerCase().includes(query);
        const matchesAssignee = ticket.assigneeName.toLowerCase().includes(query);
        const matchesTag = ticket.tags.some((tag) => tag.toLowerCase().includes(query));
        return matchesTitle || matchesClient || matchesId || matchesAssignee || matchesTag;
      }
      return true;
    });
  }, [tickets, selectedStatusTab, priorityFilter, categoryFilter, searchQuery]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTicketItem: Ticket = {
      id: `t${tickets.length + 1}`,
      title: newTitle,
      description: newDescription || "No description provided.",
      clientId: "cl1",
      clientName: newClient,
      category: newCategory,
      priority: newPriority,
      status: "open",
      assignedTo: "u4",
      assigneeName: "Priya Sharma",
      slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      slaBreach: false,
      tags: ["new-ticket", newCategory],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTickets([newTicketItem, ...tickets]);
    setIsCreateOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  const handleResetFilters = () => {
    setSelectedStatusTab("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedStatusTab !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all" ||
    searchQuery !== "";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
              Support & Helpdesk
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
              SLA Monitored
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time incident response queue, SLA monitoring, and resolution workflows.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Log a new issue or customer request into the SLA queue.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ticket-title">Title</Label>
                  <Input
                    id="ticket-title"
                    placeholder="Brief description of the issue"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Client</Label>
                    <Select value={newClient} onValueChange={setNewClient}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TechVentures">TechVentures</SelectItem>
                        <SelectItem value="SwiftLogic">SwiftLogic</SelectItem>
                        <SelectItem value="FreshFoods Inc">FreshFoods Inc</SelectItem>
                        <SelectItem value="DataPulse">DataPulse</SelectItem>
                        <SelectItem value="GreenWave Eco">GreenWave Eco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={newCategory}
                      onValueChange={(val) => setNewCategory(val as TicketCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="feature_request">Feature Request</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select
                    value={newPriority}
                    onValueChange={(val) => setNewPriority(val as Priority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical (Immediate SLA)</SelectItem>
                      <SelectItem value="high">High (4h SLA)</SelectItem>
                      <SelectItem value="medium">Medium (24h SLA)</SelectItem>
                      <SelectItem value="low">Low (72h SLA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ticket-desc">Detailed Description</Label>
                  <Textarea
                    id="ticket-desc"
                    rows={3}
                    placeholder="Provide repro steps, affected URLs, or error payloads..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Open Card */}
        <Card
          className="border-border/60 bg-card/60 backdrop-blur-sm cursor-pointer transition-all hover:border-blue-500/40 hover:bg-card/90"
          onClick={() => setSelectedStatusTab("open")}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Open
              </p>
              <h3 className="mt-1 text-2xl font-display font-bold text-foreground">
                {stats.open}
              </h3>
              <p className="text-[11px] text-blue-400 mt-0.5">Awaiting triage</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400">
              <CircleDot className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* In Progress Card */}
        <Card
          className="border-border/60 bg-card/60 backdrop-blur-sm cursor-pointer transition-all hover:border-purple-500/40 hover:bg-card/90"
          onClick={() => setSelectedStatusTab("in_progress")}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                In Progress
              </p>
              <h3 className="mt-1 text-2xl font-display font-bold text-foreground">
                {stats.inProgress}
              </h3>
              <p className="text-[11px] text-purple-400 mt-0.5">Active investigation</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-2.5 text-purple-400">
              <Hourglass className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Waiting Card */}
        <Card
          className="border-border/60 bg-card/60 backdrop-blur-sm cursor-pointer transition-all hover:border-yellow-500/40 hover:bg-card/90"
          onClick={() => setSelectedStatusTab("waiting")}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Waiting
              </p>
              <h3 className="mt-1 text-2xl font-display font-bold text-foreground">
                {stats.waiting}
              </h3>
              <p className="text-[11px] text-yellow-400 mt-0.5">Customer feedback</p>
            </div>
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-2.5 text-yellow-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Resolved Card */}
        <Card
          className="border-border/60 bg-card/60 backdrop-blur-sm cursor-pointer transition-all hover:border-emerald-500/40 hover:bg-card/90"
          onClick={() => setSelectedStatusTab("resolved")}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Resolved
              </p>
              <h3 className="mt-1 text-2xl font-display font-bold text-foreground">
                {stats.resolved}
              </h3>
              <p className="text-[11px] text-emerald-400 mt-0.5">Verified solutions</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* SLA Breaches Card */}
        <Card className="col-span-2 sm:col-span-1 border-destructive/40 bg-destructive/[0.07] backdrop-blur-sm transition-all hover:border-destructive/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-destructive">
                  SLA Breaches
                </p>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              </div>
              <h3 className="mt-1 text-2xl font-display font-bold text-destructive">
                {stats.slaBreach}
              </h3>
              <p className="text-[11px] text-destructive/80 mt-0.5">Requires escalation</p>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/15 p-2.5 text-destructive">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
          <Tabs
            value={selectedStatusTab}
            onValueChange={setSelectedStatusTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-muted/40 p-1 border border-border/40">
              <TabsTrigger value="all" className="text-xs">
                All ({tickets.length})
              </TabsTrigger>
              <TabsTrigger value="open" className="text-xs">
                Open ({stats.open})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs">
                In Progress ({stats.inProgress})
              </TabsTrigger>
              <TabsTrigger value="waiting" className="text-xs">
                Waiting ({stats.waiting})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs">
                Resolved ({stats.resolved})
              </TabsTrigger>
              <TabsTrigger value="closed" className="text-xs">
                Closed (0)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Quick SLA Breach filter badge if applicable */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Search and Secondary Dropdowns */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, title, client, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card/40 border-border/60"
            />
          </div>

          {/* Priority Dropdown */}
          <div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="bg-card/40 border-border/60">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Priority:</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Dropdown */}
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-card/40 border-border/60">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Category:</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <TicketTable tickets={filteredTickets} />
    </div>
  );
}
