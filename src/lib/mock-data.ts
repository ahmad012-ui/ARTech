// ============================================================
// ARTech SaaS Platform — Mock Data for All Modules
// ============================================================

import type {
  User,
  Lead,
  Contact,
  Interaction,
  Deal,
  Client,
  Subscription,
  Contract,
  Project,
  TimeEntry,
  Ticket,
  KBArticle,
  Invoice,
  Expense,
  KPIMetrics,
  RevenueDataPoint,
  Notification,
  AuditLogEntry,
  Integration,
} from "./types";

// ---- Users ----
export const mockUsers: User[] = [
  { id: "u1", name: "Ahmed Khan", email: "ahmed@artech.dev", role: "admin", department: "Engineering", isActive: true, lastLogin: "2026-10-16T14:00:00Z", createdAt: "2025-01-15" },
  { id: "u2", name: "Sara Chen", email: "sara@artech.dev", role: "manager", department: "Sales", isActive: true, lastLogin: "2026-10-16T10:30:00Z", createdAt: "2025-03-01" },
  { id: "u3", name: "James Miller", email: "james@artech.dev", role: "sales_rep", department: "Sales", isActive: true, lastLogin: "2026-10-16T09:15:00Z", createdAt: "2025-04-12" },
  { id: "u4", name: "Priya Sharma", email: "priya@artech.dev", role: "developer", department: "Engineering", isActive: true, lastLogin: "2026-10-15T18:00:00Z", createdAt: "2025-02-20" },
  { id: "u5", name: "Marcus Johnson", email: "marcus@artech.dev", role: "support_agent", department: "Support", isActive: true, lastLogin: "2026-10-16T12:00:00Z", createdAt: "2025-06-01" },
  { id: "u6", name: "Emily Davis", email: "emily@artech.dev", role: "developer", department: "Engineering", isActive: true, lastLogin: "2026-10-16T11:00:00Z", createdAt: "2025-05-15" },
];

// ---- Leads ----
export const mockLeads: Lead[] = [
  { id: "l1", name: "Alex Rivera", email: "alex@nexusco.com", company: "Nexus Corp", phone: "+1-555-0101", stage: "new", source: "website", score: 45, value: 24000, assignedTo: "u3", tags: ["saas", "enterprise"], notes: "Interested in custom dashboard solution.", createdAt: "2026-10-14", updatedAt: "2026-10-14" },
  { id: "l2", name: "Maria Santos", email: "maria@brightpath.io", company: "BrightPath IO", phone: "+1-555-0102", stage: "contacted", source: "linkedin", score: 62, value: 36000, assignedTo: "u3", tags: ["startup", "api"], notes: "Had initial call, very interested in API integration.", createdAt: "2026-10-10", updatedAt: "2026-10-13" },
  { id: "l3", name: "David Kim", email: "david@orbitlabs.co", company: "Orbit Labs", phone: "+1-555-0103", stage: "demo_scheduled", source: "referral", score: 78, value: 60000, assignedTo: "u2", tags: ["enterprise", "multi-tenant"], notes: "Demo scheduled for Oct 18th. Referred by TechVentures.", createdAt: "2026-10-05", updatedAt: "2026-10-15" },
  { id: "l4", name: "Lisa Thompson", email: "lisa@cloudpeak.io", company: "CloudPeak", phone: "+1-555-0104", stage: "proposal_sent", source: "conference", score: 85, value: 48000, assignedTo: "u2", tags: ["saas", "analytics"], notes: "Proposal sent on Oct 12th. Follow up by Oct 19th.", createdAt: "2026-09-28", updatedAt: "2026-10-12" },
  { id: "l5", name: "Omar Hassan", email: "omar@datastream.ai", company: "DataStream AI", phone: "+1-555-0105", stage: "negotiation", source: "cold_outreach", score: 91, value: 120000, assignedTo: "u2", tags: ["ai", "enterprise", "priority"], notes: "Negotiating contract terms. Legal review pending.", createdAt: "2026-09-15", updatedAt: "2026-10-16" },
  { id: "l6", name: "Rachel Green", email: "rachel@freshfoods.com", company: "FreshFoods Inc", stage: "won", source: "partner", score: 95, value: 72000, assignedTo: "u3", tags: ["ecommerce", "logistics"], notes: "Deal closed! Onboarding starts next week.", createdAt: "2026-08-20", updatedAt: "2026-10-10" },
  { id: "l7", name: "Tom Bradley", email: "tom@silverline.co", company: "Silverline Co", stage: "lost", source: "website", score: 30, value: 18000, assignedTo: "u3", tags: ["smb"], notes: "Lost to competitor. Budget constraints.", createdAt: "2026-09-01", updatedAt: "2026-10-05" },
  { id: "l8", name: "Nina Patel", email: "nina@quantumleap.tech", company: "QuantumLeap Tech", stage: "new", source: "linkedin", score: 55, value: 42000, assignedTo: "u3", tags: ["fintech", "security"], notes: "Inbound inquiry from LinkedIn ad.", createdAt: "2026-10-15", updatedAt: "2026-10-15" },
  { id: "l9", name: "Carlos Mendez", email: "carlos@urbanflow.co", company: "UrbanFlow", stage: "contacted", source: "referral", score: 68, value: 30000, assignedTo: "u2", tags: ["mobility", "api"], notes: "Referred by David Kim. Interested in mobility platform.", createdAt: "2026-10-12", updatedAt: "2026-10-14" },
  { id: "l10", name: "Sophie Turner", email: "sophie@greenwave.eco", company: "GreenWave Eco", stage: "demo_scheduled", source: "conference", score: 72, value: 55000, assignedTo: "u3", tags: ["sustainability", "dashboard"], notes: "Met at GreenTech Summit. Demo on Oct 20th.", createdAt: "2026-10-08", updatedAt: "2026-10-15" },
];

