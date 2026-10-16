import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { mockContacts, mockInteractions, mockUsers } from "@/lib/mock-data";
import type { Contact, Interaction } from "@/lib/types";
import {
  formatDate,
  getUserInitials,
  getContactTypeBadgeClass,
} from "@/lib/crm-utils";
import { ContactTable } from "@/components/dashboard/contacts/ContactTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  X,
  Users,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  PhoneCall,
  Video,
  FileText,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/contacts/")({
  component: ContactsPage,
});

function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Dialogs
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // New Contact Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    type: "lead" as Contact["type"],
    tags: "decision-maker",
  });

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
        const matchesName = fullName.includes(query);
        const matchesCompany = contact.company.toLowerCase().includes(query);
        const matchesTitle = contact.jobTitle.toLowerCase().includes(query);
        const matchesEmail = contact.email.toLowerCase().includes(query);
        const matchesTags = contact.tags?.some((t) => t.toLowerCase().includes(query));

        if (!matchesName && !matchesCompany && !matchesTitle && !matchesEmail && !matchesTags) {
          return false;
        }
      }

      if (selectedType !== "all" && contact.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [contacts, searchQuery, selectedType]);

  // KPIs
  const typeCounts = useMemo(() => {
    return {
      total: contacts.length,
      lead: contacts.filter((c) => c.type === "lead").length,
      client: contacts.filter((c) => c.type === "client").length,
      partner: contacts.filter((c) => c.type === "partner").length,
      vendor: contacts.filter((c) => c.type === "vendor").length,
    };
  }, [contacts]);

  // Selected contact's interactions
  const contactInteractions = useMemo(() => {
    if (!selectedContact) return [];
    return mockInteractions.filter((i) => i.contactId === selectedContact.id);
  }, [selectedContact]);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) return;

    const newContact: Contact = {
      id: `c${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || "+1-555-0100",
      company: formData.company,
      jobTitle: formData.jobTitle || "Business Contact",
      type: formData.type,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      lastContactedAt: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    };

    setContacts([newContact, ...contacts]);
    setIsAddContactOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      type: "lead",
      tags: "decision-maker",
    });
  };

  const getInteractionIcon = (type: Interaction["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-3.5 w-3.5 text-blue-400" />;
      case "call":
        return <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />;
      case "meeting":
        return <Video className="h-3.5 w-3.5 text-purple-400" />;
      case "note":
        return <FileText className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Contacts Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your network of key leads, enterprise clients, ecosystem partners, and vendors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-7 px-3 text-xs gap-1.5 cursor-pointer"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-7 px-3 text-xs gap-1.5 cursor-pointer"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table</span>
            </Button>
          </div>

          {/* Add Contact Button */}
          <Button
            onClick={() => setIsAddContactOpen(true)}
            size="sm"
            className="h-9 px-4 text-xs font-medium gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Contact</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          onClick={() => setSelectedType("all")}
          className={`cursor-pointer rounded-xl border p-4 backdrop-blur-sm transition-all ${
            selectedType === "all"
              ? "border-primary/50 bg-primary/10 shadow-sm"
              : "border-border/60 bg-card/40 hover:bg-card/70"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">All Contacts</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {typeCounts.total}
          </p>
        </div>

        <div
          onClick={() => setSelectedType("client")}
          className={`cursor-pointer rounded-xl border p-4 backdrop-blur-sm transition-all ${
            selectedType === "client"
              ? "border-emerald-500/50 bg-emerald-500/10 shadow-sm"
              : "border-border/60 bg-card/40 hover:bg-card/70"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Clients</span>
            <Building2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-400">
            {typeCounts.client}
          </p>
        </div>

        <div
          onClick={() => setSelectedType("lead")}
          className={`cursor-pointer rounded-xl border p-4 backdrop-blur-sm transition-all ${
            selectedType === "lead"
              ? "border-blue-500/50 bg-blue-500/10 shadow-sm"
              : "border-border/60 bg-card/40 hover:bg-card/70"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Leads</span>
            <UserCheck className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-blue-400">
            {typeCounts.lead}
          </p>
        </div>

        <div
          onClick={() => setSelectedType("partner")}
          className={`cursor-pointer rounded-xl border p-4 backdrop-blur-sm transition-all ${
            selectedType === "partner"
              ? "border-purple-500/50 bg-purple-500/10 shadow-sm"
              : "border-border/60 bg-card/40 hover:bg-card/70"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Partners & Vendors</span>
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-purple-400">
            {typeCounts.partner + typeCounts.vendor}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, job title, email, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 bg-background/50 border-border/60 text-sm focus-visible:bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-9 w-[160px] bg-background/50 border-border/60 text-xs">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="partner">Partners</SelectItem>
              <SelectItem value="vendor">Vendors</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery !== "" || selectedType !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Content: Grid or Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContacts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border/60 rounded-xl bg-card/20">
              <Users className="mx-auto h-8 w-8 opacity-40 mb-2" />
              <p className="text-sm font-medium">No contacts match your criteria</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try clearing search terms or selecting another type
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const fullName = `${contact.firstName} ${contact.lastName}`;
              const initials = getUserInitials(fullName);
              const typeClass = getContactTypeBadgeClass(contact.type);

              return (
                <Card
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="group relative flex flex-col justify-between p-5 border-border/60 bg-card/50 hover:bg-card/85 hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
                >
                  <div>
                    {/* Header: Avatar, Name, Type */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border border-border/60">
                          <AvatarFallback className="text-sm font-bold bg-primary/20 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {fullName}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {contact.jobTitle}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium capitalize border px-2 py-0.5 ${typeClass}`}
                      >
                        {contact.type}
                      </Badge>
                    </div>

                    {/* Company */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-foreground/80 font-medium">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{contact.company}</span>
                    </div>

                    {/* Contact Details */}
                    <div className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span className="font-mono truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span className="font-mono">{contact.phone}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {contact.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-muted/60 text-muted-foreground/90 font-mono px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer: Last Contacted */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 opacity-60" />
                      <span>{formatDate(contact.lastContactedAt)}</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      View Profile &rarr;
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <ContactTable contacts={filteredContacts} onSelectContact={setSelectedContact} />
      )}

      {/* Add Contact Dialog */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent className="max-w-md border-border/80 bg-background text-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add Contact</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add an individual contact to your directory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateContact} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">First Name *</label>
                <Input
                  required
                  placeholder="e.g. Jane"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Last Name *</label>
                <Input
                  required
                  placeholder="e.g. Miller"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Company *</label>
                <Input
                  required
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Job Title</label>
                <Input
                  placeholder="e.g. Head of Engineering"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Email Address *</label>
              <Input
                type="email"
                required
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-8 text-xs bg-muted/30 border-border/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Phone</label>
                <Input
                  placeholder="+1-555-0100"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-8 text-xs bg-muted/30 border-border/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Contact Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({ ...formData, type: val as Contact["type"] })}
                >
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Tags (comma separated)</label>
              <Input
                placeholder="vip, decision-maker, technical"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="h-8 text-xs bg-muted/30 border-border/60"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddContactOpen(false)}
                className="h-8 text-xs cursor-pointer border-border/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Profile & Interaction History Dialog */}
      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
          <DialogContent className="max-w-xl border-border/80 bg-background text-foreground shadow-2xl">
            <DialogHeader>
              <div className="flex items-start justify-between pr-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-border/60">
                    <AvatarFallback className="text-base font-bold bg-primary/20 text-primary">
                      {getUserInitials(`${selectedContact.firstName} ${selectedContact.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="font-display text-xl font-bold">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      {selectedContact.jobTitle} at {selectedContact.company}
                    </DialogDescription>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs font-medium capitalize border px-2.5 py-0.5 ${getContactTypeBadgeClass(
                    selectedContact.type
                  )}`}
                >
                  {selectedContact.type}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-3">
              {/* Contact Information Box */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/50 bg-card/30 p-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Email Address</span>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="block font-mono text-foreground hover:text-primary hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Phone Number</span>
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="block font-mono text-foreground hover:text-primary"
                  >
                    {selectedContact.phone}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Company</span>
                  <p className="font-medium text-foreground">{selectedContact.company}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Last Contacted</span>
                  <p className="font-mono text-foreground">
                    {formatDate(selectedContact.lastContactedAt)}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedContact.tags && selectedContact.tags.length > 0 && (
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Segment Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContact.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 text-muted-foreground"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Interaction History */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Interaction History
                  </h4>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {contactInteractions.length} recorded
                  </span>
                </div>

                {contactInteractions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                    <Clock className="mx-auto h-5 w-5 opacity-40 mb-1" />
                    <span>No interaction records logged for this contact yet.</span>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {contactInteractions.map((item) => {
                      const user = mockUsers.find((u) => u.id === item.userId);
                      return (
                        <div
                          key={item.id}
                          className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              {getInteractionIcon(item.type)}
                              <span>{item.subject}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {formatDate(item.date)}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            {item.description}
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground/70">
                            <span>Logged by: {user ? user.name : "Sales Team"}</span>
                            {item.duration && <span>{item.duration} mins</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedContact(null)}
                className="h-8 text-xs cursor-pointer border-border/60"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
