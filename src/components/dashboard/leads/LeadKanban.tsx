import React from "react";
import type { Lead, LeadSource, LeadStage } from "@/lib/types";
import {
  CRM_STAGES,
  STAGE_CONFIG,
  formatCurrency,
  getUser,
  getUserInitials,
  getScoreBadgeClass,
  SOURCE_LABELS,
} from "@/lib/crm-utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Globe,
  UserCheck,
  Share2,
  Mail,
  Users as UsersIcon,
  Handshake,
  DollarSign,
  Sparkles,
} from "lucide-react";

interface LeadKanbanProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
  onStageChange?: (leadId: string, newStage: LeadStage) => void;
}

export function LeadSourceIcon({
  source,
  className = "h-3.5 w-3.5",
}: {
  source: LeadSource;
  className?: string;
}) {
  switch (source) {
    case "website":
      return <Globe className={className} title="Website" />;
    case "referral":
      return <UserCheck className={className} title="Referral" />;
    case "linkedin":
      return <Share2 className={className} title="LinkedIn" />;
    case "cold_outreach":
      return <Mail className={className} title="Cold Outreach" />;
    case "conference":
      return <UsersIcon className={className} title="Conference" />;
    case "partner":
      return <Handshake className={className} title="Partner" />;
    default:
      return <Globe className={className} title="Web" />;
  }
}

export function LeadKanban({ leads, onSelectLead, onStageChange }: LeadKanbanProps) {
  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <div className="grid grid-flow-col auto-cols-[300px] gap-4 min-w-[2140px] px-1">
        {CRM_STAGES.map((stage) => {
          const stageConfig = STAGE_CONFIG[stage.id];
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const stageTotal = stageLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-xl border border-border/50 bg-card/25 backdrop-blur-sm p-3 min-h-[650px]"
            >
              {/* Column Header */}
              <div className="flex flex-col gap-1 pb-3 mb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${stageConfig.dotClass}`} />
                    <span className="font-display text-sm font-semibold text-foreground tracking-tight">
                      {stageConfig.label}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="h-5 px-2 text-[11px] font-mono bg-muted/80 text-muted-foreground"
                  >
                    {stageLeads.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>Total Value</span>
                  <span className="font-mono font-medium text-foreground/90">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>
              </div>

              {/* Cards List */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {stageLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-xs text-muted-foreground/60 border border-dashed border-border/40 rounded-lg">
                    <span>No leads in {stageConfig.label}</span>
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const assignedUser = getUser(lead.assignedTo);
                    const initials = getUserInitials(lead.assignedTo);
                    const scoreClass = getScoreBadgeClass(lead.score);

                    return (
                      <Card
                        key={lead.id}
                        onClick={() => onSelectLead?.(lead)}
                        className="group relative p-3.5 border-border/60 bg-card/70 hover:bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
                      >
                        {/* Top Row: Name and Score */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                              {lead.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {lead.company}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold border ${scoreClass}`}
                            title={`Lead Score: ${lead.score}/100`}
                          >
                            <Sparkles className="h-2.5 w-2.5 opacity-80" />
                            <span>{lead.score}</span>
                          </div>
                        </div>

                        {/* Value Row */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm font-semibold font-mono text-foreground">
                            <DollarSign className="h-3.5 w-3.5 text-primary opacity-80" />
                            <span>{lead.value.toLocaleString()}</span>
                          </div>
                          <div
                            className="flex items-center gap-1 text-[11px] text-muted-foreground/80 bg-muted/40 px-2 py-0.5 rounded-md"
                            title={`Source: ${SOURCE_LABELS[lead.source] || lead.source}`}
                          >
                            <LeadSourceIcon source={lead.source} className="h-3 w-3 text-muted-foreground" />
                            <span className="capitalize">{SOURCE_LABELS[lead.source] || lead.source}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {lead.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-muted/50 text-muted-foreground/90 font-mono"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer: Assigned User & Stage indicator */}
                        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-border/50">
                              <AvatarFallback className="text-[10px] font-medium bg-primary/20 text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">
                              {assignedUser ? assignedUser.name.split(" ")[0] : "Unassigned"}
                            </span>
                          </div>

                          <span className="text-[10px] text-muted-foreground/60 font-mono">
                            {lead.createdAt}
                          </span>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
