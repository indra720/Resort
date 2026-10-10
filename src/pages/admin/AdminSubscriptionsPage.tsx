import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  CreditCard,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileText,
  DollarSign,
  Building2,
} from 'lucide-react';

interface SubscriptionRecord {
  id: string;
  resortName: string;
  resortCode: string;
  planName: 'Basic' | 'Pro' | 'Enterprise';
  mrr: number;
  billingCycle: 'Monthly' | 'Annual';
  nextBillingDate: string;
  paymentMethod: string;
  status: 'Active' | 'Trial' | 'Payment Due';
}

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'SUB-201',
    resortName: 'Joy Resorts - Lakeview Sanctuary',
    resortCode: 'JOY-UDR',
    planName: 'Enterprise',
    mrr: 49999,
    billingCycle: 'Monthly',
    nextBillingDate: '15 Nov 2026',
    paymentMethod: 'Corporate Auto-Debit (HDFC)',
    status: 'Active',
  },
  {
    id: 'SUB-202',
    resortName: 'Joy Resorts - Pine Heritage Estate',
    resortCode: 'JOY-SHM',
    planName: 'Pro',
    mrr: 27999,
    billingCycle: 'Monthly',
    nextBillingDate: '01 Nov 2026',
    paymentMethod: 'Razorpay Mandate (ICICI)',
    status: 'Active',
  },
  {
    id: 'SUB-203',
    resortName: 'Joy Resorts - Emerald Backwaters',
    resortCode: 'JOY-KMR',
    planName: 'Enterprise',
    mrr: 49999,
    billingCycle: 'Annual',
    nextBillingDate: '12 Feb 2027',
    paymentMethod: 'Corporate NEFT Transfer',
    status: 'Active',
  },
  {
    id: 'SUB-204',
    resortName: 'Joy Resorts - Rainforest Hideaway',
    resortCode: 'JOY-CRG',
    planName: 'Pro',
    mrr: 27999,
    billingCycle: 'Monthly',
    nextBillingDate: '28 Oct 2026',
    paymentMethod: 'UPI Auto-Pay',
    status: 'Trial',
  },
  {
    id: 'SUB-205',
    resortName: 'Joy Resorts - Beachfront Dunes',
    resortCode: 'JOY-GOA',
    planName: 'Basic',
    mrr: 14999,
    billingCycle: 'Monthly',
    nextBillingDate: '10 Nov 2026',
    paymentMethod: 'Credit Card (Axis Bank)',
    status: 'Active',
  },
];

export const AdminSubscriptionsPage: React.FC = () => {
  const [subscriptions] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = subscriptions.filter(
    (s) =>
      s.resortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.resortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMRR = subscriptions.reduce((acc, s) => acc + (s.status === 'Active' ? s.mrr : 0), 0);

  const handleDownloadInvoice = (sub: SubscriptionRecord) => {
    toast.success(`Generated SaaS Tax Invoice for ${sub.resortCode} (Oct 2026)`);
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-48 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80"
            alt="Subscriptions & MRR"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Platform Billing & Recurring Yield
                </span>
                <span className="text-xs text-[#64748B]">SaaS Subscriptions</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Multi-Tenant Subscriptions & MRR
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Automated monthly and annual billing cycles, tax folios, and tenant renewal management
              </p>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  +18.4%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Current MRR</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(totalMRR)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">Active monthly yield</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Forecast
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Annualized ARR</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(totalMRR * 12)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">12-month projected</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  100%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Collection Rate</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  100%
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">0 past due accounts</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  Accounts
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Paid Subscribers</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {subscriptions.filter((s) => s.status === 'Active').length} Tenants
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 truncate">1 in trial conversion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions by property, code, plan..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Tenant Subscription Accounts</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live recurring billing agreements with auto-generated GST compliance folios
            </p>
          </div>
        </div>

        {/* Compact Mobile / Tablet Swipe Notice */}
        <div className="lg:hidden flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-[#475569]">
          <span className="flex items-center gap-1.5 font-medium min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse shrink-0" />
            <span className="truncate">Swipe horizontally to see all columns</span>
          </span>
          <span className="text-[10px] font-bold text-[#0F5132] bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap shrink-0">
            ↔ Swipe
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px] text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                <th className="py-3.5 px-4 min-w-[240px]">Resort Tenant</th>
                <th className="py-3.5 px-4 min-w-[120px]">Plan Tier</th>
                <th className="py-3.5 px-4 min-w-[130px]">Cycle</th>
                <th className="py-3.5 px-4 min-w-[130px]">Monthly Fee</th>
                <th className="py-3.5 px-4 min-w-[140px]">Next Invoice Date</th>
                <th className="py-3.5 px-4 min-w-[180px]">Payment Rail</th>
                <th className="py-3.5 px-4 min-w-[100px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-[#0F172A]">{s.resortName}</p>
                      <p className="text-[11px] text-[#64748B]">{s.resortCode}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                      {s.planName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#475569] font-medium">
                    {s.billingCycle}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#0F5132]">{formatINR(s.mrr)}</span>
                    <span className="text-[10px] text-[#64748B] block">/ month</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#334155] font-semibold">
                    {s.nextBillingDate}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                    {s.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                        s.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(s)}
                      className="px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F5132] font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                      title="Download GST Invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Invoice</span>
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