// ---- Contacts ----
export const mockContacts: Contact[] = [
  { id: "c1", firstName: "Alex", lastName: "Rivera", email: "alex@nexusco.com", phone: "+1-555-0101", company: "Nexus Corp", jobTitle: "CTO", type: "lead", tags: ["decision-maker"], lastContactedAt: "2026-10-14", createdAt: "2026-10-14" },
  { id: "c2", firstName: "Maria", lastName: "Santos", email: "maria@brightpath.io", phone: "+1-555-0102", company: "BrightPath IO", jobTitle: "Product Manager", type: "lead", tags: ["technical"], lastContactedAt: "2026-10-13", createdAt: "2026-10-10" },
  { id: "c3", firstName: "David", lastName: "Kim", email: "david@orbitlabs.co", phone: "+1-555-0103", company: "Orbit Labs", jobTitle: "VP Engineering", type: "lead", tags: ["decision-maker", "enterprise"], lastContactedAt: "2026-10-15", createdAt: "2026-10-05" },
  { id: "c4", firstName: "Rachel", lastName: "Green", email: "rachel@freshfoods.com", phone: "+1-555-0106", company: "FreshFoods Inc", jobTitle: "CEO", type: "client", tags: ["vip", "decision-maker"], lastContactedAt: "2026-10-10", createdAt: "2026-08-20" },
  { id: "c5", firstName: "John", lastName: "Watson", email: "john@techventures.io", phone: "+1-555-0107", company: "TechVentures", jobTitle: "Director of IT", type: "client", tags: ["technical", "enterprise"], lastContactedAt: "2026-10-12", createdAt: "2026-03-15" },
  { id: "c6", firstName: "Amanda", lastName: "Lee", email: "amanda@swiftlogic.co", phone: "+1-555-0108", company: "SwiftLogic", jobTitle: "COO", type: "client", tags: ["decision-maker"], lastContactedAt: "2026-10-08", createdAt: "2026-01-20" },
  { id: "c7", firstName: "Kevin", lastName: "Brown", email: "kevin@datapulse.io", phone: "+1-555-0109", company: "DataPulse", jobTitle: "Head of Product", type: "partner", tags: ["partner", "integration"], lastContactedAt: "2026-10-01", createdAt: "2025-11-10" },
  { id: "c8", firstName: "Lisa", lastName: "Thompson", email: "lisa@cloudpeak.io", phone: "+1-555-0104", company: "CloudPeak", jobTitle: "Founder & CEO", type: "lead", tags: ["decision-maker", "analytics"], lastContactedAt: "2026-10-12", createdAt: "2026-09-28" },
];

// ---- Interactions ----
export const mockInteractions: Interaction[] = [
  { id: "i1", contactId: "c3", type: "meeting", subject: "Initial Discovery Call", description: "Discussed their current tech stack and pain points. They need multi-tenant architecture.", date: "2026-10-05", duration: 45, userId: "u2" },
  { id: "i2", contactId: "c3", type: "email", subject: "Follow-up: Technical Requirements", description: "Sent technical requirements document and pricing overview.", date: "2026-10-07", userId: "u2" },
  { id: "i3", contactId: "c3", type: "call", subject: "Demo Scheduling", description: "Confirmed demo for Oct 18th. Will include their full engineering team.", date: "2026-10-15", duration: 15, userId: "u2" },
  { id: "i4", contactId: "c4", type: "meeting", subject: "Onboarding Kickoff", description: "Onboarding session with FreshFoods team. Set up accounts and reviewed timeline.", date: "2026-10-10", duration: 60, userId: "u3" },
  { id: "i5", contactId: "c5", type: "email", subject: "Monthly Check-in", description: "Regular monthly health check. They're happy with the platform performance.", date: "2026-10-12", userId: "u2" },
  { id: "i6", contactId: "c2", type: "call", subject: "Product Demo Follow-up", description: "Quick follow-up call after the demo. They want to see API documentation.", date: "2026-10-13", duration: 20, userId: "u3" },
];

