import { useState } from "react";
import {
  AlertTriangle,
  Bug,
  Sparkles,
  LifeBuoy,
  Receipt,
  Tag,
  Clock,
  Eye,
  CheckCircle2,
  Hourglass,
  CircleDot,
  XCircle,
} from "lucide-react";
import type { Ticket, Priority, TicketStatus, TicketCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SLABadge } from "./SLABadge";

interface TicketTableProps {
  tickets: Ticket[];
  className?: string;
}

// Priority Badge Component with urgent pulse on critical
export function PriorityBadge({ priority }: { priority: Priority }) {
  switch (priority) {
    case "critical":
      return (
        <span className="relative inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
          </span>
          Critical
        </span>
      );
    case "high":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/15 px-2.5 py-0.5 text-xs font-medium text-orange-400">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          High
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/15 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
          Medium
        </span>
      );
    case "low":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          Low
        </span>
      );
  }
}

// Status Badge Component
export function StatusBadge({ status }: { status: TicketStatus }) {
  switch (status) {
    case "open":
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/15 text-blue-400 gap-1 font-medium"
        >
          <CircleDot className="h-3 w-3" />
          Open
        </Badge>
      );
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className="border-purple-500/30 bg-purple-500/15 text-purple-400 gap-1 font-medium"
        >
          <Hourglass className="h-3 w-3 animate-spin text-purple-400 [animation-duration:3s]" />
          In Progress
        </Badge>
      );
    case "waiting":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/30 bg-yellow-500/15 text-yellow-400 gap-1 font-medium"
        >
          <Clock className="h-3 w-3" />
          Waiting
        </Badge>
      );
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400 gap-1 font-medium"
        >
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </Badge>
      );
    case "closed":
    default:
      return (
        <Badge
          variant="outline"
          className="border-border bg-muted/60 text-muted-foreground gap-1 font-medium"
        >
          <XCircle className="h-3 w-3" />
          Closed
        </Badge>
      );
  }
}

// Category Badge Component
export function CategoryBadge({ category }: { category: TicketCategory }) {
  const configs: Record<
    TicketCategory,
    { label: string; icon: typeof Bug; className: string }
  > = {
    bug: {
      label: "Bug",
      icon: Bug,
      className: "border-rose-500/30 bg-rose-500/15 text-rose-400",
    },
    feature_request: {
      label: "Feature Request",
      icon: Sparkles,
      className: "border-indigo-500/30 bg-indigo-500/15 text-indigo-400",
    },
    support: {
      label: "Support",
      icon: LifeBuoy,
      className: "border-sky-500/30 bg-sky-500/15 text-sky-400",
    },
    billing: {
      label: "Billing",
      icon: Receipt,
      className: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    },
    other: {
      label: "Other",
      icon: Tag,
      className: "border-border bg-muted/60 text-muted-foreground",
    },
  };

  const config = configs[category] || configs.other;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TicketTable({ tickets, className }: TicketTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <>
      <div className={cn("rounded-xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden", className)}>
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="w-[90px] font-mono text-xs uppercase tracking-wider">ID</TableHead>
              <TableHead className="min-w-[220px]">Title</TableHead>
              <TableHead className="min-w-[130px]">Client</TableHead>
              <TableHead className="w-[130px]">Category</TableHead>
              <TableHead className="w-[110px]">Priority</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="min-w-[140px]">Assignee</TableHead>
              <TableHead className="w-[140px]">SLA Deadline</TableHead>
              <TableHead className="w-[130px]">SLA Status</TableHead>
              <TableHead className="w-[110px]">Created</TableHead>
              <TableHead className="w-[50px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                  No tickets found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => {
                const isCritical = ticket.priority === "critical";
                const isBreached = ticket.slaBreach;

                return (
                  <TableRow
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "cursor-pointer border-border/40 transition-colors group",
                      isCritical
                        ? "border-l-4 border-l-destructive bg-destructive/[0.04] hover:bg-destructive/[0.08]"
                        : isBreached
                        ? "border-l-4 border-l-amber-500 bg-amber-500/[0.03] hover:bg-amber-500/[0.07]"
                        : "hover:bg-muted/40"
                    )}
                  >
                    {/* ID */}
                    <TableCell className="font-mono text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                      <div className="flex items-center gap-1.5">
                        {isBreached && (
                          <AlertTriangle
                            className="h-3.5 w-3.5 text-destructive shrink-0 animate-pulse"
                            title="SLA Breached"
                          />
                        )}
                        #{ticket.id.toUpperCase()}
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {ticket.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </span>
                      </div>
                    </TableCell>

                    {/* Client */}
                    <TableCell className="text-sm font-medium text-foreground/90">
                      {ticket.clientName}
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <CategoryBadge category={ticket.category} />
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>

                    {/* Assignee */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-semibold">
                            {getInitials(ticket.assigneeName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-foreground/90 truncate max-w-[100px]">
                          {ticket.assigneeName}
                        </span>
                      </div>
                    </TableCell>

                    {/* SLA Deadline */}
                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {formatDateTime(ticket.slaDeadline)}
                    </TableCell>

                    {/* SLA Status */}
                    <TableCell>
                      <SLABadge deadline={ticket.slaDeadline} breach={ticket.slaBreach} />
                    </TableCell>

                    {/* Created */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(ticket.createdAt)}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        {selectedTicket && (
          <DialogContent className="max-w-2xl border-border bg-card">
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                <span>TICKET #{selectedTicket.id.toUpperCase()}</span>
                <span>•</span>
                <span>Created {formatDateTime(selectedTicket.createdAt)}</span>
              </div>
              <DialogTitle className="text-xl font-display font-semibold text-foreground">
                {selectedTicket.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Client: <strong className="text-foreground">{selectedTicket.clientName}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedTicket.status} />
                <PriorityBadge priority={selectedTicket.priority} />
                <CategoryBadge category={selectedTicket.category} />
                <SLABadge deadline={selectedTicket.slaDeadline} breach={selectedTicket.slaBreach} />
              </div>

              {/* Description */}
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Description
                </h4>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Meta details grid */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border/40 bg-muted/10 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">Assignee</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                        {getInitials(selectedTicket.assigneeName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{selectedTicket.assigneeName}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block mb-1">SLA Target</span>
                  <span className="font-mono text-foreground">
                    {formatDateTime(selectedTicket.slaDeadline)}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTicket.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block mb-1">Last Updated</span>
                  <span className="font-mono text-foreground">
                    {formatDateTime(selectedTicket.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Footer action */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
                  Close
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Update Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
