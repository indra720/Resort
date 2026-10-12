import React from 'react';
import {
  X,
  Printer,
  MessageCircle,
  Mail,
  CalendarCheck,
  CheckCircle2,
  Building2,
  Phone,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Quotation } from '@/types/crm';
import { useAuthStore } from '@/store/useAuthStore';
import { formatINR } from '@/lib/formatINR';
import { sendQuotation, convertQuotationToBooking } from '@/api/quotations';
import { toast } from '@/store/useToastStore';

export interface QuotationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: Quotation | null;
  onRefresh?: () => void;
}

export const QuotationPreviewModal: React.FC<QuotationPreviewModalProps> = ({
  isOpen,
  onClose,
  quotation,
  onRefresh,
}) => {
  const { currentResort, user } = useAuthStore();

  if (!isOpen || !quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWA = () => {
    const res = sendQuotation(quotation.id, 'whatsapp', currentResort.id, user);
    if (res.success) {
      toast.success('WhatsApp Sent', res.message);
      if (onRefresh) onRefresh();
    }
  };

  const handleSendEmail = () => {
    const res = sendQuotation(quotation.id, 'email', currentResort.id, user);
    if (res.success) {
      toast.success('Email Dispatched', res.message);
      if (onRefresh) onRefresh();
    }
  };

  const handleConvert = () => {
    const res = convertQuotationToBooking(quotation.id, currentResort.id, user);
    if (res.success) {
      toast.success('Converted to Booking', `Confirmed reservation ${res.booking?.id} created.`);
      if (onRefresh) onRefresh();
      onClose();
    } else {
      toast.error('Conversion Failed', res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#CBD5E1] text-[#0F172A] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Actions Toolbar (Hidden during print) */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Proposal Preview</span>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                quotation.status === 'Accepted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : quotation.status === 'Sent'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {quotation.status}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-3 rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-xs font-semibold text-[#334155] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleSendWA}
              className="h-8 px-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-xs font-semibold text-[#075E54] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleSendEmail}
              className="h-8 px-3 rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-xs font-semibold text-[#334155] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Email</span>
            </button>

            {quotation.status !== 'Accepted' && (
              <button
                type="button"
                onClick={handleConvert}
                className="h-8 px-3.5 rounded-xl bg-[#0F5132] hover:bg-[#0B3D25] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Accept & Book</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Document Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm bg-white print:p-0 print:m-0">
          
          {/* Header & Resort Branding */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b-2 border-[#0F5132]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-black text-sm">
                  JOY
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                    {currentResort.name}
                  </h1>
                  <p className="text-xs text-[#64748B] font-medium">{currentResort.tagline}</p>
                </div>
              </div>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                {currentResort.city}, {currentResort.state}, India<br />
                Concierge Desk: +91 98200 11223 | reservations@joyresorts.com
              </p>
            </div>

            <div className="text-left sm:text-right bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] min-w-[200px]">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Formal Proposal</span>
              <span className="text-base font-black text-[#0F5132] block mt-0.5">{quotation.quotation_number}</span>
              <div className="mt-2 text-xs text-[#475569] space-y-0.5">
                <p><strong>Date:</strong> {quotation.created_at.split('T')[0]}</p>
                <p><strong>Valid Until:</strong> {quotation.valid_until}</p>
              </div>
            </div>
          </div>

          {/* Guest & Requirement Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Prepared Exclusively For:
              </span>
              <p className="text-sm font-bold text-[#0F172A]">{quotation.guest_name}</p>
              <p className="text-xs text-[#64748B]">{quotation.guest_phone}</p>
              <p className="text-xs text-[#64748B]">{quotation.guest_email}</p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Booking Scope:
              </span>
              <p className="text-xs text-[#334155]"><strong>Experience:</strong> {quotation.interested_in || 'Curated Resort Stay'}</p>
              <p className="text-xs text-[#334155]"><strong>Prepared By:</strong> {quotation.created_by}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0F5132] text-white font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Package Description & Inclusions</th>
                  <th className="py-2.5 px-3 text-center">Qty / Days</th>
                  <th className="py-2.5 px-3 text-right">Tariff (₹)</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {quotation.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-3 font-semibold text-[#64748B]">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-[#0F172A]">{item.description}</td>
                    <td className="py-3 px-3 text-center text-[#475569]">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-[#475569]">{formatINR(item.rate)}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#0F172A]">{formatINR(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="flex-1 space-y-2 text-xs text-[#64748B]">
              {quotation.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950">
                  <span className="font-bold block mb-0.5">Special Inclusions & Notes:</span>
                  <p>{quotation.notes}</p>
                </div>
              )}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-[#475569] leading-relaxed">
                ⚖️ <strong>CA & Tax Note:</strong> GST rates calculated as per prevailing Government of India hospitality tax slabs (CGST {quotation.cgst_rate}% + SGST {quotation.sgst_rate}%). Please confirm exact input tax credit eligibility with your CA.
              </div>
            </div>

            <div className="w-full sm:w-72 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(quotation.subtotal)}</span>
              </div>
              {quotation.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Privilege Discount</span>
                  <span className="font-semibold">- {formatINR(quotation.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#64748B]">
                <span>CGST ({quotation.cgst_rate}%)</span>
                <span>{formatINR(quotation.tax_amount / 2)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>SGST ({quotation.sgst_rate}%)</span>
                <span>{formatINR(quotation.tax_amount / 2)}</span>
              </div>
              <div className="pt-2 border-t border-[#CBD5E1] flex justify-between items-baseline">
                <span className="font-black text-sm text-[#0F172A]">Grand Total</span>
                <span className="font-black text-lg text-[#0F5132]">{formatINR(quotation.grand_total)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pt-4 border-t border-[#E2E8F0] text-[11px] text-[#64748B] space-y-1">
            <span className="font-bold text-[#0F172A] block text-xs">Resort Reservation Terms:</span>
            <p>1. Check-in time: 2:00 PM | Check-out time: 11:00 AM. Early check-in subject to availability.</p>
            <p>2. A 50% advance payment is required to confirm reservation. Balance payable at check-in.</p>
            <p>3. Valid Govt ID proof (Aadhaar / Passport / Driving License) required for all adults at front desk.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
