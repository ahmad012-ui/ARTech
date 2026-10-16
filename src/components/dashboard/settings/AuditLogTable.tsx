import * as React from "react";
import {
  ShieldAlert,
  Clock,
  Globe,
  FileCode,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AuditLogEntry } from "@/lib/types";

interface AuditLogTableProps {
  entries: AuditLogEntry[];
  itemsPerPage?: number;
}

// User initials helper
function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Action badge styling per requirements:
// CREATE=green, UPDATE=blue, DELETE=red, LOGIN=gray, EXPORT=purple
export function getActionBadgeClass(action: string) {
  switch (action.toUpperCase()) {
    case "CREATE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "UPDATE":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "DELETE":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "LOGIN":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    case "EXPORT":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

// Format ISO date to high-precision readable time
export function formatAuditTime(timestampStr: string) {
  try {
    const d = new Date(timestampStr);
    const dateFormatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatted = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return { dateFormatted, timeFormatted };
  } catch {
    return { dateFormatted: timestampStr, timeFormatted: "" };
  }
}

export function AuditLogTable({ entries, itemsPerPage = 8 }: AuditLogTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [copiedIp, setCopiedIp] = React.useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = React.useState<AuditLogEntry | null>(null);

  // Reset page when entries array changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [entries.length]);

  const totalPages = Math.max(1, Math.ceil(entries.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = entries.slice(startIndex, startIndex + itemsPerPage);

  const handleCopyIp = (ip: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[180px] font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-4">
                  Timestamp
                </TableHead>
                <TableHead className="w-[200px] font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  User
                </TableHead>
                <TableHead className="w-[110px] font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </TableHead>
                <TableHead className="w-[130px] font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resource
                </TableHead>
                <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Details
                </TableHead>
                <TableHead className="w-[150px] font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-4 text-right">
                  IP Address
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {currentEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                      <ShieldAlert className="h-6 w-6 text-muted-foreground/60" />
                      <p className="font-medium text-foreground">No audit entries found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your filters or date range parameters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentEntries.map((entry) => {
                  const { dateFormatted, timeFormatted } = formatAuditTime(entry.timestamp);

                  return (
                    <TableRow
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="group cursor-pointer border-border/30 transition-colors hover:bg-muted/30"
                    >
                      {/* Timestamp */}
                      <TableCell className="pl-4 py-3 align-middle">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground">
                            {dateFormatted}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground/80">
                            {timeFormatted}
                          </span>
                        </div>
                      </TableCell>

                      {/* User */}
                      <TableCell className="py-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 border border-border/50">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-[11px]">
                              {getInitials(entry.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-foreground truncate">
                              {entry.userName}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {entry.userId}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="py-3 align-middle">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide",
                            getActionBadgeClass(entry.action)
                          )}
                        >
                          {entry.action.toUpperCase()}
                        </span>
                      </TableCell>

                      {/* Resource */}
                      <TableCell className="py-3 align-middle">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                            {entry.resource}
                          </span>
                          {entry.resourceId && (
                            <span className="text-[10px] text-muted-foreground font-mono hidden xl:inline">
                              #{entry.resourceId}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Details */}
                      <TableCell className="py-3 align-middle">
                        <p className="text-xs text-foreground/90 line-clamp-1 max-w-[420px]">
                          {entry.details}
                        </p>
                      </TableCell>

                      {/* IP Address */}
                      <TableCell className="pr-4 py-3 align-middle text-right">
                        <button
                          type="button"
                          onClick={(e) => handleCopyIp(entry.ipAddress, e)}
                          title="Click to copy IP"
                          className="group/ip inline-flex items-center gap-1.5 rounded border border-border/50 bg-background/60 px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground cursor-pointer"
                        >
                          <Globe className="h-3 w-3 text-muted-foreground/60" />
                          <span>{entry.ipAddress}</span>
                          {copiedIp === entry.ipAddress ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3 opacity-0 group-hover/ip:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination bar */}
        <div className="flex flex-col gap-3 border-t border-border/50 bg-muted/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{entries.length === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="font-medium text-foreground">
              {Math.min(startIndex + itemsPerPage, entries.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{entries.length}</span> audit logs
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-8 gap-1 text-xs border-border/60 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
            <span className="px-2 font-mono text-xs text-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 gap-1 text-xs border-border/60 disabled:opacity-40 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Raw JSON Inspector Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="max-w-xl border-border bg-card">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold",
                  selectedEntry ? getActionBadgeClass(selectedEntry.action) : ""
                )}
              >
                {selectedEntry?.action}
              </span>
              <DialogTitle className="font-display text-lg">
                Audit Record Details
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Immutable forensic log entry with event context and metadata.
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <span className="text-muted-foreground">Actor:</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedEntry.userName}</p>
                  <span className="font-mono text-[11px] text-muted-foreground">{selectedEntry.userId}</span>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <span className="text-muted-foreground">Origin IP:</span>
                  <p className="font-mono font-semibold text-foreground mt-0.5">{selectedEntry.ipAddress}</p>
                  <span className="text-[11px] text-muted-foreground">IPv4 Gateway</span>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <span className="text-muted-foreground">Resource Target:</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedEntry.resource}</p>
                  <span className="font-mono text-[11px] text-muted-foreground">ID: {selectedEntry.resourceId}</span>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <p className="font-mono text-foreground mt-0.5 text-[11px]">{selectedEntry.timestamp}</p>
                  <span className="text-[11px] text-muted-foreground">UTC Synchronized</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description:</label>
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-foreground font-sans">
                  {selectedEntry.details}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Raw Payload JSON:</label>
                <pre className="max-h-48 overflow-auto rounded-lg border border-border/50 bg-black/60 p-3 font-mono text-[11px] text-emerald-400">
                  {JSON.stringify(selectedEntry, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