// ---- Deals ----
export const mockDeals: Deal[] = [
  { id: "d1", title: "Orbit Labs Enterprise Platform", company: "Orbit Labs", contactId: "c3", value: 60000, stage: "demo_scheduled", probability: 60, expectedCloseDate: "2026-11-15", assignedTo: "u2", notes: "High-value enterprise deal.", createdAt: "2026-10-05", updatedAt: "2026-10-15" },
  { id: "d2", title: "CloudPeak Analytics Suite", company: "CloudPeak", contactId: "c8", value: 48000, stage: "proposal_sent", probability: 70, expectedCloseDate: "2026-11-01", assignedTo: "u2", notes: "Proposal under review by their team.", createdAt: "2026-09-28", updatedAt: "2026-10-12" },
  { id: "d3", title: "DataStream AI Integration", company: "DataStream AI", contactId: "c1", value: 120000, stage: "negotiation", probability: 85, expectedCloseDate: "2026-10-31", assignedTo: "u2", notes: "Final contract negotiation stage.", createdAt: "2026-09-15", updatedAt: "2026-10-16" },
  { id: "d4", title: "BrightPath API Access", company: "BrightPath IO", contactId: "c2", value: 36000, stage: "contacted", probability: 35, expectedCloseDate: "2026-12-01", assignedTo: "u3", notes: "Exploring API integration possibilities.", createdAt: "2026-10-10", updatedAt: "2026-10-13" },
  { id: "d5", title: "FreshFoods Platform Build", company: "FreshFoods Inc", contactId: "c4", value: 72000, stage: "won", probability: 100, expectedCloseDate: "2026-10-10", assignedTo: "u3", notes: "Closed! Contract signed.", createdAt: "2026-08-20", updatedAt: "2026-10-10" },
];

// ---- Clients ----
export const mockClients: Client[] = [
  { id: "cl1", name: "TechVentures", email: "billing@techventures.io", company: "TechVentures", industry: "Technology", plan: "enterprise", subscriptionStatus: "active", mrr: 4500, userLicenses: 25, healthScore: 92, contactId: "c5", createdAt: "2026-03-15" },
  { id: "cl2", name: "SwiftLogic", email: "admin@swiftlogic.co", company: "SwiftLogic", industry: "Logistics", plan: "professional", subscriptionStatus: "active", mrr: 2800, userLicenses: 15, healthScore: 78, contactId: "c6", createdAt: "2026-01-20" },
  { id: "cl3", name: "FreshFoods Inc", email: "tech@freshfoods.com", company: "FreshFoods Inc", industry: "Food & Beverage", plan: "enterprise", subscriptionStatus: "active", mrr: 6000, userLicenses: 40, healthScore: 95, contactId: "c4", createdAt: "2026-10-10" },
  { id: "cl4", name: "DataPulse", email: "ops@datapulse.io", company: "DataPulse", industry: "Data Analytics", plan: "starter", subscriptionStatus: "trial", mrr: 0, userLicenses: 5, healthScore: 60, contactId: "c7", createdAt: "2026-10-01" },
  { id: "cl5", name: "GreenWave Eco", email: "tech@greenwave.eco", company: "GreenWave Eco", industry: "Sustainability", plan: "professional", subscriptionStatus: "past_due", mrr: 1800, userLicenses: 10, healthScore: 45, contactId: "c1", createdAt: "2026-06-15" },
];

// ---- Subscriptions ----
export const mockSubscriptions: Subscription[] = [
  { id: "s1", clientId: "cl1", plan: "enterprise", status: "active", mrr: 4500, billingCycle: "annual", startDate: "2026-03-15", renewalDate: "2027-03-15", features: ["Unlimited Users", "Priority Support", "Custom Integrations", "SLA 99.9%"] },
  { id: "s2", clientId: "cl2", plan: "professional", status: "active", mrr: 2800, billingCycle: "monthly", startDate: "2026-01-20", renewalDate: "2026-11-20", features: ["Up to 20 Users", "Email Support", "Standard Integrations"] },
  { id: "s3", clientId: "cl3", plan: "enterprise", status: "active", mrr: 6000, billingCycle: "annual", startDate: "2026-10-10", renewalDate: "2027-10-10", features: ["Unlimited Users", "Dedicated Account Manager", "Custom Development", "SLA 99.99%"] },
  { id: "s4", clientId: "cl4", plan: "starter", status: "trial", mrr: 0, billingCycle: "monthly", startDate: "2026-10-01", renewalDate: "2026-10-31", features: ["Up to 5 Users", "Community Support", "Basic Features"] },
  { id: "s5", clientId: "cl5", plan: "professional", status: "past_due", mrr: 1800, billingCycle: "monthly", startDate: "2026-06-15", renewalDate: "2026-10-15", features: ["Up to 15 Users", "Email Support", "Standard Integrations"] },
];

