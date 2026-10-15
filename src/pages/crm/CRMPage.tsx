import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatINR } from "@/lib/formatINR";
import { toast } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getLeads, getLeadStats, updateLead } from "@/api/leads";
import { getFunnelAnalytics, getExecutiveLeaderboard } from "@/api/targets";
import { Lead, LeadStatus } from "@/types/crm";
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
  UserPlus,
  BarChart3,
  Trophy,
  Target,
  PieChart,
  FileText,
  Zap,
  FileBarChart,
  Settings,
} from "lucide-react";

export const CRMPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentResort } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState(getLeadStats(currentResort.id, user));
  const [viewMode, setViewMode] = useState<
    "kanban" | "list" | "funnel" | "leaderboard"
  >("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = () => {
    const list = getLeads(currentResort.id, user);
    setLeads(list);
    setStats(getLeadStats(currentResort.id, user));
  };

  useEffect(() => {
    loadData();
  }, [currentResort.id, user]);

  const funnelData = useMemo(
    () => getFunnelAnalytics(currentResort.id),
    [currentResort.id, leads],
  );
  const leaderboard = useMemo(
    () => getExecutiveLeaderboard(currentResort.id),
    [currentResort.id, leads],
  );

  const pipelineStages: { id: LeadStatus; label: string; color: string }[] = [
    { id: "New", label: "1. New Enquiries", color: "bg-blue-500" },
    { id: "Contacted", label: "2. Contacted", color: "bg-indigo-500" },
    {
      id: "Site Visit",
      label: "3. Site Visit Scheduled",
      color: "bg-purple-500",
    },
    { id: "Interested", label: "4. Highly Interested", color: "bg-amber-500" },
    { id: "Booked", label: "5. Closed Won (Booked)", color: "bg-emerald-500" },
    { id: "Lost", label: "6. Lost", color: "bg-rose-500" },
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          l.name.toLowerCase().includes(q) ||
          l.lead_code.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.interested_in.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, searchQuery]);

  const totalPipelineValue = leads
    .filter((l) => l.status !== "Lost")
    .reduce((acc, l) => acc + (l.budget_max || l.budget_min || 0), 0);

  const totalWonValue = leads
    .filter((l) => l.status === "Booked")
    .reduce((acc, l) => acc + (l.budget_max || l.budget_min || 0), 0);

  const moveStage = (leadId: string, direction: "forward" | "backward") => {
    const stageOrder: LeadStatus[] = [
      "New",
      "Contacted",
      "Site Visit",
      "Interested",
      "Booked",
    ];
    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead) return;

    const currentIndex = stageOrder.indexOf(currentLead.status);
    if (currentIndex === -1) return;

    const nextIndex =
      direction === "forward" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < stageOrder.length) {
      const nextStage = stageOrder[nextIndex];
      updateLead(leadId, { status: nextStage }, currentResort.id, user);
      toast.success(`Advanced "${currentLead.name}" to ${nextStage}`);
      loadData();
    }
  };

  return (
    <div className="space-y-4 text-[#111827] text-left">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[170px] sm:min-h-[190px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="CRM Overview"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse" />
                  CRM Overview & Pipeline
                </span>
                <span className="text-xs text-[#64748B] font-semibold">
                  {currentResort.name}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                CRM & Pipeline Summary
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-xl">
                Unified sales pipeline synchronized directly from lead inquiries
                across luxury villas, weddings, and retreats.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#E2E8F0] shadow-2xs overflow-x-auto max-w-full scrollbar-none">
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    viewMode === "kanban"
                      ? "bg-[#0F5132] text-white shadow-2xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Pipeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    viewMode === "list"
                      ? "bg-[#0F5132] text-white shadow-2xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("funnel")}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    viewMode === "funnel"
                      ? "bg-[#0F5132] text-white shadow-2xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Funnel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("leaderboard")}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    viewMode === "leaderboard"
                      ? "bg-[#0F5132] text-white shadow-2xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Targets</span>
                </button>
              </div>

              {/* Quick links to Phase 3 modules (Horizontally scrollable on mobile) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full py-0.5">
                <button
                  type="button"
                  onClick={() => navigate("/leads")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0 whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Leads</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/quotations")}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5 text-[#0F5132]" />
                  <span>Quotations</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/templates")}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0F5132]" />
                  <span>Templates</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/automations")}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 text-[#0F5132]" />
                  <span>Automations</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/crm/reports")}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  <FileBarChart className="w-3.5 h-3.5 text-[#0F5132]" />
                  <span>Reports</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/crm/settings")}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  <Settings className="w-3.5 h-3.5 text-[#0F5132]" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pipeline Metric Cards (Calculated from Leads store) */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0F5132] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Open
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Active Pipeline
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {formatINR(totalPipelineValue)}
                  <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 truncate">
                    {
                      leads.filter(
                        (l) => l.status !== "Lost" && l.status !== "Booked",
                      ).length
                    }{" "}
                    active deals
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Won
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Won Bookings
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {formatINR(totalWonValue)}
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] mt-0.5 truncate">
                    {stats.bookings} confirmed
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  High Ticket
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Avg Budget
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {formatINR(
                    Math.round(totalPipelineValue / (leads.length || 1)),
                  )}
                  <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">
                    Across {leads.length} leads
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  Ratio
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Win Conversion
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {leads.length > 0
                    ? ((stats.bookings / leads.length) * 100).toFixed(1)
                    : "0.0"}
                  %
                  <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">
                    From {leads.length} inquiries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pipeline by guest name, phone, city, or package..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
          />
        </div>

        <button
          type="button"
          onClick={() => navigate("/leads")}
          className="h-9 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0F5132] flex items-center justify-center gap-1.5 transition-colors shrink-0"
        >
          <span>Full Leads Directory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main View: Kanban Board */}
      {viewMode === "kanban" && (
        <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin pb-2">
            <div className="flex gap-4 min-w-[1300px]">
              {pipelineStages.map((stage) => {
                const stageLeads = filteredLeads.filter(
                  (l) => l.status === stage.id,
                );
                const stageTotal = stageLeads.reduce(
                  (acc, l) => acc + (l.budget_max || l.budget_min || 0),
                  0,
                );

                return (
                  <div
                    key={stage.id}
                    className="flex-1 min-w-[210px] max-w-[260px] bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0] flex flex-col"
                  >
                    {/* Stage Header */}
                    <div className="pb-3 border-b border-[#E2E8F0] mb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0F172A]">
                          {stage.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#475569]">
                          {stageLeads.length}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-[#0F5132] mt-1">
                        {formatINR(stageTotal)}
                      </p>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin">
                      {stageLeads.map((l) => (
                        <div
                          key={l.id}
                          onClick={() => navigate("/leads")}
                          className="p-3 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#0F5132]/40 shadow-2xs hover:shadow-xs transition-all space-y-2 text-xs cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                              {l.lead_code}
                            </span>
                            {l.score === "Hot" && (
                              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                                <Flame className="w-3 h-3 fill-rose-600" /> Hot
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-bold text-[#0F172A] text-xs leading-snug">
                              {l.name}
                            </h4>
                            <p className="text-[11px] text-[#64748B]">
                              {l.city} • {l.interested_in}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-[#F1F5F9]">
                            <span className="text-xs font-black text-[#0F5132]">
                              {formatINR(l.budget_max)}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">
                              {l.assigned_to}
                            </span>
                          </div>

                          {/* Advance Controls */}
                          <div
                            className="flex items-center justify-between pt-1 text-[11px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {stage.id !== "New" && stage.id !== "Lost" ? (
                              <button
                                type="button"
                                onClick={() => moveStage(l.id, "backward")}
                                className="p-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] flex items-center gap-0.5"
                                title="Previous stage"
                              >
                                <ArrowLeft className="w-3 h-3" />
                                <span>Back</span>
                              </button>
                            ) : (
                              <div />
                            )}

                            {stage.id !== "Booked" && stage.id !== "Lost" && (
                              <button
                                type="button"
                                onClick={() => moveStage(l.id, "forward")}
                                className="px-2 py-0.5 rounded-lg bg-[#0F5132] hover:bg-[#0B3D25] text-white font-semibold text-[10px] flex items-center gap-1 shadow-2xs"
                                title="Advance to next stage"
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="p-4 rounded-xl border border-dashed border-[#CBD5E1] text-center text-[11px] text-[#94A3B8]">
                          No leads in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* View 2: List Summary View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          {/* Mobile Standalone Lead Cards (Stayora Luxury Native App Style) */}
          <div className="block lg:hidden space-y-3 p-3 bg-[#F8FAFC]/50">
            {filteredLeads.map((l) => (
              <div
                key={l.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-3 hover:border-[#0F5132]/30 transition-all text-left"
              >
                {/* Top Row: Lead Code left, Status right (Only 2 badges for 320px safety) */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {l.lead_code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                    {l.status}
                  </span>
                </div>

                {/* Lead Name & City */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#0F172A] text-sm truncate">
                      {l.name}
                    </h4>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {l.phone} • {l.city}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#64748B] block">
                      Budget
                    </span>
                    <span className="text-sm font-black text-[#0F5132]">
                      {formatINR(l.budget_max)}
                    </span>
                  </div>
                </div>

                {/* Package & Sales Rep */}
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex items-center justify-between">
                  <span className="text-[#475569] font-medium truncate">
                    {l.interested_in}
                  </span>
                  <span className="text-[11px] font-semibold text-[#0F172A] shrink-0 bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                    {l.assigned_to}
                  </span>
                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() => navigate("/leads")}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F5132] rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                >
                  <span>View Lead Details →</span>
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[900px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                  <th className="py-3 px-4"># Code</th>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Stage Status</th>
                  <th className="py-3 px-4">Requirement</th>
                  <th className="py-3 px-4">Budget (₹)</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLeads.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-[#475569]">
                      {l.lead_code}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#0F172A] block">
                        {l.name}
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        {l.phone} • {l.city}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      {l.interested_in}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F5132] text-sm">
                      {formatINR(l.budget_max)}
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      {l.assigned_to}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/leads")}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F5132] font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Funnel Analytics View */}
      {viewMode === "funnel" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#0F5132]" />
                  <span>Lead-to-Booking Funnel Analytics</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Cumulative stage progression and drop-off conversion rates
                  across sales pipeline.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-900">
                  Overall Win Rate:
                </span>
                <span className="text-base font-black text-[#0F5132]">
                  {funnelData.overallWinRate}%
                </span>
              </div>
            </div>

            {/* Visual Funnel Progression Bars */}
            <div className="space-y-3 pt-2">
              {funnelData.stages.map((stage) => (
                <div
                  key={stage.stage}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0F172A] flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span>{stage.stage}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#0F172A]">
                        {stage.count} Leads
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        {stage.conversionRate}% from previous
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stage.overallConversionRate}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off / Lost Reasons Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-600" />
              <span>Deal Drop-Off Analysis (Lost Opportunities)</span>
            </h3>

            {funnelData.dropOffReasons.length === 0 ? (
              <p className="text-xs text-[#64748B]">
                No lost leads recorded yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {funnelData.dropOffReasons.map((dr) => (
                  <div
                    key={dr.reason}
                    className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1"
                  >
                    <span className="text-xs font-bold text-rose-950 block truncate">
                      {dr.reason}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-rose-700">
                        {dr.count} deals
                      </span>
                      <span className="text-xs font-bold text-rose-800">
                        {dr.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 4: Targets & Leaderboard View */}
      {viewMode === "leaderboard" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Sales Targets & Team Leaderboard (October 2026)</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Performance ranking, quota completion, win rate %, and
                  first-response speed.
                </p>
              </div>
            </div>

            {/* Mobile Standalone Leaderboard Cards (Stayora Luxury Native App Style) */}
            <div className="block lg:hidden space-y-3">
              {leaderboard.map((exec) => (
                <div
                  key={exec.executiveName}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-3 hover:border-[#0F5132]/30 transition-all text-left"
                >
                  {/* Top Row: Rank badge left, Win Rate pill right */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-xs inline-flex items-center gap-1 ${
                        exec.rank === 1
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : exec.rank === 2
                            ? "bg-slate-200 text-slate-800 border border-slate-300"
                            : "bg-orange-100 text-orange-900 border border-orange-300"
                      }`}
                    >
                      <Trophy className="w-3 h-3" /> Rank #{exec.rank}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      {exec.winRate}% Win Rate
                    </span>
                  </div>

                  {/* Rep Name & Revenue */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-[#0F172A] text-sm truncate">{exec.executiveName}</h4>
                      <p className="text-[11px] text-[#64748B] truncate">Target: {formatINR(exec.targetRevenue)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#64748B] block font-medium">Achieved</span>
                      <span className="text-sm font-black text-[#0F5132]">{formatINR(exec.revenue)}</span>
                    </div>
                  </div>

                  {/* Target Progress Bar */}
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-[#64748B]">Quota Progress</span>
                      <span className="font-black text-[#0F172A]">{exec.targetProgressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          exec.targetProgressPercent >= 100
                            ? "bg-emerald-600"
                            : exec.targetProgressPercent >= 60
                              ? "bg-[#0F5132]"
                              : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.min(100, exec.targetProgressPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* 3-Column Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Leads</span>
                      <span className="font-bold text-[#0F172A]">{exec.assignedLeads}</span>
                    </div>
                    <div className="border-x border-[#E2E8F0]">
                      <span className="text-[10px] text-[#64748B] block font-medium">Booked</span>
                      <span className="font-bold text-[#16A34A]">{exec.bookedCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Avg Speed</span>
                      <span className="font-bold text-[#0F172A]">{exec.avgResponseMinutes}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Leaderboard Table */}
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#E2E8F0] scrollbar-thin">
              <table className="w-full min-w-[780px] text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold">
                    <th className="py-3 px-3 text-center">Rank</th>
                    <th className="py-3 px-4">Sales Representative</th>
                    <th className="py-3 px-4">Assigned Leads</th>
                    <th className="py-3 px-4">Won Bookings</th>
                    <th className="py-3 px-4">Revenue Achieved (₹)</th>
                    <th className="py-3 px-4">Target Progress</th>
                    <th className="py-3 px-4 text-center">Win Rate</th>
                    <th className="py-3 px-4 text-center">Avg Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {leaderboard.map((exec) => (
                    <tr
                      key={exec.executiveName}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-xs ${
                            exec.rank === 1
                              ? "bg-amber-100 text-amber-800"
                              : exec.rank === 2
                                ? "bg-slate-200 text-slate-800"
                                : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          #{exec.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0F172A] block">
                          {exec.executiveName}
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          Target: {formatINR(exec.targetRevenue)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#475569]">
                        {exec.assignedLeads}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-800">
                        {exec.bookedCount}
                      </td>
                      <td className="py-3 px-4 font-black text-[#0F5132]">
                        {formatINR(exec.revenue)}
                      </td>
                      <td className="py-3 px-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span>{exec.targetProgressPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              exec.targetProgressPercent >= 100
                                ? "bg-emerald-600"
                                : exec.targetProgressPercent >= 60
                                  ? "bg-[#0F5132]"
                                  : "bg-amber-500"
                            }`}
                            style={{
                              width: `${Math.min(100, exec.targetProgressPercent)}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#0F172A]">
                        {exec.winRate}%
                      </td>
                      <td className="py-3 px-4 text-center text-[#64748B] font-medium">
                        {exec.avgResponseMinutes} mins
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
