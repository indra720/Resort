import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  TrendingUp,
  Users,
  CalendarDays,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  LogIn,
  ShieldCheck,
  LifeBuoy,
  Sparkles,
  IndianRupee,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { PLATFORM_PLANS } from '@/data/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { ResortTenant } from '@/types';
import { formatINR } from '@/lib/formatINR';
import { cn } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import { computeSaaSPlatformMetrics, createResortTenant } from '@/api/resortsApi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const PLATFORM_MRR_DATA = [
  { month: 'May', mrr: 110000, resorts: 3 },
  { month: 'Jun', mrr: 125000, resorts: 3 },
  { month: 'Jul', mrr: 138000, resorts: 4 },
  { month: 'Aug', mrr: 145000, resorts: 4 },
  { month: 'Sep', mrr: 156000, resorts: 5 },
  { month: 'Oct', mrr: 168000, resorts: 5 },
];

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { enterResortAsAdmin } = useAuthStore();

  const [metrics, setMetrics] = useState(computeSaaSPlatformMetrics());
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'trial' | 'plans'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddResortOpen, setIsAddResortOpen] = useState(false);

  // New Resort Form State
  const [newResortForm, setNewResortForm] = useState({
    name: '',
    city: '',
    state: '',
    plan: 'Pro' as 'Basic' | 'Pro' | 'Enterprise',
    ownerName: '',
    ownerEmail: '',
    totalRooms: 20,
  });

  const refreshMetrics = () => {
    setMetrics(computeSaaSPlatformMetrics());
  };

  const filteredResorts = useMemo(() => {
    return metrics.resorts.filter((r) => {
      if (activeTab === 'active' && r.status !== 'Active') return false;
      if (activeTab === 'trial' && r.status !== 'Trial') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          r.name.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.ownerName.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [metrics.resorts, activeTab, searchQuery]);

  const handleImpersonate = (resort: ResortTenant) => {
    enterResortAsAdmin(resort.id);
    toast.success(`Entered ${resort.name} as Super Admin audit inspector.`);
    navigate('/rooms');
  };

  const handleCreateResort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResortForm.name || !newResortForm.ownerEmail) {
      toast.error('Please enter resort name and owner email.');
      return;
    }

    const created = createResortTenant({
      name: newResortForm.name,
      city: newResortForm.city || 'India',
      state: newResortForm.state || 'India',
      plan: newResortForm.plan,
      totalRooms: Number(newResortForm.totalRooms) || 20,
      ownerName: newResortForm.ownerName || 'Resort Owner',
      ownerEmail: newResortForm.ownerEmail,
    });

    refreshMetrics();
    setIsAddResortOpen(false);
    toast.success(`Resort "${created.name}" onboarded with 14-day SaaS trial!`);
  };

  return (
    <div className="space-y-3.5 text-[#111827] w-full">
      {/* 1. Panoramic Hero Section with Header & 5 SaaS Platform Owner KPI Cards */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden flex flex-col justify-between p-5 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent" />

          {/* Header row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  SaaS Platform Owner
                </span>
                <span className="text-xs text-[#64748B]">Multi-Tenant Cloud Control</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Platform Operations & Tenants
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Centralized resort management, subscription MRR, and tenant provisioning
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddResortOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Resort</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 SaaS Platform KPI Cards (Responsive spreading cards with top icon layout) */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* KPI 1: Total Resorts */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +{metrics.trialCount} New
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">Total Resorts</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {metrics.totalResorts}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  {metrics.activeCount} Active, {metrics.trialCount} Trial
                </p>
              </div>
            </div>

            {/* KPI 2: Active Subscriptions */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  100% Paid
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">Active Subscriptions</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {metrics.activeCount}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  Paid Multi-Tenant
                </p>
              </div>
            </div>

            {/* KPI 3: Monthly Recurring Revenue (MRR) - Spans 2 cols on mobile, 1 col on desktop */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[140px] sm:min-h-[160px] min-w-0 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +18.4%
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">Platform MRR</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(metrics.totalMRR)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  ARR: {formatINR(metrics.totalARR)}
                </p>
              </div>
            </div>

            {/* KPI 4: Total Platform Bookings */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +15.2%
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">Total Bookings</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  1,240
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  Across all tenants
                </p>
              </div>
            </div>

            {/* KPI 5: Churn Rate */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[148px] sm:min-h-[160px] min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#84CC16] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  -0.4% MoM
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#64748B] leading-snug truncate">Platform Churn</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  0.8%
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  Industry top 5%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 max-w-full">
          {[
            { id: 'all', label: 'All Resorts (Tenants)', count: metrics.totalResorts },
            { id: 'active', label: 'Active Subscriptions', count: metrics.activeCount },
            { id: 'trial', label: 'Trial Mode', count: metrics.trialCount },
            { id: 'plans', label: 'SaaS Plans & Tiers', count: PLATFORM_PLANS.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-lg shrink-0',
                  isActive
                    ? 'text-[#0F5132] font-bold'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-full font-semibold',
                    isActive
                      ? 'bg-[#DCFCE7] text-[#0F5132]'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  )}
                >
                  {tab.count}
                </span>

                {isActive && (
                  <div className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-[#0F5132] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAddResortOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Resort</span>
          </button>
        </div>
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resorts by property name, code, owner, city..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:border-[#0F5132] text-[#1E293B] placeholder-[#94A3B8]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveTab('all');
              toast.info('Filters cleared.');
            }}
            className="h-9 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] flex items-center gap-1.5 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4. Multi-Tenant Resorts List Table */}
      {activeTab !== 'plans' ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">Onboarded Resort Properties</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#0F5132]">
                  {filteredResorts.length} Properties
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Isolated tenant databases with custom branding and role-based permissions
              </p>
            </div>
          </div>

          {/* Mobile / Tablet Horizontal Scroll Notice */}
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
            <table className="w-full min-w-[1020px] text-left text-xs text-[#1E293B] border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                  <th className="py-3.5 px-4 min-w-[260px]">Resort / Property</th>
                  <th className="py-3.5 px-4 min-w-[150px]">Location</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Owner Contact</th>
                  <th className="py-3.5 px-4 min-w-[120px]">SaaS Plan</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Keys / Users</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Monthly Yield (MRR)</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                  <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredResorts.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {r.code.slice(4, 6) || 'JY'}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A] whitespace-nowrap">{r.name}</p>
                          <p className="text-[11px] text-[#64748B] whitespace-nowrap">{r.code} • {r.tagline}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-[#334155]">
                      {r.city}, {r.state}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-[#0F172A] whitespace-nowrap">{r.ownerName}</p>
                        <p className="text-[11px] text-[#64748B] whitespace-nowrap">{r.ownerEmail}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                        {r.plan} Tier
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                      <span className="font-semibold text-[#0F172A]">{r.totalRooms}</span> Keys •{' '}
                      <span className="font-semibold text-[#0F172A]">{r.activeUsers}</span> Staff
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#0F5132] text-sm">{formatINR(r.mrr)}</span>
                      <span className="text-[10px] text-[#64748B] block">/ month</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                          r.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            r.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                          )}
                        />
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleImpersonate(r)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap"
                        title="Impersonate & Login as Resort Manager"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Login as Resort</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Plans & Pricing Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLATFORM_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between relative',
                plan.isPopular ? 'border-[#0F5132] ring-1 ring-[#0F5132]' : 'border-[#E2E8F0]'
              )}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#0F5132] text-white text-[11px] font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#0F172A]">
                    {formatINR(plan.priceMonthly)}
                  </span>
                  <span className="text-xs text-[#64748B]">/ month + GST</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Billed yearly at {formatINR(plan.priceYearly)}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-2 text-xs text-[#334155]">
                  <p className="font-semibold text-[#0F172A]">Includes:</p>
                  <p>• Up to <span className="font-bold">{plan.roomLimit} Rooms / Keys</span></p>
                  <p>• Up to <span className="font-bold">{plan.userLimit} Staff Logins</span></p>
                  <p>• <span className="font-bold">{plan.branchLimit} Branch Property</span></p>
                  {plan.features.map((feat: string, i: number) => (
                    <p key={i} className="flex items-center gap-1.5 text-[#16A34A]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[#334155]">{feat}</span>
                    </p>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.success(`Plan ${plan.name} configured.`)}
                className={cn(
                  'mt-5 w-full py-2.5 rounded-xl text-xs font-semibold transition-colors',
                  plan.isPopular
                    ? 'bg-[#0F5132] hover:bg-[#0B3D25] text-white'
                    : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]'
                )}
              >
                Configure Tier
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. Charts Row: MRR Growth Trajectory + Plans Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                MRR Growth Trajectory (₹ Lakhs)
              </h3>
              <p className="text-xs text-[#64748B]">
                Multi-tenant resort subscription revenues across 2026
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#0F5132]">
              +18.4% MoM
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLATFORM_MRR_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="saasMrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F5132" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0F5132" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    color: '#0F172A',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [formatINR(value), 'Platform MRR']}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  name="Monthly Recurring Revenue"
                  stroke="#0F5132"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#saasMrrGrad)"
                  dot={{ r: 4, fill: '#0F5132', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Donut */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs">
          <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-1">
            Resorts by Plan Tier
          </h3>
          <p className="text-xs text-[#64748B] mb-3">
            Active subscription tier allocation
          </p>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.planDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Onboard Resort Modal */}
      {isAddResortOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-bold text-[#0F172A]">Onboard New Resort Tenant</h3>
              <button
                type="button"
                onClick={() => setIsAddResortOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResort} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#334155] block mb-1">Resort Name</label>
                <input
                  type="text"
                  required
                  value={newResortForm.name}
                  onChange={(e) => setNewResortForm({ ...newResortForm, name: e.target.value })}
                  placeholder="e.g. Joy Resorts - Whispering Palms"
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#334155] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newResortForm.city}
                    onChange={(e) => setNewResortForm({ ...newResortForm, city: e.target.value })}
                    placeholder="e.g. Manali"
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#334155] block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newResortForm.state}
                    onChange={(e) => setNewResortForm({ ...newResortForm, state: e.target.value })}
                    placeholder="e.g. Himachal"
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#334155] block mb-1">Subscription Plan</label>
                  <select
                    value={newResortForm.plan}
                    onChange={(e) => setNewResortForm({ ...newResortForm, plan: e.target.value as any })}
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                  >
                    <option value="Basic">Basic (₹14,999/mo)</option>
                    <option value="Pro">Pro (₹27,999/mo)</option>
                    <option value="Enterprise">Enterprise (₹49,999/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#334155] block mb-1">Total Keys / Rooms</label>
                  <input
                    type="number"
                    value={newResortForm.totalRooms}
                    onChange={(e) => setNewResortForm({ ...newResortForm, totalRooms: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#334155] block mb-1">Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={newResortForm.ownerName}
                  onChange={(e) => setNewResortForm({ ...newResortForm, ownerName: e.target.value })}
                  placeholder="e.g. Rajesh Singhal"
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#334155] block mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  value={newResortForm.ownerEmail}
                  onChange={(e) => setNewResortForm({ ...newResortForm, ownerEmail: e.target.value })}
                  placeholder="e.g. rajesh@singhalresorts.com"
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddResortOpen(false)}
                  className="px-3.5 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl font-semibold text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl font-semibold"
                >
                  Onboard & Launch Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
