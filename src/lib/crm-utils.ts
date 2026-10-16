import type { LeadStage, LeadSource, Contact, User } from "./types";
import { mockUsers } from "./mock-data";

export const CRM_STAGES: { id: LeadStage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "demo_scheduled", label: "Demo Scheduled" },
  { id: "proposal_sent", label: "Proposal Sent" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export const STAGE_CONFIG: Record<
  LeadStage,
  { label: string; badgeClass: string; dotClass: string; borderClass: string }
> = {
  new: {
    label: "New",
    badgeClass: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    dotClass: "bg-slate-400",
    borderClass: "border-t-slate-500/50",
  },
  contacted: {
    label: "Contacted",
    badgeClass: "border-blue-500/30 bg-blue-500/15 text-blue-400",
    dotClass: "bg-blue-400",
    borderClass: "border-t-blue-500/50",
  },
  demo_scheduled: {
    label: "Demo Scheduled",
    badgeClass: "border-purple-500/30 bg-purple-500/15 text-purple-400",
    dotClass: "bg-purple-400",
    borderClass: "border-t-purple-500/50",
  },
  proposal_sent: {
    label: "Proposal Sent",
    badgeClass: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    dotClass: "bg-amber-400",
    borderClass: "border-t-amber-500/50",
  },
  negotiation: {
    label: "Negotiation",
    badgeClass: "border-orange-500/30 bg-orange-500/15 text-orange-400",
    dotClass: "bg-orange-400",
    borderClass: "border-t-orange-500/50",
  },
  won: {
    label: "Won",
    badgeClass: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    dotClass: "bg-emerald-400",
    borderClass: "border-t-emerald-500/50",
  },
  lost: {
    label: "Lost",
    badgeClass: "border-rose-500/30 bg-rose-500/15 text-rose-400",
    dotClass: "bg-rose-400",
    borderClass: "border-t-rose-500/50",
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getUser(userId: string): User | undefined {
  return mockUsers.find((u) => u.id === userId);
}

export function getUserInitials(userIdOrName: string): string {
  const user = mockUsers.find((u) => u.id === userIdOrName);
  const name = user ? user.name : userIdOrName;
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getScoreBadgeClass(score: number): string {
  if (score <= 40) {
    return "border-rose-500/30 bg-rose-500/15 text-rose-400";
  }
  if (score <= 70) {
    return "border-amber-500/30 bg-amber-500/15 text-amber-400";
  }
  return "border-emerald-500/30 bg-emerald-500/15 text-emerald-400";
}

export function getContactTypeBadgeClass(type: Contact["type"]): string {
  switch (type) {
    case "lead":
      return "border-blue-500/30 bg-blue-500/15 text-blue-400";
    case "client":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-400";
    case "partner":
      return "border-purple-500/30 bg-purple-500/15 text-purple-400";
    case "vendor":
      return "border-orange-500/30 bg-orange-500/15 text-orange-400";
    default:
      return "border-border bg-secondary text-secondary-foreground";
  }
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  linkedin: "LinkedIn",
  cold_outreach: "Cold Outreach",
  conference: "Conference",
  partner: "Partner",
};
