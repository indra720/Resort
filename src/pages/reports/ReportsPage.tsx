import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { KPICard } from '@/components/ui/KPICard';
import { ChartCard } from '@/components/ui/ChartCard';
import { formatINR, formatCompactINR } from '@/lib/formatINR';
import { MONTHLY_REVENUE_DATA, FINANCE_PNL_DATA } from '@/data/dashboardMockData';
import { toast } from '@/store/useToastStore';
import {
  FileSpreadsheet,
  Download,
  IndianRupee,
  Percent,
  TrendingUp,
  Receipt,
  FileText,
  Calendar,
  Crown,
  ClipboardList,
  Clock,
  Sparkles,
  CheckCircle2,
  Building2,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const ReportsPage: React.FC = () => {
  const { role, currentResort } = useAuthStore();
  const isOwner = role === 'Resort Owner' || role === 'Super Admin';
  const isManager = role === 'Resort Manager';

  const [reportType, setReportType] = useState<
    'revenue' | 'occupancy' | 'expense' | 'gst' | 'investor_pnl' | 'operations_sla'
  >(isOwner ? 'investor_pnl' : isManager ? 'operations_sla' : 'revenue');

  const [dateRange, setDateRange] = useState('This Month (Oct 2026)');

  const handleExportCSV = () => {
    toast.success('CSV Report Exported', `${reportType.toUpperCase()}_Report_${dateRange}.csv downloaded.`);
  };

  const handleExportPDF = () => {
    toast.success('PDF Audit Exported', `${reportType.toUpperCase()}_Compliance_Report.pdf prepared for CA.`);
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Role-Specific Perspective Top Banner */}
      {isOwner ? (
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                  Resort Owner Executive Financial Desk
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#DCFCE7] text-[#0F5132]">
                  Equity & Capex Audits
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Strategic perspective on operating EBITDA (49.5%), net profit after tax, Capex ROI payback, and annual dividend distributions.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-[#64748B] block">Current Net Profit</span>
            <span className="text-base font-black text-[#0F5132]">{formatINR(3390000)}</span>
          </div>
        </div>
      ) : isManager ? (
        <div className="p-4 bg-gradient-to-r from-blue-50 via-sky-50/50 to-white border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <ClipboardList className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="text-xs font-bold text-[#0369A1] uppercase tracking-wider">
                  Resort General Manager Operational Audit
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-[#0369A1]">
                  Ground SLA Velocity
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Operational focus on room turnaround velocity, check-in queue times, housekeeping inspection pass rates, and restaurant table turns.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-[#64748B] block">Avg Room Turnaround</span>
            <span className="text-base font-black text-[#0284C7]">38 mins</span>
          </div>
        </div>
      ) : null}

      {/* Main Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
            {isOwner
              ? 'Executive P&L & Investment Audit'
              : isManager
              ? 'Operations & Velocity Analytics'
              : 'Financial & Operational Reports'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            {isOwner
              ? 'Multi-property Capex yield, EBITDA margins, and statutory tax compliance.'
              : isManager
              ? 'Live turnaround SLAs, department performance, and guest satisfaction metrics.'
              : 'GSTR compliance reports, revenue audits, occupancy metrics, and P&L statements.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportCSV}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-[#22C55E]" />}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleExportPDF}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Date Range Selector & Report Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
        <div className="flex flex-wrap gap-2">
          {/* Owner Exclusive Tab */}
          {isOwner && (
            <button
              onClick={() => setReportType('investor_pnl')}
              className={`px-3 py-2 text-xs rounded-lg flex items-center gap-1.5 transition-all ${
                reportType === 'investor_pnl'
                  ? 'bg-[#0F5132] text-white font-semibold shadow-xs'
                  : 'bg-emerald-50/60 text-[#0F5132] hover:bg-emerald-100/50'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner P&L & Capex ROI</span>
            </button>
          )}

          {/* Manager Exclusive Tab */}
          {isManager && (
            <button
              onClick={() => setReportType('operations_sla')}
              className={`px-3 py-2 text-xs rounded-lg flex items-center gap-1.5 transition-all ${
                reportType === 'operations_sla'
                  ? 'bg-[#0284C7] text-white font-semibold shadow-xs'
                  : 'bg-sky-50 text-[#0284C7] hover:bg-sky-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Turnaround & Ops SLA</span>
            </button>
          )}

          {[
            { id: 'revenue', label: 'Revenue Audit', icon: IndianRupee },
            { id: 'occupancy', label: 'Occupancy Analysis', icon: Percent },
            { id: 'expense', label: 'Expense & Margin', icon: TrendingUp },
            { id: 'gst', label: 'GST Tax Returns (GSTR)', icon: Receipt },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as typeof reportType)}
                className={`px-3 py-2 text-xs rounded-lg flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#0F5132] text-white font-semibold'
                    : 'bg-[#F8FAFC] text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-[#0F5132]" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white text-[#1F2937] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0F5132]"
          >
            <option value="This Month (Oct 2026)">This Month (Oct 2026)</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
            <option value="Full Year 2026">Full Year 2026</option>
          </select>
        </div>
      </div>

      {/* 0. OWNER EXCLUSIVE: Investor P&L & Capex Yield View */}
      {reportType === 'investor_pnl' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Gross Resort Revenue"
              value={formatCompactINR(6850000)}
              subtitle="Tariff + F&B + Spa"
              change="+18.4% YoY"
              trend="up"
              icon={IndianRupee}
            />
            <KPICard
              title="Operating EBITDA"
              value={formatCompactINR(3390000)}
              subtitle="49.5% Operating Margin"
              change="+3.2% bps"
              trend="up"
              badge="High Yield"
              icon={TrendingUp}
            />
            <KPICard
              title="Capex Payback Velocity"
              value="14.2 Mos"
              subtitle="Solar & Pool Upgrades"
              badge="Ahead of Plan"
              icon={Building2}
            />
            <KPICard
              title="Projected Annual Dividend"
              value={formatCompactINR(14500000)}
              subtitle="Net Distributable Yield"
              trend="up"
              icon={Crown}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Owner Statement Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex flex-col lg:flex-row items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Executive P&L Statement (FY 2026-27 YTD)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Statutory Audited
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-[300px] min-w-0 md:w-full overflow-x-auto text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                        <th className="py-2.5 px-3">Revenue / Cost Head</th>
                        <th className="py-2.5 px-3">Oct 2026 Actual</th>
                        <th className="py-2.5 px-3">Budget Target</th>
                        <th className="py-2.5 px-3 text-right">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y shrink-0 whitespace-nowrap divide-[#E2E8F0]">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Gross Room Tariff Income</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">{formatINR(4850000)}</td>
                        <td className="py-2.5 px-3 text-[#64748B]">{formatINR(4200000)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">+15.4%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">F&B Restaurant & Banquets</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">{formatINR(1580000)}</td>
                        <td className="py-2.5 px-3 text-[#64748B]">{formatINR(1400000)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">+12.8%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Direct Opex (Staff, Power, Linens)</td>
                        <td className="py-2.5 px-3 font-bold text-red-600">({formatINR(2420000)})</td>
                        <td className="py-2.5 px-3 text-[#64748B]">({formatINR(2500000)})</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">-3.2% (Savings)</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="py-3 px-3 font-black text-[#0F5132]">Operating EBITDA (Cash Flow)</td>
                        <td className="py-3 px-3 font-black text-[#0F5132]">{formatINR(3390000)}</td>
                        <td className="py-3 px-3 font-bold text-[#0F5132]">{formatINR(2850000)}</td>
                        <td className="py-3 px-3 text-right font-black text-[#0F5132]">+18.9%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Depreciation & Capex Amortization</td>
                        <td className="py-2.5 px-3 text-[#64748B]">({formatINR(320000)})</td>
                        <td className="py-2.5 px-3 text-[#64748B]">({formatINR(320000)})</td>
                        <td className="py-2.5 px-3 text-right text-[#64748B]">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Corporate Tax Provision (22%)</td>
                        <td className="py-2.5 px-3 text-[#64748B]">({formatINR(675000)})</td>
                        <td className="py-2.5 px-3 text-[#64748B]">({formatINR(556000)})</td>
                        <td className="py-2.5 px-3 text-right text-[#64748B]">--</td>
                      </tr>
                      <tr className="bg-[#0F5132] text-white">
                        <td className="py-3 px-3 font-black">Net Distributable Owner Profit</td>
                        <td className="py-3 px-3 font-black">{formatINR(2395000)}</td>
                        <td className="py-3 px-3 font-semibold text-emerald-200">{formatINR(1974000)}</td>
                        <td className="py-3 px-3 text-right font-black text-amber-300">+21.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Asset Allocation & Valuation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Owner Asset Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[#64748B] block font-medium">Total Property Land & Keys</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-[#0F172A]">₹18.50 Cr</span>
                    <span className="text-[11px] font-bold text-emerald-700">30 Keys</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">Average Key Valuation: ₹61.6 Lakhs / key</p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">RevPAR (Revenue per Available Room):</span>
                    <strong className="text-[#0F172A]">₹11,360</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Average Daily Rate (ADR):</span>
                    <strong className="text-[#0F172A]">₹14,200</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Capex Budget Allocated (FY26):</span>
                    <strong className="text-[#0F172A]">₹45,00,000</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Capex Utilized:</span>
                    <strong className="text-emerald-700">₹18,40,000 (41%)</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5132]">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
                    <span>Owner Signatory Rights</span>
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Capex approvals exceeding ₹25,000 are restricted exclusively to Resort Owner credentials.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 0. MANAGER EXCLUSIVE: Operations Turnaround & SLA Velocity View */}
      {reportType === 'operations_sla' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Room Turnaround Velocity"
              value="38 Mins"
              subtitle="Target SLA: < 45 Mins"
              badge="7m Faster"
              trend="up"
              icon={Clock}
            />
            <KPICard
              title="Front Desk Check-in Wait"
              value="2.4 Mins"
              subtitle="Guest Queue Time"
              badge="Optimal"
              icon={CheckCircle2}
            />
            <KPICard
              title="Dining Table Turn Time"
              value="42 Mins"
              subtitle="Lunch & Dinner Service"
              trend="up"
              icon={Activity}
            />
            <KPICard
              title="Guest CSAT Score"
              value="4.8 / 5.0"
              subtitle="98.2% Positive Feedback"
              badge="Top Rated"
              icon={Sparkles}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex flex-col lg:flex-row items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0284C7]" />
                    <span>Daily Departmental SLA Turnaround Audit</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    Live Operational Data
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                        <th className="py-2.5 px-3">Department & Shift</th>
                        <th className="py-2.5 px-3">Avg SLA Time</th>
                        <th className="py-2.5 px-3">Target Standard</th>
                        <th className="py-2.5 px-3">SLA Compliance</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Housekeeping (Morning Departure Turn)</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">38 mins / room</td>
                        <td className="py-2.5 px-3 text-[#64748B]">45 mins</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-bold">96.4%</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Pass</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Front Desk Express Check-In</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">2.4 mins / guest</td>
                        <td className="py-2.5 px-3 text-[#64748B]">3.5 mins</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-bold">98.1%</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Pass</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Kitchen KOT Preparation (Mains)</td>
                        <td className="py-2.5 px-3 font-bold text-amber-700">18.5 mins</td>
                        <td className="py-2.5 px-3 text-[#64748B]">15 mins</td>
                        <td className="py-2.5 px-3 text-amber-600 font-bold">88.5%</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Watch</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Engineering Maintenance Tickets</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">24 mins</td>
                        <td className="py-2.5 px-3 text-[#64748B]">30 mins</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-bold">94.0%</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Pass</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Manager Daily Action Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[#0369A1] space-y-1">
                  <p className="font-bold">Shift Handover & Inspection</p>
                  <p className="text-[11px] text-sky-800">
                    Afternoon shift supervisor: Pre-inspect 4 pool villas prior to VIP check-in at 14:00.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
                  <p className="font-bold">Linen Stock Laundry Audit</p>
                  <p className="text-[11px] text-[#64748B]">
                    Commercial laundry dispatch returned 140 bath sheets. Pool towels at 85% par stock.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5132] space-y-1">
                  <p className="font-bold">Staff Attendance: 100% On-Duty</p>
                  <p className="text-[11px] text-emerald-800">
                    22 active team members rostered across Front Desk, F&B, and Housekeeping today.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 1. Revenue Report View */}
      {reportType === 'revenue' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Gross Room Tariff"
              value={formatCompactINR(4250000)}
              subtitle="Oct 2026 (30 Keys)"
              change="+14.2%"
              trend="up"
              icon={IndianRupee}
            />
            <KPICard
              title="F&B Dining Revenue"
              value={formatCompactINR(1350000)}
              subtitle="Restaurant & Pool Bar"
              change="+8.6%"
              trend="up"
              icon={TrendingUp}
            />
            <KPICard
              title="Spa & Concierge"
              value={formatCompactINR(420000)}
              subtitle="Wellness treatments"
              icon={Percent}
            />
            <KPICard
              title="Total Billed"
              value={formatCompactINR(6020000)}
              subtitle="All guest folios"
              badge="Audited"
              trend="up"
              icon={Receipt}
            />
          </div>

          <ChartCard
            title="Revenue Comparison by Source (₹)"
            description="Room bookings represent 70% of gross resort receipts"
            height={280}
          >
            <BarChart
              data={MONTHLY_REVENUE_DATA}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#6B7280"
                fontSize={11}
                tickFormatter={(v) => `₹${v / 100000}L`}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  borderRadius: '8px',
                  color: '#1F2937',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: number) => [formatINR(val), 'Revenue']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="rooms" name="Room Tariff" fill="#0F5132" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fnb" name="Dining & Bar" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>
      )}

      {/* 2. Occupancy Report View */}
      {reportType === 'occupancy' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pool Villas (Premium)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-3xl font-bold text-[#0F5132]">94.2%</div>
              <p className="text-xs text-[#6B7280]">Average Length of Stay: 3.4 nights</p>
              <div className="text-xs text-[#22C55E]">Zero vacancy over weekends</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Luxury Suites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-3xl font-bold text-[#1F2937]">86.0%</div>
              <p className="text-xs text-[#6B7280]">Average Length of Stay: 2.8 nights</p>
              <div className="text-xs text-[#22C55E]">High domestic corporate inflow</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deluxe Cottages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-3xl font-bold text-[#1F2937]">78.5%</div>
              <p className="text-xs text-[#6B7280]">Average Length of Stay: 2.1 nights</p>
              <div className="text-xs text-[#6B7280]">Weekend leisure getaways</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3. Expense Report View */}
      {reportType === 'expense' && (
        <ChartCard
          title="Operating Expenses vs Gross Yield (₹)"
          description="Operational cost discipline maintained across FY 2026"
          height={280}
        >
          <BarChart
            data={FINANCE_PNL_DATA}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickFormatter={(v) => `₹${v / 100000}L`}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E7EB',
                borderRadius: '8px',
                color: '#1F2937',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(val: number) => [formatINR(val), 'Amount']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="revenue" name="Gross Revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Operational Cost" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      )}

      {/* 4. GST GSTR-3B Tax Filing View */}
      {reportType === 'gst' && (
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#0F5132]" />
              <span>GSTR-3B Tax Liability Statement (State 30 - Goa)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280] block">Total Taxable Turnover</span>
                <span className="text-xl font-bold text-[#1F2937]">{formatINR(4830000)}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280] block">CGST 9% (Central Tax)</span>
                <span className="text-xl font-bold text-[#0F5132]">{formatINR(435000)}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280] block">SGST 9% (State Tax)</span>
                <span className="text-xl font-bold text-[#0F5132]">{formatINR(435000)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <span>Total GST Paid to Government of India (Challan #CH-88219):</span>
              <span className="text-base font-bold">{formatINR(870000)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
