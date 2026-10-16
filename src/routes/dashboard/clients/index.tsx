import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Shield,
  CreditCard,
  FileText,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { mockClients, mockSubscriptions, mockContracts } from "@/lib/mock-data";
import type { Client, SubscriptionPlan, SubscriptionStatus } from "@/lib/types";
import { ClientTable } from "@/components/dashboard/clients/ClientTable";
import { SubscriptionManager } from "@/components/dashboard/clients/SubscriptionManager";
import { ContractCard } from "@/components/dashboard/clients/ContractCard";

export const Route = createFileRoute("/dashboard/clients/")({
  component: ClientsPage,
});

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"directory" | "subscriptions" | "contracts">("directory");

  // Form state for Add Client dialog
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newIndustry, setNewIndustry] = useState("Technology");
  const [newPlan, setNewPlan] = useState<SubscriptionPlan>("professional");

  // Filter clients based on search query, plan, and status
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlan =
        selectedPlan === "all" || client.plan === selectedPlan;

      const matchesStatus =
        selectedStatus === "all" || client.subscriptionStatus === selectedStatus;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [clients, searchQuery, selectedPlan, selectedStatus]);

  // Summary Metrics calculations
  const totalClients = clients.length;
  const activeSubscriptions = clients.filter(
    (c) => c.subscriptionStatus === "active"
  ).length;
  const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0);
  const atRiskClients = clients.filter(
    (c) => c.healthScore < 50 || c.subscriptionStatus === "past_due"
  ).length;

  const handleOpenDetail = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;

    const newClientObj: Client = {
      id: `cl${Date.now()}`,
      name: newCompanyName,
      company: newCompanyName,
      email: newCompanyEmail || `contact@${newCompanyName.toLowerCase().replace(/\s+/g, "")}.com`,
      industry: newIndustry,
      plan: newPlan,
      subscriptionStatus: "active",
      mrr: newPlan === "starter" ? 499 : newPlan === "professional" ? 1800 : 4500,
      userLicenses: newPlan === "starter" ? 5 : newPlan === "professional" ? 15 : 30,
      healthScore: 88,
      contactId: "c1",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setClients([newClientObj, ...clients]);
    setNewCompanyName("");
    setNewCompanyEmail("");
    setIsAddClientOpen(false);
  };

  // Find subscription and contract for selected client
  const clientSubscription = selectedClient
    ? mockSubscriptions.find((s) => s.clientId === selectedClient.id)
    : undefined;

  const clientContract = selectedClient
    ? mockContracts.find((c) => c.clientId === selectedClient.id)
    : undefined;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Client Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage enterprise accounts, active subscriptions, health scores, and SLA contracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-background border-border">
              <form onSubmit={handleCreateClient}>
                <DialogHeader>
                  <DialogTitle className="font-display text-lg">Add New Client Account</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Register a new client organisation and configure their subscription plan.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName" className="text-xs">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="e.g. Apex Global Technologies"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="companyEmail" className="text-xs">Billing Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="e.g. billing@apexglobal.tech"
                      value={newCompanyEmail}
                      onChange={(e) => setNewCompanyEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="industry" className="text-xs">Industry</Label>
                      <Input
                        id="industry"
                        placeholder="e.g. FinTech"
                        value={newIndustry}
                        onChange={(e) => setNewIndustry(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="plan" className="text-xs">Initial Plan</Label>
                      <Select
                        value={newPlan}
                        onValueChange={(val: SubscriptionPlan) => setNewPlan(val)}
                      >
                        <SelectTrigger id="plan" className="h-9 text-xs">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="starter">Starter ($499/mo)</SelectItem>
                          <SelectItem value="professional">Professional ($1,800/mo)</SelectItem>
                          <SelectItem value="enterprise">Enterprise ($4,500/mo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddClientOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                    Create Client
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clients */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Clients
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {totalClients}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">+2 this quarter</span>
              <span>across 4 sectors</span>
            </p>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active Subscriptions
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {activeSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-sky-400 font-medium">1 in trial</span>
              <span>•</span>
              <span className="text-rose-400 font-medium">1 past due</span>
            </p>
          </CardContent>
        </Card>

        {/* Total MRR */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total MRR
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              ${totalMRR.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">+12.4%</span>
              <span>from last month ($181.2k ARR)</span>
            </p>
          </CardContent>
        </Card>

        {/* At-Risk Clients */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              At-Risk Clients
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl md:text-3xl font-bold tracking-tight text-rose-400">
              {atRiskClients}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
              <span className="text-rose-400 font-medium">GreenWave Eco</span>
              <span>(Health 45%, Past Due)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "directory" | "subscriptions" | "contracts")}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <TabsList className="bg-muted/40 p-1">
            <TabsTrigger value="directory" className="text-xs flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Clients Directory ({filteredClients.length})
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="text-xs flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Subscriptions ({mockSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-xs flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Contracts & SLAs ({mockContracts.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Clients Directory */}
        <TabsContent value="directory" className="space-y-4 mt-0">
          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Search by company name, email, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-card/40 border-border/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Plan Filter */}
              <div className="w-[140px]">
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="h-9 text-xs bg-card/40 border-border/60">
                    <SelectValue placeholder="All Plans" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="w-[140px]">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-9 text-xs bg-card/40 border-border/60">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || selectedPlan !== "all" || selectedStatus !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedPlan("all");
                    setSelectedStatus("all");
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Client Table Component */}
          <ClientTable
            clients={filteredClients}
            onSelectClient={handleOpenDetail}
            onViewSubscription={(c) => {
              setSelectedClient(c);
              setActiveTab("subscriptions");
            }}
            onViewContract={(c) => {
              setSelectedClient(c);
              setActiveTab("contracts");
            }}
          />
        </TabsContent>

        {/* TAB 2: Subscriptions Overview */}
        <TabsContent value="subscriptions" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSubscriptions.map((sub) => {
              const matchedClient = clients.find((c) => c.id === sub.clientId);
              return (
                <SubscriptionManager
                  key={sub.id}
                  subscription={sub}
                  client={matchedClient}
                />
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 3: Contracts & SLAs */}
        <TabsContent value="contracts" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockContracts.map((contract) => {
              const matchedClient = clients.find((c) => c.id === contract.clientId);
              return (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  clientName={matchedClient?.company}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Client Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-xl bg-background border-border overflow-y-auto">
          {selectedClient && (
            <div className="space-y-6 py-4">
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
                    {selectedClient.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <SheetTitle className="font-display text-xl">
                      {selectedClient.company}
                    </SheetTitle>
                    <SheetDescription className="text-xs">
                      {selectedClient.industry} • Account created {selectedClient.createdAt}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Account Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/40 bg-card/50 p-3 text-center">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">MRR</p>
                  <p className="font-display text-base font-bold text-foreground">
                    ${selectedClient.mrr.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Licenses</p>
                  <p className="font-display text-base font-bold text-foreground">
                    {selectedClient.userLicenses} Users
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Health</p>
                  <p
                    className={`font-display text-base font-bold ${
                      selectedClient.healthScore >= 80
                        ? "text-emerald-400"
                        : selectedClient.healthScore >= 50
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {selectedClient.healthScore}%
                  </p>
                </div>
              </div>

              {/* Subscription details */}
              <div className="space-y-2">
                <h3 className="font-display text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Subscription Details
                </h3>
                {clientSubscription ? (
                  <SubscriptionManager
                    subscription={clientSubscription}
                    client={selectedClient}
                  />
                ) : (
                  <div className="rounded-lg border border-border/40 p-4 text-center text-xs text-muted-foreground">
                    No active subscription recorded for this client.
                  </div>
                )}
              </div>

              {/* Contract details */}
              <div className="space-y-2">
                <h3 className="font-display text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Service Agreement & SLA
                </h3>
                {clientContract ? (
                  <ContractCard
                    contract={clientContract}
                    clientName={selectedClient.company}
                  />
                ) : (
                  <div className="rounded-lg border border-border/40 p-4 text-center text-xs text-muted-foreground">
                    Standard terms apply. No custom SLA contract uploaded.
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
