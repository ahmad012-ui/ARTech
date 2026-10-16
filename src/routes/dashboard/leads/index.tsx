import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { mockLeads, mockUsers } from "@/lib/mock-data";
import type { Lead, LeadStage, LeadSource } from "@/lib/types";
import {
  CRM_STAGES,
  STAGE_CONFIG,
  formatCurrency,
  formatDate,
  getUser,
  getUserInitials,
  getScoreBadgeClass,
  SOURCE_LABELS,
} from "@/lib/crm-utils";
import { LeadKanban } from "@/components/dashboard/leads/LeadKanban";
import { LeadTable } from "@/components/dashboard/leads/LeadTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Kanban,
  Table as TableIcon,
  X,
  Target,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Calendar,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/leads/")({
  component: LeadsPage,
});

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Dialog states
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New Lead form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    value: 25000,
    stage: "new" as LeadStage,
    source: "website" as LeadSource,
    assignedTo: "u2",
    tags: "enterprise, priority",
    notes: "",
  });

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesCompany = lead.company.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesTags = lead.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCompany && !matchesEmail && !matchesTags) {
          return false;
        }
      }

      // Stage filter
      if (selectedStage !== "all" && lead.stage !== selectedStage) {
        return false;
      }

      // Source filter
      if (selectedSource !== "all" && lead.source !== selectedSource) {
        return false;
      }

      // User filter
      if (selectedUser !== "all" && lead.assignedTo !== selectedUser) {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, selectedStage, selectedSource, selectedUser]);

  // Aggregate metrics
  const totalValue = useMemo(() => {
    return leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [leads]);

  const avgScore = useMemo(() => {
    if (leads.length === 0) return 0;
    return Math.round(leads.reduce((acc, curr) => acc + curr.score, 0) / leads.length);
  }, [leads]);

  const wonLeadsValue = useMemo(() => {
    return leads
      .filter((l) => l.stage === "won")
      .reduce((acc, curr) => acc + curr.value, 0);
  }, [leads]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email) return;

    const newLead: Lead = {
      id: `l${Date.now()}`,
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      stage: formData.stage,
      source: formData.source,
      value: Number(formData.value) || 0,
      score: 65,
      assignedTo: formData.assignedTo,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setLeads([newLead, ...leads]);
    setIsAddLeadOpen(false);
    // Reset form
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      value: 25000,
      stage: "new",
      source: "website",
      assignedTo: "u2",
      tags: "enterprise",
      notes: "",
    });
  };

  const handleStageChange = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage, updatedAt: new Date().toISOString().split("T")[0] } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedStage !== "all" ||
    selectedSource !== "all" ||
    selectedUser !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStage("all");
    setSelectedSource("all");
    setSelectedUser("all");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Lead Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track, qualify, and convert potential opportunities across pipeline stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-1">
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-7 px-3 text-xs gap-1.5 cursor-pointer"
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-7 px-3 text-xs gap-1.5 cursor-pointer"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table</span>
            </Button>
          </div>

          {/* Add Lead Button */}
          <Button
            onClick={() => setIsAddLeadOpen(true)}
            size="sm"
            className="h-9 px-4 text-xs font-medium gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Total Leads</span>
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-foreground">
              {leads.length}
            </span>
            <span className="text-xs text-muted-foreground">
              ({filteredLeads.length} showing)
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Pipeline Value</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold font-mono text-foreground">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Lead Score</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold font-mono text-foreground">
              {avgScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Won Revenue</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold font-mono text-emerald-400">
              {formatCurrency(wonLeadsValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, email, or #tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 bg-background/50 border-border/60 text-sm focus-visible:bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="h-9 w-[150px] bg-background/50 border-border/60 text-xs">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {CRM_STAGES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="h-9 w-[150px] bg-background/50 border-border/60 text-xs">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* User Filter */}
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="h-9 w-[150px] bg-background/50 border-border/60 text-xs">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {mockUsers.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "kanban" ? (
        <LeadKanban
          leads={filteredLeads}
          onSelectLead={setSelectedLead}
          onStageChange={handleStageChange}
        />
      ) : (
        <LeadTable leads={filteredLeads} onSelectLead={setSelectedLead} />
      )}

      {/* Add Lead Dialog */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="max-w-lg border-border/80 bg-background text-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add New Lead</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new lead entry in your CRM pipeline. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLead} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Lead Full Name *</label>
                <Input
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Company Name *</label>
                <Input
                  required
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Email Address *</label>
                <Input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Phone Number</label>
                <Input
                  placeholder="+1-555-0199"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Estimated Value ($)</label>
                <Input
                  type="number"
                  placeholder="25000"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="h-8 text-xs bg-muted/30 border-border/60 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Pipeline Stage</label>
                <Select
                  value={formData.stage}
                  onValueChange={(val) => setFormData({ ...formData, stage: val as LeadStage })}
                >
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRM_STAGES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Lead Source</label>
                <Select
                  value={formData.source}
                  onValueChange={(val) => setFormData({ ...formData, source: val as LeadSource })}
                >
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Assigned User</label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(val) => setFormData({ ...formData, assignedTo: val })}
                >
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Tags (comma separated)</label>
              <Input
                placeholder="enterprise, ai, high-priority"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="h-8 text-xs bg-muted/30 border-border/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Notes / Context</label>
              <textarea
                rows={2}
                placeholder="Initial conversation notes or lead requirements..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddLeadOpen(false)}
                className="h-8 text-xs cursor-pointer border-border/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Dialog */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
          <DialogContent className="max-w-xl border-border/80 bg-background text-foreground shadow-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <div>
                  <DialogTitle className="font-display text-xl font-bold">
                    {selectedLead.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {selectedLead.company}
                  </DialogDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium border px-2.5 py-0.5 ${
                    STAGE_CONFIG[selectedLead.stage].badgeClass
                  }`}
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      STAGE_CONFIG[selectedLead.stage].dotClass
                    }`}
                  />
                  {STAGE_CONFIG[selectedLead.stage].label}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-3">
              {/* Key Lead Stats Bar */}
              <div className="grid grid-cols-3 gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">Deal Value</p>
                  <p className="font-mono text-base font-bold text-foreground">
                    {formatCurrency(selectedLead.value)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Lead Score</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold border ${getScoreBadgeClass(
                        selectedLead.score
                      )}`}
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {selectedLead.score}/100
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Source</p>
                  <p className="text-xs font-medium text-foreground mt-0.5 capitalize">
                    {SOURCE_LABELS[selectedLead.source] || selectedLead.source}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-lg border border-border/50 bg-card/30 p-3.5 space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground font-mono">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground">
                      {selectedLead.phone || "No phone provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground">{selectedLead.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>Created: {formatDate(selectedLead.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Assignment & Stage Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/50 bg-card/30 p-3">
                  <p className="text-[11px] text-muted-foreground">Assigned Representative</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-7 w-7 border border-border/50">
                      <AvatarFallback className="text-[11px] font-medium bg-primary/20 text-primary">
                        {getUserInitials(selectedLead.assignedTo)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {getUser(selectedLead.assignedTo)?.name || "Unassigned"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {getUser(selectedLead.assignedTo)?.department || "Sales"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-card/30 p-3">
                  <p className="text-[11px] text-muted-foreground mb-1.5">Change Pipeline Stage</p>
                  <Select
                    value={selectedLead.stage}
                    onValueChange={(val) => handleStageChange(selectedLead.id, val as LeadStage)}
                  >
                    <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CRM_STAGES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              {selectedLead.tags && selectedLead.tags.length > 0 && (
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLead.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 text-muted-foreground"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">Notes & Discovery Context</p>
                <div className="rounded-md border border-border/50 bg-muted/20 p-3 text-xs text-foreground/90 whitespace-pre-line">
                  {selectedLead.notes || "No notes available for this lead."}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLead(null)}
                className="h-8 text-xs cursor-pointer border-border/60"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
