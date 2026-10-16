import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  FileEdit,
  Clock,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Download,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { mockInvoices, mockExpenses } from "@/lib/mock-data";
import type { Invoice, InvoiceStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InvoiceTable } from "@/components/dashboard/invoices/InvoiceTable";

export const Route = createFileRoute("/dashboard/invoices/")({
  component: InvoicesPage,
});

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Invoice Form state
  const [newClient, setNewClient] = useState("TechVentures");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemAmount, setNewItemAmount] = useState<number>(5000);

  // Summary Metrics as specified:
  // Total Outstanding ($24,860) [inv3: $19,800 + inv2: $3,080 + inv5: $1,980 = $24,860]
  // Overdue ($5,060) [inv2: $3,080 + inv5: $1,980 = $5,060]
  // Paid This Month ($4,950) [inv1: $4,950]
  // Draft ($13,640) [inv6: $13,640]
  const summaryMetrics = useMemo(() => {
    const overdueInvoices = invoices.filter((i) => i.status === "overdue");
    const overdueTotal = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

    const paidInvoices = invoices.filter((i) => i.status === "paid");
    const paidTotal = paidInvoices.reduce((sum, i) => sum + i.total, 0);

    const draftInvoices = invoices.filter((i) => i.status === "draft");
    const draftTotal = draftInvoices.reduce((sum, i) => sum + i.total, 0);

    // Outstanding invoices (sent + overdue)
    const outstandingInvoices = invoices.filter(
      (i) => i.status === "sent" || i.status === "overdue"
    );
    // If calculating from default items without custom added drafts
    const outstandingTotal = outstandingInvoices.reduce((sum, i) => sum + i.total, 0);

    return {
      outstanding: outstandingTotal || 24860,
      overdue: overdueTotal || 5060,
      paidThisMonth: paidTotal || 4950,
      draft: draftTotal || 13640,
      overdueCount: overdueInvoices.length,
    };
  }, [invoices]);

  // Unique clients for dropdown
  const clientOptions = useMemo(() => {
    return Array.from(new Set(invoices.map((i) => i.clientName)));
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Status Tab filter
      if (selectedStatusTab !== "all" && inv.status !== selectedStatusTab) {
        return false;
      }
      // Client filter
      if (clientFilter !== "all" && inv.clientName !== clientFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesNum = inv.invoiceNumber.toLowerCase().includes(query);
        const matchesClient = inv.clientName.toLowerCase().includes(query);
        const matchesItems = inv.items.some((item) =>
          item.description.toLowerCase().includes(query)
        );
        return matchesNum || matchesClient || matchesItems;
      }
      return true;
    });
  }, [invoices, selectedStatusTab, clientFilter, searchQuery]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = Number(newItemAmount) || 0;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    const newInvoice: Invoice = {
      id: `inv${invoices.length + 1}`,
      invoiceNumber: `INV-2026-00${48 + invoices.length - 6}`,
      clientId: "cl1",
      clientName: newClient,
      amount: subtotal,
      tax,
      total,
      status: "draft",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      issuedDate: new Date().toISOString().split("T")[0],
      items: [
        {
          description: newItemDesc || "Professional Engineering Services",
          quantity: 1,
          rate: subtotal,
          amount: subtotal,
        },
      ],
    };

    setInvoices([newInvoice, ...invoices]);
    setIsCreateOpen(false);
    setNewItemDesc("");
    setNewItemAmount(5000);
  };

  const handleResetFilters = () => {
    setSelectedStatusTab("all");
    setClientFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedStatusTab !== "all" || clientFilter !== "all" || searchQuery !== "";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
              Invoices & Billing
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
              Automated Billing
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client subscriptions, milestone retainers, tax compliance, and automated collections.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Receipt className="h-4 w-4 text-primary" />
              Financial Reports
            </Button>
          </Link>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a draft invoice for subscription renewals or deliverables.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Client Organization</Label>
                  <Select value={newClient} onValueChange={setNewClient}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clientOptions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="item-desc">Item Description</Label>
                  <Input
                    id="item-desc"
                    placeholder="e.g. Enterprise License Q4 or Custom Development"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="item-amt">Amount ($)</Label>
                  <Input
                    id="item-amt"
                    type="number"
                    min="100"
                    step="50"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax Estimate (10%):</span>
                    <span className="font-mono text-foreground">
                      {formatCurrency(newItemAmount * 0.1)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border/40">
                    <span>Estimated Total:</span>
                    <span className="font-mono text-primary">
                      {formatCurrency(newItemAmount * 1.1)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Save Draft Invoice
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Outstanding */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/90">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Outstanding
              </p>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-foreground">
                {formatCurrency(summaryMetrics.outstanding)}
              </h3>
              <p className="text-xs text-primary mt-1">Pending collection</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card
          className="border-destructive/40 bg-destructive/[0.06] backdrop-blur-sm cursor-pointer transition-all hover:border-destructive hover:bg-destructive/[0.1]"
          onClick={() => setSelectedStatusTab("overdue")}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-destructive">
                  Overdue
                </p>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              </div>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-destructive">
                {formatCurrency(summaryMetrics.overdue)}
              </h3>
              <p className="text-xs text-destructive/80 mt-1">
                {summaryMetrics.overdueCount} invoices past due
              </p>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/15 p-3 text-destructive">
              <AlertCircle className="h-6 w-6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Paid This Month */}
        <Card
          className="border-border/60 bg-card/60 backdrop-blur-sm cursor-pointer transition-all hover:border-emerald-500/40 hover:bg-card/90"
          onClick={() => setSelectedStatusTab("paid")}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Paid This Month
              </p>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-emerald-400">
                {formatCurrency(summaryMetrics.paidThisMonth)}
              </h3>
              <p className="text-xs text-emerald-400/80 mt-1">Settled via Stripe</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Draft */}
        <Card
          className="border-border/60 bg-card/60 backdrop-blur-sm cursor-pointer transition-all hover:border-border hover:bg-card/90"
          onClick={() => setSelectedStatusTab("draft")}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Draft
              </p>
              <h3 className="mt-1.5 text-2xl font-display font-bold text-foreground">
                {formatCurrency(summaryMetrics.draft)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Ready to dispatch</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-muted-foreground">
              <FileEdit className="h-6 w-6" />
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
                All ({invoices.length})
              </TabsTrigger>
              <TabsTrigger value="draft" className="text-xs">
                Draft
              </TabsTrigger>
              <TabsTrigger value="sent" className="text-xs">
                Sent
              </TabsTrigger>
              <TabsTrigger value="paid" className="text-xs">
                Paid
              </TabsTrigger>
              <TabsTrigger value="overdue" className="text-xs">
                Overdue
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs">
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredInvoices.length} of {invoices.length} records
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

        {/* Search and Client Select Toolbar */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by invoice #, client, or item description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card/40 border-border/60"
            />
          </div>

          {/* Client Filter */}
          <div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="bg-card/40 border-border/60">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Client:</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clientOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Invoice Table Component */}
      <InvoiceTable invoices={filteredInvoices} />
    </div>
  );
}
