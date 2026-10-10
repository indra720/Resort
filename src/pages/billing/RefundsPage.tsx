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
  RotateCcw,
  PlusCircle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export interface RefundRequest {
  id: string;
  bookingRef: string;
  guestName: string;
  phone: string;
  originalAmount: number;
  deductionPenalty: number;
  netRefund: number;
  reason: string;
  requestedDate: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  refundMethod: 'Original UPI' | 'Original Credit Card' | 'NEFT Transfer';
}

const INITIAL_REFUNDS: RefundRequest[] = [
  {
    id: 'REF-201',
    bookingRef: 'RES-8821',
    guestName: 'Anandita Roy',
    phone: '+91 98450 11998',
    originalAmount: 38000,
    deductionPenalty: 3800, // 10% policy deduction
    netRefund: 34200,
    reason: 'Medical emergency in family prior to departure. Cancellation initiated 9 days in advance.',
    requestedDate: 'Today, 10:15 AM',
    status: 'Pending Approval',
    refundMethod: 'Original UPI',
  },
  {
    id: 'REF-202',
    bookingRef: 'RES-6632',
    guestName: 'Kunal Singhania',
    phone: '+91 98200 77665',
    originalAmount: 72000,
    deductionPenalty: 36000, // 50% deduction (3 days prior)
    netRefund: 36000,
    reason: 'Flight cancelled due to weather. Requested 50% refund under standard policy.',
    requestedDate: 'Yesterday',
    status: 'Approved',
    refundMethod: 'Original Credit Card',
  },
  {
    id: 'REF-203',
    bookingRef: 'RES-4410',
    guestName: 'Manish Verma',
    phone: '+91 97110 33221',
    originalAmount: 18480,
    deductionPenalty: 18480,
    netRefund: 0,
    reason: 'No-show without prior intimation (<24 hours). Claimed non-refundable stay fee.',
    requestedDate: '05 Oct 2026',
    status: 'Rejected',
    refundMethod: 'Original UPI',
  },
];

