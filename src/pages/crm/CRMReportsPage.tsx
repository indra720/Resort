import React, { useState, useMemo } from "react";
import {
  FileBarChart,
  Download,
  Printer,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users2,
  CalendarCheck2,
  Timer,
  ShieldCheck,
  Award,
  ChevronDown,
  Filter,
  Calendar,
  AlertOctagon,
  Sparkles,
  Lock,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useAuthStore } from "@/store/useAuthStore";
import { canUse } from "@/lib/permissions";
import { formatINR } from "@/lib/formatINR";
import { toast } from "@/store/useToastStore";
import { getCRMAnalyticsReport, exportCRMReportCSV } from "@/api/crmReports";
import { DateRangeOption, DateRangeFilter } from "@/types/crm";

export const CRMReportsPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [dateRange, setDateRange] = useState<DateRangeOption>("all_time");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const isUnlocked = canUse(currentResort, "crm_reports");

  const filter: DateRangeFilter = useMemo(() => {
    return {
      range: dateRange,
      startDate: customStart || undefined,
      endDate: customEnd || undefined,
    };
  }, [dateRange, customStart, customEnd]);

  const report = useMemo(() => {
    // refreshKey allows manual recalculation
    return getCRMAnalyticsReport(currentResort?.id || "resort-1", filter);
  }, [currentResort?.id, filter, refreshKey]);

  const handleDownloadCSV = (
    type: "executive" | "source" | "lost" | "monthly",
  ) => {
    try {
      const csvContent = exportCRMReportCSV(report, type);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `JOY_CRM_Report_${type}_${currentResort?.id || "resort-1"}_${dateRange}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExportMenuOpen(false);
      toast.success(
        "CSV Downloaded",
        `${type.toUpperCase()} report exported successfully.`,
      );
    } catch {
      toast.error("Export Failed", "Could not generate CSV file.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    toast.success("Data Refreshed", "Recalculated CRM report metrics.");
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2">
          Pro & Enterprise Feature
        </span>
        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
          CRM Analytics & Sales Reports Locked
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
          Unlock executive conversion leaderboards, source channel ROI matrices,
          sales velocity trackers, and lost reason analytics on the{" "}
          <strong>Pro Plan</strong>.
        </p>
        <button
          onClick={() =>
            toast.info(
              "Upgrade Plan",
              "Please contact support or visit SaaS Billing.",
            )
          }
          className="px-5 py-2.5 rounded-xl bg-[#0F5132] text-white font-bold text-sm shadow hover:bg-[#0c4128] transition-colors"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  const datePresets: { id: DateRangeOption; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "this_week", label: "This Week" },
    { id: "this_month", label: "This Month" },
    { id: "this_quarter", label: "This Quarter" },
    { id: "this_year", label: "This Year" },
    { id: "all_time", label: "All Time" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div className="space-y-6 text-left pb-16 print:p-0 print:space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Sales Reports & Analytics
            </h1>
            <span className="bg-emerald-100 text-[#0F5132] text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              Live BI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Conversion metrics, sales velocity, executive performance, and
            source attribution for{" "}
            <strong className="text-[#0F172A]">
              {currentResort?.name || "Resort"}
            </strong>
            .
          </p>
        </div>

        {/* Global Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#475569] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors shadow-2xs"
            title="Recalculate report"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#475569] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors shadow-2xs"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {/* Export CSV Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0F5132] hover:bg-[#0c4128] rounded-xl shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#CBD5E1] rounded-xl shadow-xl z-30 py-1.5 overflow-hidden animate-in fade-in-50">
                <div className="px-3 py-1 text-[10px] font-black uppercase text-[#94A3B8] tracking-wider">
                  Select CSV Dataset
                </div>
                <button
                  onClick={() => handleDownloadCSV("executive")}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-between"
                >
                  <span>Executive Leaderboard</span>
                  <ArrowUpRight className="w-3 h-3 text-[#94A3B8]" />
                </button>
                <button
                  onClick={() => handleDownloadCSV("source")}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-between"
                >
                  <span>Source Conversion Matrix</span>
                  <ArrowUpRight className="w-3 h-3 text-[#94A3B8]" />
                </button>
                <button
                  onClick={() => handleDownloadCSV("lost")}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-between"
                >
                  <span>Lost Reasons & Revenue</span>
                  <ArrowUpRight className="w-3 h-3 text-[#94A3B8]" />
                </button>
                <button
                  onClick={() => handleDownloadCSV("monthly")}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-between"
                >
                  <span>Monthly Trailing Trend</span>
                  <ArrowUpRight className="w-3 h-3 text-[#94A3B8]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Range Selector Pill Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#64748B] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#0F5132]" /> Range:
          </span>
          {datePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setDateRange(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                dateRange === preset.id
                  ? "bg-[#0F5132] text-white shadow-2xs"
                  : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {dateRange === "custom" && (
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#E2E8F0]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#64748B] font-semibold">
                From:
              </span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2 py-1 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#64748B] font-semibold">To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2 py-1 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Top 7 KPI Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3.5">
        {/* 1. Total Leads */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs text-left">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Leads
            </span>
            <Users2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
            {report.totalLeads}
          </div>
          <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
            In selected range
          </p>
        </div>

        {/* 2. Direct Bookings */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs text-left">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Bookings
            </span>
            <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1.5">
            {report.totalBookings}
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Confirmed stays
          </p>
        </div>

        {/* 3. Conversion Win Rate */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs text-left">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Win Rate
            </span>
            <TrendingUp className="w-4 h-4 text-[#0F5132]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F5132] mt-1.5">
            {report.overallConversionRate}%
          </div>
          <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
            Leads to Booked
          </p>
        </div>

        {/* 4. Total Attributed Revenue */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs text-left">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Sales Revenue
            </span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5 truncate">
            {formatINR(report.totalRevenue)}
          </div>
          <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
            Booked pipeline value
          </p>
        </div>

        {/* 5. Average Deal Size */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs text-left">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Avg Deal Size
            </span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#0F172A] mt-1.5 truncate">
            {formatINR(report.avgDealSize)}
          </div>
          <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
            Per converted stay
          </p>
        </div>

        {/* 6. Sales Cycle Velocity */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs text-left">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Velocity
            </span>
            <Timer className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
            {report.avgSalesCycleDays}{" "}
            <span className="text-xs font-semibold text-[#64748B]">days</span>
          </div>
          <p className="text-[10px] text-cyan-800 font-semibold mt-0.5">
            Enquiry to booking
          </p>
        </div>

        {/* 7. Follow-up SLA Adherence */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs text-left">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              SLA Adherence
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1.5">
            {report.followupAdherenceRate}%
          </div>
          <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
            Target SLA &lt;30m
          </p>
        </div>
      </div>

      {/* SECTION 1: Sales Executive Conversion Leaderboard */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Sales Executive Conversion Leaderboard
            </h2>
            <p className="text-xs text-[#64748B]">
              Ranked by total closed revenue, conversion percentage, and sales
              turnaround time.
            </p>
          </div>
          <span className="text-xs font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            {report.executivesBreakdown.length} Reps Tracking
          </span>
        </div>

        {/* Table View (Desktop) & Cards (Mobile) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0]">
                <th className="py-2.5 px-3">Rank & Executive</th>
                <th className="py-2.5 px-3 text-center">Assigned Leads</th>
                <th className="py-2.5 px-3 text-center">Closed Bookings</th>
                <th className="py-2.5 px-3">Win Rate</th>
                <th className="py-2.5 px-3 text-right">Revenue (INR)</th>
                <th className="py-2.5 px-3 text-right">Avg Deal</th>
                <th className="py-2.5 px-3 text-center">Velocity</th>
                <th className="py-2.5 px-3 text-center">SLA Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {report.executivesBreakdown.map((exec, idx) => {
                const isGold = idx === 0;
                const isSilver = idx === 1;
                const isBronze = idx === 2;
                return (
                  <tr
                    key={exec.executiveName}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
                            isGold
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : isSilver
                                ? "bg-slate-200 text-slate-700"
                                : isBronze
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                            {exec.executiveName}
                            {isGold && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">
                                Top Closer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#64748B]">
                            Sales Executive
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-semibold text-[#0F172A]">
                      {exec.assignedLeads}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-emerald-700">
                      {exec.bookingsCount}
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>{exec.conversionRate}%</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0F5132] h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, exec.conversionRate * 2.5)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-black text-[#0F172A]">
                      {formatINR(exec.totalRevenue)}
                    </td>

                    <td className="py-3 px-3 text-right font-semibold text-[#64748B]">
                      {formatINR(exec.avgDealSize)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                        {exec.avgCycleDays} days
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          exec.followupAdherenceRate >= 90
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {exec.followupAdherenceRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Source Conversion Matrix & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Source Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                Acquisition Channel Performance
              </h3>
              <p className="text-xs text-[#64748B]">
                Leads, conversions, and revenue by origin.
              </p>
            </div>
            <span className="text-[11px] text-[#64748B] font-semibold">
              {report.sourcesBreakdown.length} Sources
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0]">
                  <th className="py-2 px-2.5">Source</th>
                  <th className="py-2 px-2.5 text-center">Leads</th>
                  <th className="py-2 px-2.5 text-center">Booked</th>
                  <th className="py-2 px-2.5 text-center">Conv %</th>
                  <th className="py-2 px-2.5 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {report.sourcesBreakdown.map((src) => (
                  <tr key={src.source} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-2.5 font-bold text-[#0F172A]">
                      {src.source}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-semibold text-[#64748B]">
                      {src.leadsCount}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-bold text-emerald-700">
                      {src.bookingsCount}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-bold">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                        {src.conversionRate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-black text-[#0F172A]">
                      {formatINR(src.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Sources Recharts Bar Chart */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                Leads vs Converted Bookings
              </h3>
              <p className="text-xs text-[#64748B]">
                Visual volume comparison across top channels
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report.sourcesBreakdown}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <XAxis
                  dataKey="source"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    val,
                    name === "leadsCount" ? "Total Leads" : "Bookings",
                  ]}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }}
                />
                <Bar
                  dataKey="leadsCount"
                  name="Leads"
                  fill="#94A3B8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="bookingsCount"
                  name="Booked"
                  fill="#0F5132"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3: Lost Reasons Deep Dive & Revenue At Risk */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              Lost Reasons Breakdown & Potential Revenue Loss
            </h2>
            <p className="text-xs text-[#64748B]">
              Identify drop-off friction points, pricing mismatch, and lost
              pipeline value.
            </p>
          </div>
          <div className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Total Lost Value:{" "}
            {formatINR(
              report.lostReasonsBreakdown.reduce(
                (acc, r) => acc + r.lostPotentialRevenue,
                0,
              ),
            )}
          </div>
        </div>

        {report.lostReasonsBreakdown.length === 0 ? (
          <div className="p-8 text-center text-[#64748B] text-xs">
            No lost leads recorded in this period. Great job!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.lostReasonsBreakdown.map((item) => (
              <div
                key={item.reason}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 hover:border-red-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F172A]">
                    {item.reason}
                  </span>
                  <span className="text-xs font-extrabold text-red-600">
                    {item.count} leads ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Estimated Value Lost:</span>
                  <span className="font-bold text-[#0F172A]">
                    {formatINR(item.lostPotentialRevenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: Trailing Monthly Revenue & Booking Trajectory */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0F5132]" />
              Trailing Monthly Revenue & Booking Trajectory
            </h2>
            <p className="text-xs text-[#64748B]">
              6-month historical view of lead volume, closed conversions, and
              total INR revenue.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={report.monthlyTrend}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="crmRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F5132" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0F5132" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `₹${val / 100000}L`}
              />
              <Tooltip
                formatter={(val: number, name: string) => [
                  name === "revenue" ? formatINR(val) : val,
                  name === "revenue" ? "Sales Revenue" : "Bookings",
                ]}
                contentStyle={{
                  backgroundColor: "#0F172A",
                  color: "#fff",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Sales Revenue"
                stroke="#0F5132"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#crmRevGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly table summary */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0]">
                <th className="py-2 px-3">Month</th>
                <th className="py-2 px-3 text-center">Leads Generated</th>
                <th className="py-2 px-3 text-center">Bookings Closed</th>
                <th className="py-2 px-3 text-right">Total Revenue</th>
                <th className="py-2 px-3 text-right">Avg Deal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {report.monthlyTrend.map((m) => (
                <tr key={m.month} className="hover:bg-[#F8FAFC]">
                  <td className="py-2 px-3 font-bold text-[#0F172A]">
                    {m.month}
                  </td>
                  <td className="py-2 px-3 text-center font-semibold text-[#64748B]">
                    {m.leadsCount}
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700">
                    {m.bookingsCount}
                  </td>
                  <td className="py-2 px-3 text-right font-black text-[#0F172A]">
                    {formatINR(m.revenue)}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-[#64748B]">
                    {formatINR(m.avgDealSize)}
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
