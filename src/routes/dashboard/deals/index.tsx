import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { mockDeals, mockUsers, mockContacts } from "@/lib/mock-data";
import type { Deal, LeadStage } from "@/lib/types";
import {
  CRM_STAGES,
  STAGE_CONFIG,
  formatCurrency,
  formatDate,
  getUser,
  getUserInitials,
} from "@/lib/crm-utils";
import { DealPipeline } from "@/components/dashboard/deals/DealPipeline";
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
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  Calendar,
  Building2,
  User,
  X,
  Target,
  Sparkles,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/deals/")({
  component: DealsPage,
});

function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Dialogs
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // New Deal Form State
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    contactId: "c1",
    value: 50000,
    stage: "demo_scheduled" as LeadStage,
    probability: 50,
    expectedCloseDate: "2026-11-30",
    assignedTo: "u2",
    notes: "",
  });

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = deal.title.toLowerCase().includes(query);
        const matchesCompany = deal.company.toLowerCase().includes(query);
        const matchesNotes = deal.notes.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesNotes) {
          return false;
        }
      }

      if (selectedStage !== "all" && deal.stage !== selectedStage) {
        return false;
      }

      if (selectedUser !== "all" && deal.assignedTo !== selectedUser) {
        return false;
      }

      return true;
    });
  }, [deals, searchQuery, selectedStage, selectedUser]);

  // Summary stats
  const totalPipelineValue = useMemo(() => {
    return deals.reduce((acc, curr) => acc + curr.value, 0);
  }, [deals]);

  const averageDealSize = useMemo(() => {
    if (deals.length === 0) return 0;
    return Math.round(totalPipelineValue / deals.length);
  }, [deals, totalPipelineValue]);

  const weightedForecast = useMemo(() => {
    return deals.reduce((acc, curr) => acc + (curr.value * curr.probability) / 100, 0);
  }, [deals]);

  const activeDealsCount = useMemo(() => {
    return deals.filter((d) => d.stage !== "won" && d.stage !== "lost").length;
  }, [deals]);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;

    const newDeal: Deal = {
      id: `d${Date.now()}`,
      title: formData.title,
      company: formData.company,
      contactId: formData.contactId,
      value: Number(formData.value) || 0,
      stage: formData.stage,
      probability: Number(formData.probability) || 50,
      expectedCloseDate: formData.expectedCloseDate,
      assignedTo: formData.assignedTo,
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setDeals([newDeal, ...deals]);
    setIsAddDealOpen(false);
    setFormData({
      title: "",
      company: "",
      contactId: "c1",
      value: 50000,
      stage: "demo_scheduled",
      probability: 50,
      expectedCloseDate: "2026-11-30",
      assignedTo: "u2",
      notes: "",
    });
  };

  const handleMoveStage = (dealId: string, nextStage: LeadStage) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: nextStage,
              probability: nextStage === "won" ? 100 : nextStage === "lost" ? 0 : d.probability,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : d
      )
    );
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal((prev) =>
        prev
          ? {
              ...prev,
              stage: nextStage,
              probability: nextStage === "won" ? 100 : nextStage === "lost" ? 0 : prev.probability,
            }
          : null
      );
    }
  };

  const hasActiveFilters = searchQuery !== "" || selectedStage !== "all" || selectedUser !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStage("all");
    setSelectedUser("all");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Deals Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor deal velocity, projected closing revenues, and weighted sales forecasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddDealOpen(true)}
            size="sm"
            className="h-9 px-4 text-xs font-medium gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Deal</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Pipeline Value */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total Pipeline Value
            </span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold font-mono text-foreground">
              {formatCurrency(totalPipelineValue)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Across {deals.length} total tracked deals
          </p>
        </div>

        {/* Average Deal Size */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Average Deal Size</span>
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold font-mono text-foreground">
              {formatCurrency(averageDealSize)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Average contract value</p>
        </div>

        {/* Weighted Forecast */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Weighted Forecast</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold font-mono text-emerald-400">
              {formatCurrency(weightedForecast)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Probability-adjusted expected yield</p>
        </div>

        {/* Active Deals */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Active Deals</span>
            <Layers className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold font-mono text-foreground">
              {activeDealsCount}
            </span>
            <span className="text-xs text-muted-foreground">in progress</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {deals.filter((d) => d.stage === "won").length} won,{" "}
            {deals.filter((d) => d.stage === "lost").length} lost
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deals by title, company, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 bg-background/50 border-border/60 text-sm focus-visible:bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
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

          {/* User Filter */}
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="h-9 w-[150px] bg-background/50 border-border/60 text-xs">
              <SelectValue placeholder="All Owners" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {mockUsers.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

      {/* Deal Pipeline Visualization Component */}
      <DealPipeline
        deals={filteredDeals}
        onSelectDeal={setSelectedDeal}
        onMoveStage={handleMoveStage}
      />

      {/* Add Deal Dialog */}
      <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
        <DialogContent className="max-w-lg border-border/80 bg-background text-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Create New Deal</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a deal opportunity to track forecast and close targets.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDeal} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Deal Title *</label>
              <Input
                required
                placeholder="e.g. Acme Corp Enterprise Platform"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-8 text-xs bg-muted/30 border-border/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Primary Contact</label>
                <Select
                  value={formData.contactId}
                  onValueChange={(val) => setFormData({ ...formData, contactId: val })}
                >
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.company})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Deal Value ($) *</label>
                <Input
                  type="number"
                  required
                  placeholder="50000"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="h-8 text-xs bg-muted/30 border-border/60 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Probability (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) =>
                    setFormData({ ...formData, probability: Number(e.target.value) })
                  }
                  className="h-8 text-xs bg-muted/30 border-border/60 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Expected Close Date</label>
                <Input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedCloseDate: e.target.value })
                  }
                  className="h-8 text-xs bg-muted/30 border-border/60 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Assigned Rep</label>
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
                      {u.name} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Deal Notes</label>
              <textarea
                rows={2}
                placeholder="Scope, key decision-makers, or next milestone..."
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
                onClick={() => setIsAddDealOpen(false)}
                className="h-8 text-xs cursor-pointer border-border/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Deal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deal Detail Dialog */}
      {selectedDeal && (
        <Dialog open={!!selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)}>
          <DialogContent className="max-w-xl border-border/80 bg-background text-foreground shadow-2xl">
            <DialogHeader>
              <div className="flex items-start justify-between pr-6">
                <div>
                  <DialogTitle className="font-display text-xl font-bold">
                    {selectedDeal.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {selectedDeal.company}
                  </DialogDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium border px-2.5 py-0.5 ${
                    STAGE_CONFIG[selectedDeal.stage].badgeClass
                  }`}
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      STAGE_CONFIG[selectedDeal.stage].dotClass
                    }`}
                  />
                  {STAGE_CONFIG[selectedDeal.stage].label}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-3">
              {/* Financial & Forecast Metrics */}
              <div className="grid grid-cols-3 gap-3 rounded-lg border border-border/50 bg-muted/20 p-3.5">
                <div>
                  <p className="text-[11px] text-muted-foreground">Deal Value</p>
                  <p className="font-mono text-base font-bold text-foreground mt-0.5">
                    {formatCurrency(selectedDeal.value)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Win Probability</p>
                  <p className="font-mono text-base font-bold text-primary mt-0.5">
                    {selectedDeal.probability}%
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Weighted Forecast</p>
                  <p className="font-mono text-base font-bold text-emerald-400 mt-0.5">
                    {formatCurrency((selectedDeal.value * selectedDeal.probability) / 100)}
                  </p>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Forecast Confidence</span>
                  <span className="font-mono">{selectedDeal.probability}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${selectedDeal.probability}%` }}
                  />
                </div>
              </div>

              {/* Deal Timing & Contact Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border/50 bg-card/30 p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Deal Details
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>Target Close: {formatDate(selectedDeal.expectedCloseDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground">{selectedDeal.company}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-card/30 p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Assigned Owner
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border border-border/50">
                      <AvatarFallback className="text-[11px] font-medium bg-primary/20 text-primary">
                        {getUserInitials(selectedDeal.assignedTo)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {getUser(selectedDeal.assignedTo)?.name || "Unassigned"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {getUser(selectedDeal.assignedTo)?.department || "Sales Team"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage Changer */}
              <div className="rounded-lg border border-border/50 bg-card/30 p-3">
                <p className="text-[11px] text-muted-foreground mb-1.5">Change Pipeline Stage</p>
                <Select
                  value={selectedDeal.stage}
                  onValueChange={(val) => handleMoveStage(selectedDeal.id, val as LeadStage)}
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

              {/* Notes */}
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">Deal Notes</p>
                <div className="rounded-md border border-border/50 bg-muted/20 p-3 text-xs text-foreground/90 whitespace-pre-line">
                  {selectedDeal.notes || "No notes available for this deal."}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDeal(null)}
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