// ---- Contracts ----
export const mockContracts: Contract[] = [
  { id: "ct1", clientId: "cl1", title: "TechVentures Enterprise Agreement", status: "active", startDate: "2026-03-15", endDate: "2027-03-15", value: 54000, slaTerms: "99.9% uptime, 4hr response time", autoRenewal: true },
  { id: "ct2", clientId: "cl2", title: "SwiftLogic Service Contract", status: "expiring_soon", startDate: "2026-01-20", endDate: "2026-11-20", value: 33600, slaTerms: "99.5% uptime, 24hr response time", autoRenewal: false },
  { id: "ct3", clientId: "cl3", title: "FreshFoods Custom Development", status: "active", startDate: "2026-10-10", endDate: "2027-10-10", value: 72000, slaTerms: "99.99% uptime, 1hr response time", autoRenewal: true },
];

// ---- Projects ----
export const mockProjects: Project[] = [
  { id: "p1", name: "FreshFoods E-Commerce Platform", clientId: "cl3", clientName: "FreshFoods Inc", status: "active", progress: 35, startDate: "2026-10-15", endDate: "2027-02-28", budget: 72000, spent: 12400, manager: "u2", team: ["u4", "u6"], description: "Full e-commerce platform with inventory management and delivery tracking.", milestones: [{ id: "m1", title: "Design Approval", dueDate: "2026-10-30", completed: true }, { id: "m2", title: "Frontend MVP", dueDate: "2026-11-30", completed: false }, { id: "m3", title: "Backend Integration", dueDate: "2026-12-31", completed: false }, { id: "m4", title: "UAT & Launch", dueDate: "2027-02-15", completed: false }] },
  { id: "p2", name: "TechVentures Dashboard Redesign", clientId: "cl1", clientName: "TechVentures", status: "active", progress: 68, startDate: "2026-08-01", endDate: "2026-11-30", budget: 35000, spent: 24800, manager: "u2", team: ["u4"], description: "Complete redesign of the analytics dashboard with real-time data streaming.", milestones: [{ id: "m5", title: "Wireframes & UX", dueDate: "2026-08-20", completed: true }, { id: "m6", title: "Component Library", dueDate: "2026-09-15", completed: true }, { id: "m7", title: "Data Integration", dueDate: "2026-10-31", completed: false }, { id: "m8", title: "Launch & Training", dueDate: "2026-11-15", completed: false }] },
  { id: "p3", name: "SwiftLogic API Gateway", clientId: "cl2", clientName: "SwiftLogic", status: "delayed", progress: 45, startDate: "2026-07-01", endDate: "2026-10-15", budget: 28000, spent: 19200, manager: "u1", team: ["u6"], description: "Custom API gateway for logistics operations integration.", milestones: [{ id: "m9", title: "Architecture Design", dueDate: "2026-07-15", completed: true }, { id: "m10", title: "Core API Development", dueDate: "2026-08-30", completed: true }, { id: "m11", title: "Security Audit", dueDate: "2026-09-30", completed: false }, { id: "m12", title: "Production Deploy", dueDate: "2026-10-15", completed: false }] },
  { id: "p4", name: "Internal CRM Build", clientId: "cl1", clientName: "ARTech (Internal)", status: "planning", progress: 10, startDate: "2026-11-01", endDate: "2027-03-31", budget: 0, spent: 0, manager: "u1", team: ["u4", "u6"], description: "Internal CRM system for managing sales pipeline and client relationships.", milestones: [{ id: "m13", title: "Requirements Gathering", dueDate: "2026-11-15", completed: false }, { id: "m14", title: "Phase 1 MVP", dueDate: "2027-01-15", completed: false }] },
  { id: "p5", name: "DataPulse Analytics POC", clientId: "cl4", clientName: "DataPulse", status: "completed", progress: 100, startDate: "2026-09-01", endDate: "2026-09-30", budget: 8000, spent: 7200, manager: "u2", team: ["u4"], description: "Proof of concept for real-time analytics pipeline.", milestones: [{ id: "m15", title: "POC Delivery", dueDate: "2026-09-30", completed: true }] },
];

