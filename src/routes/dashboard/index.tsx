import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserMinus,
  Users,
  Target,
  Wallet,
  Activity,
  AlertTriangle,
  Receipt,
  FileClock,
  CheckCircle,
  Download,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/widgets/KPICard";
import { RevenueChart } from "@/components/dashboard/widgets/RevenueChart";
import { PipelineChart } from "@/components/dashboard/widgets/PipelineChart";
import { ProjectStatusWidget } from "@/components/dashboard/widgets/ProjectStatusWidget";
import { AlertsWidget } from "@/components/dashboard/widgets/AlertsWidget";
import {
  mockKPIMetrics,
  mockTickets,
  mockInvoices,
  mockContracts,
  mockClients,
  mockRevenueData,
  pipelineSummary,
  projectStatusSummary,
  mockNotifications,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  component: ExecutiveDashboardPage,
});

function ExecutiveDashboardPage() {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Operational metrics for Quick Stats
  const openTickets = React.useMemo(
    () => mockTickets.filter((t) => t.status !== "resolved" && t.status !== "closed"),
    []
  );
  const criticalTicketsCount = openTickets.filter((t) => t.priority === "critical").length;

  const overdueInvoices = React.useMemo(
    () => mockInvoices.filter((i) => i.status === "overdue"),
    []
  );
  const overdueTotalAmount = overdueInvoices.reduce((acc, curr) => acc + curr.total, 0);

  const expiringContracts = React.useMemo(
    () => mockContracts.filter((c) => c.status === "expiring_soon"),
    []
  );
  const expiringValue = expiringContracts.reduce((acc, curr) => acc + curr.value, 0);

  const activeClientsCount = React.useMemo(
    () => mockClients.filter((c) => c.subscriptionStatus === "active").length,
    []
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ============================================================ */}
      {/* 1. Header Section */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Executive Overview
            </h1>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs gap-1.5 py-0.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live Metrics
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Holistic view of recurring revenue, enterprise deals, active projects, and operational KPIs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-1.5 rounded-lg border border-border/50 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground md:flex">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">FY26 Q4 (Oct 2026)</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9 gap-2 border-border/60 bg-card/40 text-xs hover:bg-muted/50"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            size="sm"
            className="h-9 gap-2 bg-primary text-primary-foreground text-xs shadow-md shadow-primary/20 hover:bg-primary/90"
            onClick={() => {
              window.print();
            }}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. Top KPI Cards Row (5 Cards) */}
      {/* ============================================================ */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* MRR */}
          <KPICard
            title="Monthly Recurring"
            value={mockKPIMetrics.mrr}
            change={mockKPIMetrics.mrrGrowth}
            icon={DollarSign}
            format="currency"
            delay={0.05}
          />

          {/* ARR */}
          <KPICard
            title="Annual Run Rate"
            value={mockKPIMetrics.arr}
            change={mockKPIMetrics.arrGrowth}
            icon={Activity}
            format="currency"
            delay={0.1}
          />

          {/* Churn Rate (Negative change is good) */}
          <KPICard
            title="Net Churn Rate"
            value={mockKPIMetrics.churnRate}
            change={mockKPIMetrics.churnChange}
            icon={UserMinus}
            format="percentage"
            inverseTrend={true}
            delay={0.15}
          />

          {/* CAC (Negative change is good) */}
          <KPICard
            title="Customer Acq Cost"
            value={mockKPIMetrics.cac}
            change={mockKPIMetrics.cacChange}
            icon={Target}
            format="currency"
            inverseTrend={true}
            delay={0.2}
          />

          {/* LTV */}
          <KPICard
            title="Customer Lifetime Value"
            value={mockKPIMetrics.ltv}
            change={mockKPIMetrics.ltvChange}
            icon={Wallet}
            format="currency"
            delay={0.25}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. Quick Stats Row */}
      {/* ============================================================ */}
      <section aria-label="Operational Quick Stats">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Open Tickets */}
          <Link to="/dashboard/tickets" className="block group">
            <Card className="border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-200 group-hover:border-border group-hover:bg-muted/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Open Tickets
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-display text-xl font-bold text-foreground">
                        {openTickets.length}
                      </span>
                      {criticalTicketsCount > 0 && (
                        <Badge variant="destructive" className="text-[10px] py-0 px-1.5 h-4">
                          {criticalTicketsCount} critical
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </CardContent>
            </Card>
          </Link>

          {/* Overdue Invoices */}
          <Link to="/dashboard/invoices" className="block group">
            <Card className="border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-200 group-hover:border-border group-hover:bg-muted/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Overdue Invoices
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-display text-xl font-bold text-rose-400">
                        {overdueInvoices.length}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        (${overdueTotalAmount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </CardContent>
            </Card>
          </Link>

          {/* Upcoming Contract Renewals */}
          <Link to="/dashboard/clients" className="block group">
            <Card className="border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-200 group-hover:border-border group-hover:bg-muted/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <FileClock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Expiring Contracts
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-display text-xl font-bold text-foreground">
                        {expiringContracts.length}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        (${expiringValue.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </CardContent>
            </Card>
          </Link>

          {/* System SLA & Health */}
          <div className="block">
            <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Platform Uptime
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-display text-xl font-bold text-emerald-400">
                        99.98%
                      </span>
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] py-0 px-1.5 h-4">
                        Healthy
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. Main Analytics & Operational Section */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (Primary Visualizations) */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Revenue Chart */}
          <RevenueChart data={mockRevenueData} />

          {/* Sales Pipeline Funnel & Stages */}
          <PipelineChart />
        </div>

        {/* Right Column (Status & Critical Feeds) */}
        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          {/* Project Status Widget */}
          <ProjectStatusWidget />

          {/* Recent Notifications / Alerts Widget */}
          <AlertsWidget maxItems={5} />
        </div>
      </section>
    </div>
  );
}
