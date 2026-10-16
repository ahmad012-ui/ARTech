import { useState } from "react";
import {
  FileText,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Contract, ContractStatus } from "@/lib/types";
import { mockContracts } from "@/lib/mock-data";

interface ContractCardProps {
  contract?: Contract;
  clientName?: string;
  className?: string;
  onToggleAutoRenewal?: (contractId: string, autoRenewal: boolean) => void;
}

export function ContractCard({
  contract = mockContracts[0],
  clientName,
  className,
  onToggleAutoRenewal,
}: ContractCardProps) {
  const [autoRenew, setAutoRenew] = useState(contract.autoRenewal);

  const handleAutoRenewalToggle = (checked: boolean) => {
    setAutoRenew(checked);
    if (onToggleAutoRenewal) {
      onToggleAutoRenewal(contract.id, checked);
    }
  };

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

  // Status badge styling
  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        );
      case "expiring_soon":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium flex items-center gap-1.5"
          >
            <Clock className="h-3 w-3" />
            Expiring Soon
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-400 font-medium flex items-center gap-1.5"
          >
            <AlertTriangle className="h-3 w-3" />
            Expired
          </Badge>
        );
      case "renewed":
        return (
          <Badge
            variant="outline"
            className="border-sky-500/30 bg-sky-500/10 text-sky-400 font-medium flex items-center gap-1.5"
          >
            <RefreshCw className="h-3 w-3" />
            Renewed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDateStr: string) => {
    const end = new Date(endDateStr).getTime();
    const now = new Date("2026-10-16").getTime(); // Current simulation date
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = calculateDaysRemaining(contract.endDate);

  return (
    <Card className={cn("border-border/60 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden transition-all hover:border-border", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </span>
              <CardTitle className="font-display text-base font-semibold tracking-tight text-foreground">
                {contract.title}
              </CardTitle>
            </div>
            {clientName && (
              <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                <Building2 className="h-3 w-3 text-muted-foreground/70" />
                {clientName}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {getStatusBadge(contract.status)}
            {daysRemaining > 0 ? (
              <span className={cn(
                "text-[11px] font-mono",
                daysRemaining <= 45 ? "text-amber-400 font-medium" : "text-muted-foreground"
              )}>
                {daysRemaining} days remaining
              </span>
            ) : (
              <span className="text-[11px] font-mono text-rose-400 font-medium">Expired</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Value and Dates Grid */}
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/40 bg-muted/20 p-3">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground/60" />
              Contract Value
            </span>
            <p className="font-display text-lg font-bold text-foreground">
              {formatCurrency(contract.value)}
              <span className="text-xs font-normal text-muted-foreground"> /yr</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground/60" />
              Term Period
            </span>
            <p className="text-xs font-medium text-foreground">
              {formatDate(contract.startDate)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              to {formatDate(contract.endDate)}
            </p>
          </div>
        </div>

        {/* SLA Terms Box */}
        <div className="rounded-lg border border-border/40 bg-accent/10 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>SLA Guarantee</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {contract.slaTerms}
          </p>
        </div>

        <Separator className="border-border/40" />

        {/* Auto Renewal Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/10 px-3 py-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-foreground">Auto-Renewal</span>
              {autoRenew ? (
                <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-zinc-500/20 text-zinc-400 bg-zinc-500/5">
                  Manual
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {autoRenew
                ? "Renews for 12 months on term end date"
                : "Contract ends without automatic renewal"}
            </p>
          </div>
          <Switch
            checked={autoRenew}
            onCheckedChange={handleAutoRenewalToggle}
            aria-label="Toggle auto-renewal"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs border-border/60 hover:bg-accent hover:text-accent-foreground"
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download PDF
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <span>View Terms</span>
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