// ---- Time Entries ----
export const mockTimeEntries: TimeEntry[] = [
  { id: "te1", projectId: "p1", userId: "u4", userName: "Priya Sharma", date: "2026-10-15", hours: 6, description: "Frontend component development - product listing", billable: true, rate: 150 },
  { id: "te2", projectId: "p1", userId: "u6", userName: "Emily Davis", date: "2026-10-15", hours: 4, description: "Database schema design", billable: true, rate: 150 },
  { id: "te3", projectId: "p2", userId: "u4", userName: "Priya Sharma", date: "2026-10-14", hours: 8, description: "Real-time chart components", billable: true, rate: 150 },
  { id: "te4", projectId: "p2", userId: "u4", userName: "Priya Sharma", date: "2026-10-15", hours: 2, description: "Bug fix: data refresh interval", billable: true, rate: 150 },
  { id: "te5", projectId: "p3", userId: "u6", userName: "Emily Davis", date: "2026-10-14", hours: 7, description: "API rate limiting implementation", billable: true, rate: 140 },
  { id: "te6", projectId: "p3", userId: "u6", userName: "Emily Davis", date: "2026-10-15", hours: 5, description: "OAuth2 flow integration", billable: true, rate: 140 },
  { id: "te7", projectId: "p4", userId: "u1", userName: "Ahmed Khan", date: "2026-10-16", hours: 3, description: "Requirements and architecture planning", billable: false, rate: 0 },
];

// ---- Tickets ----
export const mockTickets: Ticket[] = [
  { id: "t1", title: "Dashboard loading slow on mobile", description: "The analytics dashboard takes 8+ seconds to load on mobile devices.", clientId: "cl1", clientName: "TechVentures", category: "bug", priority: "high", status: "in_progress", assignedTo: "u4", assigneeName: "Priya Sharma", slaDeadline: "2026-10-17T14:00:00Z", slaBreach: false, tags: ["performance", "mobile"], createdAt: "2026-10-15T10:00:00Z", updatedAt: "2026-10-16T09:00:00Z" },
  { id: "t2", title: "Add CSV export to reports", description: "Need ability to export financial reports as CSV files.", clientId: "cl2", clientName: "SwiftLogic", category: "feature_request", priority: "medium", status: "open", assignedTo: "u6", assigneeName: "Emily Davis", slaDeadline: "2026-10-20T14:00:00Z", slaBreach: false, tags: ["reports", "export"], createdAt: "2026-10-14T14:00:00Z", updatedAt: "2026-10-14T14:00:00Z" },
  { id: "t3", title: "Payment processing error 502", description: "Intermittent 502 errors when processing payments through Stripe integration.", clientId: "cl3", clientName: "FreshFoods Inc", category: "bug", priority: "critical", status: "in_progress", assignedTo: "u4", assigneeName: "Priya Sharma", slaDeadline: "2026-10-16T18:00:00Z", slaBreach: false, tags: ["payments", "stripe", "critical"], createdAt: "2026-10-16T08:00:00Z", updatedAt: "2026-10-16T12:00:00Z" },
  { id: "t4", title: "SSO setup assistance needed", description: "Help configuring SAML SSO with their Azure AD instance.", clientId: "cl1", clientName: "TechVentures", category: "support", priority: "medium", status: "waiting", assignedTo: "u5", assigneeName: "Marcus Johnson", slaDeadline: "2026-10-18T14:00:00Z", slaBreach: false, tags: ["sso", "azure", "configuration"], createdAt: "2026-10-13T11:00:00Z", updatedAt: "2026-10-15T16:00:00Z" },
  { id: "t5", title: "Invoice discrepancy Q3", description: "Client reports invoice amount doesn't match agreed contract terms for Q3.", clientId: "cl2", clientName: "SwiftLogic", category: "billing", priority: "high", status: "open", assignedTo: "u5", assigneeName: "Marcus Johnson", slaDeadline: "2026-10-17T10:00:00Z", slaBreach: false, tags: ["billing", "invoice"], createdAt: "2026-10-15T09:00:00Z", updatedAt: "2026-10-15T09:00:00Z" },
  { id: "t6", title: "API rate limit increase request", description: "Current rate limit of 1000 req/min is insufficient for their data pipeline.", clientId: "cl4", clientName: "DataPulse", category: "support", priority: "low", status: "resolved", assignedTo: "u5", assigneeName: "Marcus Johnson", slaDeadline: "2026-10-20T14:00:00Z", slaBreach: false, tags: ["api", "rate-limit"], createdAt: "2026-10-10T13:00:00Z", updatedAt: "2026-10-12T10:00:00Z" },
  { id: "t7", title: "Dark mode styling broken", description: "Several UI components have incorrect contrast in dark mode after latest update.", clientId: "cl5", clientName: "GreenWave Eco", category: "bug", priority: "medium", status: "open", assignedTo: "u6", assigneeName: "Emily Davis", slaDeadline: "2026-10-19T14:00:00Z", slaBreach: false, tags: ["ui", "dark-mode"], createdAt: "2026-10-15T15:00:00Z", updatedAt: "2026-10-15T15:00:00Z" },
  { id: "t8", title: "Webhook delivery failures", description: "Webhooks to client endpoint failing with timeout errors since Oct 14th.", clientId: "cl1", clientName: "TechVentures", category: "bug", priority: "high", status: "in_progress", assignedTo: "u4", assigneeName: "Priya Sharma", slaDeadline: "2026-10-16T20:00:00Z", slaBreach: true, tags: ["webhooks", "integration"], createdAt: "2026-10-14T08:00:00Z", updatedAt: "2026-10-16T14:00:00Z" },
];

