import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  AlertTriangle,
  CreditCard,
  TicketCheck,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock-data";
import type { Notification, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AlertsWidgetProps {
  className?: string;
  maxItems?: number;
}

const priorityBadges: Record<
  Priority,
  { label: string; badge: string; dot: string }
> = {
  critical: {
    label: "Critical",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dot: "bg-rose-500 animate-ping",
  },
  high: {
    label: "High",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    dot: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  low: {
    label: "Low",
    badge: "bg-muted text-muted-foreground border-border/50",
    dot: "bg-muted-foreground",
  },
};

const typeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  ticket: TicketCheck,
  invoice: CreditCard,
  alert: AlertTriangle,
  approval: CheckCircle2,
  system: Bell,
};

function formatTimestamp(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date("2026-10-16T14:35:44Z");
    const diffHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export function AlertsWidget({ className, maxItems = 5 }: AlertsWidgetProps) {
  const [filter, setFilter] = React.useState<"all" | "critical">("all");

  const filteredNotifications = React.useMemo(() => {
    let list = [...mockNotifications];
    if (filter === "critical") {
      list = list.filter((n) => n.priority === "critical" || n.priority === "high");
    }
    return list.slice(0, maxItems);
  }, [filter, maxItems]);

  const criticalCount = mockNotifications.filter(
    (n) => n.priority === "critical" || n.priority === "high"
  ).length;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="font-display text-lg tracking-tight">Active Alerts</CardTitle>
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5">
                <ShieldAlert className="mr-1 h-3 w-3" />
                {criticalCount} Urgent
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            System notices, overdue items, and operational escalations
          </CardDescription>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("critical")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
              filter === "critical"
                ? "bg-rose-500 text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Urgent
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {filteredNotifications.map((notification) => {
          const priorityInfo = priorityBadges[notification.priority] || priorityBadges.low;
          const Icon = typeIcons[notification.type] || Bell;

          return (
            <Link
              key={notification.id}
              to={notification.link || "/dashboard"}
              className={cn(
                "group relative block rounded-xl border p-3 transition-all duration-200 hover:border-border hover:bg-muted/30",
                notification.priority === "critical"
                  ? "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50"
                  : notification.priority === "high"
                    ? "border-orange-500/20 bg-card/40 hover:border-orange-500/40"
                    : "border-border/40 bg-card/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                    notification.priority === "critical"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      : notification.priority === "high"
                        ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                        : "border-primary/20 bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {notification.priority === "critical" && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-display text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {notification.title}
                    </h5>
                    <span className="shrink-0 text-[10px] text-muted-foreground font-mono">
                      {formatTimestamp(notification.createdAt)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {notification.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn("text-[9px] px-1.5 py-0 h-4 uppercase font-semibold", priorityInfo.badge)}
                    >
                      {priorityInfo.label}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Resolve <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
