import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserPlus,
  Shield,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Mail,
  Building,
  KeyRound,
  Trash2,
  Edit2,
  Check,
  Search,
  Filter,
  ShieldAlert,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUsers } from "@/lib/mock-data";
import type { User, UserRole } from "@/lib/types";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsNav";
import { RBACManager } from "@/components/dashboard/settings/RBACManager";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/settings/team")({
  component: TeamSettingsPage,
});

// Role badge styling per exact prompt specifications:
// admin=red, manager=purple, sales_rep=blue, developer=green, support_agent=yellow, viewer=gray
export function getRoleBadgeClass(role: UserRole) {
  switch (role) {
    case "admin":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "manager":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "sales_rep":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "developer":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "support_agent":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "viewer":
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
  }
}

export function formatRoleLabel(role: UserRole) {
  switch (role) {
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "sales_rep":
      return "Sales Rep";
    case "developer":
      return "Developer";
    case "support_agent":
      return "Support Agent";
    case "viewer":
      return "Viewer";
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatLastLogin(dateStr: string) {
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

function TeamSettingsPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");

  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteName, setInviteName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<UserRole>("developer");
  const [inviteDept, setInviteDept] = React.useState("Engineering");

  // Edit role modal state
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [newRole, setNewRole] = React.useState<UserRole>("developer");

  // Summary counts
  const totalMembers = users.length;
  const roleBreakdown = React.useMemo(() => {
    return {
      admin: users.filter((u) => u.role === "admin").length,
      manager: users.filter((u) => u.role === "manager").length,
      developer: users.filter((u) => u.role === "developer").length,
      sales_rep: users.filter((u) => u.role === "sales_rep").length,
      support_agent: users.filter((u) => u.role === "support_agent").length,
      viewer: users.filter((u) => u.role === "viewer").length,
    };
  }, [users]);

  // Filtered members list
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newUser: User = {
      id: `u${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      department: inviteDept,
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("developer");
    setInviteDept("Engineering");
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleSaveRole = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, role: newRole } : u))
    );
    setEditingUser(null);
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to revoke this user's membership?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Settings Navigation Header with Invite Action */}
      <SettingsHeader
        title="Team & Roles"
        description="Manage workspace team members, departments, active statuses, and role-based access permissions."
        actions={
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm">
                <UserPlus className="h-4 w-4" />
                <span>Invite Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card max-w-md">
              <form onSubmit={handleInviteSubmit}>
                <DialogHeader>
                  <div className="flex items-center gap-2 text-primary">
                    <UserPlus className="h-5 w-5" />
                    <DialogTitle className="font-display text-lg">Invite New Teammate</DialogTitle>
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground">
                    An email invitation link with setup credentials will be sent immediately.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 text-xs">
                  <div className="space-y-1.5">
                    <Label htmlFor="invite-name" className="text-xs font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="invite-name"
                      placeholder="e.g. Maya Lin"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="invite-email" className="text-xs font-medium">
                      Work Email
                    </Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="maya@artech.dev"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="invite-role" className="text-xs font-medium">
                        Initial Role
                      </Label>
                      <Select
                        value={inviteRole}
                        onValueChange={(v) => setInviteRole(v as UserRole)}
                      >
                        <SelectTrigger id="invite-role" className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="sales_rep">Sales Rep</SelectItem>
                          <SelectItem value="support_agent">Support Agent</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="invite-dept" className="text-xs font-medium">
                        Department
                      </Label>
                      <Select value={inviteDept} onValueChange={setInviteDept}>
                        <SelectTrigger id="invite-dept" className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsInviteOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Send Invitation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary KPI Cards: Total Team Members (6) & Role Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Members */}
        <Card className="col-span-2 sm:col-span-1 border-border/60 bg-card/60 backdrop-blur-sm p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Members</p>
              <h3 className="font-display text-2xl font-bold text-foreground">{totalMembers}</h3>
            </div>
          </div>
        </Card>

        {/* Admin Breakdown */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-3.5">
          <p className="text-[11px] font-medium text-muted-foreground">Admins</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-xl font-bold text-foreground">
              {roleBreakdown.admin}
            </span>
            <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
              Red
            </span>
          </div>
        </Card>

        {/* Manager Breakdown */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-3.5">
          <p className="text-[11px] font-medium text-muted-foreground">Managers</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-xl font-bold text-foreground">
              {roleBreakdown.manager}
            </span>
            <span className="rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400">
              Purple
            </span>
          </div>
        </Card>

        {/* Developer Breakdown */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-3.5">
          <p className="text-[11px] font-medium text-muted-foreground">Developers</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-xl font-bold text-foreground">
              {roleBreakdown.developer}
            </span>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              Green
            </span>
          </div>
        </Card>

        {/* Sales Rep Breakdown */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-3.5">
          <p className="text-[11px] font-medium text-muted-foreground">Sales Reps</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-xl font-bold text-foreground">
              {roleBreakdown.sales_rep}
            </span>
            <span className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">
              Blue
            </span>
          </div>
        </Card>

        {/* Support Agent Breakdown */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-3.5">
          <p className="text-[11px] font-medium text-muted-foreground">Support</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-xl font-bold text-foreground">
              {roleBreakdown.support_agent}
            </span>
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
              Yellow
            </span>
          </div>
        </Card>

        {/* Viewer Breakdown */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-3.5">
          <p className="text-[11px] font-medium text-muted-foreground">Viewers</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-xl font-bold text-foreground">
              {roleBreakdown.viewer}
            </span>
            <span className="rounded border border-zinc-500/30 bg-zinc-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
              Gray
            </span>
          </div>
        </Card>
      </div>

      {/* Team Members Table Section */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-display text-lg tracking-tight">Active Team Roster</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                All assigned staff with registered company email, role badges, and access authorizations.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-xs"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-9 w-32 text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="sales_rep">Sales Rep</SelectItem>
                  <SelectItem value="support_agent">Support</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-6">
                    Name
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Department
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Login
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/30">
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-sm text-muted-foreground">
                      No team members found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                      {/* Name */}
                      <TableCell className="pl-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/50">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground text-sm">{user.name}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground font-mono">
                        {user.email}
                      </TableCell>

                      {/* Role Badge (with exact required colors) */}
                      <TableCell className="py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
                            getRoleBadgeClass(user.role)
                          )}
                        >
                          {formatRoleLabel(user.role)}
                        </span>
                      </TableCell>

                      {/* Department */}
                      <TableCell className="py-3.5">
                        <span className="rounded border border-border/50 bg-muted/40 px-2 py-0.5 text-xs text-foreground font-medium">
                          {user.department}
                        </span>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="py-3.5">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                            Inactive
                          </span>
                        )}
                      </TableCell>

                      {/* Last Login */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground font-mono">
                        {formatLastLogin(user.lastLogin)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 border-border bg-card">
                            <DropdownMenuLabel className="text-xs">Member Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingUser(user);
                                setNewRole(user.role);
                              }}
                              className="text-xs gap-2 cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-primary" />
                              <span>Change Role</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user.id)}
                              className="text-xs gap-2 cursor-pointer"
                            >
                              {user.isActive ? (
                                <>
                                  <XCircle className="h-3.5 w-3.5 text-amber-400" />
                                  <span>Deactivate Account</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                  <span>Reactivate Account</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-xs gap-2 text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Revoke Access</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* RBAC Permissions Matrix Component */}
      <RBACManager />

      {/* Edit Role Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="border-border bg-card max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              Change Role for {editingUser?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Adjusting permissions will alter their RBAC privileges across modules immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs">Selected User</Label>
              <Input value={editingUser?.email ?? ""} disabled className="text-xs font-mono" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Assign Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (Red — All Privileges)</SelectItem>
                  <SelectItem value="manager">Manager (Purple — Operations & Team)</SelectItem>
                  <SelectItem value="developer">Developer (Green — Code & Tickets)</SelectItem>
                  <SelectItem value="sales_rep">Sales Rep (Blue — CRM & Pipeline)</SelectItem>
                  <SelectItem value="support_agent">Support Agent (Yellow — Customer Care)</SelectItem>
                  <SelectItem value="viewer">Viewer (Gray — Read Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveRole} className="bg-primary text-primary-foreground">
              Save Role Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
