import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ResortTenant } from '@/types';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  Building2,
  Search,
  Plus,
  LogIn,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  X,
  Filter,
} from 'lucide-react';

export const AdminResortsPage: React.FC = () => {
  const navigate = useNavigate();
  const { allResorts, enterResortAsAdmin, addAuditLog } = useAuthStore();
  const [resortsList, setResortsList] = useState<ResortTenant[]>(allResorts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Trial'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Resort Form State
  const [newResort, setNewResort] = useState({
    name: '',
    city: '',
    state: '',
    plan: 'Pro' as 'Basic' | 'Pro' | 'Enterprise',
    totalRooms: 24,
    ownerName: '',
    ownerEmail: '',
  });

  const filteredResorts = useMemo(() => {
    return resortsList.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
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
  }, [resortsList, statusFilter, searchQuery]);

  const totalMRR = resortsList.reduce((acc, r) => acc + (r.status === 'Active' ? r.mrr : 0), 0);
  const activeCount = resortsList.filter((r) => r.status === 'Active').length;
  const trialCount = resortsList.filter((r) => r.status === 'Trial').length;

  const handleEnterResort = (resort: ResortTenant) => {
    enterResortAsAdmin(resort.id);
    addAuditLog('Tenant Impersonation', `Super Admin entered ${resort.name} for audit oversight`, 'Warning', resort.id);
    toast.success(`Entered ${resort.name} as Super Admin auditor.`);
    navigate('/rooms');
  };

  const handleToggleStatus = (resortId: string) => {
    setResortsList((prev) =>
      prev.map((r) => {
        if (r.id === resortId) {
          const nextStatus = r.status === 'Active' ? 'Trial' : 'Active';
          toast.info(`Updated ${r.name} status to ${nextStatus}.`);
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleCreateResort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResort.name || !newResort.ownerEmail) {
      toast.error('Please enter Resort Name and Owner Email.');
      return;
    }

    const created: ResortTenant = {
      id: `resort-${Date.now()}`,
      name: newResort.name,
      code: `JOY-${newResort.name.slice(0, 3).toUpperCase()}`,
      tagline: 'Luxury Nature & Stay Sanctuary',
      city: newResort.city || 'Goa',
      state: newResort.state || 'Goa',
      plan: newResort.plan,
      status: 'Active',
      totalRooms: Number(newResort.totalRooms) || 20,
      activeUsers: 8,
      mrr: newResort.plan === 'Enterprise' ? 49999 : newResort.plan === 'Pro' ? 27999 : 14999,
      ownerName: newResort.ownerName || 'Resort Owner',
      ownerEmail: newResort.ownerEmail,
      joinedDate: 'Today',
    };

    setResortsList([created, ...resortsList]);
    addAuditLog('Tenant Provisioned', `New resort ${created.name} provisioned under ${created.plan} plan`, 'Info', created.id);
    toast.success(`Provisioned ${created.name} successfully!`);
    setIsAddModalOpen(false);
    setNewResort({
      name: '',
      city: '',
      state: '',
      plan: 'Pro',
      totalRooms: 24,
      ownerName: '',
      ownerEmail: '',
    });
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-48 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=80"
            alt="Multi-Tenant Resorts"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Platform Multi-Tenant
                </span>
                <span className="text-xs text-[#64748B]">Joy SaaS Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Resort Properties (Tenants)
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Isolated database tenants with custom domain branding, inventory quotas, and billing
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Resort</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  {activeCount} Active
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Total Onboarded</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {resortsList.length}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  {trialCount} on 14-day trial
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  +18.4%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Platform MRR</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(totalMRR)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  Annualized: {formatINR(totalMRR * 12)}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  100% Up
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Tenant Isolation</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  Strict Multi-Tenant
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">
                  Isolated schemas & keys
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  Total
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Keys & Rooms Managed</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {resortsList.reduce((acc, r) => acc + r.totalRooms, 0)} Keys
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 truncate">
                  Across 5 destination states
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 min-w-[220px] max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by resort name, city, owner, code..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:border-[#0F5132]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Active', 'Trial'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`h-8 px-3 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#0F5132] text-white shadow-2xs'
                  : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Resorts Table Container */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#0F172A]">All Registered Resort Tenants</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#0F5132]">
                {filteredResorts.length} Properties
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Super Admin can access any tenant for security audits, data export, or plan changes
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
          <table className="w-full min-w-[1020px] text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                <th className="py-3.5 px-4 min-w-[260px]">Resort Property</th>
                <th className="py-3.5 px-4 min-w-[150px]">Location</th>
                <th className="py-3.5 px-4 min-w-[200px]">Owner Profile</th>
                <th className="py-3.5 px-4 min-w-[120px]">SaaS Plan</th>
                <th className="py-3.5 px-4 min-w-[130px]">Inventory / Keys</th>
                <th className="py-3.5 px-4 min-w-[140px]">Monthly Yield (MRR)</th>
                <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[170px]">Actions</th>
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
                        <p className="text-[11px] text-[#64748B] whitespace-nowrap">
                          {r.code} • {r.tagline}
                        </p>
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
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(r.id)}
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border cursor-pointer hover:opacity-80 transition-opacity ${
                        r.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                      title="Click to toggle status"
                    >
                      {r.status === 'Active' ? 'Active Account' : '14-Day Trial'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEnterResort(r)}
                      className="px-3 py-1.5 rounded-xl bg-[#0F5132]/10 hover:bg-[#0F5132] text-[#0F5132] hover:text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Audit As Admin</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Resort Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Provision New Resort Tenant</h3>
                <p className="text-xs text-[#64748B]">Set up an isolated database workspace</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResort} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Resort Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joy Heritage Palace, Jaipur"
                  value={newResort.name}
                  onChange={(e) => setNewResort({ ...newResort, name: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Jaipur"
                    value={newResort.city}
                    onChange={(e) => setNewResort({ ...newResort, city: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Rajasthan"
                    value={newResort.state}
                    onChange={(e) => setNewResort({ ...newResort, state: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">SaaS Plan Tier</label>
                  <select
                    value={newResort.plan}
                    onChange={(e) => setNewResort({ ...newResort, plan: e.target.value as any })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  >
                    <option value="Basic">Basic (₹14,999/mo)</option>
                    <option value="Pro">Pro (₹27,999/mo)</option>
                    <option value="Enterprise">Enterprise (₹49,999/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Total Room Keys</label>
                  <input
                    type="number"
                    min="1"
                    value={newResort.totalRooms}
                    onChange={(e) => setNewResort({ ...newResort, totalRooms: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Owner Full Name</label>
                  <input
                    type="text"
                    placeholder="Raja Man Singh"
                    value={newResort.ownerName}
                    onChange={(e) => setNewResort({ ...newResort, ownerName: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Owner Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@palace.in"
                    value={newResort.ownerEmail}
                    onChange={(e) => setNewResort({ ...newResort, ownerEmail: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs"
                >
                  Provision Resort Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
