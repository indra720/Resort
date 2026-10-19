import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import { getLeads } from '@/api/leads';
import { getFollowUps } from '@/api/followups';
import { getQuotations } from '@/api/quotations';
import {
  Target,
  TrendingUp,
  Award,
  PhoneCall,
  CalendarCheck,
  FileSpreadsheet,
  Users2,
  UserPlus,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Send,
  Building2,
  DollarSign,
  Briefcase,
  Layers,
  Percent,
} from 'lucide-react';

export const SalesExecutiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentResort } = useAuthStore();

  // Load Sales Executive specific leads, followups, and quotations
  const myLeads = useMemo(() => {
    return getLeads(currentResort.id, user);
  }, [currentResort.id, user]);

  const myFollowUps = useMemo(() => {
    return getFollowUps(currentResort.id, user, 'all');
  }, [currentResort.id, user]);

  const myQuotations = useMemo(() => {
    return getQuotations(currentResort.id, user);
  }, [currentResort.id, user]);

  // Personal performance metrics
  const monthlyTarget = 1800000; // ₹18,00,000 monthly target
  const wonLeads = myLeads.filter((l) => l.status === 'Booked');
  const wonValue = wonLeads.reduce(
    (sum, l) => sum + (l.budget_max || l.budget_min || 0),
    0
  );
  const activePipelineValue = myLeads
    .filter((l) => l.status !== 'Lost' && l.status !== 'Booked')
    .reduce((sum, l) => sum + (l.budget_max || l.budget_min || 0), 0);

  const targetProgress = Math.min(100, Math.round((wonValue / monthlyTarget) * 100));
  const estimatedCommission = Math.round(wonValue * 0.05); // 5% incentive

  // Today's priority follow-ups
  const urgentFollowUps = myFollowUps.slice(0, 4);

  return (
    <div className="space-y-4 text-[#111827] text-left pb-10">
      {/* 1. Header Hero Banner - Dedicated Sales Executive Identity */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[180px] sm:min-h-[200px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse" />
                  Sales Executive Command Center
                </span>
                <span className="text-xs text-[#64748B] font-semibold">
                  {currentResort.name}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                Welcome Back, {user?.name || 'Sameer Verma'}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-xl">
                Personal Sales Target, Assigned Corporate Leads & Incentive Pipeline
              </p>
            </div>

            {/* Quick Action Bar for Sales Executive */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => navigate('/leads')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>My Leads ({myLeads.length})</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/quotations')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0F5132]" />
                <span>Quotations ({myQuotations.length})</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/follow-ups')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                <PhoneCall className="w-4 h-4 text-sky-600" />
                <span>Follow-ups ({myFollowUps.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Personal Performance Metric Cards */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Monthly Target Progress */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center font-bold">
                  <Target className="w-4 h-4 text-[#0F5132]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {targetProgress}% Target
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">My Monthly Sales Target</p>
                <p className="text-xl font-black text-[#0F172A] mt-0.5">
                  {formatINR(wonValue)}
                </p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#0F5132] h-full rounded-full transition-all duration-500"
                    style={{ width: `${targetProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#64748B] mt-1.5">
                  Goal: {formatINR(monthlyTarget)} • {formatINR(Math.max(0, monthlyTarget - wonValue))} remaining
                </p>
              </div>
            </div>

            {/* Card 2: My Active Pipeline */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  {myLeads.filter((l) => l.status !== 'Booked' && l.status !== 'Lost').length} Active Deals
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">My Active Pipeline</p>
                <p className="text-xl font-black text-[#0F172A] mt-0.5">
                  {formatINR(activePipelineValue)}
                </p>
                <p className="text-[10px] text-blue-600 font-medium mt-1">
                  High-intent MICE, Weddings & Retreats
                </p>
              </div>
            </div>

            {/* Card 3: Closed Won Deals */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  {wonLeads.length} Bookings
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Deals Closed Won</p>
                <p className="text-xl font-black text-[#0F172A] mt-0.5">
                  {formatINR(wonValue)}
                </p>
                <p className="text-[10px] text-purple-600 font-medium mt-1">
                  Conversion Rate: {myLeads.length > 0 ? ((wonLeads.length / myLeads.length) * 100).toFixed(1) : '0'}%
                </p>
              </div>
            </div>

            {/* Card 4: My Commission & Incentive */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Rank #2 on Resort
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">My Earned Incentive</p>
                <p className="text-xl font-black text-[#0F172A] mt-0.5">
                  {formatINR(estimatedCommission)}
                </p>
                <p className="text-[10px] text-amber-700 font-medium mt-1">
                  5% commission on closed luxury bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Assigned Leads & Urgent Follow-up Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Cols): My Assigned Leads Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-[#0F5132]" />
                <h2 className="text-sm font-bold text-[#0F172A]">My Assigned Leads Pipeline</h2>
                <span className="text-xs bg-emerald-50 text-[#0F5132] px-2 py-0.5 rounded-full font-bold">
                  {myLeads.length} Leads
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/leads')}
                className="text-xs text-[#0F5132] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Pipeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {myLeads.slice(0, 6).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate('/leads')}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#0F5132] flex items-center justify-center font-bold text-xs shrink-0">
                      {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A] truncate">{lead.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {lead.lead_code}
                        </span>
                        {lead.score === 'Hot' && (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                            <Flame className="w-3 h-3 fill-rose-600" /> Hot
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {lead.city} • {lead.interested_in} • {lead.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-[#0F5132] block">
                      {formatINR(lead.budget_max || lead.budget_min || 0)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}

              {myLeads.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No leads currently assigned. Create a new lead to start your pipeline.
                </div>
              )}
            </div>
          </div>

          {/* Quick Quotations Summary for Sales Executive */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#0F5132]" />
                <h2 className="text-sm font-bold text-[#0F172A]">My Recent Quotations & Proposals</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/quotations')}
                className="text-xs text-[#0F5132] font-semibold hover:underline flex items-center gap-1"
              >
                <span>All Quotations</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {myQuotations.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  onClick={() => navigate('/quotations')}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#0F5132]/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">{q.quotation_number}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      q.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.status === 'Sent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-1 truncate">{q.guest_name}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500">{q.interested_in || 'Resort Stay'}</span>
                    <span className="text-xs font-bold text-[#0F5132]">{formatINR(q.grand_total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Follow-up Calls & Incentive Tracker */}
        <div className="space-y-4">
          {/* Today's Calls Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-[#0F172A]">Today's Follow-Ups</h2>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {myFollowUps.length} Pending
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {urgentFollowUps.map((fu) => (
                <div
                  key={fu.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A] truncate max-w-[150px]">
                      {fu.lead_name || 'Guest Inquirer'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {fu.scheduled_at || 'Today'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{fu.title}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#0F5132] font-semibold">{fu.lead_phone}</span>
                    <button
                      type="button"
                      onClick={() => {
                        toast.success('Call initiated', `Calling ${fu.lead_name} (${fu.lead_phone})`);
                      }}
                      className="px-2 py-1 bg-[#0F5132] text-white rounded text-[10px] font-bold hover:bg-[#0B3D25]"
                    >
                      Call Now
                    </button>
                  </div>
                </div>
              ))}

              {urgentFollowUps.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">
                  No urgent calls scheduled for today.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/follow-ups')}
              className="w-full mt-3 py-2 text-center text-xs font-bold text-[#0F5132] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors block"
            >
              Open Follow-Up Calendar
            </button>
          </div>

          {/* Sales Commission & Perks Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#0F5132] text-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                Q3 Incentive Tier
              </span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>

            <div>
              <p className="text-2xl font-black">{formatINR(estimatedCommission)}</p>
              <p className="text-xs text-emerald-200 mt-0.5">
                Current month approved incentive
              </p>
            </div>

            <div className="pt-2 border-t border-white/20 text-xs space-y-1">
              <div className="flex justify-between text-emerald-200">
                <span>Next Milestone:</span>
                <span className="font-bold text-white">₹15 Lakhs (7% Tier)</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Active Leads Assigned:</span>
                <span className="font-bold text-white">{myLeads.length} Leads</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
