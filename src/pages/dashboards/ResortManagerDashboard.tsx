import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { formatINR } from '@/lib/formatINR';
import {
  Building2,
  CalendarCheck,
  Sparkles,
  Utensils,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  PhoneCall,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const ResortManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort, user } = useAuthStore();

  return (
    <div className="space-y-4 text-[#111827] w-full pb-8">
      {/* 1. Operations Command Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] text-[11px] font-bold uppercase tracking-wider border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse" />
              General Operations Command
            </span>
            <span className="text-xs font-medium text-[#64748B]">Duty Manager: {user?.name || 'Ananya Sharma'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1.5">
            {currentResort?.name} • Daily Operations Hub
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
            Real-time synchronization between Front Desk, Housekeeping, Kitchen F&B, and Concierge
          </p>
        </div>

        {/* Quick Operations Actions */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/check-in-out')}
            className="flex-1 min-w-[130px] sm:flex-none px-3 py-2 rounded-xl bg-[#0F5132] hover:bg-[#0A3622] active:scale-95 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Front Desk Arrivals</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/housekeeping')}
            className="flex-1 min-w-[110px] sm:flex-none px-3 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 active:scale-95 border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
            <span className="truncate">Housekeeping</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/crm')}
            className="flex-1 min-w-[100px] sm:flex-none px-3 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 active:scale-95 border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
            <span className="truncate">Sales & CRM</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 Operational Pulse KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Occupancy Card */}
        <div
          onClick={() => navigate('/rooms')}
          className="bg-white border border-[#E2E8F0] hover:border-[#0F5132] rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-w-0"
        >
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
              Live
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Live Occupancy</p>
            <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
              87.5%
              <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                28 / 32 Villas Occupied
              </p>
            </div>
          </div>
        </div>

        {/* Today's Check-Ins */}
        <div
          onClick={() => navigate('/check-in-out')}
          className="bg-white border border-[#E2E8F0] hover:border-[#0F5132] rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-w-0"
        >
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
              Arrivals
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Today's Arrivals</p>
            <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
              6 / 8 Arrived
              <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold mt-0.5 truncate">
                2 Expected evening
              </p>
            </div>
          </div>
        </div>

        {/* Today's Check-Outs */}
        <div
          onClick={() => navigate('/check-in-out')}
          className="bg-white border border-[#E2E8F0] hover:border-[#0F5132] rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-w-0"
        >
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
              Departures
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Departures</p>
            <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
              4 / 5 Settled
              <p className="text-[10px] sm:text-[11px] text-amber-600 font-semibold mt-0.5 truncate">
                1 Late check-out (V-08)
              </p>
            </div>
          </div>
        </div>

        {/* Housekeeping Turnaround */}
        <div
          onClick={() => navigate('/housekeeping')}
          className="bg-white border border-[#E2E8F0] hover:border-[#0F5132] rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-w-0"
        >
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
              Turnover
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">Cleaning Index</p>
            <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
              26 Clean
              <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium mt-0.5 truncate">
                3 In-cleaning • 3 Inspected
              </p>
            </div>
          </div>
        </div>

        {/* Dining & F&B Covers */}
        <div
          onClick={() => navigate('/restaurant')}
          className="bg-white border border-[#E2E8F0] hover:border-[#0F5132] rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between min-w-0 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
              Dining
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] leading-snug">F&B Live Covers</p>
            <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
              18 Tables Active
              <p className="text-[10px] sm:text-[11px] text-rose-600 font-semibold mt-0.5 truncate">
                4 Open Kitchen KOTs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: VIP Guest Watchlist & Department Shift Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* VIP Watchlist & Escalations */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
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

          <div className="space-y-2.5">
            <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                    VIP Arrival • Villa V-01
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] truncate">Pooja Hegde (Presidential Pool Villa)</span>
                </div>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  Requested Goa airport private luxury BMW transfer at 04:30 PM. Chef Sanjeev personally preparing Goan prawn curry welcome platter.
                </p>
              </div>
              <span className="text-[10px] text-amber-800 font-semibold whitespace-nowrap bg-white px-2 py-1 rounded-md border border-amber-200 self-start sm:self-auto shrink-0">
                Action Assigned
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#0F5132] text-[10px] font-bold">
                    Special Service • Villa V-07
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] truncate">Rohan Mehra (25th Anniversary)</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Beachfront gazebo candlelit table reserved for 08:00 PM. Violinist confirmed by events team.
                </p>
              </div>
              <span className="text-[10px] text-[#0F5132] font-semibold whitespace-nowrap bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 self-start sm:self-auto shrink-0">
                Arranged
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-[10px] font-bold">
                    Corporate Retreat • 12 Villas
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] truncate">Infosys Leadership Summit</span>
                </div>
                <p className="text-xs text-blue-950/80 leading-relaxed">
                  Banqueting hall A/V setup inspection scheduled for 03:00 PM with IT department.
                </p>
              </div>
              <span className="text-[10px] text-blue-800 font-semibold whitespace-nowrap bg-white px-2 py-1 rounded-md border border-blue-200 self-start sm:self-auto shrink-0">
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Department Shift Pulse Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0F5132]" />
              <span>Shift Attendance Pulse</span>
            </h3>
            <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 21 On Duty
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CalendarCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-[#1E293B] truncate">Front Desk & Reception</span>
              </div>
              <span className="font-bold text-[#0F172A] shrink-0">3 / 3</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-[#0F5132] shrink-0" />
                <span className="font-semibold text-[#1E293B] truncate">Housekeeping & Linens</span>
              </div>
              <span className="font-bold text-[#0F172A] shrink-0">6 / 6</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Utensils className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold text-[#1E293B] truncate">Kitchen Chefs & Stewards</span>
              </div>
              <span className="font-bold text-[#0F172A] shrink-0">8 / 8</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
                <span className="font-semibold text-[#1E293B] truncate">Security & Bell Desk</span>
              </div>
              <span className="font-bold text-[#0F172A] shrink-0">4 / 4</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/staff')}
            className="w-full py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-xs font-bold text-[#0F5132] border border-[#E2E8F0] transition-colors"
          >
            Manage Staff Duty Roster →
          </button>
        </div>
      </div>
    </div>
  );
};
