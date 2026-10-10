import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  UserPlus,
  Search,
  Plus,
  Phone,
  MessageCircle,
  TrendingUp,
  Flame,
  Zap,
  Snowflake,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  Mail,
  MapPin,
} from 'lucide-react';

export interface InboundLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  score: number; // 0 - 100
  temperature: 'Hot' | 'Warm' | 'Cold';
  interest: 'Presidential Villa' | 'Luxury Suite' | 'Destination Wedding' | 'Corporate Offsite' | 'Weekend Cottage';
  budget: number;
  source: 'Website Direct' | 'Instagram Ad' | 'Google Ads' | 'MakeMyTrip' | 'Corporate Referral';
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent';
  assignedTo: string;
  createdAt: string;
}

const INITIAL_INBOUND_LEADS: InboundLead[] = [
  {
    id: 'LD-101',
    name: 'Dr. Siddharth & Aditi Rao',
    phone: '+91 98201 11223',
    email: 'dr.siddharth@apollo.org',
    city: 'Mumbai',
    score: 95,
    temperature: 'Hot',
    interest: 'Presidential Villa',
    budget: 180000,
    source: 'Website Direct',
    status: 'Proposal Sent',
    assignedTo: 'Sameer Verma',
    createdAt: 'Today, 10:15 AM',
  },
  {
    id: 'LD-102',
    name: 'Mehta Destination Wedding Group',
    phone: '+91 98110 99887',
    email: 'events@mehtajewels.in',
    city: 'Ahmedabad',
    score: 98,
    temperature: 'Hot',
    interest: 'Destination Wedding',
    budget: 1850000,
    source: 'Corporate Referral',
    status: 'Qualified',
    assignedTo: 'Rajvardhan Oberoi (Owner)',
    createdAt: 'Yesterday, 04:30 PM',
  },
  {
    id: 'LD-103',
    name: 'Ananya Deshmukh',
    phone: '+91 97665 44332',
    email: 'ananya.d@tcs.com',
    city: 'Pune',
    score: 78,
    temperature: 'Warm',
    interest: 'Luxury Suite',
    budget: 65000,
    source: 'Instagram Ad',
    status: 'Contacted',
    assignedTo: 'Amit Singh',
    createdAt: 'Yesterday, 06:10 PM',
  },
  {
    id: 'LD-104',
    name: 'Karan Singhania Tech Offsite',
    phone: '+91 98450 77665',
    email: 'karan@cloudzen.io',
    city: 'Bangalore',
    score: 88,
    temperature: 'Hot',
    interest: 'Corporate Offsite',
    budget: 420000,
    source: 'Google Ads',
    status: 'Qualified',
    assignedTo: 'Sameer Verma',
    createdAt: '2 days ago',
  },
  {
    id: 'LD-105',
    name: 'Pooja Hegde & Family',
    phone: '+91 99887 66554',
    email: 'pooja.h@gmail.com',
    city: 'Delhi',
    score: 55,
    temperature: 'Warm',
    interest: 'Weekend Cottage',
    budget: 38000,
    source: 'MakeMyTrip',
    status: 'New',
    assignedTo: 'Ananya Sharma',
    createdAt: '3 days ago',
  },
  {
    id: 'LD-106',
    name: 'Rohan Mehra',
    phone: '+91 98330 22119',
    email: 'rohan.mehra@gmail.com',
    city: 'Mumbai',
    score: 35,
    temperature: 'Cold',
    interest: 'Weekend Cottage',
    budget: 22000,
    source: 'Website Direct',
    status: 'Contacted',
    assignedTo: 'Amit Singh',
    createdAt: '4 days ago',
  },
];

