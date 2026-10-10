import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  Users2,
  Kanban,
  List,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Building2,
  TrendingUp,
  Flame,
  X,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

export type PipelineStage = 'Inquiry' | 'Site Visit' | 'Proposal Sent' | 'Negotiation' | 'Won';

export interface Deal {
  id: string;
  title: string;
  guestName: string;
  phone: string;
  amount: number;
  stage: PipelineStage;
  category: 'Destination Wedding' | 'Corporate Offsite' | 'Presidential Villa' | 'Luxury Suite' | 'Honeymoon Package';
  expectedClose: string;
  assignedTo: string;
  probability: number;
}

const INITIAL_DEALS: Deal[] = [
  {
    id: 'DEAL-701',
    title: 'Mehta Destination Wedding (3 Nights Buyout)',
    guestName: 'Rajesh Mehta',
    phone: '+91 98110 99887',
    amount: 1850000,
    stage: 'Negotiation',
    category: 'Destination Wedding',
    expectedClose: '15 Oct 2026',
    assignedTo: 'Rajvardhan Oberoi (Owner)',
    probability: 85,
  },
  {
    id: 'DEAL-702',
    title: 'TechCorp Annual Leadership Offsite',
    guestName: 'Karan Singhania',
    phone: '+91 98450 77665',
    amount: 420000,
    stage: 'Proposal Sent',
    category: 'Corporate Offsite',
    expectedClose: '20 Oct 2026',
    assignedTo: 'Sameer Verma',
    probability: 60,
  },
  {
    id: 'DEAL-703',
    title: 'Dr. Siddharth 4-Night Luxury Pool Villa',
    guestName: 'Dr. Siddharth Rao',
    phone: '+91 98201 11223',
    amount: 180000,
    stage: 'Proposal Sent',
    category: 'Presidential Villa',
    expectedClose: '18 Oct 2026',
    assignedTo: 'Sameer Verma',
    probability: 75,
  },
  {
    id: 'DEAL-704',
    title: 'Sunil Gavaskar VIP Golf Weekend Stay',
    guestName: 'Sunil Gavaskar',
    phone: '+91 98200 44332',
    amount: 120000,
    stage: 'Won',
    category: 'Presidential Villa',
    expectedClose: 'Closed Won',
    assignedTo: 'Ananya Sharma (Manager)',
    probability: 100,
  },
  {
    id: 'DEAL-705',
    title: 'Goa Beachfront Honeymoon Sanctuary',
    guestName: 'Arjun & Riya Malhotra',
    phone: '+91 99203 11882',
    amount: 95000,
    stage: 'Site Visit',
    category: 'Honeymoon Package',
    expectedClose: '24 Oct 2026',
    assignedTo: 'Sameer Verma',
    probability: 50,
  },
  {
    id: 'DEAL-706',
    title: 'Pharma Syndicate Annual Gala & Stay',
    guestName: 'Dr. Ketan Parekh',
    phone: '+91 97654 33221',
    amount: 680000,
    stage: 'Inquiry',
    category: 'Corporate Offsite',
    expectedClose: '05 Nov 2026',
    assignedTo: 'Sameer Verma',
    probability: 25,
  },
  {
    id: 'DEAL-707',
    title: 'Family Reunion Villa Buyout (12 Pax)',
    guestName: 'Kavita Iyer',
    phone: '+91 98411 22998',
    amount: 240000,
    stage: 'Inquiry',
    category: 'Luxury Suite',
    expectedClose: '30 Oct 2026',
    assignedTo: 'Amit Singh',
    probability: 30,
  },
];

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'Inquiry', label: '1. New Inquiries', color: 'bg-blue-500' },
  { id: 'Site Visit', label: '2. Tour / Site Visit', color: 'bg-indigo-500' },
  { id: 'Proposal Sent', label: '3. Proposal & Quotation', color: 'bg-amber-500' },
  { id: 'Negotiation', label: '4. Contract Negotiation', color: 'bg-purple-500' },
  { id: 'Won', label: '5. Closed Won', color: 'bg-emerald-500' },
];

