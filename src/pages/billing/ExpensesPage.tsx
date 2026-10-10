import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import { formatINR } from '@/lib/formatINR';
import {
  FileBarChart,
  PlusCircle,
  Receipt,
  Building,
  CheckCircle2,
  Clock,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

export interface ExpenseRecord {
  id: string;
  category: 'F&B & Kitchen' | 'Generator Fuel & Power' | 'Pool & Chemical Supplies' | 'Linens & Laundry' | 'Landscape & Gardens' | 'Maintenance & Hardware';
  title: string;
  vendorName: string;
  amount: number;
  date: string;
  paidVia: 'Petty Cash' | 'Corporate Credit Card' | 'Direct Vendor NEFT';
  status: 'Approved' | 'Pending Approval';
  submittedBy: string;
}

const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'EXP-401',
    category: 'F&B & Kitchen',
    title: 'Fresh Organic Seafood & Goan Produce Restock',
    vendorName: 'Mapusa Coastal Fish & Fresh Produce Syndicate',
    amount: 48500,
    date: 'Today, 08:30 AM',
    paidVia: 'Direct Vendor NEFT',
    status: 'Approved',
    submittedBy: 'Chef Anand Kulkarni',
  },
  {
    id: 'EXP-402',
    category: 'Generator Fuel & Power',
    title: 'Backup Diesel Generator 500L Tank Refill',
    vendorName: 'Indian Oil Corporation Candolim Depot',
    amount: 46200,
    date: 'Yesterday',
    paidVia: 'Corporate Credit Card',
    status: 'Approved',
    submittedBy: 'Chief Engineer Suresh',
  },
  {
    id: 'EXP-403',
    category: 'Pool & Chemical Supplies',
    title: 'Chlorine Granules, Algaecide & pH Balancers for 8 Villas',
    vendorName: 'Aquatic Care Solutions Goa',
    amount: 18400,
    date: 'Yesterday',
    paidVia: 'Petty Cash',
    status: 'Approved',
    submittedBy: 'Housekeeping Supervisor',
  },
  {
    id: 'EXP-404',
    category: 'Linens & Laundry',
    title: 'Commercial Steam Laundering & Egyptian Cotton Towels Replacement',
    vendorName: 'Sparkle Hospitality Laundry Hub',
    amount: 32000,
    date: '06 Oct 2026',
    paidVia: 'Direct Vendor NEFT',
    status: 'Pending Approval',
    submittedBy: 'Ananya Sharma (Manager)',
  },
];

