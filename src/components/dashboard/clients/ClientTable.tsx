import { useState } from "react";
import {
  Building2,
  MoreHorizontal,
  Eye,
  CreditCard,
  FileText,
  Mail,
  ShieldAlert,
  ArrowUpDown,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Client, SubscriptionPlan, SubscriptionStatus } from "@/lib/types";

interface ClientTableProps {
  clients: Client[];
  onSelectClient?: (client: Client) => void;
  onViewSubscription?: (client: Client) => void;
  onViewContract?: (client: Client) => void;
  className?: string;
}

export function ClientTable({
  clients,
  onSelectClient,
  onViewSubscription,
  onViewContract,
  className,
}: ClientTableProps) {
  const [sortField, setSortField] = useState<keyof Client>("company");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case "starter":
        return (
          <Badge
            variant="outline"
            className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 capitalize text-xs font-medium"
          >
            Starter
          </Badge>
        );
      case "professional":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-500/10 text-purple-400 capitalize text-xs font-medium"
          >
            Professional
          </Badge>
        );
      case "enterprise":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400 capitalize text-xs font-medium"
          >
            Enterprise
          </Badge>
        );
      case "custom":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 capitalize text-xs font-medium"
          >
            Custom
          </Badge>
        );
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 capitalize text-xs font-medium"
          >
            Active
          </Badge>
        );
      case "trial":
        return (
          <Badge
            variant="outline"
            className="border-sky-500/30 bg-sky-500/10 text-sky-400 capitalize text-xs font-medium"
          >
            Trial
          </Badge>
        );
      case "past_due":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-400 capitalize text-xs font-medium"
          >
            Past Due
          </Badge>
        );
      case "paused":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400 capitalize text-xs font-medium"
          >
            Paused
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-zinc-500/30 bg-zinc-500/10 text-zinc-400 capitalize text-xs font-medium"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Health score color coding: 80-100 green, 50-79 yellow, 0-49 red
  const getHealthScoreDetails = (score: number) => {
    if (score >= 80) {
      return {
        badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        barClass: "bg-emerald-500",
        label: "Healthy",
      };
    }
    if (score >= 50) {
      return {
        badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        barClass: "bg-amber-500",
        label: "Stable",
      };
    }
    return {
      badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-400",
      barClass: "bg-rose-500",
      label: "At Risk",
    };
  };

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden shadow-sm",
        className
      )}
    >
      <div className="relative w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toggleSort("company")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Company</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toggleSort("industry")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Industry</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">
                Plan
              </TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">
                Status
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground text-right"
                onClick={() => toggleSort("mrr")}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>MRR</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground text-center"
                onClick={() => toggleSort("userLicenses")}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Licenses</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground min-w-[150px]"
                onClick={() => toggleSort("healthScore")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Health Score</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toggleSort("createdAt")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Created</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="w-[60px] text-right font-medium text-xs text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-36 text-center text-sm text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="h-8 w-8 text-muted-foreground/40" />
                    <p>No clients found matching the selected filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedClients.map((client) => {
                const health = getHealthScoreDetails(client.healthScore);
                return (
                  <TableRow
                    key={client.id}
                    className="border-border/40 hover:bg-muted/20 cursor-pointer transition-colors group"
                    onClick={() => onSelectClient?.(client)}
                  >
                    {/* Company */}
                    <TableCell className="font-medium py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-lg border border-border/50 bg-primary/10 text-primary font-bold text-xs">
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                            {getCompanyInitials(client.company)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {client.company}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Industry */}
                    <TableCell className="text-xs text-muted-foreground py-3">
                      <span className="rounded-md border border-border/40 bg-muted/30 px-2 py-1">
                        {client.industry}
                      </span>
                    </TableCell>

                    {/* Plan */}
                    <TableCell className="py-3">
                      {getPlanBadge(client.plan)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3">
                      {getStatusBadge(client.subscriptionStatus)}
                    </TableCell>

                    {/* MRR */}
                    <TableCell className="text-right font-mono text-sm font-semibold text-foreground py-3">
                      {formatCurrency(client.mrr)}
                      <span className="text-[11px] font-normal text-muted-foreground">/mo</span>
                    </TableCell>

                    {/* Licenses */}
                    <TableCell className="text-center py-3">
                      <div className="inline-flex items-center gap-1 text-xs text-foreground/80 font-mono">
                        <Users className="h-3 w-3 text-muted-foreground/70" />
                        <span>{client.userLicenses}</span>
                      </div>
                    </TableCell>

                    {/* Health Score */}
                    <TableCell className="py-3">
                      <div className="space-y-1.5 w-full max-w-[140px]">
                        <div className="flex items-center justify-between text-xs">
                          <Badge
                            variant="outline"
                            className={cn("px-1.5 py-0 text-[10px] font-mono h-4", health.badgeClass)}
                          >
                            {client.healthScore}%
                          </Badge>
                          <span className={cn("text-[11px] font-medium", health.badgeClass.split(" ")[2])}>
                            {health.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className={cn("h-full transition-all rounded-full", health.barClass)}
                            style={{ width: `${client.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="text-xs text-muted-foreground py-3 font-mono">
                      {formatDate(client.createdAt)}
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell
                      className="text-right py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-background border-border shadow-xl"
                        >
                          <DropdownMenuLabel className="text-xs font-semibold">
                            {client.company}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-xs cursor-pointer"
                            onClick={() => onSelectClient?.(client)}
                          >
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            View Client Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs cursor-pointer"
                            onClick={() => onViewSubscription?.(client)}
                          >
                            <CreditCard className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            Manage Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs cursor-pointer"
                            onClick={() => onViewContract?.(client)}
                          >
                            <FileText className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            View Contract & SLA
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-xs cursor-pointer"
                            onClick={() => {
                              window.location.href = `mailto:${client.email}`;
                            }}
                          >
                            <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            Email Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
