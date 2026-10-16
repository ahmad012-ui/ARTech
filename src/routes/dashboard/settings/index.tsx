import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Mail,
  Globe,
  Bell,
  ShieldCheck,
  Database,
  AlertTriangle,
  Download,
  Trash2,
  Check,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsNav";

export const Route = createFileRoute("/dashboard/settings/")({
  component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
  // 1. Organization Profile State
  const [companyName, setCompanyName] = React.useState("ARTech");
  const [email, setEmail] = React.useState("admin@artech.dev");
  const [website, setWebsite] = React.useState("artech.dev");
  const [phone, setPhone] = React.useState("+1 (555) 019-2831");
  const [timezone, setTimezone] = React.useState("utc");
  const [isSavingOrg, setIsSavingOrg] = React.useState(false);
  const [orgSaveSuccess, setOrgSaveSuccess] = React.useState(false);

  // 2. Notifications State
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [slackNotifications, setSlackNotifications] = React.useState(true);
  const [smsCriticalAlerts, setSmsCriticalAlerts] = React.useState(false);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);
  const [isSavingNotifs, setIsSavingNotifs] = React.useState(false);
  const [notifSaveSuccess, setNotifSaveSuccess] = React.useState(false);

  // 3. Data & Privacy State
  const [retentionPeriod, setRetentionPeriod] = React.useState("365");
  const [gdprCompliance, setGdprCompliance] = React.useState(true);
  const [backupSchedule, setBackupSchedule] = React.useState("daily");
  const [isSavingData, setIsSavingData] = React.useState(false);
  const [dataSaveSuccess, setDataSaveSuccess] = React.useState(false);

  // Export State
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportComplete, setExportComplete] = React.useState(false);

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingOrg(true);
    setTimeout(() => {
      setIsSavingOrg(false);
      setOrgSaveSuccess(true);
      setTimeout(() => setOrgSaveSuccess(false), 3000);
    }, 600);
  };

  const handleSaveNotifs = () => {
    setIsSavingNotifs(true);
    setTimeout(() => {
      setIsSavingNotifs(false);
      setNotifSaveSuccess(true);
      setTimeout(() => setNotifSaveSuccess(false), 3000);
    }, 500);
  };

  const handleSaveData = () => {
    setIsSavingData(true);
    setTimeout(() => {
      setIsSavingData(false);
      setDataSaveSuccess(true);
      setTimeout(() => setDataSaveSuccess(false), 3000);
    }, 500);
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportPayload = {
        organization: {
          name: companyName,
          email,
          website,
          exportDate: new Date().toISOString(),
          version: "2.4.0",
        },
        preferences: {
          retentionPeriodDays: retentionPeriod,
          gdprCompliance,
          backupSchedule,
          notifications: {
            email: emailNotifications,
            slack: slackNotifications,
            smsCritical: smsCriticalAlerts,
            weeklyDigest,
          },
        },
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `artech-organization-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header with Navigation Tabs */}
      <SettingsHeader
        title="Settings"
        description="Manage your organization profile, notifications, data preferences, and account security."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              SaaS Admin v2.4
            </span>
          </div>
        }
      />

      <div className="space-y-8">
        {/* 1. Organization Profile Card */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
          <form onSubmit={handleSaveOrg}>
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg tracking-tight">
                      Organization Profile
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Public corporate identity, primary administration contact, and company domains.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
                  Workspace ID: org_artech_092
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-xs font-medium text-foreground">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. ARTech"
                      className="pl-9 text-sm"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Used across invoices, client invitations, and header titles.
                  </p>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-foreground">
                    Primary Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@artech.dev"
                      className="pl-9 text-sm"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    System notifications, password resets, and audit reports go here.
                  </p>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-medium text-foreground">
                    Company Website
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. artech.dev"
                      className="pl-9 text-sm"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Public canonical domain linked in outward-facing communications.
                  </p>
                </div>

                {/* Support Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                    Support Hotline
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="pl-9 text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Emergency phone for critical tier-1 client escalations.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/40 bg-muted/10 px-6 py-4">
              <span className="text-xs text-muted-foreground">
                Last modified by <strong className="text-foreground">Ahmed Khan</strong> today
              </span>
              <Button
                type="submit"
                disabled={isSavingOrg}
                className="gap-2 bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {isSavingOrg ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : orgSaveSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    Changes Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* 2. Notifications Card */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-display text-lg tracking-tight">
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Control how alerts, ticket breaches, and team activity are dispatched to you.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Email Notifications Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:border-border/70">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <Label htmlFor="emailNotifications" className="text-sm font-medium text-foreground cursor-pointer">
                    Email Notifications
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Receive real-time transactional emails for new leads, ticket updates, and client contract renewals.
                </p>
              </div>
              <div className="flex items-center gap-3 pl-6 sm:pl-0">
                <span className="text-xs font-mono text-muted-foreground">
                  {emailNotifications ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>

            {/* Slack Notifications Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:border-border/70">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  <Label htmlFor="slackNotifications" className="text-sm font-medium text-foreground cursor-pointer">
                    Slack Channel Notifications
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Broadcast pipeline wins, SLA warnings, and team deployments directly into #artech-feed.
                </p>
              </div>
              <div className="flex items-center gap-3 pl-6 sm:pl-0">
                <span className="text-xs font-mono text-muted-foreground">
                  {slackNotifications ? "Connected (#artech-feed)" : "Muted"}
                </span>
                <Switch
                  id="slackNotifications"
                  checked={slackNotifications}
                  onCheckedChange={setSlackNotifications}
                />
              </div>
            </div>

            {/* SMS Alerts for Critical Issues */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:border-border/70">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-amber-400" />
                  <Label htmlFor="smsCriticalAlerts" className="text-sm font-medium text-foreground cursor-pointer">
                    SMS Alerts for Critical Issues
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Urgent SMS dispatch to system administrators for high-severity outages or payment gateway failures.
                </p>
              </div>
              <div className="flex items-center gap-3 pl-6 sm:pl-0">
                <span className="text-xs font-mono text-muted-foreground">
                  {smsCriticalAlerts ? "Active" : "Off"}
                </span>
                <Switch
                  id="smsCriticalAlerts"
                  checked={smsCriticalAlerts}
                  onCheckedChange={setSmsCriticalAlerts}
                />
              </div>
            </div>

            {/* Weekly Digest */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:border-border/70">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <Label htmlFor="weeklyDigest" className="text-sm font-medium text-foreground cursor-pointer">
                    Executive Weekly Digest
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Receive a consolidated Monday morning KPI report summarizing MRR, new leads, and team velocity.
                </p>
              </div>
              <div className="flex items-center gap-3 pl-6 sm:pl-0">
                <span className="text-xs font-mono text-muted-foreground">
                  {weeklyDigest ? "Subscribed" : "Off"}
                </span>
                <Switch
                  id="weeklyDigest"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end border-t border-border/40 bg-muted/10 px-6 py-4">
            <Button
              type="button"
              onClick={handleSaveNotifs}
              disabled={isSavingNotifs}
              className="gap-2 bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {isSavingNotifs ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : notifSaveSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Preferences Saved!
                </>
              ) : (
                "Save Notifications"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* 3. Data & Privacy Card */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-primary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-display text-lg tracking-tight">
                  Data & Privacy Governance
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Configure corporate data retention lifecycle, automated disaster recovery, and regulatory compliance.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Data Retention Period Selector */}
              <div className="space-y-2">
                <Label htmlFor="retention" className="text-xs font-medium text-foreground">
                  Audit & Data Retention Period
                </Label>
                <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                  <SelectTrigger id="retention" className="text-xs">
                    <SelectValue placeholder="Select retention duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days (Rolling Window)</SelectItem>
                    <SelectItem value="90">90 Days (Quarterly Audit)</SelectItem>
                    <SelectItem value="180">180 Days (Half-Year)</SelectItem>
                    <SelectItem value="365">365 Days (1 Year — Recommended)</SelectItem>
                    <SelectItem value="1095">3 Years (Enterprise Compliance)</SelectItem>
                    <SelectItem value="forever">Indefinite (Archive Forever)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Historical leads, interaction timestamps, and ticket history older than this will be archived securely.
                </p>
              </div>

              {/* Auto-backup Schedule Selector */}
              <div className="space-y-2">
                <Label htmlFor="backupSchedule" className="text-xs font-medium text-foreground">
                  Automated Database Snapshot Schedule
                </Label>
                <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                  <SelectTrigger id="backupSchedule" className="text-xs">
                    <SelectValue placeholder="Select snapshot interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Continuous WAL Streaming (Near 0 RPO)</SelectItem>
                    <SelectItem value="hourly">Hourly Differential Snapshots</SelectItem>
                    <SelectItem value="daily">Daily at 00:00 UTC (Standard)</SelectItem>
                    <SelectItem value="weekly">Weekly Full Image Backup</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Encrypted AES-256 snapshots replicated geographically across Frankfurt and Virginia regions.
                </p>
              </div>
            </div>

            {/* GDPR Compliance Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:border-border/70">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <Label htmlFor="gdprCompliance" className="text-sm font-medium text-foreground cursor-pointer">
                    Strict GDPR & CCPA Compliance Mode
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Enforces customer Right-to-be-Forgotten automation, cookie consent registries, and strict IP anonymization on audit trails.
                </p>
              </div>
              <div className="flex items-center gap-3 pl-6 sm:pl-0">
                <span className="text-xs font-mono text-emerald-400">
                  {gdprCompliance ? "Compliant" : "Standard"}
                </span>
                <Switch
                  id="gdprCompliance"
                  checked={gdprCompliance}
                  onCheckedChange={setGdprCompliance}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end border-t border-border/40 bg-muted/10 px-6 py-4">
            <Button
              type="button"
              onClick={handleSaveData}
              disabled={isSavingData}
              className="gap-2 bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {isSavingData ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : dataSaveSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Data Policies Updated!
                </>
              ) : (
                "Save Data Preferences"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* 4. Danger Zone Card */}
        <Card className="border-red-500/40 bg-red-950/10 backdrop-blur-sm shadow-sm">
          <CardHeader className="border-b border-red-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-display text-lg tracking-tight text-red-400">
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Irreversible actions concerning organization workspace tenure and data export.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Export All Data Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/50 bg-card/60 p-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Export All Organization Data</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Download an offline portable JSON archive containing all projects, clients, deals, and audit ledgers.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isExporting}
                className="shrink-0 gap-2 border-border/70 text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Packaging Archive...
                  </>
                ) : exportComplete ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Export Complete
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    Export All Data
                  </>
                )}
              </Button>
            </div>

            {/* Delete Account Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-950/20 p-4">
              <div>
                <h4 className="text-sm font-semibold text-red-400">Delete Organization Account</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Permanently erase the workspace, remove all user credentials, disconnect payment processors, and shred database snapshots.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="shrink-0 gap-2 text-xs font-medium shadow-sm hover:bg-destructive/90 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-red-500/40 bg-card">
                  <AlertDialogHeader>
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="h-5 w-5" />
                      <AlertDialogTitle className="font-display text-lg">
                        Permanently Delete Organization?
                      </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-xs text-muted-foreground space-y-2">
                      <p>
                        This action cannot be undone. This will permanently destroy the
                        <strong className="text-foreground"> ARTech</strong> workspace, wipe all 6 active user accounts, cancel active client subscriptions, and irrevocably purge system configurations.
                      </p>
                      <p className="rounded border border-red-500/30 bg-red-500/10 p-2 text-[11px] text-red-300">
                        Warning: All outstanding customer invoices and contracts will be marked as cancelled immediately.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
                      onClick={() => alert("Deletion request initiated for ARTech workspace.")}
                    >
                      Yes, Delete My Organization
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
