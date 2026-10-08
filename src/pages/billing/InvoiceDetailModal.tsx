import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { Invoice } from '@/types';
import { Printer, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  if (!invoice) return null;

  const halfGst = Math.round(invoice.gstAmount / 2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tax Invoice"
      description={`GST Compliance Voucher • ${invoice.invoiceNumber}`}
      maxWidth="xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <Button
            variant="outline"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Tax Invoice
          </Button>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {/* Printable Invoice Container */}
      <div className="space-y-6 text-left p-2 sm:p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
        {/* Resort Header & GSTIN */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#C2410C] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#C2410C]">Aura Palms Resort & Spa</h2>
            </div>
            <p className="text-xs text-[#6B7280]">Candolim Beach Road, North Goa, 403515</p>
            <p className="text-xs text-[#C2410C] font-semibold mt-1">
              GSTIN: 30AABCA1234F1Z8 (Goa State Code: 30)
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#6B7280] block">
              Original For Recipient
            </span>
            <span className="font-bold text-base text-[#1F2937] block">
              {invoice.invoiceNumber}
            </span>
            <span className="text-xs text-[#6B7280] block">
              Date: {formatDate(invoice.date)}
            </span>
            <div className="pt-1">
              <StatusBadge status={invoice.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Billed To Guest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] space-y-1">
            <span className="text-[10px] font-semibold uppercase text-[#6B7280]">
              Billed To Guest:
            </span>
            <p className="text-sm font-bold text-[#1F2937]">{invoice.guestName}</p>
            <p className="text-[#6B7280]">Place of Supply: Goa (State 30)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] space-y-1">
            <span className="text-[10px] font-semibold uppercase text-[#6B7280]">
              SAC / HSN Code:
            </span>
            <p className="text-sm font-semibold text-[#1F2937]">
              996311 (Room Accommodation Services)
            </p>
            <p className="text-[#6B7280]">Tax Category: GST {invoice.gstRate}%</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] pb-0.5">
          <table className="w-full min-w-[580px] text-xs text-left border-collapse">
            <thead className="bg-[#FFF8F3] text-[#1F2937] uppercase border-b border-[#E5E7EB]">
              <tr>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Description</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Taxable Value</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">CGST ({invoice.gstRate / 2}%)</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">SGST ({invoice.gstRate / 2}%)</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
              <tr>
                <td className="py-3 px-3.5 whitespace-nowrap">
                  <span className="font-semibold block">Resort Accommodation Tariff</span>
                  <span className="text-[11px] text-[#6B7280]">
                    Includes Luxury Villa Amenities & Buffet Breakfast
                  </span>
                </td>
                <td className="py-3 px-3.5 text-right font-medium whitespace-nowrap">
                  {formatINR(invoice.subTotal)}
                </td>
                <td className="py-3 px-3.5 text-right text-[#6B7280] whitespace-nowrap">
                  {formatINR(halfGst)}
                </td>
                <td className="py-3 px-3.5 text-right text-[#6B7280] whitespace-nowrap">
                  {formatINR(halfGst)}
                </td>
                <td className="py-3 px-3.5 text-right font-bold text-[#C2410C] whitespace-nowrap">
                  {formatINR(invoice.grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="p-4 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] space-y-2 text-xs">
          <div className="flex justify-between text-[#6B7280]">
            <span>Taxable Sub-Total:</span>
            <span>{formatINR(invoice.subTotal)}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Central GST (CGST {invoice.gstRate / 2}%):</span>
            <span>{formatINR(halfGst)}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>State GST (SGST {invoice.gstRate / 2}%):</span>
            <span>{formatINR(halfGst)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#E5E7EB] font-bold text-sm text-[#1F2937]">
            <span>Invoice Grand Total:</span>
            <span className="text-base text-[#C2410C]">{formatINR(invoice.grandTotal)}</span>
          </div>
        </div>

        {/* GST Signature Declaration */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1.5 text-[#22C55E]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Digitally generated GST e-Invoice
          </span>
          <span>For Aura Palms Hospitality Pvt Ltd</span>
        </div>
      </div>
    </Modal>
  );
};
