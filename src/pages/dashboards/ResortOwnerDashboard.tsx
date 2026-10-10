import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import { ExecutiveApproval } from '@/types';
import {
  TrendingUp,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  FileSpreadsheet,
  Users2,
  ChevronRight,
  Sparkles,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const OWNER_REVENUE_CHART = [
  { month: 'May', revenue: 4800000, expenses: 2600000, profit: 2200000 },
  { month: 'Jun', revenue: 5200000, expenses: 2800000, profit: 2400000 },
  { month: 'Jul', revenue: 5900000, expenses: 3100000, profit: 2800000 },
  { month: 'Aug', revenue: 6100000, expenses: 3200000, profit: 2900000 },
  { month: 'Sep', revenue: 6400000, expenses: 3300000, profit: 3100000 },
  { month: 'Oct', revenue: 6840000, expenses: 3450000, profit: 3390000 },
];

const INITIAL_APPROVALS: ExecutiveApproval[] = [
  {
    id: 'app-1',
    resortId: 'resort-1',
    title: 'Executive Refund Request - Suite S-04 Early Departure',
    type: 'Refund',
    amount: 32500,
    requestedBy: 'Ananya Sharma (Resort Manager)',
    requestedDate: 'Today, 11:20 AM',
    status: 'Pending',
    reason: 'Guest medical emergency. Manager recommends full refund of remaining 2 nights.',
  },
  {
    id: 'app-2',
    resortId: 'resort-1',
    title: 'Poolside Gazebo Furniture Capex Procurement',
    type: 'Capex',
    amount: 185000,
    requestedBy: 'Sunita Devi (Housekeeping Head)',
    requestedDate: 'Yesterday, 04:15 PM',
    status: 'Pending',
    reason: 'Replacement of 8 weather-damaged teakwood sunbeds before peak season.',
  },
  {
    id: 'app-3',
    resortId: 'resort-1',
    title: 'Corporate Retreat 22% Volume Discount (TCS Gala)',
    type: 'Discount',
    amount: 94000,
    requestedBy: 'Sameer Verma (Sales Executive)',
    requestedDate: 'Yesterday, 02:00 PM',
    status: 'Pending',
    reason: '35 Villa block booking for 4 nights. Total booking value ₹14,20,000.',
  },
];

export const ResortOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort, allResorts, switchResort, addAuditLog } = useAuthStore();
  const [approvals, setApprovals] = useState<ExecutiveApproval[]>(INITIAL_APPROVALS);
  const [selectedQuarter, setSelectedQuarter] = useState('Q3 FY26');

  const pendingApprovals = approvals.filter((a) => a.status === 'Pending');

  const handleAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    const target = approvals.find((a) => a.id === id);
    if (newStatus === 'Approved') {
      toast.success('Approval Confirmed', `Signed off: ${target?.title}`);
      addAuditLog('Owner Approval Signed', `Approved ${target?.title} (${formatINR(target?.amount || 0)})`, 'Info');
    } else {
      toast.error('Request Rejected', `Rejected: ${target?.title}`);
      addAuditLog('Owner Approval Rejected', `Rejected ${target?.title}`, 'Warning');
    }
  };

  return (
    <div className="space-y-4 text-[#111827] w-full pb-8">
      {/* 1. Executive Top Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] text-[11px] font-bold uppercase tracking-wider">
              Resort Owner Executive Suite
            </span>
            <span className="text-xs text-[#64748B]">Property Ownership & Capital Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1">
            {currentResort?.name}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            P&L performance, capital capex authorizations & multi-branch oversight
          </p>
        </div>

        {/* Property Switcher & Quarter Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={currentResort?.id}
            onChange={(e) => switchResort(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#0F5132]"
            aria-label="Switch Resort Branch"
          >
            {allResorts.map((r) => (
              <option key={r.id} value={r.id}>
                Branch: {r.name}
              </option>
            ))}
          </select>

          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#0F5132]"
            aria-label="Select Financial Period"
          >
            <option value="Q3 FY26">Q3 FY26 (Current)</option>
            <option value="Q2 FY26">Q2 FY26 (Past)</option>
            <option value="FY25-26">Full Financial Year</option>
          </select>

          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="px-3.5 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>P&L Ledger</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 Executive Owner KPI Cards (Responsive spreading cards with top icon layout) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center shrink-0 shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +14.2%
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Gross Revenue (MTD)</p>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
              {formatINR(6840000)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 whitespace-nowrap">
              vs last month
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
              49.5% Net
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Net Profit (Margin)</p>
            <div className="text-xl sm:text-2xl font-black text-[#0F5132] tracking-tight mt-0.5 whitespace-nowrap">
              {formatINR(3390000)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 whitespace-nowrap">
              After GST & Operations
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
              High Season
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Average Occupancy</p>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
              87.5%
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium mt-0.5 whitespace-nowrap">
              28 of 32 villas occupied
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
              RevPAR +8%
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Average Tariff (ADR)</p>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
              {formatINR(18200)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium mt-0.5 whitespace-nowrap">
              Per villa / per night
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
              Requires Sign-off
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Pending Approvals</p>
            <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight mt-0.5 whitespace-nowrap">
              {pendingApprovals.length} Action Items
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-700 font-medium mt-0.5 whitespace-nowrap">
              Needs Owner Sign-off
            </p>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Revenue vs Profit Chart & Branch Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue & Profit Area Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                6-Month Revenue, Operating Expense & Net Profit
              </h3>
              <p className="text-xs text-[#64748B]">
                Financial trajectory in INR across this property
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#0F5132] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F5132]" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Net Profit
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OWNER_REVENUE_CHART} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ownerRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F5132" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0F5132" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ownerProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0F5132" strokeWidth={2.5} fillOpacity={1} fill="url(#ownerRev)" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#ownerProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Branch Resort Portfolio Cards */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A]">Resort Group Branches</h3>
            <span className="text-[11px] font-semibold text-[#0F5132]">3 Properties Active</span>
          </div>

          <div className="space-y-2.5">
            {allResorts.map((branch) => {
              const isCurrent = branch.id === currentResort?.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => switchResort(branch.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{branch.name}</h4>
                      <p className="text-[11px] text-[#64748B]">{branch.city}, {branch.state}</p>
                    </div>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-[#0F5132] text-white text-[9px] font-bold">
                        Active View
                      </span>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">Capacity: <strong>{branch.totalRooms} Villas</strong></span>
                    <span className="font-semibold text-[#0F5132]">{formatINR(branch.mrr)} /mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Executive Approvals Queue (Refunds, Capex, VIP Discounts) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Executive Approvals Queue</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Manager and Sales proposals requiring Owner sign-off before settlement
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {pendingApprovals.length} Pending Actions
          </span>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Notice */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0F5132] animate-pulse" />
            Scroll table horizontally to review proposals
          </span>
          <span className="text-[10px] font-semibold text-[#0F5132] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] whitespace-nowrap">
            ↔ Swipe to explore
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[860px] text-left text-xs border-collapse">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] font-semibold border-y border-[#E2E8F0] whitespace-nowrap">
              <tr>
                <th className="py-3 px-3 min-w-[100px]">Type</th>
                <th className="py-3 px-3 min-w-[260px]">Proposal Title & Justification</th>
                <th className="py-3 px-3 min-w-[140px]">Amount</th>
                <th className="py-3 px-3 min-w-[160px]">Submitted By</th>
                <th className="py-3 px-3 min-w-[120px]">Status</th>
                <th className="py-3 px-3 text-right min-w-[160px]">Owner Sign-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {approvals.map((app) => (
                <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.type === 'Refund'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : app.type === 'Capex'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {app.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 min-w-[260px]">
                    <div className="font-semibold text-[#0F172A] whitespace-nowrap">{app.title}</div>
                    <div className="text-[11px] text-[#64748B] whitespace-nowrap">{app.reason}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#0F172A] whitespace-nowrap">
                    {formatINR(app.amount)}
                  </td>
                  <td className="py-3 px-3 text-[#64748B] whitespace-nowrap">
                    <div>{app.requestedBy}</div>
                    <div className="text-[10px] text-slate-400">{app.requestedDate}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        app.status === 'Approved'
                          ? 'text-emerald-600'
                          : app.status === 'Rejected'
                          ? 'text-rose-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {app.status === 'Approved' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : app.status === 'Rejected' ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {app.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAction(app.id, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-[#0F5132] hover:bg-[#0A3622] text-white text-[11px] font-bold transition-all shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(app.id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold border border-rose-200 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#94A3B8] italic">Decided</span>
                    )}
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
