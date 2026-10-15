import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  FileText,
  CreditCard,
  AlertCircle,
  CalendarDays,
  FileSpreadsheet,
  TrendingUp,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  Layers,
} from 'lucide-react';
import { Invoice } from '@/types';
import { formatINR } from '@/lib/formatINR';
import { formatDate, cn } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const FINANCIAL_CASH_FLOW = [
  { month: 'May', collections: 3600000, expenses: 1950000, taxGst: 540000 },
  { month: 'Jun', collections: 3900000, expenses: 2100000, taxGst: 585000 },
  { month: 'Jul', collections: 4200000, expenses: 2280000, taxGst: 630000 },
  { month: 'Aug', collections: 4100000, expenses: 2200000, taxGst: 615000 },
  { month: 'Sep', collections: 4450000, expenses: 2350000, taxGst: 667500 },
  { month: 'Oct', collections: 4850000, expenses: 2420000, taxGst: 727500 },
];

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
  {
    id: 'inv-4',
    invoiceNumber: 'TAX-INV-2026-084',
    guestName: 'Sunita Singhania',
    date: '2026-10-08',
    subTotal: 28000,
    gstRate: 18,
    gstAmount: 5040,
    grandTotal: 33040,
    status: 'Paid',
  },
];

export const AccountantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending'>('All');

  const filteredInvoices = MOCK_INVOICES.filter((inv) => {
    if (filterStatus !== 'All' && inv.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.guestName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 text-[#111827] w-full pb-8">
      {/* 1. Panoramic Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[180px] sm:min-h-[200px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 sm:via-white/60 to-white/30 sm:to-transparent" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse" />
                  Finance & Accounts Command
                </span>
                <span className="text-xs font-medium text-[#64748B]">Auditing & GST Returns</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                Financial Operations & Ledgers
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-2xl">
                Resort cash flows, GST compliance, pending guest folios, and vendor payouts
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Month: Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/billing')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Generate Invoices</span>
                <span className="sm:hidden">Invoices</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* KPI 1 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +18.2%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Total Collections
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  ₹48.5 L
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    October MTD
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  4 Folios
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Outstanding Folios
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  ₹3.2 L
                  <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 truncate">
                    Pending at checkout
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  GSTR-3B Ready
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  GST Output Liability
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  ₹7.27 L
                  <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">
                    18% Room & F&B
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  Direct Rails
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  UPI & Card Share
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  88%
                  <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">
                    Instant settlements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Monthly Collections vs Expenses Chart */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
              Collections Trajectory & Net Operating Margin
            </h3>
            <p className="text-xs text-[#64748B]">
              Inflow vs Outflow analysis across the last 6 months
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F5132] text-[11px] font-semibold border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-[#0F5132]" /> Collections
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-100">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Outflow & Expenses
            </span>
          </div>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FINANCIAL_CASH_FLOW} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="collectionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F5132" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0F5132" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `₹${val / 100000}L`}
              />
              <Tooltip
                formatter={(value: number) => [formatINR(value), 'Amount']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="collections" stroke="#0F5132" strokeWidth={2.5} fillOpacity={1} fill="url(#collectionsGrad)" />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#expensesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Financial Operations Quick Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <button
          type="button"
          onClick={() => navigate('/expenses')}
          className="p-3.5 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group active:scale-[0.98] min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132] truncate">
                Expenses & Capex
              </span>
              <span className="text-[10px] text-[#64748B] block truncate">Petty cash & vendor bills</span>
            </div>
          </div>
          <span className="text-xs text-[#0F5132] font-bold shrink-0 ml-1.5">→</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/payments')}
          className="p-3.5 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group active:scale-[0.98] min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132] truncate">
                Payments Ledger
              </span>
              <span className="text-[10px] text-[#64748B] block truncate">Settlement rails & POS</span>
            </div>
          </div>
          <span className="text-xs text-[#0F5132] font-bold shrink-0 ml-1.5">→</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/refunds')}
          className="p-3.5 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group active:scale-[0.98] min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132] truncate">
                Refunds Desk
              </span>
              <span className="text-[10px] text-[#64748B] block truncate">Credit notes & reversals</span>
            </div>
          </div>
          <span className="text-xs text-[#0F5132] font-bold shrink-0 ml-1.5">→</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/billing')}
          className="p-3.5 bg-white hover:bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-left transition-all shadow-2xs flex items-center justify-between group active:scale-[0.98] min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-[#0F172A] block group-hover:text-[#0F5132] truncate">
                Billing & GST
              </span>
              <span className="text-[10px] text-[#64748B] block truncate">Tax invoices & folios</span>
            </div>
          </div>
          <span className="text-xs text-[#0F5132] font-bold shrink-0 ml-1.5">→</span>
        </button>
      </div>

      {/* 4. Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">Recent Tax Invoices & Folios</h3>
            <p className="text-xs text-[#64748B]">GST compliant receipts and guest settlements</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoice or guest..."
                className="w-full sm:w-48 h-9 pl-8 pr-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/billing')}
              className="text-xs text-[#0F5132] font-bold hover:underline shrink-0 whitespace-nowrap"
            >
              View All Billing →
            </button>
          </div>
        </div>

        {/* Mobile Standalone Invoice Cards (Stayora Luxury Native App Style) */}
        <div className="block lg:hidden space-y-3 p-2.5 sm:p-3 bg-[#F8FAFC]/50">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-3 hover:border-[#0F5132]/30 transition-all text-left"
            >
              {/* Top Row: Invoice Code left, Status right */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {inv.invoiceNumber}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0',
                    inv.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      inv.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                    )}
                  />
                  {inv.status}
                </span>
              </div>

              {/* Guest & Date */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  {inv.guestName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[#0F172A] text-sm truncate">{inv.guestName}</h4>
                  <p className="text-[11px] text-[#64748B]">Issued on {formatDate(inv.date)}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#64748B] block">Grand Total</span>
                  <span className="text-sm font-black text-[#0F5132]">{formatINR(inv.grandTotal)}</span>
                </div>
              </div>

              {/* Subtotal & GST breakdown */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B] block font-medium">Subtotal</span>
                  <span className="font-semibold text-[#1E293B]">{formatINR(inv.subTotal)}</span>
                </div>
                <div className="border-l border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block font-medium">GST {inv.gstRate}%</span>
                  <span className="font-semibold text-[#1E293B]">{formatINR(inv.gstAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-0.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Invoice ${inv.invoiceNumber} receipt downloaded.`);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/billing')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F5132] rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98] shrink-0"
                >
                  <span>Folio →</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[850px] text-left text-xs text-[#1E293B] border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
              <tr>
                <th className="py-3.5 px-4 min-w-[140px]">Invoice #</th>
                <th className="py-3.5 px-4 min-w-[180px]">Guest Name</th>
                <th className="py-3.5 px-4 min-w-[120px]">Issued Date</th>
                <th className="py-3.5 px-4 min-w-[120px]">Subtotal</th>
                <th className="py-3.5 px-4 min-w-[120px]">GST 18%</th>
                <th className="py-3.5 px-4 min-w-[130px]">Total Amount</th>
                <th className="py-3.5 px-4 min-w-[100px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[110px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8FAFC] whitespace-nowrap">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F5132] whitespace-nowrap">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-medium text-[#0F172A] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0F5132] font-bold text-xs flex items-center justify-center">
                        {inv.guestName.charAt(0)}
                      </div>
                      <span>{inv.guestName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] whitespace-nowrap">{formatDate(inv.date)}</td>
                  <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">{formatINR(inv.subTotal)}</td>
                  <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">{formatINR(inv.gstAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] whitespace-nowrap">{formatINR(inv.grandTotal)}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                        inv.status === 'Paid' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        inv.status === 'Pending' && 'bg-amber-50 text-amber-700 border-amber-200'
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          inv.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                        )}
                      />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toast.success(`Receipt for ${inv.invoiceNumber} downloaded.`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
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
