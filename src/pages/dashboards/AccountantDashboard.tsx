import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { ChartCard } from '@/components/ui/ChartCard';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FINANCE_PNL_DATA } from '@/data/dashboardMockData';
import { formatINR, formatCompactINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { Invoice } from '@/types';
import {
  CreditCard,
  IndianRupee,
  FileText,
  AlertCircle,
  FileSpreadsheet,
  Receipt,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const AccountantDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock Tax Invoices
  const invoices: Invoice[] = [
    {
      id: 'inv-1',
      invoiceNumber: 'TAX-INV-2026-081',
      guestName: 'Rohan Mehra',
      date: '2026-10-05',
      subTotal: 16500,
      gstRate: 12,
      gstAmount: 1980,
      grandTotal: 18480,
      status: 'Paid',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'TAX-INV-2026-082',
      guestName: 'Kavita Iyer',
      date: '2026-10-06',
      subTotal: 34500,
      gstRate: 18,
      gstAmount: 6210,
      grandTotal: 40710,
      status: 'Pending',
    },
    {
      id: 'inv-3',
      invoiceNumber: 'TAX-INV-2026-083',
      guestName: 'Devendra Singhania',
      date: '2026-10-04',
      subTotal: 72000,
      gstRate: 18,
      gstAmount: 12960,
      grandTotal: 84960,
      status: 'Paid',
    },
  ];

  const invoiceColumns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      accessor: (i) => <span className="font-semibold text-[#B84C00]">{i.invoiceNumber}</span>,
      sortable: true,
      sortValue: (i) => i.invoiceNumber,
    },
    {
      key: 'guestName',
      header: 'Billed To',
      accessor: (i) => <span className="font-medium text-[#0F172A]">{i.guestName}</span>,
      sortable: true,
      sortValue: (i) => i.guestName,
    },
    {
      key: 'date',
      header: 'Date',
      accessor: (i) => <span>{formatDate(i.date)}</span>,
    },
    {
      key: 'gstAmount',
      header: 'GST Breakup',
      accessor: (i) => (
        <span className="text-xs text-[#64748B]">
          {formatINR(i.gstAmount)} ({i.gstRate}%)
        </span>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Grand Total',
      accessor: (i) => (
        <span className="font-bold text-[#0F172A]">{formatINR(i.grandTotal)}</span>
      ),
      sortable: true,
      sortValue: (i) => i.grandTotal,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (i) => <StatusBadge status={i.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#B84C00]">
            Finance & Tax Accounting Terminal
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            GST reconciliation (12% & 18%), payments ledger, and profit-and-loss balances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/reports')}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-[#B84C00]" />}
          >
            GST Audit Report
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/billing')}
            leftIcon={<Receipt className="w-4 h-4" />}
          >
            Create Tax Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="October Net Invoiced"
          value={formatCompactINR(5600000)}
          subtitle="All rooms & F&B orders"
          trend="up"
          change="+18.4%"
          icon={IndianRupee}
          badge="Oct 2026"
        />
        <KPICard
          title="Total GST Output (12% + 18%)"
          value={formatCompactINR(870000)}
          subtitle="CGST + SGST collected"
          icon={CreditCard}
        />
        <KPICard
          title="Pending Receivables"
          value={formatINR(40710)}
          subtitle="1 Unpaid invoice due today"
          trend="down"
          change="Action required"
          icon={AlertCircle}
        />
        <KPICard
          title="Net Operating Margin"
          value="53.5%"
          subtitle="After payroll & utilities"
          trend="up"
          change="+4.2%"
          icon={FileText}
        />
      </div>

      {/* Chart: Revenue vs Operational Expenses */}
      <ChartCard
        title="Fiscal Health: Revenue vs Operating Expenses (₹)"
        description="Net margins maintained above 50% across tourist season quarters"
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
          <Bar dataKey="revenue" name="Total Revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Operating Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="gst" name="GST Liability" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>

      {/* Recent Tax Invoices Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#B84C00] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#B84C00]" />
            <span>Recent GST Tax Invoices</span>
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/billing')}>
            View All Invoices
          </Button>
        </div>

        <DataTable
          data={invoices}
          columns={invoiceColumns}
          keyExtractor={(i) => i.id}
          pageSize={5}
        />
      </div>
    </div>
  );
};
