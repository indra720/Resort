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
  PartyPopper,
  PlusCircle,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';

export interface EventBooking {
  id: string;
  title: string;
  hostName: string;
  phone: string;
  venue: string;
  eventDate: string;
  pax: number;
  totalCost: number;
  depositPaid: number;
  status: 'Confirmed' | 'Tentative' | 'Completed';
  eventType: 'Wedding' | 'Corporate Offsite' | 'Birthday Gala' | 'Cocktail Reception';
}

const INITIAL_EVENTS: EventBooking[] = [
  {
    id: 'EVT-901',
    title: 'Mehta & Singhal Destination Wedding',
    hostName: 'Girish Mehta',
    phone: '+91 98110 99887',
    venue: 'Oceanfront Coconut Lawn',
    eventDate: '2026-11-20',
    pax: 450,
    totalCost: 1450000,
    depositPaid: 500000,
    status: 'Confirmed',
    eventType: 'Wedding',
  },
  {
    id: 'EVT-902',
    title: 'Tata Consumer Leadership Annual Summit',
    hostName: 'Sanjay Deshmukh',
    phone: '+91 98200 44332',
    venue: 'Royal Grand Ballroom',
    eventDate: '2026-10-28',
    pax: 120,
    totalCost: 580000,
    depositPaid: 250000,
    status: 'Confirmed',
    eventType: 'Corporate Offsite',
  },
  {
    id: 'EVT-903',
    title: 'Silver Jubilee Cocktail Soirée',
    hostName: 'Vikramaditya Oberoi',
    phone: '+91 98330 22119',
    venue: 'Poolside Sunset Deck',
    eventDate: '2026-10-18',
    pax: 80,
    totalCost: 240000,
    depositPaid: 100000,
    status: 'Tentative',
    eventType: 'Cocktail Reception',
  },
];

const VENUE_CATALOG = [
  {
    name: 'Oceanfront Coconut Lawn',
    capacity: '800 Pax',
    type: 'Outdoor Beachfront',
    basePrice: 380000,
  },
  {
    name: 'Royal Grand Ballroom',
    capacity: '500 Pax',
    type: 'Air-Conditioned Indoor',
    basePrice: 250000,
  },
  {
    name: 'Poolside Sunset Deck',
    capacity: '150 Pax',
    type: 'Open-Air Poolside',
    basePrice: 120000,
  },
  {
    name: 'Regal Boardroom',
    capacity: '35 Pax',
    type: 'Executive Meeting Room',
    basePrice: 60000,
  },
];

export const EventsPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [events, setEvents] = useState<EventBooking[]>(INITIAL_EVENTS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [hostName, setHostName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [venue, setVenue] = useState(VENUE_CATALOG[0].name);
  const [eventDate, setEventDate] = useState('2026-11-15');
  const [pax, setPax] = useState(150);
  const [eventType, setEventType] = useState<EventBooking['eventType']>('Wedding');
  const [totalCost, setTotalCost] = useState(350000);
  const [depositPaid, setDepositPaid] = useState(100000);

  const totalEventYield = events.reduce((acc, e) => acc + e.totalCost, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hostName) return;

    const newEvt: EventBooking = {
      id: `EVT-${Math.floor(904 + Math.random() * 90)}`,
      title,
      hostName,
      phone,
      venue,
      eventDate,
      pax: Number(pax) || 50,
      totalCost: Number(totalCost) || 100000,
      depositPaid: Number(depositPaid) || 25000,
      status: 'Confirmed',
      eventType,
    };

    setEvents([newEvt, ...events]);
    setIsAddOpen(false);
    toast.success('Event Venue Booked', `${newEvt.title} confirmed for ${newEvt.eventDate}`);
    setTitle('');
    setHostName('');
  };

  const columns: Column<EventBooking>[] = [
    {
      key: 'title',
      header: 'Event Name & Host',
      accessor: (e) => (
        <div>
          <span className="font-bold text-[#0F172A] block">{e.title}</span>
          <span className="text-[11px] text-[#64748B]">
            Host: {e.hostName} • {e.phone}
          </span>
        </div>
      ),
      sortable: true,
      sortValue: (e) => e.title,
    },
    {
      key: 'venue',
      header: 'Assigned Venue & Date',
      accessor: (e) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800 block">{e.venue}</span>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#0F5132]" /> {e.eventDate} • {e.pax} Guests
          </span>
        </div>
      ),
    },
    {
      key: 'eventType',
      header: 'Event Category',
      accessor: (e) => (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
          {e.eventType}
        </span>
      ),
    },
    {
      key: 'totalCost',
      header: 'Package Value & Deposit',
      accessor: (e) => (
        <div>
          <span className="font-bold text-[#0F5132] text-sm block">{formatINR(e.totalCost)}</span>
          <span className="text-[11px] text-emerald-700">Advance: {formatINR(e.depositPaid)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Booking Status',
      accessor: (e) => (
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
            e.status === 'Confirmed'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {e.status}
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
              <PartyPopper className="w-6 h-6 text-[#0F5132]" />
              <span>Banquets, Destination Weddings & Corporate Galas</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Lawn reservations, banquet halls, corporate summits, and event deposit management.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Book Venue Space
        </Button>
      </div>

      {/* Venue Spaces Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {VENUE_CATALOG.map((v) => (
          <div
            key={v.name}
            className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1"
          >
            <span className="text-[10px] font-bold text-[#0F5132] uppercase tracking-wider block">
              {v.type}
            </span>
            <p className="font-bold text-xs sm:text-sm text-[#0F172A]">{v.name}</p>
            <div className="flex flex-col md:flex-row items-center justify-between text-[11px] text-[#64748B] pt-1">
              <span>{v.capacity}</span>
              <span className="font-semibold text-[#0F5132]">{formatINR(v.basePrice)}/day</span>
            </div>
          </div>
        ))}
      </div>

      {/* Events Table */}
      <DataTable
        data={events}
        columns={columns}
        keyExtractor={(e) => e.id}
        searchPlaceholder="Search events by name, host, or venue..."
        pageSize={5}
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Reserve Banquet Venue Space"
        description="Book beachfront lawns, grand ballrooms, or poolside decks for private gatherings"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <Input
            label="Event Name / Occasion"
            placeholder="e.g. Singhal Silver Jubilee Gala"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Host Full Name"
              placeholder="e.g. Girish Mehta"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
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
            <Select
              label="Venue Location"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              options={VENUE_CATALOG.map((v) => ({ label: `${v.name} (${v.capacity})`, value: v.name }))}
            />
            <Select
              label="Event Nature"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              options={[
                { label: 'Destination Wedding', value: 'Wedding' },
                { label: 'Corporate Offsite / Summit', value: 'Corporate Offsite' },
                { label: 'Birthday Gala / Anniversary', value: 'Birthday Gala' },
                { label: 'Cocktail Reception', value: 'Cocktail Reception' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Event Date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
            <Input
              label="Expected Guest Pax"
              type="number"
              value={String(pax)}
              onChange={(e) => setPax(Number(e.target.value) || 1)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Package Tariff (₹ INR)"
              type="number"
              value={String(totalCost)}
              onChange={(e) => setTotalCost(Number(e.target.value) || 0)}
              required
            />
            <Input
              label="Advance Deposit Collected (₹ INR)"
              type="number"
              value={String(depositPaid)}
              onChange={(e) => setDepositPaid(Number(e.target.value) || 0)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
              Confirm Venue Reservation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