// ---- Knowledge Base ----
export const mockKBArticles: KBArticle[] = [
  { id: "kb1", title: "Getting Started with ARTech Platform", category: "Onboarding", content: "A comprehensive guide to setting up your ARTech account...", tags: ["getting-started", "setup"], views: 1250, helpful: 89, lastUpdated: "2026-10-01", author: "Ahmed Khan", isPublished: true },
  { id: "kb2", title: "API Authentication Guide", category: "Developer", content: "How to authenticate with the ARTech API using OAuth2...", tags: ["api", "authentication", "oauth2"], views: 890, helpful: 72, lastUpdated: "2026-09-28", author: "Priya Sharma", isPublished: true },
  { id: "kb3", title: "Configuring SSO with SAML", category: "Security", content: "Step-by-step guide to configure SAML-based SSO...", tags: ["sso", "saml", "security"], views: 430, helpful: 45, lastUpdated: "2026-10-05", author: "Marcus Johnson", isPublished: true },
  { id: "kb4", title: "Billing & Subscription FAQ", category: "Billing", content: "Common questions about billing cycles, upgrades, and payment methods...", tags: ["billing", "faq", "payments"], views: 670, helpful: 58, lastUpdated: "2026-09-15", author: "Sara Chen", isPublished: true },
  { id: "kb5", title: "Webhook Integration Guide", category: "Developer", content: "How to set up and manage webhook endpoints...", tags: ["webhooks", "integration", "developer"], views: 320, helpful: 31, lastUpdated: "2026-10-10", author: "Emily Davis", isPublished: true },
  { id: "kb6", title: "Internal: Incident Response Playbook", category: "Internal", content: "Steps for handling P1 and P2 incidents...", tags: ["internal", "incident", "ops"], views: 85, helpful: 12, lastUpdated: "2026-10-12", author: "Ahmed Khan", isPublished: false },
];

// ---- Invoices ----
export const mockInvoices: Invoice[] = [
  { id: "inv1", invoiceNumber: "INV-2026-0042", clientId: "cl1", clientName: "TechVentures", amount: 4500, tax: 450, total: 4950, status: "paid", dueDate: "2026-10-15", issuedDate: "2026-10-01", paidDate: "2026-10-12", items: [{ description: "Enterprise Plan — October 2026", quantity: 1, rate: 4500, amount: 4500 }], paymentMethod: "stripe" },
  { id: "inv2", invoiceNumber: "INV-2026-0043", clientId: "cl2", clientName: "SwiftLogic", amount: 2800, tax: 280, total: 3080, status: "overdue", dueDate: "2026-10-10", issuedDate: "2026-09-25", items: [{ description: "Professional Plan — October 2026", quantity: 1, rate: 2800, amount: 2800 }] },
  { id: "inv3", invoiceNumber: "INV-2026-0044", clientId: "cl3", clientName: "FreshFoods Inc", amount: 18000, tax: 1800, total: 19800, status: "sent", dueDate: "2026-10-31", issuedDate: "2026-10-10", items: [{ description: "Enterprise Plan — Q4 2026", quantity: 1, rate: 18000, amount: 18000 }] },
  { id: "inv4", invoiceNumber: "INV-2026-0045", clientId: "cl1", clientName: "TechVentures", amount: 8500, tax: 850, total: 9350, status: "sent", dueDate: "2026-11-01", issuedDate: "2026-10-15", items: [{ description: "Dashboard Redesign — Milestone 3", quantity: 1, rate: 8500, amount: 8500 }], paymentMethod: "stripe" },
  { id: "inv5", invoiceNumber: "INV-2026-0046", clientId: "cl5", clientName: "GreenWave Eco", amount: 1800, tax: 180, total: 1980, status: "overdue", dueDate: "2026-10-05", issuedDate: "2026-09-20", items: [{ description: "Professional Plan — October 2026", quantity: 1, rate: 1800, amount: 1800 }] },
  { id: "inv6", invoiceNumber: "INV-2026-0047", clientId: "cl3", clientName: "FreshFoods Inc", amount: 12400, tax: 1240, total: 13640, status: "draft", dueDate: "2026-11-15", issuedDate: "2026-10-16", items: [{ description: "E-Commerce Platform — Phase 1 Development", quantity: 80, rate: 150, amount: 12000 }, { description: "Cloud Infrastructure Setup", quantity: 1, rate: 400, amount: 400 }] },
];

