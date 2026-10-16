import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Settings, Shield, Cable, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsNavProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

const navItems = [
  {
    label: "General",
    href: "/dashboard/settings",
    icon: Settings,
    exact: true,
  },
  {
    label: "Team & Roles",
    href: "/dashboard/settings/team",
    icon: Shield,
    exact: false,
  },
  {
    label: "Integrations",
    href: "/dashboard/settings/integrations",
    icon: Cable,
    exact: false,
  },
  {
    label: "Audit Log",
    href: "/dashboard/settings/audit-log",
    icon: ClipboardList,
    exact: false,
  },
];

export function SettingsHeader({ title, description, actions }: SettingsNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-border/60">
        <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto" aria-label="Settings Tabs">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href || pathname === `${item.href}/`
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
