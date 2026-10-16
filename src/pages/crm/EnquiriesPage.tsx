import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import { formatINR } from '@/lib/formatINR';
import { createLead, checkDuplicateLead } from '@/api/leads';
import {
  MessageSquareText,
  PlusCircle,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export interface Enquiry {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  category: string;
  pax: number;
  budget: number;
  source: 'Website' | 'WhatsApp' | 'MakeMyTrip' | 'Referral' | 'Walk-in';
  status: 'New' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost';
  assignedTo: string;
  createdAt: string;
}

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'ENQ-801',
    guestName: 'Dr. Siddharth Rao',
    phone: '+91 98201 11223',
    email: 'dr.siddharth@apollo.org',
    checkIn: '2026-10-24',
    checkOut: '2026-10-28',
    category: 'Pool Villa',
    pax: 4,
    budget: 140000,
    source: 'Website',
    status: 'Proposal Sent',
    assignedTo: 'Kavita Iyer (Sales)',
    createdAt: 'Yesterday, 04:30 PM',
  },
  {
    id: 'ENQ-802',
    guestName: 'Ananya Deshmukh',
    phone: '+91 97665 44332',
    email: 'ananya.d@tcs.com',
    checkIn: '2026-11-05',
    checkOut: '2026-11-08',
    category: 'Luxury Suite',
    pax: 2,
    budget: 65000,
    source: 'WhatsApp',
    status: 'New',
    assignedTo: 'Vikram Singh',
    createdAt: 'Today, 10:15 AM',
  },
  {
    id: 'ENQ-803',
    guestName: 'Mehta Destination Wedding Group',
    phone: '+91 98110 99887',
    email: 'events@mehtajewels.in',
    checkIn: '2026-12-15',
    checkOut: '2026-12-18',
    category: 'Full Resort Buyout',
    pax: 65,
    budget: 1850000,
    source: 'Referral',
    status: 'Qualified',
    assignedTo: 'Rajvardhan Oberoi (Owner)',
    createdAt: '2 days ago',
  },
  {
    id: 'ENQ-804',
    guestName: 'Gaurav Kapoor',
    phone: '+91 98450 77665',
    email: 'gaurav.k@zomato.in',
    checkIn: '2026-10-18',
    checkOut: '2026-10-20',
    category: 'Deluxe Cottage',
    pax: 2,
    budget: 28000,
    source: 'MakeMyTrip',
    status: 'Won',
    assignedTo: 'Kavita Iyer (Sales)',
    createdAt: '3 days ago',
  },
];

