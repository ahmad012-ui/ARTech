import { useState } from "react";
import { Link, Outlet, useMatches } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Target,
  Handshake,
  Building2,
  FolderKanban,
  TicketCheck,
  FileText,
  BarChart3,
  BookOpen,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Cable,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockNotifications } from "@/lib/mock-data";

// ---- Navigation Config ----
const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Sales & CRM",
    items: [
      { label: "Leads", href: "/dashboard/leads", icon: Target },
      { label: "Contacts", href: "/dashboard/contacts", icon: Users },
      { label: "Deals", href: "/dashboard/deals", icon: Handshake },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Clients", href: "/dashboard/clients", icon: Building2 },
      { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Tickets", href: "/dashboard/tickets", icon: TicketCheck },
      { label: "Knowledge Base", href: "/dashboard/knowledge-base", icon: BookOpen },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
      { label: "Team & Roles", href: "/dashboard/settings/team", icon: Shield },
      { label: "Integrations", href: "/dashboard/settings/integrations", icon: Cable },
      { label: "Audit Log", href: "/dashboard/settings/audit-log", icon: ClipboardList },
    ],
  },
];

// ---- Sidebar ----
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.fullPath ?? "";

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border/50 bg-card/30 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-sm">
              AR
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              ARTech
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onToggle}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="opacity-50" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    currentPath === item.href ||
                    (item.href !== "/dashboard" &&
                      currentPath.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-primary" : ""
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User section at bottom */}
      {!collapsed && (
        <>
          <Separator className="opacity-50" />
          <div className="p-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  AK
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Ahmed Khan</p>
                <p className="text-xs text-muted-foreground truncate">Admin</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---- Top Bar ----
function TopBar() {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/20 px-6 backdrop-blur-sm">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search leads, clients, tickets..."
          className="h-9 pl-9 bg-muted/30 border-border/50 focus-visible:bg-muted/50"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            </div>
            <ScrollArea className="max-h-[400px]">
              <div className="divide-y divide-border/30">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/30",
                      !notification.isRead && "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                        notification.priority === "critical"
                          ? "bg-destructive"
                          : notification.priority === "high"
                            ? "bg-orange-500"
                            : notification.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-muted-foreground"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 opacity-50" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                  AK
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline">Ahmed</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ---- Dashboard Layout ----
export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <Sidebar collapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
