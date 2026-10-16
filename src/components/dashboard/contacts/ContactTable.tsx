import React, { useState } from "react";
import type { Contact } from "@/lib/types";
import {
  formatDate,
  getUserInitials,
  getContactTypeBadgeClass,
} from "@/lib/crm-utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  Eye,
  ExternalLink,
} from "lucide-react";

interface ContactTableProps {
  contacts: Contact[];
  onSelectContact?: (contact: Contact) => void;
}

type SortField = "name" | "company" | "jobTitle" | "type" | "lastContactedAt";

export function ContactTable({ contacts, onSelectContact }: ContactTableProps) {
  const [sortField, setSortField] = useState<SortField>("lastContactedAt");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name": {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        comparison = nameA.localeCompare(nameB);
        break;
      }
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
      case "jobTitle":
        comparison = a.jobTitle.localeCompare(b.jobTitle);
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      case "lastContactedAt":
        comparison =
          new Date(a.lastContactedAt).getTime() - new Date(b.lastContactedAt).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortAsc ? comparison : -comparison;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortAsc ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-primary" />
    );
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                <span>Contact Name</span>
                {renderSortIcon("name")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group"
              onClick={() => handleSort("company")}
            >
              <div className="flex items-center">
                <span>Company</span>
                {renderSortIcon("company")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group"
              onClick={() => handleSort("jobTitle")}
            >
              <div className="flex items-center">
                <span>Job Title</span>
                {renderSortIcon("jobTitle")}
              </div>
            </TableHead>
            <TableHead className="font-medium text-xs text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="font-medium text-xs text-muted-foreground">
              Phone
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group"
              onClick={() => handleSort("type")}
            >
              <div className="flex items-center">
                <span>Type</span>
                {renderSortIcon("type")}
              </div>
            </TableHead>
            <TableHead className="font-medium text-xs text-muted-foreground">
              Tags
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group text-right"
              onClick={() => handleSort("lastContactedAt")}
            >
              <div className="flex items-center justify-end">
                <span>Last Contacted</span>
                {renderSortIcon("lastContactedAt")}
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-right font-medium text-xs text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedContacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-36 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <p className="text-sm font-medium">No contacts match your query</p>
                  <p className="text-xs text-muted-foreground/70">
                    Try clearing filters or search keywords
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedContacts.map((contact) => {
              const fullName = `${contact.firstName} ${contact.lastName}`;
              const initials = getUserInitials(fullName);
              const typeBadgeClass = getContactTypeBadgeClass(contact.type);

              return (
                <TableRow
                  key={contact.id}
                  onClick={() => onSelectContact?.(contact)}
                  className="cursor-pointer border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  {/* Avatar + Name */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 border border-border/50">
                        <AvatarFallback className="text-xs font-semibold bg-primary/20 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {fullName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="text-sm text-foreground/90 font-medium py-3.5">
                    {contact.company}
                  </TableCell>

                  {/* Job Title */}
                  <TableCell className="text-xs text-muted-foreground py-3.5">
                    {contact.jobTitle}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-xs font-mono text-muted-foreground py-3.5">
                    <a
                      href={`mailto:${contact.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-primary hover:underline flex items-center gap-1.5"
                    >
                      <Mail className="h-3 w-3 opacity-70" />
                      <span>{contact.email}</span>
                    </a>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="text-xs font-mono text-muted-foreground py-3.5">
                    <a
                      href={`tel:${contact.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-primary flex items-center gap-1.5"
                    >
                      <Phone className="h-3 w-3 opacity-70" />
                      <span>{contact.phone}</span>
                    </a>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium capitalize px-2 py-0.5 border ${typeBadgeClass}`}
                    >
                      {contact.type}
                    </Badge>
                  </TableCell>

                  {/* Tags */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-muted/60 text-muted-foreground font-mono px-1.5 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  {/* Last Contacted */}
                  <TableCell className="text-right text-xs text-muted-foreground font-mono py-3.5">
                    {formatDate(contact.lastContactedAt)}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="text-right py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => onSelectContact?.(contact)}
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
