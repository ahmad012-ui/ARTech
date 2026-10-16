import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Zap,
  TrendingUp,
  AlertCircle,
  PauseCircle,
  XCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Subscription, SubscriptionPlan, SubscriptionStatus, Client } from "@/lib/types";
import { mockSubscriptions, mockClients } from "@/lib/mock-data";

interface SubscriptionManagerProps {
  subscription?: Subscription;
  client?: Client;
  className?: string;
  onUpdatePlan?: (newPlan: SubscriptionPlan) => void;
}

const planTiers: {
  id: SubscriptionPlan;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "Essential tooling for early startups and small engineering teams.",
    features: ["Up to 5 Users", "Community Support", "Basic Analytics", "Standard APIs"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$1,800",
    period: "/month",
    description: "Scale your software operations with priority support and team features.",
    features: ["Up to 20 Users", "Email & Chat Support", "Standard Integrations", "Advanced Reporting", "99.5% Uptime SLA"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$4,500",
    period: "/month",
    description: "Dedicated infrastructure, custom SLAs, and white-glove onboarding.",
    features: ["Unlimited Users", "24/7 Priority Support", "Custom Integrations", "Dedicated Account Manager", "99.99% Uptime SLA", "Custom Development"],
  },
];

export function SubscriptionManager({
  subscription: propSub,
  client,
  className,
  onUpdatePlan,
}: SubscriptionManagerProps) {
  // If no subscription prop is provided, fallback to first mock subscription or find matching client
  const matchedClientSub = client
    ? mockSubscriptions.find((s) => s.clientId === client.id)
    : mockSubscriptions[0];

  const currentSub = propSub || matchedClientSub || mockSubscriptions[0];
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(currentSub.plan);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Find client info if not provided directly
  const activeClient =
    client || mockClients.find((c) => c.id === currentSub.clientId);

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
            className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 uppercase tracking-wider text-[11px] font-semibold"
          >
            Starter
          </Badge>
        );
      case "professional":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-500/10 text-purple-400 uppercase tracking-wider text-[11px] font-semibold"
          >
            Professional
          </Badge>
        );
      case "enterprise":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400 uppercase tracking-wider text-[11px] font-semibold"
          >
            Enterprise
          </Badge>
        );
      case "custom":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider text-[11px] font-semibold"
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
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        );
      case "trial":
        return (
          <Badge
            variant="outline"
            className="border-sky-500/30 bg-sky-500/10 text-sky-400 font-medium flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3" />
            Trial
          </Badge>
        );
      case "past_due":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-400 font-medium flex items-center gap-1.5"
          >
            <AlertCircle className="h-3 w-3" />
            Past Due
          </Badge>
        );
      case "paused":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium flex items-center gap-1.5"
          >
            <PauseCircle className="h-3 w-3" />
            Paused
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-zinc-500/30 bg-zinc-500/10 text-zinc-400 font-medium flex items-center gap-1.5"
          >
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePlanSelect = (tierId: SubscriptionPlan) => {
    setSelectedPlan(tierId);
    if (onUpdatePlan) {
      onUpdatePlan(tierId);
    }
    setIsUpgradeOpen(false);
  };

  return (
    <Card className={cn("border-border/60 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden transition-all hover:border-border", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <CreditCard className="h-4 w-4" />
              </span>
              <CardTitle className="font-display text-base font-semibold tracking-tight text-foreground">
                Subscription Plan
              </CardTitle>
              {getPlanBadge(selectedPlan)}
            </div>
            {activeClient && (
              <CardDescription className="text-xs text-muted-foreground">
                Assigned to <span className="font-medium text-foreground">{activeClient.company}</span>
              </CardDescription>
            )}
          </div>
          <div>{getStatusBadge(currentSub.status)}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* MRR & Billing cycle metric block */}
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/40 bg-muted/20 p-3.5">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground/60" />
              Monthly Recurring (MRR)
            </span>
            <p className="font-display text-2xl font-bold text-foreground">
              {formatCurrency(currentSub.mrr)}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground/60" />
              Next Renewal
            </span>
            <p className="font-medium text-sm text-foreground">
              {formatDate(currentSub.renewalDate)}
            </p>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 uppercase tracking-wide border-border/60 bg-muted/40">
                {currentSub.billingCycle} billing
              </Badge>
            </div>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
            Included Features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentSub.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-md border border-border/30 bg-muted/15 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <Separator className="border-border/40" />

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-3 pb-3">
        <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              Change Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-background border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Select Subscription Tier</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Upgrade or modify the active plan for this client account.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 py-3">
              {planTiers.map((tier) => {
                const isCurrent = selectedPlan === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handlePlanSelect(tier.id)}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all hover:border-primary/60",
                      isCurrent
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border/60 bg-card/40 hover:bg-muted/20"
                    )}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-base font-semibold">{tier.name}</span>
                        {isCurrent && (
                          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-baseline">
                        <span className="font-display text-2xl font-bold">{tier.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">{tier.period}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tier.description}</p>
                      <Separator className="border-border/40 my-2" />
                      <ul className="space-y-1.5">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center text-xs text-muted-foreground">
                            <Check className="h-3 w-3 text-emerald-400 mr-1.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      size="sm"
                      variant={isCurrent ? "outline" : "default"}
                      className="mt-4 w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanSelect(tier.id);
                      }}
                    >
                      {isCurrent ? "Active Plan" : `Switch to ${tier.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setIsUpgradeOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="mr-1.5 h-3 w-3" />
            Billing Cycle
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs border-border/60 text-muted-foreground hover:text-foreground"
          >
            Manage Payment
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