// ---- Expenses ----
export const mockExpenses: Expense[] = [
  { id: "e1", category: "Software Licenses", description: "GitHub Enterprise — October", amount: 420, date: "2026-10-01", vendor: "GitHub", status: "approved" },
  { id: "e2", category: "Cloud Infrastructure", description: "AWS — September invoice", amount: 2340, projectId: "p1", date: "2026-10-05", vendor: "Amazon Web Services", status: "approved" },
  { id: "e3", category: "Freelancer", description: "UI/UX Contractor — Dashboard wireframes", amount: 3200, projectId: "p2", date: "2026-10-08", vendor: "Sarah Designs Co", status: "approved" },
  { id: "e4", category: "Software Licenses", description: "Figma Team — October", amount: 135, date: "2026-10-01", vendor: "Figma", status: "approved" },
  { id: "e5", category: "Marketing", description: "LinkedIn Ads — October campaign", amount: 1500, date: "2026-10-10", vendor: "LinkedIn", status: "pending" },
  { id: "e6", category: "Travel", description: "GreenTech Summit — flights + hotel", amount: 1850, date: "2026-10-06", vendor: "Various", status: "approved" },
  { id: "e7", category: "Freelancer", description: "Security audit consultant", amount: 4500, projectId: "p3", date: "2026-10-14", vendor: "SecureCode LLC", status: "pending" },
];

// ---- KPI Metrics ----
export const mockKPIMetrics: KPIMetrics = {
  mrr: 15100,
  mrrGrowth: 12.4,
  arr: 181200,
  arrGrowth: 15.2,
  churnRate: 2.1,
  churnChange: -0.8,
  cac: 1240,
  cacChange: -5.3,
  ltv: 42000,
  ltvChange: 8.7,
  activeDeals: 4,
  winRate: 68,
  monthlyForecast: 22400,
};

// ---- Revenue Data ----
export const mockRevenueData: RevenueDataPoint[] = [
  { month: "Mar", revenue: 8200, expenses: 5400, profit: 2800 },
  { month: "Apr", revenue: 9800, expenses: 6100, profit: 3700 },
  { month: "May", revenue: 10500, expenses: 5800, profit: 4700 },
  { month: "Jun", revenue: 11200, expenses: 7200, profit: 4000 },
  { month: "Jul", revenue: 12800, expenses: 6900, profit: 5900 },
  { month: "Aug", revenue: 13500, expenses: 8100, profit: 5400 },
  { month: "Sep", revenue: 14200, expenses: 7600, profit: 6600 },
  { month: "Oct", revenue: 15100, expenses: 8200, profit: 6900 },
];

// ---- Notifications ----
export const mockNotifications: Notification[] = [
  { id: "n1", type: "ticket", title: "Critical: Payment Processing Error", message: "FreshFoods Inc reports Stripe 502 errors. Ticket #T3 created.", isRead: false, priority: "critical", link: "/dashboard/tickets", createdAt: "2026-10-16T08:05:00Z" },
  { id: "n2", type: "invoice", title: "Overdue Invoice: SwiftLogic", message: "Invoice INV-2026-0043 is 6 days overdue ($3,080).", isRead: false, priority: "high", link: "/dashboard/invoices", createdAt: "2026-10-16T07:00:00Z" },
  { id: "n3", type: "alert", title: "SLA Breach Warning", message: "Ticket #T8 (Webhook failures) approaching SLA deadline.", isRead: false, priority: "high", link: "/dashboard/tickets", createdAt: "2026-10-16T14:00:00Z" },
  { id: "n4", type: "approval", title: "Expense Approval Required", message: "Security audit consultant expense ($4,500) needs approval.", isRead: false, priority: "medium", link: "/dashboard/invoices", createdAt: "2026-10-14T10:00:00Z" },
  { id: "n5", type: "system", title: "Contract Expiring Soon", message: "SwiftLogic contract expires Nov 20, 2026. Auto-renewal is OFF.", isRead: true, priority: "medium", link: "/dashboard/clients", createdAt: "2026-10-12T09:00:00Z" },
  { id: "n6", type: "invoice", title: "Payment Received", message: "TechVentures paid INV-2026-0042 ($4,950) via Stripe.", isRead: true, priority: "low", link: "/dashboard/invoices", createdAt: "2026-10-12T15:30:00Z" },
];

