import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import {
  Building2,
  CalendarCheck,
  Sparkles,
  Utensils,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PhoneCall,
  CalendarDays,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Plus,
  ArrowUpRight,
  Layers,
  Key,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VIPEscalation {
  id: string;
  category: string;
  villa: string;
  guestName: string;
  notes: string;
  status: 'Action Assigned' | 'Arranged' | 'In Progress';
  time: string;
  phone: string;
}

const INITIAL_VIP_LIST: VIPEscalation[] = [
  {
    id: 'vip-1',
    category: 'VIP Arrival',
    villa: 'Villa V-01 (Presidential Pool Villa)',
    guestName: 'Pooja Hegde',
    notes: 'Requested Goa airport private luxury BMW transfer at 04:30 PM. Chef Sanjeev personally preparing Goan prawn curry welcome platter.',
    status: 'Action Assigned',
    time: 'Today 04:30 PM',
    phone: '+91 98201 44210',
  },
  {
    id: 'vip-2',
    category: 'Special Celebration',
    villa: 'Villa V-07 (Sunset Jacuzzi Suite)',
    guestName: 'Rohan Mehra (25th Anniversary)',
    notes: 'Beachfront gazebo candlelit table reserved for 08:00 PM. Violinist confirmed by events team.',
    status: 'Arranged',
    time: 'Tonight 08:00 PM',
    phone: '+91 94140 88291',
  },
  {
    id: 'vip-3',
    category: 'Corporate Offsite',
    villa: '12 Villas (Infosys Leadership)',
    guestName: 'Infosys Leadership Summit',
    notes: 'Banqueting hall A/V setup inspection scheduled for 03:00 PM with IT department.',
    status: 'In Progress',
    time: 'Today 03:00 PM',
    phone: '+91 99881 22345',
  },
];

export const ResortManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'vip' | 'shifts'>('all');
  const [vipList, setVipList] = useState<VIPEscalation[]>(INITIAL_VIP_LIST);

  const handleAcknowledge = (id: string) => {
    setVipList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Arranged' } : item
      )
    );
    toast.success('VIP Note Updated', 'Escalation marked as arranged.');
  };

  return (
    <div className="space-y-4 text-[#111827] w-full pb-8">
      {/* 1. Panoramic Hero Section with Header & 5 Operational Command KPI Cards */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[180px] sm:min-h-[200px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
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
                  General Operations Command
                </span>
                <span className="text-xs font-medium text-[#64748B]">
                  Duty GM: {user?.name || 'Ananya Sharma'}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                {currentResort?.name} • Operations Hub
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-2xl">
                Real-time synchronization between Front Desk, Housekeeping, Kitchen F&B, and Concierge
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Today: 08 Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/check-in-out')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Front Desk</span>
                <span className="sm:hidden">Desk</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Operational Pulse KPI Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* KPI 1: Live Occupancy */}
            <div
              onClick={() => navigate('/rooms')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-[#0F5132]/50 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  Live 87.5%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Live Occupancy</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  28 / 32
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    Villas Occupied
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 2: Today's Arrivals */}
            <div
              onClick={() => navigate('/check-in-out')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  6 / 8 In
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Today's Arrivals</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  8 Check-ins
                  <p className="text-[10px] sm:text-[11px] text-sky-600 font-semibold mt-0.5 truncate">
                    2 Pending Evening
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 3: Departures */}
            <div
              onClick={() => navigate('/check-in-out')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  4 Settled
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Departures</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  5 Villas
                  <p className="text-[10px] sm:text-[11px] text-amber-600 font-semibold mt-0.5 truncate">
                    1 Late Check-Out (V-08)
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 4: Cleaning Index */}
            <div
              onClick={() => navigate('/housekeeping')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0F5132] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  26 Ready
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Turnover Index</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  81% Clean
                  <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium mt-0.5 truncate">
                    3 In-cleaning • 3 Inspected
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 5: Dining Covers */}
            <div
              onClick={() => navigate('/restaurant')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between min-w-0 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  4 Active KOT
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Dining Covers</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  18 Tables
                  <p className="text-[10px] sm:text-[11px] text-purple-600 font-semibold mt-0.5 truncate">
                    Lakefront & Room Service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Operations Action Strip (Mobile Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <button
          type="button"
          onClick={() => navigate('/check-in-out')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Front Desk Arrivals</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/housekeeping')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Housekeeping Turnover</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/restaurant')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <Utensils className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>F&B Kitchen Queue</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/crm')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <Users className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Sales & Leads</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/staff')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#1E293B] shadow-2xs whitespace-nowrap active:scale-[0.98] transition-all shrink-0"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Staff Duty Roster</span>
        </button>
      </div>

      {/* 3. Middle Section: VIP Guest Watchlist & Department Shift Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* VIP Watchlist & Escalations */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Today's VIP Watchlist & Escalation Notes</span>
              </h3>
              <p className="text-xs text-[#64748B]">
                High-priority concierge requests requiring GM oversight
              </p>
            </div>
            <button
              onClick={() => navigate('/guests')}
              className="text-xs text-[#0F5132] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Guest Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Standalone VIP Cards (Stayora Luxury Native App Style) */}
          <div className="space-y-3">
            {vipList.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8FAFC]/70 hover:bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] space-y-3 transition-all text-left"
              >
                {/* Row 1: Category badge left, Status pill right (Fits 320px screen perfectly) */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200/80">
                    {item.category}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0',
                      item.status === 'Arranged'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'Action Assigned'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    )}
                  >
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        item.status === 'Arranged'
                          ? 'bg-emerald-500'
                          : item.status === 'Action Assigned'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      )}
                    />
                    {item.status}
                  </span>
                </div>

                {/* Row 2: Luxury Guest Identity */}
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    {item.guestName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[#0F172A] text-sm truncate">{item.guestName}</h4>
                    <p className="text-[11px] text-[#0F5132] font-semibold truncate">{item.villa}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#94A3B8] shrink-0" /> <span className="truncate">{item.time} • {item.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Row 3: Manager Special Instructions Box */}
                <p className="text-xs text-[#334155] bg-white border border-[#E2E8F0] rounded-xl p-2.5 leading-relaxed shadow-2xs">
                  {item.notes}
                </p>

                {/* Row 4: Action Buttons */}
                <div className="pt-0.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAcknowledge(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0F5132] hover:bg-[#0B3D25] active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-2xs transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Arranged</span>
                  </button>

                  <a
                    href={`tel:${item.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F5132] active:scale-[0.98] rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call Guest</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Shift Pulse Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0F5132]" />
                <span>Shift Attendance Pulse</span>
              </h3>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> 21 On Duty
              </span>
            </div>

            <div className="space-y-2.5 text-xs pt-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#1E293B] truncate block">Front Desk & Reception</span>
                    <span className="text-[10px] text-[#64748B]">Lead: Pooja K.</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0F172A] block">3 / 3</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% Present</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#0F5132] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#1E293B] truncate block">Housekeeping & Linens</span>
                    <span className="text-[10px] text-[#64748B]">Lead: Sunita D.</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0F172A] block">6 / 6</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Turnover Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#1E293B] truncate block">Kitchen Chefs & Stewards</span>
                    <span className="text-[10px] text-[#64748B]">Head Chef: Sanjeev</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0F172A] block">8 / 8</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Lunch Shift</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#1E293B] truncate block">Security & Bell Desk</span>
                    <span className="text-[10px] text-[#64748B]">Main Gate & Valet</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0F172A] block">4 / 4</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">All Gates Secure</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => navigate('/staff')}
              className="w-full py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-bold text-[#0F5132] border border-[#CBD5E1] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>Manage Full Duty Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
