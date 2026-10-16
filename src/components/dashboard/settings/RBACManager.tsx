import * as React from "react";
import { Check, X, Shield, Info, Search, HelpCircle, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export interface PermissionDefinition {
  id: string;
  name: string;
  category: "Overview" | "Sales & CRM" | "Operations" | "Finance & Reporting" | "Administration";
  description: string;
  allowedRoles: Record<UserRole, boolean>;
}

export const ROLES_CONFIG: {
  key: UserRole;
  label: string;
  badgeClass: string;
  desc: string;
}[] = [
  {
    key: "viewer",
    label: "Viewer",
    badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
    desc: "Read-only visibility into general business metrics",
  },
  {
    key: "support_agent",
    label: "Support Agent",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    desc: "Customer support tickets, contacts, and basic resolution",
  },
  {
    key: "sales_rep",
    label: "Sales Rep",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    desc: "Leads, pipeline deals, contact directory & sales reports",
  },
  {
    key: "developer",
    label: "Developer",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    desc: "Engineering projects, technical tickets, and audit trails",
  },
  {
    key: "manager",
    label: "Manager",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    desc: "Operational management, billing oversight & team coordination",
  },
  {
    key: "admin",
    label: "Admin",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
    desc: "Unrestricted platform privilege and system administration",
  },
];

export const RBAC_PERMISSIONS: PermissionDefinition[] = [
  {
    id: "dashboard_access",
    name: "Dashboard Access",
    category: "Overview",
    description: "Access executive summary metrics, team feed, and high-level KPIs",
    allowedRoles: {
      viewer: true,
      support_agent: true,
      sales_rep: true,
      developer: true,
      manager: true,
      admin: true,
    },
  },
  {
    id: "lead_management",
    name: "Lead Management",
    category: "Sales & CRM",
    description: "Capture, qualify, assign, and update potential customer leads",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: true,
      developer: false,
      manager: true,
      admin: true,
    },
  },
  {
    id: "contact_management",
    name: "Contact Management",
    category: "Sales & CRM",
    description: "Create and update client directories, leads, and vendor contact records",
    allowedRoles: {
      viewer: false,
      support_agent: true,
      sales_rep: true,
      developer: false,
      manager: true,
      admin: true,
    },
  },
  {
    id: "deal_management",
    name: "Deal Management",
    category: "Sales & CRM",
    description: "Track pipeline stages, forecast ARR, and negotiate deal terms",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: true,
      developer: false,
      manager: true,
      admin: true,
    },
  },
  {
    id: "client_management",
    name: "Client Management",
    category: "Operations",
    description: "Manage client contracts, subscriptions, SLA tiers, and accounts",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: false,
      developer: false,
      manager: true,
      admin: true,
    },
  },
  {
    id: "project_management",
    name: "Project Management",
    category: "Operations",
    description: "Plan milestones, assign developers, and track billable time entries",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: false,
      developer: true,
      manager: true,
      admin: true,
    },
  },
  {
    id: "ticket_management",
    name: "Ticket Management",
    category: "Operations",
    description: "Manage customer issues, triage SLA breaches, and publish KB articles",
    allowedRoles: {
      viewer: false,
      support_agent: true,
      sales_rep: false,
      developer: true,
      manager: true,
      admin: true,
    },
  },
  {
    id: "invoice_management",
    name: "Invoice Management",
    category: "Finance & Reporting",
    description: "Generate invoices, verify expense receipts, and handle billing cycles",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: false,
      developer: false,
      manager: true,
      admin: true,
    },
  },
  {
    id: "report_access",
    name: "Report Access",
    category: "Finance & Reporting",
    description: "View financial statements, revenue forecasts, and analytics charts",
    allowedRoles: {
      viewer: true,
      support_agent: false,
      sales_rep: true,
      developer: false,
      manager: true,
      admin: true,
    },
  },
  {
    id: "team_management",
    name: "Team Management",
    category: "Administration",
    description: "Invite workspace members, edit member profiles, and modify roles",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: false,
      developer: false,
      manager: true,
      admin: true,
    },
  },
  {
    id: "system_settings",
    name: "System Settings",
    category: "Administration",
    description: "Modify company configuration, data retention policies, and security",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: false,
      developer: false,
      manager: false,
      admin: true,
    },
  },
  {
    id: "audit_logs",
    name: "Audit Logs",
    category: "Administration",
    description: "Inspect system security logs, authentication events, and data changes",
    allowedRoles: {
      viewer: false,
      support_agent: false,
      sales_rep: false,
      developer: true,
      manager: false,
      admin: true,
    },
  },
];

export function RBACManager() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<UserRole | "all">("all");

  const filteredPermissions = React.useMemo(() => {
    return RBAC_PERMISSIONS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedRole === "all") return true;
      return p.allowedRoles[selectedRole];
    });
  }, [searchTerm, selectedRole]);

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-lg tracking-tight">
                Role-Based Access Control (RBAC) Matrix
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Define privileges and operational access boundaries progressively from Viewer to System Administrator.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Role Quick Filter Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-medium text-muted-foreground mr-1">Filter by role:</span>
          <button
            onClick={() => setSelectedRole("all")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
              selectedRole === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All Roles
          </button>
          {ROLES_CONFIG.map((role) => (
            <button
              key={role.key}
              onClick={() => setSelectedRole(role.key)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                selectedRole === role.key
                  ? role.badgeClass + " font-semibold ring-1 ring-primary/40"
                  : "border-border/40 bg-card/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {role.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm py-3.5 pl-6 pr-4 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[280px]">
                  Permission & Privilege Scope
                </th>
                {ROLES_CONFIG.map((role) => (
                  <th
                    key={role.key}
                    className={cn(
                      "px-3 py-3.5 text-center font-display text-xs font-semibold tracking-wider min-w-[120px]",
                      selectedRole === role.key ? "bg-primary/5" : ""
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", role.badgeClass)}>
                        {role.label}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No permissions match your filter.
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((permission) => (
                  <tr
                    key={permission.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="sticky left-0 z-10 bg-card/95 group-hover:bg-card/90 backdrop-blur-sm py-3.5 pl-6 pr-4">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted/50 text-muted-foreground">
                          <Lock className="h-3 w-3" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-xs sm:text-sm">
                              {permission.name}
                            </span>
                            <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {permission.category}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground/80 line-clamp-1">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {ROLES_CONFIG.map((role) => {
                      const isAllowed = permission.allowedRoles[role.key];
                      return (
                        <td
                          key={role.key}
                          className={cn(
                            "px-3 py-3.5 text-center transition-colors",
                            selectedRole === role.key ? "bg-primary/5" : ""
                          )}
                        >
                          <div className="flex items-center justify-center">
                            {isAllowed ? (
                              <div
                                title={`${role.label} has ${permission.name}`}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs"
                              >
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                              </div>
                            ) : (
                              <div
                                title={`${role.label} does not have ${permission.name}`}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800/40 text-zinc-600 border border-zinc-800"
                              >
                                <X className="h-3.5 w-3.5 opacity-40" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer / legend */}
        <div className="flex flex-col gap-2 border-t border-border/40 bg-muted/10 px-6 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>Authorized</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                <X className="h-2.5 w-2.5" />
              </div>
              <span>Restricted</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/80">
            <Info className="h-3.5 w-3.5" />
            <span>Changes to core administrative roles require 2-step verification</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
