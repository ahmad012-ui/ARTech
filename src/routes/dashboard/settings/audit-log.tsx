import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
  Lock,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpDown,
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
import { mockAuditLog, mockUsers } from "@/lib/mock-data";
import type { AuditLogEntry } from "@/lib/types";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsNav";
import { AuditLogTable } from "@/components/dashboard/settings/AuditLogTable";

export const Route = createFileRoute("/dashboard/settings/audit-log")({
  component: AuditLogPage,
});

// Extend with additional realistic entries including DELETE action to demonstrate full gamut
const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  ...mockAuditLog,
  {
    id: "a9",
    userId: "u1",
    userName: "Ahmed Khan",
    action: "DELETE",
    resource: "Lead",
    resourceId: "l7",
    details: "Deleted archived stale lead 'Tom Bradley' (Silverline Co)",
    ipAddress: "192.168.1.10",
    timestamp: "2026-10-16T12:45:00Z",
  },
  {
    id: "a10",
    userId: "u3",
    userName: "James Miller",
    action: "UPDATE",
    resource: "Contact",
    resourceId: "c3",
    details: "Updated phone number and SLA tier for David Kim (Orbit Labs)",
    ipAddress: "192.168.1.20",
    timestamp: "2026-10-16T13:10:00Z",
  },
];

function AuditLogPage() {
  const [logs] = React.useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [userFilter, setUserFilter] = React.useState("all");
  const [actionFilter, setActionFilter] = React.useState("all");
  const [dateRangeFilter, setDateRangeFilter] = React.useState("all");
  const [isExporting, setIsExporting] = React.useState(false);

  // Reverse chronological sorting (newest first)
  const sortedLogs = React.useMemo(() => {
    return [...logs].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [logs]);

  // Filtered entries
  const filteredLogs = React.useMemo(() => {
    // Current simulated date is 2026-10-16
    const baseTime = new Date("2026-10-16T23:59:59Z").getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    return sortedLogs.filter((entry) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        entry.userName.toLowerCase().includes(query) ||
        entry.resource.toLowerCase().includes(query) ||
        entry.details.toLowerCase().includes(query) ||
        entry.ipAddress.toLowerCase().includes(query) ||
        entry.action.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. User Filter
      if (userFilter !== "all" && entry.userId !== userFilter && entry.userName !== userFilter) {
        return false;
      }

      // 3. Action Filter
      if (actionFilter !== "all" && entry.action.toUpperCase() !== actionFilter.toUpperCase()) {
        return false;
      }

      // 4. Date Range Filter
      if (dateRangeFilter !== "all") {
        const entryTime = new Date(entry.timestamp).getTime();
        const diffDays = (baseTime - entryTime) / oneDay;

        if (dateRangeFilter === "today" && diffDays > 1) return false;
        if (dateRangeFilter === "7days" && diffDays > 7) return false;
        if (dateRangeFilter === "30days" && diffDays > 30) return false;
      }

      return true;
    });
  }, [sortedLogs, searchQuery, userFilter, actionFilter, dateRangeFilter]);

  // Unique users list for dropdown filter
  const userOptions = React.useMemo(() => {
    const map = new Map<string, string>();
    sortedLogs.forEach((item) => {
      map.set(item.userId, item.userName);
    });
    return Array.from(map.entries());
  }, [sortedLogs]);

  // Export CSV handler
  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ["Timestamp", "User ID", "User Name", "Action", "Resource", "Resource ID", "Details", "IP Address"];
      const rows = filteredLogs.map((log) => [
        `"${log.timestamp}"`,
        `"${log.userId}"`,
        `"${log.userName}"`,
        `"${log.action}"`,
        `"${log.resource}"`,
        `"${log.resourceId}"`,
        `"${log.details.replace(/"/g, '""')}"`,
        `"${log.ipAddress}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `artech-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Settings Navigation Header */}
      <SettingsHeader
        title="Audit Log"
        description="Comprehensive immutable forensic trail recording administrative activity, role mutations, logins, and API resource alterations."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="gap-2 border-border/70 text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary cursor-pointer"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Generating CSV...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                Export Audit Trail (.csv)
              </>
            )}
          </Button>
        }
      />

      {/* KPI Audit Activity Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Recorded Events</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-foreground">
              {logs.length}
            </span>
            <span className="text-xs text-muted-foreground">Total records</span>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Data Modifications</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-blue-400">
              {logs.filter((l) => l.action === "CREATE" || l.action === "UPDATE").length}
            </span>
            <span className="text-xs text-muted-foreground">Write ops</span>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Destructive Deletions</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-red-400">
              {logs.filter((l) => l.action === "DELETE").length}
            </span>
            <span className="text-xs text-muted-foreground">Purged records</span>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground">Security Sign-ins</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-emerald-400">
              {logs.filter((l) => l.action === "LOGIN").length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Verified 2FA</span>
          </div>
        </Card>
      </div>

      {/* Filter Controls Bar */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by keyword, resource, details, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Range Filter */}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today Only</SelectItem>
                    <SelectItem value="7days">Past 7 Days</SelectItem>
                    <SelectItem value="30days">Past 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Filter */}
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="h-9 w-40 text-xs">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {userOptions.map(([id, name]) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Type Filter: CREATE, UPDATE, DELETE, LOGIN, EXPORT */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="CREATE">CREATE (Green)</SelectItem>
                    <SelectItem value="UPDATE">UPDATE (Blue)</SelectItem>
                    <SelectItem value="DELETE">DELETE (Red)</SelectItem>
                    <SelectItem value="LOGIN">LOGIN (Gray)</SelectItem>
                    <SelectItem value="EXPORT">EXPORT (Purple)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters button if any filter is active */}
              {(searchQuery || userFilter !== "all" || actionFilter !== "all" || dateRangeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setUserFilter("all");
                    setActionFilter("all");
                    setDateRangeFilter("all");
                  }}
                  className="h-9 text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table Component (Reverse Chronological Order) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            <span>Sorted in <strong>reverse chronological order</strong> (newest events first)</span>
          </div>
          <span>
            Matching entries: <strong className="text-foreground">{filteredLogs.length}</strong> of {logs.length}
          </span>
        </div>

        <AuditLogTable entries={filteredLogs} itemsPerPage={8} />
      </div>
    </div>
  );
}