export const CRMPage: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);

  // New Deal Form State
  const [newDeal, setNewDeal] = useState({
    title: '',
    guestName: '',
    phone: '',
    amount: 150000,
    stage: 'Inquiry' as PipelineStage,
    category: 'Presidential Villa' as Deal['category'],
    expectedClose: '25 Oct 2026',
    assignedTo: 'Sameer Verma',
  });

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          d.title.toLowerCase().includes(q) ||
          d.guestName.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [deals, searchQuery]);

  const totalPipelineValue = deals.reduce((acc, d) => acc + (d.stage !== 'Won' ? d.amount : 0), 0);
  const totalWonValue = deals.filter((d) => d.stage === 'Won').reduce((acc, d) => acc + d.amount, 0);

  const moveStage = (dealId: string, direction: 'forward' | 'backward') => {
    const stageOrder: PipelineStage[] = ['Inquiry', 'Site Visit', 'Proposal Sent', 'Negotiation', 'Won'];
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const currentIndex = stageOrder.indexOf(d.stage);
          const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex >= 0 && nextIndex < stageOrder.length) {
            const nextStage = stageOrder[nextIndex];
            toast.success(`Moved "${d.title}" to ${nextStage}`);
            return {
              ...d,
              stage: nextStage,
              probability: nextStage === 'Won' ? 100 : Math.min(90, (nextIndex + 1) * 20),
            };
          }
        }
        return d;
      })
    );
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.guestName) {
      toast.error('Please enter deal title and guest name.');
      return;
    }

    const created: Deal = {
      id: `DEAL-${Math.floor(100 + Math.random() * 900)}`,
      title: newDeal.title,
      guestName: newDeal.guestName,
      phone: newDeal.phone || '+91 98000 00000',
      amount: Number(newDeal.amount) || 100000,
      stage: newDeal.stage,
      category: newDeal.category,
      expectedClose: newDeal.expectedClose,
      assignedTo: newDeal.assignedTo,
      probability: newDeal.stage === 'Won' ? 100 : 30,
    };

    setDeals([created, ...deals]);
    toast.success(`Created deal "${created.title}" successfully!`);
    setIsAddDealOpen(false);
    setNewDeal({
      title: '',
      guestName: '',
      phone: '',
      amount: 150000,
      stage: 'Inquiry',
      category: 'Presidential Villa',
      expectedClose: '25 Oct 2026',
      assignedTo: 'Sameer Verma',
    });
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-48 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="CRM & Pipeline"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Sales Pipeline Board
                </span>
                <span className="text-xs text-[#64748B]">Revenue Velocity</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                CRM & Deal Pipeline Board
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Visual sales pipeline tracking destination weddings, corporate retreats, and villa buyout deals
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-[#0F5132] text-white shadow-2xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#0F5132] text-white shadow-2xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsAddDealOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Deal</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pipeline Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0F5132] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Open
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Active Pipeline Value</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(totalPipelineValue)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  {deals.filter((d) => d.stage !== 'Won').length} active deals
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Closed Won
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Won Deals (MTD)</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(totalWonValue)}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#16A34A] mt-0.5 truncate">Confirmed deposits</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  High Ticket
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Avg Deal Size</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 truncate">
                  {formatINR(Math.round(totalPipelineValue / (deals.length || 1)))}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">Group & villa buyouts</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  High
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Win Conversion Rate</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  38.5%
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">From quotation to deposit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Navigation Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals by title, guest, phone, or category..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="h-9 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F5132] flex items-center gap-1.5 transition-colors"
          >
            <span>Inbound Leads</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main View: Kanban or List */}
      {viewMode === 'kanban' ? (
        <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-2xs overflow-hidden">
          {/* Mobile Swipe Notice */}
          <div className="lg:hidden flex items-center justify-between gap-2 px-3 py-1.5 mb-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[11px] text-[#475569]">
            <span className="flex items-center gap-1.5 font-medium min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse shrink-0" />
              <span className="truncate">Swipe columns horizontally to view all pipeline stages</span>
            </span>
            <span className="text-[10px] font-bold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap shrink-0">
              ↔ Swipe
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin pb-2">
            <div className="flex gap-4 min-w-[1200px]">
              {STAGES.map((stage) => {
                const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
                const stageTotal = stageDeals.reduce((acc, d) => acc + d.amount, 0);

                return (
                  <div
                    key={stage.id}
                    className="flex-1 min-w-[230px] max-w-[270px] bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0] flex flex-col"
                  >
                    {/* Stage Header */}
                    <div className="pb-3 border-b border-[#E2E8F0] mb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0F172A]">{stage.label}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#E2E8F0] text-[11px] font-bold text-[#475569]">
                          {stageDeals.length}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-[#0F5132] mt-1">
                        {formatINR(stageTotal)}
                      </p>
                    </div>

                    {/* Deal Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] scrollbar-thin">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="p-3.5 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#0F5132]/40 shadow-2xs hover:shadow-xs transition-all space-y-2.5 text-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                {deal.category}
                              </span>
                              <span className="text-[10px] font-bold text-[#0F5132]">
                                {deal.probability}% Prob
                              </span>
                            </div>
                            <h4 className="font-bold text-[#0F172A] text-xs leading-snug">
                              {deal.title}
                            </h4>
                            <p className="text-[11px] text-[#64748B] mt-0.5">
                              {deal.guestName} • {deal.phone}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                            <span className="text-sm font-black text-[#0F5132]">
                              {formatINR(deal.amount)}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">
                              Close: {deal.expectedClose}
                            </span>
                          </div>

                          {/* Stage Transition Buttons */}
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            {stage.id !== 'Inquiry' ? (
                              <button
                                type="button"
                                onClick={() => moveStage(deal.id, 'backward')}
                                className="p-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] flex items-center gap-0.5"
                                title="Move to previous stage"
                              >
                                <ArrowLeft className="w-3 h-3" />
                                <span>Back</span>
                              </button>
                            ) : <div />}

                            {stage.id !== 'Won' && (
                              <button
                                type="button"
                                onClick={() => moveStage(deal.id, 'forward')}
                                className="px-2 py-1 rounded-lg bg-[#0F5132] hover:bg-[#0B3D25] text-white font-semibold text-[10px] flex items-center gap-1 shadow-2xs"
                                title="Advance to next stage"
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {stageDeals.length === 0 && (
                        <div className="p-4 rounded-xl border border-dashed border-[#E2E8F0] text-center text-[11px] text-[#94A3B8]">
                          No deals in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List Table View */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[950px] text-left text-xs text-[#1E293B] border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                  <th className="py-3.5 px-4 min-w-[260px]">Deal Title & Guest</th>
                  <th className="py-3.5 px-4 min-w-[150px]">Stage</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Deal Amount</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Category</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Expected Close</th>
                  <th className="py-3.5 px-4 min-w-[160px]">Owner / Rep</th>
                  <th className="py-3.5 px-4 text-right min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredDeals.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-[#0F172A]">{d.title}</p>
                        <p className="text-[11px] text-[#64748B]">{d.guestName} • {d.phone}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                        {d.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#0F5132] text-sm">
                      {formatINR(d.amount)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                      {d.category}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#334155]">
                      {d.expectedClose}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                      {d.assignedTo}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {d.stage !== 'Won' && (
                        <button
                          type="button"
                          onClick={() => moveStage(d.id, 'forward')}
                          className="px-2.5 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#0B3D25] text-white font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {isAddDealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-[#E2E8F0] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Create New Sales Deal</h3>
                <p className="text-xs text-[#64748B]">Add a prospect into the active sales pipeline</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDealOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goan Sunset Wedding Buyout"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Guest / Booker Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sameer Kapoor"
                    value={newDeal.guestName}
                    onChange={(e) => setNewDeal({ ...newDeal, guestName: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={newDeal.phone}
                    onChange={(e) => setNewDeal({ ...newDeal, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Deal Amount (₹ INR)</label>
                  <input
                    type="number"
                    value={newDeal.amount}
                    onChange={(e) => setNewDeal({ ...newDeal, amount: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Pipeline Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as PipelineStage })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  >
                    <option value="Inquiry">1. New Inquiry</option>
                    <option value="Site Visit">2. Tour / Site Visit</option>
                    <option value="Proposal Sent">3. Proposal Sent</option>
                    <option value="Negotiation">4. Negotiation</option>
                    <option value="Won">5. Closed Won</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Category</label>
                  <select
                    value={newDeal.category}
                    onChange={(e) => setNewDeal({ ...newDeal, category: e.target.value as any })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  >
                    <option value="Destination Wedding">Destination Wedding</option>
                    <option value="Corporate Offsite">Corporate Offsite</option>
                    <option value="Presidential Villa">Presidential Villa</option>
                    <option value="Luxury Suite">Luxury Suite</option>
                    <option value="Honeymoon Package">Honeymoon Package</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Expected Close Date</label>
                  <input
                    type="text"
                    value={newDeal.expectedClose}
                    onChange={(e) => setNewDeal({ ...newDeal, expectedClose: e.target.value })}
                    className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddDealOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
