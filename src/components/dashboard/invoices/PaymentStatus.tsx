import {
  CreditCard,
  Wallet,
  Landmark,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  Ban,
  HelpCircle,
} from "lucide-react";
import type { InvoiceStatus, PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PaymentStatusProps {
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  className?: string;
  showMethod?: boolean;
}

export function getPaymentMethodDetails(method?: PaymentMethod) {
  switch (method) {
    case "stripe":
      return {
        label: "Stripe",
        icon: CreditCard,
        className: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      };
    case "paypal":
      return {
        label: "PayPal",
        icon: Wallet,
        className: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      };
    case "bank_transfer":
      return {
        label: "Bank Wire",
        icon: Landmark,
        className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      };
    case "check":
      return {
        label: "Check",
        icon: FileCheck,
        className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      };
    default:
      return null;
  }
}

export function PaymentMethodBadge({ method }: { method?: PaymentMethod }) {
  const details = getPaymentMethodDetails(method);
  if (!details) {
    return <span className="text-xs text-muted-foreground font-mono">—</span>;
  }

  const Icon = details.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        details.className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{details.label}</span>
    </span>
  );
}

export function PaymentStatus({
  status,
  paymentMethod,
  className,
  showMethod = false,
}: PaymentStatusProps) {
  const renderBadge = () => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="border-border bg-muted/60 text-muted-foreground gap-1 font-medium"
          >
            <FileEdit className="h-3 w-3" />
            Draft
          </Badge>
        );
      case "sent":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/15 text-blue-400 gap-1 font-medium"
          >
            <Clock className="h-3 w-3" />
            Sent
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400 gap-1 font-medium"
          >
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </Badge>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            <AlertCircle className="h-3 w-3 shrink-0" />
            Overdue
          </span>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-border bg-muted/40 text-muted-foreground/80 line-through gap-1 font-medium"
          >
            <Ban className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <HelpCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {renderBadge()}
      {showMethod && <PaymentMethodBadge method={paymentMethod} />}
    </div>
  );
}