export const EnquiriesPage: React.FC = () => {
  const { currentResort, user } = useAuthStore();
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [category, setCategory] = useState('Pool Villa');
  const [budget, setBudget] = useState(75000);
  const [source, setSource] = useState<Enquiry['source']>('Website');

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false;
    return true;
  });

  const totalPipeline = enquiries.reduce((acc, e) => acc + (e.status !== 'Lost' ? e.budget : 0), 0);
  const wonCount = enquiries.filter((e) => e.status === 'Won').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !phone) return;

    const newEnq: Enquiry = {
      id: `ENQ-${Math.floor(810 + Math.random() * 90)}`,
      guestName,
      phone,
      email: email || `${guestName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      checkIn: checkIn || '2026-10-25',
      checkOut: checkOut || '2026-10-28',
      category,
      pax: 2,
      budget: Number(budget) || 50000,
      source,
      status: 'New',
      assignedTo: 'Sales Duty Desk',
      createdAt: 'Just now',
    };

    setEnquiries([newEnq, ...enquiries]);
    setIsAddOpen(false);
    toast.success('Enquiry Created', `${newEnq.id} logged for ${guestName}.`);
    setGuestName('');
  };

  const handleStatusChange = (id: string, status: Enquiry['status']) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    toast.info('Enquiry Status Updated', `Marked as ${status}`);
  };

  const handleConvertToLead = (enq: Enquiry) => {
    // 1. Check duplicate lead in store
    const dupCheck = checkDuplicateLead(enq.phone, enq.email, currentResort.id);
    if (dupCheck.isDuplicate) {
      toast.warning(
        'Lead Already Exists',
        `A lead already exists for ${dupCheck.existingLead?.name} (${dupCheck.existingLead?.phone}).`
      );
      return;
    }

    // 2. Map enquiry source and interested stay
    const mappedSource = enq.source === 'WhatsApp' ? 'Website' : enq.source;
    const res = createLead(
      {
        name: enq.guestName,
        phone: enq.phone,
        email: enq.email,
        city: 'Mumbai, India',
        interested_in: (enq.category.includes('Villa') ? 'Luxury Stay' : 'Weekend Stay') as any,
        guests_adults: enq.pax,
        guests_children: 0,
        preferred_date: enq.checkIn,
        budget_min: Math.round(enq.budget * 0.8),
        budget_max: enq.budget,
        source: mappedSource as any,
        status: 'New',
        priority: 'High',
        score: 'Hot',
        tags: ['Enquiry Conversion', enq.category],
        assigned_to: enq.assignedTo.split(' ')[0] || 'Sameer Verma',
        remarks: `Converted from online enquiry #${enq.id}. Interested in ${enq.category} from ${enq.checkIn} to ${enq.checkOut}.`,
      },
      currentResort.id,
      user
    );

    if (res.success) {
      // Mark enquiry as qualified
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enq.id ? { ...e, status: 'Qualified' } : e))
      );
      toast.success(
        'Enquiry Converted to Lead!',
        `Lead created for ${enq.guestName}. Added to CRM sales pipeline.`
      );
    } else {
      toast.error('Conversion Error', res.error || 'Failed to create lead.');
    }
  };


  const columns: Column<Enquiry>[] = [
    {
      key: 'guestName',
      header: 'Guest & Contact',
      accessor: (e) => (
        <div>
          <span className="font-bold text-[#0F172A] block">{e.guestName}</span>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#0F5132]" /> {e.phone}
          </span>
        </div>
      ),
      sortable: true,
      sortValue: (e) => e.guestName,
    },
    {
      key: 'dates',
      header: 'Stay Window',
      accessor: (e) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800 block">
            {e.checkIn} → {e.checkOut}
          </span>
          <span className="text-[11px] text-[#64748B]">{e.category} • {e.pax} Guests</span>
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Estimated Budget',
      accessor: (e) => (
        <span className="font-bold text-[#0F5132] text-sm">{formatINR(e.budget)}</span>
      ),
      sortable: true,
      sortValue: (e) => e.budget,
    },
    {
      key: 'source',
      header: 'Lead Channel',
      accessor: (e) => (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
          {e.source}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Pipeline Stage',
      accessor: (e) => {
        const color =
          e.status === 'Won'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : e.status === 'Proposal Sent'
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : e.status === 'Qualified'
            ? 'bg-purple-50 text-purple-800 border-purple-200'
            : e.status === 'Lost'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-amber-50 text-amber-800 border-amber-200';
        return (
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${color}`}>
            {e.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Stage Action',
      accessor: (e) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => handleConvertToLead(e)}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Convert this enquiry into a tracked sales lead"
          >
            <User className="w-3 h-3 text-[#0F5132]" />
            <span>Convert to Lead</span>
          </button>
          {e.status === 'New' && (
            <button
              type="button"
              onClick={() => handleStatusChange(e.id, 'Proposal Sent')}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold"
            >
              Send Quote
            </button>
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
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <MessageSquareText className="w-6 h-6 text-[#0F5132]" />
              <span>Guest Enquiries & Demand Pipeline</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Capture prospective guest demand, villa queries, and wedding quote requests.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add New Enquiry
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">Total Enquiries</span>
            <span className="text-[10px] text-[#16A34A] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">+4 this week</span>
          </div>
          <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
            <span>{enquiries.length}</span>
            <p className="text-[11px] font-normal text-[#94A3B8] mt-0.5">All received enquiries</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">Pipeline Value</span>
            <span className="text-[10px] text-[#64748B] font-semibold bg-slate-100 px-2 py-0.5 rounded-full shrink-0">Excl. lost</span>
          </div>
          <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-[#0F5132] tracking-tight mt-0.5">
            <span>{formatINR(totalPipeline)}</span>
            <p className="text-[11px] font-normal text-[#64748B] mt-0.5">Estimated pipeline</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">Converted / Won</span>
            <span className="text-[10px] text-[#16A34A] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">32% Win rate</span>
          </div>
          <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-emerald-600 tracking-tight mt-0.5">
            <span>{wonCount}</span>
            <p className="text-[11px] font-normal text-[#16A34A] mt-0.5">Closed deals</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B]">New Awaiting Action</span>
            <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full shrink-0">&lt; 2 hr SLA</span>
          </div>
          <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-amber-600 tracking-tight mt-0.5">
            <span>{enquiries.filter((e) => e.status === 'New').length}</span>
            <p className="text-[11px] font-normal text-amber-600 mt-0.5">Pending first contact</p>
          </div>
        </div>
      </div>

      {/* Status Filter Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', 'New', 'Qualified', 'Proposal Sent', 'Won', 'Lost'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === st
                ? 'bg-[#0F5132] text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            {st} ({st === 'All' ? enquiries.length : enquiries.filter((e) => e.status === st).length})
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(e) => e.id}
        searchPlaceholder="Search enquiries by guest, phone, or villa..."
        pageSize={6}
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record New Guest Enquiry"
        description="Log prospective reservation details and quote budget"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <Input
            label="Prospective Guest Name"
            placeholder="e.g. Vikramaditya Oberoi"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Phone"
              placeholder="+91 98000 11223"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="guest@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Preferred Check-In"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <Input
              label="Preferred Check-Out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Villa Category Desired"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { label: 'Pool Villa', value: 'Pool Villa' },
                { label: 'Luxury Suite', value: 'Luxury Suite' },
                { label: 'Deluxe Cottage', value: 'Deluxe Cottage' },
                { label: 'Full Resort Buyout', value: 'Full Resort Buyout' },
              ]}
            />
            <Input
              label="Estimated Budget (₹ INR)"
              type="number"
              value={String(budget)}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
            />
          </div>

          <Select
            label="Lead Acquisition Channel"
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            options={[
              { label: 'Official Website', value: 'Website' },
              { label: 'WhatsApp Concierge', value: 'WhatsApp' },
              { label: 'MakeMyTrip / OTA', value: 'MakeMyTrip' },
              { label: 'Word of Mouth / Referral', value: 'Referral' },
              { label: 'Front Desk Walk-in', value: 'Walk-in' },
            ]}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
              Record Enquiry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
