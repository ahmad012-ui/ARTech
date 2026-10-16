import React, { useState } from "react";
import type { Lead, LeadStage } from "@/lib/types";
import {
  STAGE_CONFIG,
  formatCurrency,
  formatDate,
  getUser,
  getUserInitials,
  getScoreBadgeClass,
  SOURCE_LABELS,
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
import { ArrowUpDown, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { LeadSourceIcon } from "./LeadKanban";

interface LeadTableProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
}

type SortField = "name" | "company" | "stage" | "score" | "value" | "source" | "assignedTo" | "createdAt";

export function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
      case "stage":
        comparison = a.stage.localeCompare(b.stage);
        break;
      case "score":
        comparison = a.score - b.score;
        break;
      case "value":
        comparison = a.value - b.value;
        break;
      case "source":
        comparison = a.source.localeCompare(b.source);
        break;
      case "assignedTo": {
        const userA = getUser(a.assignedTo)?.name || "";
        const userB = getUser(b.assignedTo)?.name || "";
        comparison = userA.localeCompare(userB);
        break;
      }
      case "createdAt":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortAsc ? comparison : -comparison;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />;
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
                <span>Name</span>
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
              onClick={() => handleSort("stage")}
            >
              <div className="flex items-center">
                <span>Stage</span>
                {renderSortIcon("stage")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group"
              onClick={() => handleSort("score")}
            >
              <div className="flex items-center">
                <span>Score</span>
                {renderSortIcon("score")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group text-right"
              onClick={() => handleSort("value")}
            >
              <div className="flex items-center justify-end">
                <span>Value</span>
                {renderSortIcon("value")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group"
              onClick={() => handleSort("source")}
            >
              <div className="flex items-center">
                <span>Source</span>
                {renderSortIcon("source")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group"
              onClick={() => handleSort("assignedTo")}
            >
              <div className="flex items-center">
                <span>Assigned To</span>
                {renderSortIcon("assignedTo")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none font-medium text-xs text-muted-foreground group text-right"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center justify-end">
                <span>Created Date</span>
                {renderSortIcon("createdAt")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedLeads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-36 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <p className="text-sm font-medium">No leads found</p>
                  <p className="text-xs text-muted-foreground/70">
                    Try adjusting your filters or search keywords
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedLeads.map((lead) => {
              const assignedUser = getUser(lead.assignedTo);
              const initials = getUserInitials(lead.assignedTo);
              const stageConfig = STAGE_CONFIG[lead.stage];
              const scoreClass = getScoreBadgeClass(lead.score);

              return (
                <TableRow
                  key={lead.id}
                  onClick={() => onSelectLead?.(lead)}
                  className="cursor-pointer border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  {/* Name */}
                  <TableCell className="font-medium py-3.5">
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors font-semibold">
                        {lead.name}
                      </span>
                      <span className="text-xs text-muted-foreground/80 font-mono">
                        {lead.email}
                      </span>
                    </div>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="text-sm text-foreground/90 py-3.5">
                    {lead.company}
                  </TableCell>

                  {/* Stage */}
                  <TableCell className="py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium border px-2.5 py-0.5 ${stageConfig.badgeClass}`}
                    >
                      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${stageConfig.dotClass}`} />
                      {stageConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Score */}
                  <TableCell className="py-3.5">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold border ${scoreClass}`}
                    >
                      <Sparkles className="h-3 w-3 opacity-80" />
                      <span>{lead.score}</span>
                    </div>
                  </TableCell>

                  {/* Value */}
                  <TableCell className="text-right py-3.5 font-mono font-semibold text-sm text-foreground">
                    {formatCurrency(lead.value)}
                  </TableCell>

                  {/* Source */}
                  <TableCell className="py-3.5">
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md">
                      <LeadSourceIcon source={lead.source} className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{SOURCE_LABELS[lead.source] || lead.source}</span>
                    </div>
                  </TableCell>

                  {/* Assigned To */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-border/50">
                        <AvatarFallback className="text-[10px] font-medium bg-primary/20 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground font-medium">
                        {assignedUser ? assignedUser.name : "Unassigned"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-right text-xs text-muted-foreground font-mono py-3.5">
                    {formatDate(lead.createdAt)}
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
