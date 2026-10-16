import { useState } from "react";
import {
  FileText,
  Eye,
  Download,
  Calendar,
  Building2,
  DollarSign,
  Send,
  Printer,
} from "lucide-react";
import type { Invoice } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentStatus, PaymentMethodBadge } from "./PaymentStatus";

interface InvoiceTableProps {
  invoices: Invoice[];
  className?: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InvoiceTable({ invoices, className }: InvoiceTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <>
      <div className={cn("rounded-xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden", className)}>
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="w-[140px] font-mono text-xs uppercase tracking-wider">
                Invoice #
              </TableHead>
              <TableHead className="min-w-[160px]">Client</TableHead>
              <TableHead className="w-[110px] text-right font-mono">Amount</TableHead>
              <TableHead className="w-[90px] text-right font-mono">Tax</TableHead>
              <TableHead className="w-[120px] text-right font-mono">Total</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[110px]">Issued Date</TableHead>
              <TableHead className="w-[110px]">Due Date</TableHead>
              <TableHead className="w-[110px]">Paid Date</TableHead>
              <TableHead className="w-[130px]">Payment Method</TableHead>
              <TableHead className="w-[50px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                  No invoices found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const isOverdue = inv.status === "overdue";
                const isPaid = inv.status === "paid";

                return (
                  <TableRow
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className={cn(
                      "cursor-pointer border-border/40 transition-colors group",
                      isOverdue
                        ? "border-l-4 border-l-destructive bg-destructive/[0.04] hover:bg-destructive/[0.08]"
                        : isPaid
                        ? "hover:bg-muted/30"
                        : "hover:bg-muted/40"
                    )}
                  >
                    {/* Invoice Number */}
                    <TableCell className="font-mono text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                        <span>{inv.invoiceNumber}</span>
                      </div>
                    </TableCell>

                    {/* Client */}
                    <TableCell className="text-sm font-medium text-foreground">
                      {inv.clientName}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {formatCurrency(inv.amount)}
                    </TableCell>

                    {/* Tax */}
                    <TableCell className="text-right font-mono text-xs text-muted-foreground/80">
                      {formatCurrency(inv.tax)}
                    </TableCell>

                    {/* Total */}
                    <TableCell className="text-right font-mono text-sm font-bold text-foreground">
                      {formatCurrency(inv.total)}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <PaymentStatus status={inv.status} />
                    </TableCell>

                    {/* Issued Date */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(inv.issuedDate)}
                    </TableCell>

                    {/* Due Date */}
                    <TableCell
                      className={cn(
                        "text-xs whitespace-nowrap font-mono",
                        isOverdue ? "text-destructive font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {formatDate(inv.dueDate)}
                    </TableCell>

                    {/* Paid Date */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(inv.paidDate)}
                    </TableCell>

                    {/* Payment Method */}
                    <TableCell>
                      <PaymentMethodBadge method={inv.paymentMethod} />
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(inv);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Details Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        {selectedInvoice && (
          <DialogContent className="max-w-2xl border-border bg-card">
            <DialogHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground uppercase">
                      INVOICE RECORD
                    </span>
                    <PaymentStatus status={selectedInvoice.status} />
                  </div>
                  <DialogTitle className="text-xl font-display font-bold text-foreground mt-1">
                    {selectedInvoice.invoiceNumber}
                  </DialogTitle>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Due</p>
                  <p className="text-2xl font-bold font-mono text-primary">
                    {formatCurrency(selectedInvoice.total)}
                  </p>
                </div>
              </div>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Issued for {selectedInvoice.clientName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-border/40 bg-muted/20 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">Billed To</span>
                  <span className="font-semibold text-foreground">{selectedInvoice.clientName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Issued Date</span>
                  <span className="font-mono text-foreground">{formatDate(selectedInvoice.issuedDate)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Due Date</span>
                  <span className={cn("font-mono font-medium", selectedInvoice.status === "overdue" ? "text-destructive" : "text-foreground")}>
                    {formatDate(selectedInvoice.dueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Payment Method</span>
                  <PaymentMethodBadge method={selectedInvoice.paymentMethod} />
                </div>
              </div>

              {/* Line Items Table */}
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs">Item Description</TableHead>
                      <TableHead className="w-[70px] text-right text-xs">Qty</TableHead>
                      <TableHead className="w-[100px] text-right text-xs">Rate</TableHead>
                      <TableHead className="w-[110px] text-right text-xs">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-transparent">
                        <TableCell className="text-xs font-medium text-foreground">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono text-muted-foreground">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono text-muted-foreground">
                          {formatCurrency(item.rate)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono font-semibold text-foreground">
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-mono text-foreground">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (10%):</span>
                    <span className="font-mono text-foreground">{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className="border-t border-border/60 pt-2 flex justify-between text-sm font-bold text-foreground">
                    <span>Total:</span>
                    <span className="font-mono text-primary">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Printer className="h-3.5 w-3.5" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </Button>
                </div>

                <div className="flex gap-2">
                  {selectedInvoice.status !== "paid" && (
                    <Button size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5">
                      <Send className="h-3.5 w-3.5" />
                      Send Reminder
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => setSelectedInvoice(null)} className="text-xs">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
