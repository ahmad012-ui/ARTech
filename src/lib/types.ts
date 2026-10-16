// ============================================================
// ARTech SaaS Platform — Core Type Definitions
// ============================================================

// ---- Enums & Shared ----

export type Priority = "low" | "medium" | "high" | "critical";
export type Currency = "USD" | "EUR" | "GBP" | "PKR";

// ---- Auth & Users ----

export type UserRole =
  | "admin"
  | "manager"
  | "sales_rep"
  | "developer"
  | "support_agent"
  | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

// ---- Leads & CRM ----

export type LeadStage =
  | "new"
  | "contacted"
  | "demo_scheduled"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export type LeadSource =
  | "website"
  | "referral"
  | "linkedin"
  | "cold_outreach"
  | "conference"
  | "partner";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  stage: LeadStage;
  source: LeadSource;
  score: number; // 0-100
  value: number;
  assignedTo: string; // User ID
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  avatar?: string;
  type: "lead" | "client" | "partner" | "vendor";
  tags: string[];
  lastContactedAt: string;
  createdAt: string;
}

export interface Interaction {
  id: string;
  contactId: string;
  type: "email" | "call" | "meeting" | "note" | "task";
  subject: string;
  description: string;
  date: string;
  duration?: number; // minutes
  userId: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  contactId: string;
  value: number;
  stage: LeadStage;
  probability: number; // 0-100
  expectedCloseDate: string;
  assignedTo: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Clients & Subscriptions ----

export type SubscriptionPlan =
  | "starter"
  | "professional"
  | "enterprise"
  | "custom";
export type SubscriptionStatus =
  | "active"
  | "trial"
  | "past_due"
  | "cancelled"
  | "paused";
export type ContractStatus = "active" | "expiring_soon" | "expired" | "renewed";

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  logo?: string;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  mrr: number;
  userLicenses: number;
  healthScore: number; // 0-100
  contactId: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  clientId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  mrr: number;
  billingCycle: "monthly" | "annual";
  startDate: string;
  renewalDate: string;
  features: string[];
}

export interface Contract {
  id: string;
  clientId: string;
  title: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  value: number;
  slaTerms: string;
  autoRenewal: boolean;
}

// ---- Projects ----

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "delayed";

export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  manager: string;
  team: string[];
  description: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  rate: number;
}

// ---- Support & Tickets ----

export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type TicketCategory = "bug" | "feature_request" | "support" | "billing" | "other";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  category: TicketCategory;
  priority: Priority;
  status: TicketStatus;
  assignedTo: string;
  assigneeName: string;
  slaDeadline: string;
  slaBreach: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  views: number;
  helpful: number;
  lastUpdated: string;
  author: string;
  isPublished: boolean;
}

// ---- Financials & Invoices ----

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type PaymentMethod = "stripe" | "paypal" | "bank_transfer" | "check";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  paymentMethod?: PaymentMethod;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  projectId?: string;
  date: string;
  vendor: string;
  status: "pending" | "approved" | "rejected";
}

// ---- Dashboard & KPIs ----

export interface KPIMetrics {
  mrr: number;
  mrrGrowth: number;
  arr: number;
  arrGrowth: number;
  churnRate: number;
  churnChange: number;
  cac: number;
  cacChange: number;
  ltv: number;
  ltvChange: number;
  activeDeals: number;
  winRate: number;
  monthlyForecast: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface Notification {
  id: string;
  type: "alert" | "approval" | "ticket" | "invoice" | "system";
  title: string;
  message: string;
  isRead: boolean;
  priority: Priority;
  link?: string;
  createdAt: string;
}

// ---- Audit & Settings ----

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  isConnected: boolean;
  lastSync?: string;
}