export const ExpensesPage: React.FC = () => {
  const { currentResort, role } = useAuthStore();
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('F&B & Kitchen');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState(12000);
  const [paidVia, setPaidVia] = useState<ExpenseRecord['paidVia']>('Petty Cash');

  const totalOpex = expenses.reduce((acc, e) => acc + e.amount, 0);
  const monthlyBudget = 450000;
  const budgetUtilization = Math.round((totalOpex / monthlyBudget) * 100);

  const handleApproveExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e))
    );
    toast.success('Authorized by Resort Owner', 'Capex expense approved for immediate disbursement.');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !vendorName || !amount) return;

    const newExp: ExpenseRecord = {
      id: `EXP-${Math.floor(405 + Math.random() * 90)}`,
      title,
      category,
      vendorName,
      amount: Number(amount) || 0,
      date: 'Just now',
      paidVia,
      status: role === 'Resort Owner' ? 'Approved' : 'Pending Approval',
      submittedBy: role === 'Resort Owner' ? 'Resort Owner (Direct)' : 'Resort Manager Desk',
    };

    setExpenses([newExp, ...expenses]);
    setIsAddOpen(false);
    toast.success('Expense Recorded', `${formatINR(newExp.amount)} logged for ${newExp.title}`);
    setTitle('');
    setVendorName('');
  };

  const columns: Column<ExpenseRecord>[] = [
    {
      key: 'id',
      header: 'Expense ID & Date',
      accessor: (e) => (
        <div>
          <span className="font-bold text-[#0F172A] block">{e.id}</span>
          <span className="text-[11px] text-[#64748B]">{e.date}</span>
        </div>
      ),
      sortable: true,
      sortValue: (e) => e.id,
    },
    {
      key: 'title',
      header: 'Expense Item & Category',
      accessor: (e) => (
        <div>
          <span className="font-semibold text-slate-800 block">{e.title}</span>
          <span className="text-[11px] text-[#0F5132] font-semibold">{e.category}</span>
        </div>
      ),
      sortable: true,
      sortValue: (e) => e.title,
    },
    {
      key: 'vendorName',
      header: 'Vendor / Payee',
      accessor: (e) => (
        <div className="text-xs">
          <span className="font-medium text-slate-700 block">{e.vendorName}</span>
          <span className="text-[11px] text-[#64748B]">Via {e.paidVia}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount (INR)',
      accessor: (e) => (
        <span className="font-extrabold text-[#0F172A] text-sm">{formatINR(e.amount)}</span>
      ),
      sortable: true,
      sortValue: (e) => e.amount,
    },
    {
      key: 'status',
      header: 'Audit State & Actions',
      accessor: (e) => (
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
              e.status === 'Approved'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {e.status}
          </span>
          {e.status === 'Pending Approval' && (role === 'Resort Owner' || role === 'Super Admin') && (
            <button
              type="button"
              onClick={() => handleApproveExpense(e.id)}
              className="px-2 py-0.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white text-[10px] font-bold rounded-lg shadow-2xs transition-colors shrink-0"
            >
              Sign & Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      {/* Role-Specific Perspective Banner */}
      {role === 'Resort Owner' ? (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-white border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              👑
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F5132]">Resort Owner Executive Signatory Desk</p>
              <p className="text-[11px] text-[#475569]">
                You hold sole executive authority to approve or reject capex procurement vouchers and release payments.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132] text-white self-start sm:self-auto shrink-0">
            Signatory Rights Active
          </span>
        </div>
      ) : role === 'Resort Manager' ? (
        <div className="p-3.5 bg-gradient-to-r from-blue-50 via-sky-50 to-white border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              📋
            </div>
            <div>
              <p className="text-xs font-bold text-[#0369A1]">General Manager Operational Expense Queue</p>
              <p className="text-[11px] text-[#475569]">
                Submit daily operational outlays and maintenance vendor receipts. Vouchers above ₹25,000 route to Resort Owner for approval.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0284C7] text-white self-start sm:self-auto shrink-0">
            Operations View
          </span>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <FileBarChart className="w-6 h-6 text-[#0F5132]" />
              <span>Resort Operational Expenses & Petty Cash</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Track daily provisioning, fuel, chemical supplies, laundry outlays, and budget utilization.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Record Expense
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Total Monthly OpEx</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">{formatINR(totalOpex)}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Within budgeted targets</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Monthly OpEx Cap</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F5132] mt-1">{formatINR(monthlyBudget)}</p>
          <span className="text-[10px] text-[#64748B]">Approved property limit</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Budget Burn Rate</p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">{budgetUtilization}%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${budgetUtilization}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-amber-600">Pending Authorization</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">
            {formatINR(expenses.filter((e) => e.status === 'Pending Approval').reduce((acc, e) => acc + e.amount, 0))}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">1 Invoice awaiting sign-off</span>
        </div>
      </div>

      {/* Expenses Table */}
      <DataTable
        data={expenses}
        columns={columns}
        keyExtractor={(e) => e.id}
        searchPlaceholder="Search expenses by vendor, category, or item..."
        pageSize={6}
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record Property Operational Expense"
        description="Log vendor procurement, diesel refills, or petty cash outlays"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <Input
            label="Expense Description / Item"
            placeholder="e.g. Organic Produce & Dairy Delivery"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Expense Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { label: 'F&B & Kitchen Provisions', value: 'F&B & Kitchen' },
                { label: 'Generator Fuel & Power', value: 'Generator Fuel & Power' },
                { label: 'Pool & Chemical Supplies', value: 'Pool & Chemical Supplies' },
                { label: 'Linens & Laundry', value: 'Linens & Laundry' },
                { label: 'Landscape & Gardens', value: 'Landscape & Gardens' },
                { label: 'Maintenance & Hardware', value: 'Maintenance & Hardware' },
              ]}
            />
            <Input
              label="Amount Paid (₹ INR)"
              type="number"
              value={String(amount)}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Vendor / Payee Name"
              placeholder="e.g. Indian Oil Corporation"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
            />
            <Select
              label="Disbursement Mode"
              value={paidVia}
              onChange={(e) => setPaidVia(e.target.value as any)}
              options={[
                { label: 'Front Desk Petty Cash', value: 'Petty Cash' },
                { label: 'Corporate Credit Card', value: 'Corporate Credit Card' },
                { label: 'Direct Vendor NEFT', value: 'Direct Vendor NEFT' },
              ]}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
              Save Expense Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
