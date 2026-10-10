import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  FileText,
  CreditCard,
  AlertCircle,
  CalendarDays,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import { Invoice } from '@/types';
import { formatINR } from '@/lib/formatINR';
import { formatDate, cn } from '@/lib/utils';

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'TAX-INV-2026-081',
    guestName: 'Rohan Mehra',
    date: '2026-10-05',
    subTotal: 16500,
    gstRate: 12,
    gstAmount: 1980,
    grandTotal: 18480,
    status: 'Paid',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'TAX-INV-2026-082',
    guestName: 'Kavita Iyer',
    date: '2026-10-06',
    subTotal: 34500,
    gstRate: 18,
    gstAmount: 6210,
    grandTotal: 40710,
    status: 'Pending',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'TAX-INV-2026-083',
    guestName: 'Vikram Mehta',
    date: '2026-10-07',
    subTotal: 52000,
    gstRate: 18,
    gstAmount: 9360,
    grandTotal: 61360,
    status: 'Paid',
  },
];

export const AccountantDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 text-[#111827]">
      {/* 1. Panoramic Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden flex flex-col justify-between p-5 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Finance & Accounts
                </span>
                <span className="text-xs text-[#64748B]">Auditing & GST</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Financial Operations & Billing
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Resort cash flows, GST compliance, pending guest folios, and vendor payouts
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Month: Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/billing')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Generate Invoices</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards (Responsive spreading cards with top icon layout) */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  +18.2%
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">Total Collections</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  ₹42.5 L
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">October MTD</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  6 Pending
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">Outstanding Folios</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  ₹3.2 L
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 truncate">Unsettled accounts</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  GSTR-3B
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">GST 18% Output</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  ₹6.48 L
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">Ready for return</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  Digital
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">UPI & Card Share</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  88%
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">Direct settlements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Operations Quick Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <button
          type="button"
          onClick={() => navigate('/expenses')}
          className="p-3 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group"
        >
          <div>
            <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132]">
              Expenses & Ledgers
            </span>
            <span className="text-[10px] text-[#64748B]">Petty cash & bills</span>
          </div>
          <span className="text-xs text-[#0F5132] font-bold">→</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/payments')}
          className="p-3 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group"
        >
          <div>
            <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132]">
              Payments Ledger
            </span>
            <span className="text-[10px] text-[#64748B]">Settlement rails</span>
          </div>
          <span className="text-xs text-[#0F5132] font-bold">→</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/refunds')}
          className="p-3 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group"
        >
          <div>
            <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132]">
              Refunds Desk
            </span>
            <span className="text-[10px] text-[#64748B]">Credit notes & reversals</span>
          </div>
          <span className="text-xs text-[#0F5132] font-bold">→</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/billing')}
          className="p-3 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group"
        >
          <div>
            <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132]">
              Billing & GST
            </span>
            <span className="text-[10px] text-[#64748B]">Invoices & folios</span>
          </div>
          <span className="text-xs text-[#0F5132] font-bold">→</span>
        </button>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A]">Recent Tax Invoices & Folios</h3>
          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="text-xs text-[#0F5132] font-semibold hover:underline"
          >
            View All Billing
          </button>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Notice */}
        <div className="lg:hidden flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-[#475569]">
          <span className="flex items-center gap-1.5 font-medium min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse shrink-0" />
            <span className="truncate">Swipe horizontally to view invoice breakdown</span>
          </span>
          <span className="text-[10px] font-bold text-[#0F5132] bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap shrink-0">
            ↔ Swipe
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[850px] text-left text-xs text-[#1E293B] border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
              <tr>
                <th className="py-3 px-3 min-w-[130px]">Invoice #</th>
                <th className="py-3 px-3 min-w-[180px]">Guest</th>
                <th className="py-3 px-3 min-w-[110px]">Date</th>
                <th className="py-3 px-3 min-w-[120px]">Subtotal</th>
                <th className="py-3 px-3 min-w-[120px]">GST 18%</th>
                <th className="py-3 px-3 min-w-[130px]">Total Amount</th>
                <th className="py-3 px-3 min-w-[100px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8FAFC] whitespace-nowrap">
                  <td className="py-3 px-3 font-bold text-[#0F5132] whitespace-nowrap">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3 font-medium text-[#0F172A] whitespace-nowrap">{inv.guestName}</td>
                  <td className="py-3 px-3 text-[#64748B] whitespace-nowrap">{formatDate(inv.date)}</td>
                  <td className="py-3 px-3 text-[#475569] whitespace-nowrap">{formatINR(inv.subTotal)}</td>
                  <td className="py-3 px-3 text-[#475569] whitespace-nowrap">{formatINR(inv.gstAmount)}</td>
                  <td className="py-3 px-3 font-bold text-[#0F172A] whitespace-nowrap">{formatINR(inv.grandTotal)}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                        inv.status === 'Paid' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        inv.status === 'Pending' && 'bg-amber-50 text-amber-700 border-amber-200'
                      )}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
