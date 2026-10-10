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
  CreditCard,
  PlusCircle,
  Smartphone,
  Banknote,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  ArrowDownLeft,
} from 'lucide-react';

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  guestName: string;
  roomOrBooking: string;
  amount: number;
  method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'NetBanking';
  gateway: 'Razorpay' | 'Pine Labs POS' | 'Direct Cash' | 'HDFC NetBanking';
  date: string;
  status: 'Captured' | 'Pending' | 'Failed';
}

const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'PAY-1001',
    transactionRef: 'RZP-TXN-882910',
    guestName: 'Rohan Mehra',
    roomOrBooking: 'Room #102',
    amount: 18480,
    method: 'UPI',
    gateway: 'Razorpay',
    date: 'Today, 11:20 AM',
    status: 'Captured',
  },
  {
    id: 'PAY-1002',
    transactionRef: 'PIN-POS-44391',
    guestName: 'Dr. Siddharth Rao',
    roomOrBooking: 'Pool Villa V-01',
    amount: 65000,
    method: 'Credit Card',
    gateway: 'Pine Labs POS',
    date: 'Today, 09:45 AM',
    status: 'Captured',
  },
  {
    id: 'PAY-1003',
    transactionRef: 'CSH-REC-2291',
    guestName: 'Amitabh Joshi',
    roomOrBooking: 'Room #101',
    amount: 12320,
    method: 'Cash',
    gateway: 'Direct Cash',
    date: 'Yesterday, 06:10 PM',
    status: 'Captured',
  },
  {
    id: 'PAY-1004',
    transactionRef: 'HDF-NET-77182',
    guestName: 'Mehta Destination Wedding',
    roomOrBooking: 'Banquet Lawn Buyout',
    amount: 500000,
    method: 'NetBanking',
    gateway: 'HDFC NetBanking',
    date: 'Yesterday, 02:30 PM',
    status: 'Captured',
  },
  {
    id: 'PAY-1005',
    transactionRef: 'RZP-TXN-99102',
    guestName: 'Kavita Iyer',
    roomOrBooking: 'Room #202',
    amount: 40710,
    method: 'UPI',
    gateway: 'Razorpay',
    date: '06 Oct 2026',
    status: 'Pending',
  },
];

export const PaymentsPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [roomOrBooking, setRoomOrBooking] = useState('Room #104');
  const [amount, setAmount] = useState(15000);
  const [method, setMethod] = useState<PaymentTransaction['method']>('UPI');
  const [gateway, setGateway] = useState<PaymentTransaction['gateway']>('Razorpay');

  const filtered = payments.filter((p) => {
    if (methodFilter !== 'All' && p.method !== methodFilter) return false;
    return true;
  });

  const totalCaptured = payments
    .filter((p) => p.status === 'Captured')
    .reduce((acc, p) => acc + p.amount, 0);

  const upiTotal = payments
    .filter((p) => p.method === 'UPI' && p.status === 'Captured')
    .reduce((acc, p) => acc + p.amount, 0);

  const cardTotal = payments
    .filter((p) => (p.method === 'Credit Card' || p.method === 'Debit Card') && p.status === 'Captured')
    .reduce((acc, p) => acc + p.amount, 0);

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !amount) return;

    const newPay: PaymentTransaction = {
      id: `PAY-${Math.floor(1006 + Math.random() * 90)}`,
      transactionRef: `OFF-${Date.now().toString().slice(-6)}`,
      guestName,
      roomOrBooking,
      amount: Number(amount) || 0,
      method,
      gateway,
      date: 'Just now',
      status: 'Captured',
    };

    setPayments([newPay, ...payments]);
    setIsAddOpen(false);
    toast.success('Payment Recorded', `${formatINR(newPay.amount)} captured for ${guestName}`);
    setGuestName('');
  };

  const columns: Column<PaymentTransaction>[] = [
    {
      key: 'transactionRef',
      header: 'Reference & ID',
      accessor: (p) => (
        <div>
          <span className="font-bold text-[#0F172A] block">{p.transactionRef}</span>
          <span className="text-[11px] text-[#64748B]">{p.id} • {p.date}</span>
        </div>
      ),
      sortable: true,
      sortValue: (p) => p.transactionRef,
    },
    {
      key: 'guestName',
      header: 'Guest / Allocation',
      accessor: (p) => (
        <div>
          <span className="font-semibold text-slate-800 block">{p.guestName}</span>
          <span className="text-[11px] text-[#0F5132] font-medium">{p.roomOrBooking}</span>
        </div>
      ),
      sortable: true,
      sortValue: (p) => p.guestName,
    },
    {
      key: 'amount',
      header: 'Amount Collected',
      accessor: (p) => (
        <span className="font-extrabold text-[#0F5132] text-sm">{formatINR(p.amount)}</span>
      ),
      sortable: true,
      sortValue: (p) => p.amount,
    },
    {
      key: 'method',
      header: 'Payment Method',
      accessor: (p) => (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
          {p.method} ({p.gateway})
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Capture Status',
      accessor: (p) => (
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
            p.status === 'Captured'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {p.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <h1 className="text-md sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#0F5132]" />
              <span>Payments & Settlements Ledger</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Real-time transaction register for UPI, POS card terminals, NEFT, and front-desk cash collections.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Record Transaction
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Total Captured</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F5132] mt-1">{formatINR(totalCaptured)}</p>
          <span className="text-[10px] text-emerald-600 font-medium">100% Settled</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">UPI Collections</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">{formatINR(upiTotal)}</p>
          <span className="text-[10px] text-[#64748B]">GPay, PhonePe, Paytm</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Card POS Terminal</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">{formatINR(cardTotal)}</p>
          <span className="text-[10px] text-[#64748B]">Visa, Mastercard, Amex</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-amber-600">Pending Clearances</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">
            {formatINR(payments.filter((p) => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0))}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">1 Transaction pending</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', 'UPI', 'Credit Card', 'Cash', 'NetBanking'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethodFilter(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              methodFilter === m
                ? 'bg-[#0F5132] text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Search payments by reference, guest, or room..."
        pageSize={6}
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record Offline Payment"
        description="Capture manual cash, POS swipe, or direct bank transfer"
        maxWidth="md"
      >
        <form onSubmit={handleRecord} className="space-y-4 text-left">
          <Input
            label="Guest Full Name"
            placeholder="e.g. Vikramaditya Oberoi"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Room / Folio Allocation"
              placeholder="e.g. Room #104"
              value={roomOrBooking}
              onChange={(e) => setRoomOrBooking(e.target.value)}
              required
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
            <Select
              label="Payment Channel"
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              options={[
                { label: 'UPI (QR Code / Dynamic)', value: 'UPI' },
                { label: 'Credit Card (POS Terminal)', value: 'Credit Card' },
                { label: 'Debit Card', value: 'Debit Card' },
                { label: 'Front Desk Cash', value: 'Cash' },
                { label: 'NEFT / RTGS Bank Transfer', value: 'NetBanking' },
              ]}
            />
            <Select
              label="Gateway / Processor"
              value={gateway}
              onChange={(e) => setGateway(e.target.value as any)}
              options={[
                { label: 'Razorpay Payment Gateway', value: 'Razorpay' },
                { label: 'Pine Labs POS EDC Machine', value: 'Pine Labs POS' },
                { label: 'Direct Cash Register', value: 'Direct Cash' },
                { label: 'HDFC Corporate Banking', value: 'HDFC NetBanking' },
              ]}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<CheckCircle2 className="w-4 h-4" />}>
              Capture Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
