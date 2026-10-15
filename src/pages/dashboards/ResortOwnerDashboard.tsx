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
  CalendarDays,
  CreditCard,
  Briefcase,
  IndianRupee,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
      {/* 1. Panoramic Hero Section with Header & 5 Executive Owner KPI Cards */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[180px] sm:min-h-[200px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
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
                  Resort Owner Executive Suite
                </span>
                <span className="text-xs font-medium text-[#64748B]">
                  Property Ownership & Capital Hub
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                {currentResort?.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-2xl">
                P&L performance, capital capex authorizations & multi-branch oversight
              </p>
            </div>

            {/* Header Right Actions & Switcher */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap w-full sm:w-auto">
              <select
                value={currentResort?.id}
                onChange={(e) => switchResort(e.target.value)}
                className="w-full sm:w-auto max-w-full px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#0F5132] transition-colors shadow-2xs truncate"
                aria-label="Switch Resort Branch"
              >
                {allResorts.map((r) => (
                  <option key={r.id} value={r.id}>
                    Branch: {r.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#0F5132] transition-colors shadow-2xs truncate"
                  aria-label="Select Financial Period"
                >
                  <option value="Q3 FY26">Q3 FY26 (Current)</option>
                  <option value="Q2 FY26">Q2 FY26 (Past)</option>
                  <option value="FY25-26">Full Year</option>
                </select>

                <button
                  type="button"
                  onClick={() => navigate('/reports')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">P&L Ledger</span>
                  <span className="sm:hidden">Ledger</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Executive Owner KPI Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* KPI 1: Gross Revenue */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +14.2%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Gross Revenue (MTD)</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {formatINR(6840000)}
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    vs last month
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 2: Net Profit Margin */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0F5132] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  49.5% Net
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Net Profit (Margin)</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F5132] tracking-tight mt-0.5">
                  {formatINR(3390000)}
                  <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                    After GST & Ops
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 3: Occupancy */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  High Season
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Average Occupancy</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  87.5%
                  <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium mt-0.5 truncate">
                    28 of 32 occupied
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 4: ADR Tariff */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  RevPAR +8%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Average Tariff (ADR)</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {formatINR(18200)}
                  <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium mt-0.5 truncate">
                    Per villa / night
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 5: Pending Sign-offs */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full shrink-0 border border-amber-200/70">
                  Requires Sign-off
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Pending Approvals</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-amber-600 tracking-tight mt-0.5">
                  {pendingApprovals.length} Actions
                  <p className="text-[10px] sm:text-[11px] text-amber-700 font-medium mt-0.5 truncate">
                    Needs Owner Sign-off
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive Quick Action Strip */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <button
          type="button"
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Full P&L Breakdown</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/expenses')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <Briefcase className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Operating Expenses & Capex</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/refunds')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <CreditCard className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Refunds & Adjustments</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/billing')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <DollarSign className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>GST & Folio Audit</span>
        </button>
      </div>

      {/* 3. Middle Section: Revenue vs Profit Chart & Branch Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Revenue & Profit Area Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                6-Month Revenue, Operating Expense & Net Profit
              </h3>
              <p className="text-xs text-[#64748B]">
                Financial trajectory in INR across this property
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F5132] text-[11px] font-semibold border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-[#0F5132]" /> Revenue
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-[11px] font-semibold border border-teal-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Net Profit
              </span>
            </div>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OWNER_REVENUE_CHART} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0F5132" strokeWidth={2.5} fillOpacity={1} fill="url(#ownerRev)" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#ownerProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Branch Resort Portfolio Cards */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Resort Group Branches</h3>
              <p className="text-xs text-[#64748B]">Multi-property portfolio</p>
            </div>
            <span className="text-[11px] font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {allResorts.length} Properties
            </span>
          </div>

          <div className="space-y-2.5">
            {allResorts.map((branch) => {
              const isCurrent = branch.id === currentResort?.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => switchResort(branch.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] ${
                    isCurrent
                      ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300 shadow-2xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-emerald-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {branch.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#0F172A] truncate">{branch.name}</h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-[#0F5132] text-white text-[9px] font-bold shadow-2xs shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">{branch.city}, {branch.state}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">Keys: <strong className="text-[#0F172A]">{branch.totalRooms} Villas</strong></span>
                    <span className="font-bold text-[#0F5132]">{formatINR(branch.mrr)} /mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Executive Approvals Queue (Stayora Pure Card Design for Mobile) */}
      <div className="space-y-2.5 pt-1">
        {/* Section Header on Canvas */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Executive Approvals Queue</span>
            </h3>
            <p className="text-[10px] sm:text-xs text-[#64748B]">
              Manager and Sales proposals requiring Owner sign-off
            </p>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            {pendingApprovals.length} Pending
          </span>
        </div>

        {/* Mobile View: High-End Native App Card Layout */}
        <div className="lg:hidden space-y-2.5">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-2.5"
            >
              {/* Row 1: Type Badge on Left, Status Badge on Right */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                    app.type === 'Refund'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : app.type === 'Capex'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {app.type}
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    app.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : app.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {app.status === 'Approved' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : app.status === 'Rejected' ? (
                    <XCircle className="w-3 h-3 text-rose-600" />
                  ) : (
                    <Clock className="w-3 h-3 text-amber-600" />
                  )}
                  {app.status}
                </span>
              </div>

              {/* Row 2: Title and Prominent Amount */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug flex-1">
                    {app.title}
                  </h4>
                  <div className="text-xs sm:text-sm font-black text-[#0F172A] bg-slate-50 px-2 py-1 rounded-xl border border-slate-200/70 shrink-0">
                    {formatINR(app.amount)}
                  </div>
                </div>
                <p className="text-[11px] text-[#64748B] bg-[#F8FAFC] border border-slate-100 rounded-xl p-2.5 mt-2 leading-relaxed">
                  {app.reason}
                </p>
              </div>

              {/* Row 3: Requester & Date Info */}
              <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[#64748B] pt-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1 font-medium truncate min-w-0 flex-1">
                  <Users2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{app.requestedBy}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 shrink-0 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  <span>{app.requestedDate}</span>
                </div>
              </div>

              {/* Row 4: Owner Sign-off Buttons */}
              <div className="pt-0.5">
                {app.status === 'Pending' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAction(app.id, 'Approved')}
                      className="h-9 rounded-xl bg-[#0F5132] hover:bg-[#0A3622] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(app.id, 'Rejected')}
                      className="h-9 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 text-xs font-bold border border-rose-200 transition-all flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-[#94A3B8] font-medium italic bg-[#F8FAFC] rounded-xl border border-slate-100">
                    Owner Sign-off: Decided ({app.status})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Tabular Layout */}
        <div className="hidden lg:block bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs overflow-x-auto scrollbar-thin">
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
