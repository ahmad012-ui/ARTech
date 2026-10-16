import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KPICardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  format?: "currency" | "percentage" | "number";
  inverseTrend?: boolean; // if true, negative change is desirable (e.g. churn rate, CAC)
  subtitle?: string;
  className?: string;
  delay?: number;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  format = "number",
  inverseTrend = false,
  subtitle = "vs last month",
  className,
  delay = 0,
}: KPICardProps) {
  const formattedValue = React.useMemo(() => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "number":
      default:
        return new Intl.NumberFormat("en-US").format(value);
    }
  }, [value, format]);

  // Determine if trend is favorable
  const isPositiveDirection = change > 0;
  const isNeutral = change === 0;
  const isGood = inverseTrend ? change < 0 : change > 0;

  const TrendIcon = isNeutral
    ? Minus
    : isPositiveDirection
      ? TrendingUp
      : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="h-full"
    >
      <Card
        className={cn(
          "relative overflow-hidden border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5",
          className
        )}
      >
        {/* Subtle accent glow */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {formattedValue}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                isNeutral
                  ? "bg-muted text-muted-foreground"
                  : isGood
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              )}
            >
              <TrendIcon className="h-3 w-3" />
              <span>
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground/80">{subtitle}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
