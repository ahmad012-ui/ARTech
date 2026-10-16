import React from "react";
import type { Deal, LeadStage } from "@/lib/types";
import {
  CRM_STAGES,
  STAGE_CONFIG,
  formatCurrency,
  formatDate,
  getUser,
  getUserInitials,
} from "@/lib/crm-utils";
import { mockContacts } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
  User,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface DealPipelineProps {
  deals: Deal[];
  onSelectDeal?: (deal: Deal) => void;
  onMoveStage?: (dealId: string, nextStage: LeadStage) => void;
}

export function DealPipeline({ deals, onSelectDeal, onMoveStage }: DealPipelineProps) {
  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <div className="grid grid-flow-col auto-cols-[310px] gap-4 min-w-[2210px] px-1">
        {CRM_STAGES.map((stage) => {
          const stageConfig = STAGE_CONFIG[stage.id];
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
          const stageWeighted = stageDeals.reduce(
            (sum, d) => sum + ((d.value || 0) * (d.probability || 0)) / 100,
            0
          );

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-xl border border-border/50 bg-card/25 backdrop-blur-sm p-3.5 min-h-[660px]"
            >
              {/* Column Header */}
              <div className="flex flex-col gap-2 pb-3 mb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${stageConfig.dotClass}`} />
                    <span className="font-display text-sm font-semibold text-foreground tracking-tight">
                      {stageConfig.label}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`h-5 px-2 text-[10px] font-mono border ${stageConfig.badgeClass}`}
                  >
                    {stageDeals.length}
                  </Badge>
                </div>

                {/* Values Header */}
                <div className="rounded-lg bg-muted/30 p-2 text-xs space-y-1">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Total Value</span>
                    <span className="font-mono font-semibold text-foreground">
                      {formatCurrency(stageTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground/80">
                    <span>Weighted Forecast</span>
                    <span className="font-mono text-emerald-400/90 font-medium">
                      {formatCurrency(stageWeighted)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deal Cards */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {stageDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-14 text-center text-xs text-muted-foreground/50 border border-dashed border-border/40 rounded-lg">
                    <span>No active deals</span>
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const assignedUser = getUser(deal.assignedTo);
                    const initials = getUserInitials(deal.assignedTo);
                    const contact = mockContacts.find((c) => c.id === deal.contactId);
                    const weightedValue = (deal.value * deal.probability) / 100;

                    return (
                      <Card
                        key={deal.id}
                        onClick={() => onSelectDeal?.(deal)}
                        className="group relative p-4 border-border/60 bg-card/75 hover:bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
                      >
                        {/* Title and Company */}
                        <div>
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                            {deal.title}
                          </h4>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {deal.company}
                          </p>
                        </div>

                        {/* Value & Probability */}
                        <div className="mt-3.5 rounded-lg border border-border/40 bg-muted/20 p-2.5">
                          <div className="flex items-baseline justify-between">
                            <span className="font-mono text-base font-bold text-foreground">
                              {formatCurrency(deal.value)}
                            </span>
                            <span className="font-mono text-xs font-semibold text-primary">
                              {deal.probability}% win
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                deal.stage === "won"
                                  ? "bg-emerald-400"
                                  : deal.stage === "lost"
                                    ? "bg-rose-400"
                                    : "bg-primary"
                              }`}
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>

                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                            <span>Weighted:</span>
                            <span className="text-emerald-400 font-medium">
                              {formatCurrency(weightedValue)}
                            </span>
                          </div>
                        </div>

                        {/* Close Date & Contact */}
                        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 opacity-70" />
                            <span>Close: {formatDate(deal.expectedCloseDate)}</span>
                          </div>
                          {contact && (
                            <div className="flex items-center gap-1.5 text-[11px] truncate">
                              <User className="h-3 w-3 opacity-60 shrink-0" />
                              <span className="truncate">
                                Contact: {contact.firstName} {contact.lastName}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Assignee & Stage Badge */}
                        <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-border/50">
                              <AvatarFallback className="text-[10px] font-medium bg-primary/20 text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] text-muted-foreground truncate max-w-[100px]">
                              {assignedUser ? assignedUser.name.split(" ")[0] : "Unassigned"}
                            </span>
                          </div>

                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium border px-2 py-0.5 ${stageConfig.badgeClass}`}
                          >
                            {stageConfig.label}
                          </Badge>
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
