import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Cable,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { mockIntegrations } from "@/lib/mock-data";
import type { Integration } from "@/lib/types";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsNav";
import { IntegrationCard } from "@/components/dashboard/settings/IntegrationCards";

export const Route = createFileRoute("/dashboard/settings/integrations")({
  component: IntegrationsSettingsPage,
});

function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = React.useState<Integration[]>(mockIntegrations);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "connected" | "disconnected">("all");
  const [syncingId, setSyncingId] = React.useState<string | null>(null);

  // Connect dialog state
  const [connectingItem, setConnectingItem] = React.useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput] = React.useState("");
  const [isSubmittingConnect, setIsSubmittingConnect] = React.useState(false);

  // Disconnect confirmation state
  const [disconnectingItem, setDisconnectingItem] = React.useState<Integration | null>(null);

  // Syncing simulation
  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, lastSync: new Date().toISOString() }
            : item
        )
      );
      setSyncingId(null);
    }, 1200);
  };

  // Toggle connection logic
  const handleToggleConnect = (id: string, nextState: boolean) => {
    const target = integrations.find((i) => i.id === id);
    if (!target) return;

    if (nextState) {
      // Open connection credentials dialog
      setConnectingItem(target);
      setApiKeyInput("");
    } else {
      // Open disconnect confirmation
      setDisconnectingItem(target);
    }
  };

  const handleConfirmConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingItem) return;

    setIsSubmittingConnect(true);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === connectingItem.id
            ? {
                ...item,
                isConnected: true,
                lastSync: new Date().toISOString(),
              }
            : item
        )
      );
      setIsSubmittingConnect(false);
      setConnectingItem(null);
    }, 800);
  };

  const handleConfirmDisconnect = () => {
    if (!disconnectingItem) return;

    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === disconnectingItem.id
          ? { ...item, isConnected: false, lastSync: undefined }
          : item
      )
    );
    setDisconnectingItem(null);
  };

  // Metrics summary
  const connectedCount = integrations.filter((i) => i.isConnected).length;
  const totalCount = integrations.length;
  const disconnectedCount = totalCount - connectedCount;

  // Filtered integrations
  const filteredIntegrations = React.useMemo(() => {
    return integrations.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        item.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "connected" && item.isConnected) ||
        (statusFilter === "disconnected" && !item.isConnected);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [integrations, searchQuery, categoryFilter, statusFilter]);

  // Group by Category
  const groupedCategories = React.useMemo(() => {
    const groups: Record<string, Integration[]> = {};
    filteredIntegrations.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredIntegrations]);

  const categoriesList = Array.from(new Set(integrations.map((i) => i.category)));

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Settings Navigation Header */}
      <SettingsHeader
        title="Integrations"
        description="Connect third-party developer tools, communication webhooks, payment gateways, and productivity suites."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <Activity className="h-3 w-3" />
              Webhook Gateway Active
            </span>
          </div>
        }
      />

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Connected Services</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-foreground">
              {connectedCount}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Available Connectors</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-foreground">
              {disconnectedCount}
            </span>
            <span className="text-xs text-muted-foreground">Ready to link</span>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Sync Health</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-foreground">
              99.98%
            </span>
            <span className="text-xs text-emerald-400 font-medium">Optimal</span>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Ecosystem</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-foreground">
              {totalCount}
            </span>
            <span className="text-xs text-muted-foreground">Connectors</span>
          </div>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/50 bg-card/40 p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-40 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesList.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | "connected" | "disconnected")}
          >
            <SelectTrigger className="h-9 w-36 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="connected">Connected Only</SelectItem>
              <SelectItem value="disconnected">Disconnected Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grouped by Category with Section Headers */}
      {Object.keys(groupedCategories).length === 0 ? (
        <Card className="border-border/60 bg-card/60 p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Cable className="h-8 w-8 text-muted-foreground/60" />
            <h3 className="font-display text-base font-semibold text-foreground">
              No integrations match your search
            </h3>
            <p className="text-xs text-muted-foreground">
              Clear your search query or reset filters to display all connector platforms.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="mt-3 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedCategories).map(([category, items]) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                    {category}
                  </h2>
                  <Badge variant="outline" className="border-border/60 text-[11px] font-mono">
                    {items.length} {items.length === 1 ? "tool" : "tools"}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {items.filter((i) => i.isConnected).length} of {items.length} connected
                </span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onToggleConnect={handleToggleConnect}
                    onSync={handleSync}
                    isSyncing={syncingId === integration.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Integration Modal */}
      <Dialog open={!!connectingItem} onOpenChange={(open) => !open && setConnectingItem(null)}>
        <DialogContent className="border-border bg-card max-w-md">
          <form onSubmit={handleConfirmConnect}>
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary">
                <Cable className="h-5 w-5" />
                <DialogTitle className="font-display text-lg">
                  Connect {connectingItem?.name}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Authorize ARTech to synchronize telemetry, events, and webhook payload streams.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-1">
                <p className="font-medium text-foreground">Integration Requirements:</p>
                <p className="text-muted-foreground">
                  • Read and write webhook access token
                  <br />
                  • Organization administration permissions
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="api-key" className="text-xs font-medium">
                  {connectingItem?.name} API Key / Secret Token
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sec_live_94827xxxxxxxxxxxxxxx"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Credentials are encrypted at rest with hardware HSM AES-256 keys.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConnectingItem(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingConnect}
                className="bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                {isSubmittingConnect ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Authorize & Connect"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={!!disconnectingItem} onOpenChange={(open) => !open && setDisconnectingItem(null)}>
        <DialogContent className="border-border bg-card max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle className="font-display text-base">
                Disconnect {disconnectingItem?.name}?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Severing this connection will pause automated event synchronization and stop webhook triggers immediately.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisconnectingItem(null)}
              className="text-xs"
            >
              Keep Connected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDisconnect}
              className="text-xs"
            >
              Disconnect Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