// ---- Audit Log ----
export const mockAuditLog: AuditLogEntry[] = [
  { id: "a1", userId: "u1", userName: "Ahmed Khan", action: "CREATE", resource: "Project", resourceId: "p1", details: "Created project 'FreshFoods E-Commerce Platform'", ipAddress: "192.168.1.10", timestamp: "2026-10-15T09:00:00Z" },
  { id: "a2", userId: "u2", userName: "Sara Chen", action: "UPDATE", resource: "Deal", resourceId: "d3", details: "Updated deal stage to 'Negotiation'", ipAddress: "192.168.1.15", timestamp: "2026-10-16T10:30:00Z" },
  { id: "a3", userId: "u3", userName: "James Miller", action: "CREATE", resource: "Lead", resourceId: "l8", details: "Created new lead 'Nina Patel' from LinkedIn", ipAddress: "192.168.1.20", timestamp: "2026-10-15T14:00:00Z" },
  { id: "a4", userId: "u5", userName: "Marcus Johnson", action: "UPDATE", resource: "Ticket", resourceId: "t6", details: "Resolved ticket 'API rate limit increase request'", ipAddress: "192.168.1.25", timestamp: "2026-10-12T10:00:00Z" },
  { id: "a5", userId: "u1", userName: "Ahmed Khan", action: "UPDATE", resource: "User", resourceId: "u6", details: "Updated role from 'viewer' to 'developer'", ipAddress: "192.168.1.10", timestamp: "2026-10-11T16:00:00Z" },
  { id: "a6", userId: "u2", userName: "Sara Chen", action: "CREATE", resource: "Invoice", resourceId: "inv6", details: "Created draft invoice INV-2026-0047 for FreshFoods Inc", ipAddress: "192.168.1.15", timestamp: "2026-10-16T11:00:00Z" },
  { id: "a7", userId: "u4", userName: "Priya Sharma", action: "LOGIN", resource: "Session", resourceId: "sess-1234", details: "Logged in from Chrome on macOS", ipAddress: "10.0.0.45", timestamp: "2026-10-15T18:00:00Z" },
  { id: "a8", userId: "u1", userName: "Ahmed Khan", action: "EXPORT", resource: "Report", resourceId: "rpt-q3", details: "Exported Q3 financial report as PDF", ipAddress: "192.168.1.10", timestamp: "2026-10-10T09:30:00Z" },
];

// ---- Integrations ----
export const mockIntegrations: Integration[] = [
  { id: "int1", name: "GitHub", icon: "github", category: "Development", description: "Connect repositories and track commits, PRs, and deployments.", isConnected: true, lastSync: "2026-10-16T14:00:00Z" },
  { id: "int2", name: "Slack", icon: "slack", category: "Communication", description: "Send notifications and alerts to Slack channels.", isConnected: true, lastSync: "2026-10-16T14:15:00Z" },
  { id: "int3", name: "Google Workspace", icon: "mail", category: "Productivity", description: "Sync emails, calendar events, and Google Drive documents.", isConnected: true, lastSync: "2026-10-16T12:00:00Z" },
  { id: "int4", name: "Stripe", icon: "credit-card", category: "Payments", description: "Process payments and manage subscription billing.", isConnected: true, lastSync: "2026-10-16T13:00:00Z" },
  { id: "int5", name: "Jira", icon: "kanban", category: "Project Management", description: "Sync issues, sprints, and project boards.", isConnected: false },
  { id: "int6", name: "Mailchimp", icon: "mail", category: "Marketing", description: "Manage email campaigns and marketing automations.", isConnected: false },
  { id: "int7", name: "PayPal", icon: "wallet", category: "Payments", description: "Accept PayPal payments and manage transactions.", isConnected: false },
  { id: "int8", name: "Microsoft Teams", icon: "message-square", category: "Communication", description: "Send notifications and collaborate through Teams.", isConnected: false },
];

// ---- Pipeline Summary (for charts) ----
export const pipelineSummary = {
  stages: [
    { name: "New", count: 2, value: 66000 },
    { name: "Contacted", count: 2, value: 66000 },
    { name: "Demo", count: 2, value: 115000 },
    { name: "Proposal", count: 1, value: 48000 },
    { name: "Negotiation", count: 1, value: 120000 },
    { name: "Won", count: 1, value: 72000 },
    { name: "Lost", count: 1, value: 18000 },
  ],
};

// ---- Project Status Summary ----
export const projectStatusSummary = {
  active: mockProjects.filter((p) => p.status === "active").length,
  completed: mockProjects.filter((p) => p.status === "completed").length,
  delayed: mockProjects.filter((p) => p.status === "delayed").length,
  planning: mockProjects.filter((p) => p.status === "planning").length,
};