export const RefundsPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [refunds, setRefunds] = useState<RefundRequest[]>(INITIAL_REFUNDS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [bookingRef, setBookingRef] = useState('RES-');
  const [phone, setPhone] = useState('+91 ');
  const [originalAmount, setOriginalAmount] = useState(30000);
  const [daysNotice, setDaysNotice] = useState('7+ Days (10% Fee)');
  const [reason, setReason] = useState('');
  const [refundMethod, setRefundMethod] = useState<RefundRequest['refundMethod']>('Original UPI');

  const pendingRefunds = refunds.filter((r) => r.status === 'Pending Approval');
  const totalPendingAmount = pendingRefunds.reduce((acc, r) => acc + r.netRefund, 0);

  const handleApprove = (id: string) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    toast.success('Refund Authorized', `Approved and queued for payout.`);
  };

  const handleReject = (id: string) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    toast.error('Refund Claim Rejected', 'Booking penalty policy upheld.');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !originalAmount) return;

    let penaltyPct = 0.10;
    if (daysNotice.startsWith('2 to 7')) penaltyPct = 0.50;
    if (daysNotice.startsWith('Less')) penaltyPct = 1.0;

    const penalty = Math.round(originalAmount * penaltyPct);
    const net = Math.max(0, originalAmount - penalty);

    const newReq: RefundRequest = {
      id: `REF-${Math.floor(204 + Math.random() * 80)}`,
      bookingRef,
      guestName,
      phone,
      originalAmount,
      deductionPenalty: penalty,
      netRefund: net,
      reason: reason || 'Guest initiated voluntary cancellation.',
      requestedDate: 'Just now',
      status: 'Pending Approval',
      refundMethod,
    };

    setRefunds([newReq, ...refunds]);
    setIsAddOpen(false);
    toast.success('Refund Request Queued', `${formatINR(net)} refund logged for executive approval.`);
    setGuestName('');
  };

  const columns: Column<RefundRequest>[] = [
    {
      key: 'id',
      header: 'Claim ID & Ref',
      accessor: (r) => (
        <div>
          <span className="font-bold text-[#0F172A] block">{r.id}</span>
          <span className="text-[11px] text-[#0F5132] font-semibold">{r.bookingRef}</span>
        </div>
      ),
      sortable: true,
      sortValue: (r) => r.id,
    },
    {
      key: 'guestName',
      header: 'Guest & Contact',
      accessor: (r) => (
        <div>
          <span className="font-semibold text-slate-800 block">{r.guestName}</span>
          <span className="text-[11px] text-[#64748B]">{r.phone}</span>
        </div>
      ),
      sortable: true,
      sortValue: (r) => r.guestName,
    },
    {
      key: 'amounts',
      header: 'Tariff vs Deduction',
      accessor: (r) => (
        <div className="text-xs">
          <span className="text-[#64748B] line-through block">{formatINR(r.originalAmount)}</span>
          <span className="text-[11px] text-rose-600 font-medium">Fee: -{formatINR(r.deductionPenalty)}</span>
        </div>
      ),
    },
    {
      key: 'netRefund',
      header: 'Net Refund Payable',
      accessor: (r) => (
        <div>
          <span className="font-bold text-[#0F5132] text-sm block">{formatINR(r.netRefund)}</span>
          <span className="text-[10px] text-[#64748B]">{r.refundMethod}</span>
        </div>
      ),
      sortable: true,
      sortValue: (r) => r.netRefund,
    },
    {
      key: 'status',
      header: 'Approval State',
      accessor: (r) => {
        const color =
          r.status === 'Approved'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : r.status === 'Rejected'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-amber-50 text-amber-800 border-amber-200';
        return (
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${color}`}>
            {r.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Executive Action',
      accessor: (r) => (
        <div className="flex items-center gap-1.5 justify-end">
          {r.status === 'Pending Approval' ? (
            <>
              <button
                type="button"
                onClick={() => handleApprove(r.id)}
                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold"
              >
                Approve Payout
              </button>
              <button
                type="button"
                onClick={() => handleReject(r.id)}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold"
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-xs text-[#64748B]">{r.status}</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <h1 className="text-sm sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-[#0F5132]" />
              <span>Cancellations & Refund Management Desk</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Process guest cancellation refund claims, apply retention penalties, and manage executive authorizations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Initiate Refund Request
        </Button>
      </div>

      {/* Policy Notice Box */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-800 block">Resort Cancellation Policy Matrix</span>
            <p className="text-[11px] text-amber-900 mt-0.5">
              • &gt;7 Days before check-in: 10% processing fee, 90% refund.
              • 2-7 Days before check-in: 50% cancellation deduction.
              • &lt;48 Hours: Non-refundable stay tariff.
            </p>
          </div>
        </div>

        <div className="font-bold text-xs text-amber-900 whitespace-nowrap">
          Pending Authorization: <span className="text-rose-700 font-extrabold">{formatINR(totalPendingAmount)}</span>
        </div>
      </div>

      {/* Refunds Table */}
      <DataTable
        data={refunds}
        columns={columns}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search refunds by ID, guest, or booking ref..."
        pageSize={6}
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Initiate Cancellation Refund"
        description="Compute cancellation penalty and queue for executive authorization"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <Input
            label="Guest Full Name"
            placeholder="e.g. Anandita Roy"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Booking Reference Code"
              placeholder="e.g. RES-9912"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+91 98000 11223"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Original Booking Amount (₹ INR)"
              type="number"
              value={String(originalAmount)}
              onChange={(e) => setOriginalAmount(Number(e.target.value) || 0)}
              required
            />
            <Select
              label="Cancellation Notice Window"
              value={daysNotice}
              onChange={(e) => setDaysNotice(e.target.value)}
              options={[
                { label: '7+ Days Before (10% Fee, 90% Refund)', value: '7+ Days (10% Fee)' },
                { label: '2 to 7 Days (50% Deduction)', value: '2 to 7 Days (50% Fee)' },
                { label: 'Less than 48 Hours (100% Non-refundable)', value: 'Less than 48 Hours (100% Fee)' },
              ]}
            />
          </div>

          <Select
            label="Original Payment Method for Reversal"
            value={refundMethod}
            onChange={(e) => setRefundMethod(e.target.value as any)}
            options={[
              { label: 'Original UPI ID (Instant Payout)', value: 'Original UPI' },
              { label: 'Original Credit Card (3-5 Banking Days)', value: 'Original Credit Card' },
              { label: 'NEFT Direct Bank Account Transfer', value: 'NEFT Transfer' },
            ]}
          />

          <div>
            <label className="font-semibold text-xs text-[#334155] block mb-1">
              Cancellation Rationale / Medical Notes
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Flight cancellation / medical emergency document submitted."
              className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
              Queue Refund Authorization
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
