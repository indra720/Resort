import React, { useState } from 'react';
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
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'revenue' | 'occupancy' | 'expense' | 'gst'>('revenue');
  const [dateRange, setDateRange] = useState('This Month (Oct 2026)');

  const handleExportCSV = () => {
    toast.success('CSV Report Exported', `${reportType.toUpperCase()}_Report_${dateRange}.csv downloaded.`);
  };

  const handleExportPDF = () => {
    toast.success('PDF Audit Exported', `${reportType.toUpperCase()}_Compliance_Report.pdf prepared for CA.`);
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#B84C00]">
            Financial & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            GSTR compliance reports, revenue audits, occupancy metrics, and P&L statements.
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-wrap gap-2">
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
                    ? 'bg-[#B84C00] text-white font-semibold'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-[#B84C00]" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white text-[#0F172A] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#B84C00]"
          >
            <option value="This Month (Oct 2026)">This Month (Oct 2026)</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
            <option value="Full Year 2026">Full Year 2026</option>
          </select>
        </div>
      </div>

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
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(v) => `₹${v / 100000}L`}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '8px',
                  color: '#0F172A',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: number) => [formatINR(val), 'Revenue']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="rooms" name="Room Tariff" fill="#B84C00" radius={[4, 4, 0, 0]} />
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
              <div className="text-3xl font-bold text-[#B84C00]">94.2%</div>
              <p className="text-xs text-[#64748B]">Average Length of Stay: 3.4 nights</p>
              <div className="text-xs text-[#22C55E]">Zero vacancy over weekends</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Luxury Suites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-3xl font-bold text-[#0F172A]">86.0%</div>
              <p className="text-xs text-[#64748B]">Average Length of Stay: 2.8 nights</p>
              <div className="text-xs text-[#22C55E]">High domestic corporate inflow</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deluxe Cottages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-3xl font-bold text-[#0F172A]">78.5%</div>
              <p className="text-xs text-[#64748B]">Average Length of Stay: 2.1 nights</p>
              <div className="text-xs text-[#64748B]">Weekend leisure getaways</div>
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
            <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickFormatter={(v) => `₹${v / 100000}L`}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                borderRadius: '8px',
                color: '#0F172A',
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
              <Receipt className="w-5 h-5 text-[#B84C00]" />
              <span>GSTR-3B Tax Liability Statement (State 30 - Goa)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">Total Taxable Turnover</span>
                <span className="text-xl font-bold text-[#0F172A]">{formatINR(4830000)}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">CGST 9% (Central Tax)</span>
                <span className="text-xl font-bold text-[#B84C00]">{formatINR(435000)}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] block">SGST 9% (State Tax)</span>
                <span className="text-xl font-bold text-[#B84C00]">{formatINR(435000)}</span>
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
