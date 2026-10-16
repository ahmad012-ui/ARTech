import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SLABadgeProps {
  deadline: string;
  breach: boolean;
  className?: string;
}

// Reference time for consistent countdown calculation against mock dates
const SIMULATED_NOW = new Date("2026-10-16T14:35:51Z").getTime();

export function SLABadge({ deadline, breach, className }: SLABadgeProps) {
  // If explicitly flagged as breached
  if (breach) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive shadow-sm",
          className
        )}
        title={`SLA Breached (Deadline: ${new Date(deadline).toLocaleString()})`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
        </span>
        <AlertTriangle className="h-3 w-3 shrink-0" />
        <span className="font-mono tracking-wide">BREACHED</span>
      </span>
    );
  }

  // Calculate remaining time against real date or fallback simulated app date
  const deadlineTime = new Date(deadline).getTime();
  const now = Date.now() > SIMULATED_NOW ? Date.now() : SIMULATED_NOW;
  const diffMs = deadlineTime - now;

  // If time has passed
  if (diffMs <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive",
          className
        )}
        title={`SLA Breached (Deadline: ${new Date(deadline).toLocaleString()})`}
      >
        <AlertTriangle className="h-3 w-3 shrink-0" />
        <span className="font-mono tracking-wide">BREACHED</span>
      </span>
    );
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let timeString = "";
  if (days > 0) {
    timeString = `${days}d ${remainingHours}h`;
  } else if (hours > 0) {
    timeString = `${hours}h ${minutes}m`;
  } else {
    timeString = `${minutes}m left`;
  }

  const isUrgent = hours < 6;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono transition-colors",
        isUrgent
          ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
          : "border-primary/20 bg-primary/10 text-primary",
        className
      )}
      title={`Deadline: ${new Date(deadline).toLocaleString()}`}
    >
      <Clock className={cn("h-3 w-3 shrink-0", isUrgent && "animate-pulse text-amber-400")} />
      <span>{timeString}</span>
    </span>
  );
}