export const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<InboundLead[]>(INITIAL_INBOUND_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilter, setTempFilter] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Mumbai',
    interest: 'Presidential Villa' as InboundLead['interest'],
    budget: 85000,
    source: 'Website Direct' as InboundLead['source'],
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (tempFilter !== 'All' && l.temperature !== tempFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.interest.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, tempFilter, searchQuery]);

  const hotCount = leads.filter((l) => l.temperature === 'Hot').length;
  const warmCount = leads.filter((l) => l.temperature === 'Warm').length;
  const totalLeadValue = leads.reduce((acc, l) => acc + l.budget, 0);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) {
      toast.error('Please enter name and contact phone number.');
      return;
    }

    const created: InboundLead = {
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email || 'lead@inquiry.com',
      city: newLead.city,
      score: 85,
      temperature: 'Hot',
      interest: newLead.interest,
      budget: Number(newLead.budget) || 50000,
      source: newLead.source,
      status: 'New',
      assignedTo: 'Sameer Verma',
      createdAt: 'Just now',
    };

    setLeads([created, ...leads]);
    toast.success(`Inbound lead for ${created.name} added successfully!`);
    setIsAddOpen(false);
    setNewLead({
      name: '',
      phone: '',
      email: '',
      city: 'Mumbai',
      interest: 'Presidential Villa',
      budget: 85000,
      source: 'Website Direct',
    });
  };

  const handleMoveToPipeline = (lead: InboundLead) => {
    toast.success(`Promoted ${lead.name} (${formatINR(lead.budget)}) into CRM Deal Pipeline!`);
    navigate('/crm');
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-48 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
            alt="Inbound Leads"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Guest Acquisition
                </span>
                <span className="text-xs text-[#64748B]">Lead Scoring & Qualification</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Inbound Guest Leads Directory
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                AI-scored guest prospects from website forms, social ads, OTAs, and luxury concierge referrals
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Capture New Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  {leads.length} Total
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Active Inbound Pool</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {leads.length} Leads
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">Across all marketing channels</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EF4444] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                  🔥 High Intent
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Hot Prospects</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {hotCount} Hot Leads
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#DC2626] mt-0.5 truncate">Ready for immediate contract</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  Value
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Pipeline Opportunity</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(totalLeadValue)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">Cumulative prospect budget</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  AI Scored
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Avg Lead Quality</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length)} / 100
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">High propensity to convert</p>
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
            placeholder="Search leads by guest name, city, phone, source..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Hot', 'Warm', 'Cold'] as const).map((temp) => (
            <button
              key={temp}
              type="button"
              onClick={() => setTempFilter(temp)}
              className={`h-8 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                tempFilter === temp
                  ? 'bg-[#0F5132] text-white shadow-2xs'
                  : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {temp === 'Hot' && <Flame className="w-3 h-3 text-amber-300" />}
              {temp === 'Warm' && <Zap className="w-3 h-3 text-sky-300" />}
              {temp === 'Cold' && <Snowflake className="w-3 h-3 text-slate-300" />}
              <span>{temp}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leads Directory Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A]">Inbound Qualified Guest Prospects</h3>
          <span className="text-xs text-[#64748B]">{filteredLeads.length} leads matching</span>
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
          <table className="w-full min-w-[950px] text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                <th className="py-3.5 px-4 min-w-[200px]">Lead Prospect</th>
                <th className="py-3.5 px-4 min-w-[120px]">Intent Score</th>
                <th className="py-3.5 px-4 min-w-[180px]">Category Interest</th>
                <th className="py-3.5 px-4 min-w-[130px]">Estimated Budget</th>
                <th className="py-3.5 px-4 min-w-[140px]">Source Channel</th>
                <th className="py-3.5 px-4 min-w-[130px]">Owner / Rep</th>
                <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[180px]">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLeads.map((l) => (
                <tr key={l.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-[#0F172A]">{l.name}</p>
                      <p className="text-[11px] text-[#64748B]">
                        {l.city} • {l.phone}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                          l.temperature === 'Hot'
                            ? 'bg-rose-100 text-rose-700'
                            : l.temperature === 'Warm'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {l.temperature === 'Hot' && <Flame className="w-2.5 h-2.5" />}
                        {l.score}/100
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#0F172A]">
                    {l.interest}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#0F5132]">
                    {formatINR(l.budget)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                      {l.source}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-[#334155]">
                    {l.assignedTo}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                        l.status === 'Proposal Sent'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : l.status === 'Qualified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${l.phone}`}
                        className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F5132] transition-colors"
                        title="Call Prospect"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleMoveToPipeline(l)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#0B3D25] text-white font-semibold text-xs inline-flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <span>Move to Pipeline</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capture Lead Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-[#E2E8F0] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Capture Inbound Lead</h3>
                <p className="text-xs text-[#64748B]">Add a high-intent prospect</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Guest / Booker Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="guest@domain.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Interest Category</label>
                  <select
                    value={newLead.interest}
                    onChange={(e) => setNewLead({ ...newLead, interest: e.target.value as any })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  >
                    <option value="Presidential Villa">Presidential Villa</option>
                    <option value="Luxury Suite">Luxury Suite</option>
                    <option value="Destination Wedding">Destination Wedding</option>
                    <option value="Corporate Offsite">Corporate Offsite</option>
                    <option value="Weekend Cottage">Weekend Cottage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Budget (₹ INR)</label>
                  <input
                    type="number"
                    value={newLead.budget}
                    onChange={(e) => setNewLead({ ...newLead, budget: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Guest City</label>
                  <input
                    type="text"
                    value={newLead.city}
                    onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Source Channel</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value as any })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  >
                    <option value="Website Direct">Website Direct</option>
                    <option value="Instagram Ad">Instagram Ad</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="MakeMyTrip">MakeMyTrip</option>
                    <option value="Corporate Referral">Corporate Referral</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs"
                >
                  Save Inbound Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
