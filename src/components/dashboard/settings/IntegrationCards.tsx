import * as React from "react";
import {
  GitBranch,
  Hash,
  Mail,
  CreditCard,
  Kanban,
  Wallet,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  PowerOff,
  Cable,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Integration } from "@/lib/types";

interface IntegrationCardProps {
  integration: Integration;
  onToggleConnect?: (id: string, nextState: boolean) => void;
  onSync?: (id: string) => void;
  isSyncing?: boolean;
}

// Icon resolver for integration platforms
function IntegrationIcon({ icon, name }: { icon: string; name: string }) {
  const iconLower = icon.toLowerCase();

  if (iconLower === "github" || name.toLowerCase().includes("github")) {
    return (
      <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    );
  }

  if (iconLower === "slack" || name.toLowerCase().includes("slack")) {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
        <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
        <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
        <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
      </svg>
    );
  }

  if (iconLower === "mail" || name.toLowerCase().includes("google") || name.toLowerCase().includes("mailchimp")) {
    return <Mail className="h-6 w-6 text-sky-400" />;
  }

  if (iconLower === "credit-card" || name.toLowerCase().includes("stripe")) {
    return <CreditCard className="h-6 w-6 text-indigo-400" />;
  }

  if (iconLower === "kanban" || name.toLowerCase().includes("jira")) {
    return <Kanban className="h-6 w-6 text-blue-400" />;
  }

  if (iconLower === "wallet" || name.toLowerCase().includes("paypal")) {
    return <Wallet className="h-6 w-6 text-amber-400" />;
  }

  if (iconLower === "message-square" || name.toLowerCase().includes("teams")) {
    return <MessageSquare className="h-6 w-6 text-violet-400" />;
  }

  return <Cable className="h-6 w-6 text-muted-foreground" />;
}

// Category badge color mapping
function getCategoryBadgeClass(category: string) {
  switch (category.toLowerCase()) {
    case "development":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "communication":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "productivity":
      return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    case "payments":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "project management":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "marketing":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

// Format ISO date to clean readable string
function formatSyncTime(dateStr?: string) {
  if (!dateStr) return "Never synced";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export function IntegrationCard({
  integration,
  onToggleConnect,
  onSync,
  isSyncing,
}: IntegrationCardProps) {
  const { id, name, icon, category, description, isConnected, lastSync } = integration;

  return (
    <Card
      className={cn(
        "group flex flex-col justify-between border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-200 hover:border-border hover:shadow-lg",
        isConnected ? "ring-1 ring-emerald-500/20" : ""
      )}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background/80 shadow-xs transition-transform group-hover:scale-105">
              <IntegrationIcon icon={icon} name={name} />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                    getCategoryBadgeClass(category)
                  )}
                >
                  {category}
                </span>
              </div>
            </div>
          </div>

          <div>
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                Disconnected
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>

        {isConnected && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <RefreshCw className={cn("h-3 w-3", isSyncing ? "animate-spin text-primary" : "")} />
              <span>Last sync:</span>
            </div>
            <span className="font-mono text-foreground font-medium">
              {formatSyncTime(lastSync)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/40 p-5 pt-3">
        {isConnected ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSync?.(id)}
              disabled={isSyncing}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isSyncing ? "animate-spin text-primary" : "")} />
              <span>Sync Now</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleConnect?.(id, false)}
              className="h-8 border-border/60 text-xs text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            >
              <PowerOff className="mr-1.5 h-3.5 w-3.5" />
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            onClick={() => onToggleConnect?.(id, true)}
            className="h-8 w-full bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function IntegrationCardsGrid({
  integrations,
  onToggleConnect,
  onSync,
  isSyncingId,
}: {
  integrations: Integration[];
  onToggleConnect?: (id: string, nextState: boolean) => void;
  onSync?: (id: string) => void;
  isSyncingId?: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {integrations.map((item) => (
        <IntegrationCard
          key={item.id}
          integration={item}
          onToggleConnect={onToggleConnect}
          onSync={onSync}
          isSyncing={isSyncingId === item.id}
        />
      ))}
    </div>
  );
}
