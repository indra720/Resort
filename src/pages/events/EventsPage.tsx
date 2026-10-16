import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "@/store/useToastStore";
import { formatINR } from "@/lib/formatINR";
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
  Eye,
  Check,
  X,
  IndianRupee,
  Phone,
  Trash2,
} from "lucide-react";

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
  status: "Confirmed" | "Tentative" | "Completed";
  eventType:
    | "Wedding"
    | "Corporate Offsite"
    | "Birthday Gala"
    | "Cocktail Reception";
  notes?: string;
}

const INITIAL_EVENTS: EventBooking[] = [
  {
    id: "EVT-901",
    title: "Mehta & Singhal Destination Wedding",
    hostName: "Girish Mehta",
    phone: "+91 98110 99887",
    venue: "Oceanfront Coconut Lawn",
    eventDate: "2026-11-20",
    pax: 450,
    totalCost: 1450000,
    depositPaid: 500000,
    status: "Confirmed",
    eventType: "Wedding",
    notes: "Mandap setup on shoreline, drone photography permit arranged.",
  },
  {
    id: "EVT-902",
    title: "Tata Consumer Leadership Annual Summit",
    hostName: "Sanjay Deshmukh",
    phone: "+91 98200 44332",
    venue: "Royal Grand Ballroom",
    eventDate: "2026-10-28",
    pax: 120,
    totalCost: 580000,
    depositPaid: 250000,
    status: "Confirmed",
    eventType: "Corporate Offsite",
    notes: "Stage projection screens, podium microphones, hi-tea buffet at 4 PM.",
  },
  {
    id: "EVT-903",
    title: "Silver Jubilee Cocktail Soirée",
    hostName: "Vikramaditya Oberoi",
    phone: "+91 98330 22119",
    venue: "Poolside Sunset Deck",
    eventDate: "2026-10-18",
    pax: 80,
    totalCost: 240000,
    depositPaid: 100000,
    status: "Tentative",
    eventType: "Cocktail Reception",
    notes: "Acoustic jazz duo, signature mocktail counter, gazebo lighting.",
  },
];

const VENUE_CATALOG = [
  {
    name: "Oceanfront Coconut Lawn",
    capacity: "800 Pax",
    maxCapacity: 800,
    type: "Outdoor Beachfront",
    basePrice: 380000,
  },
  {
    name: "Royal Grand Ballroom",
    capacity: "500 Pax",
    maxCapacity: 500,
    type: "Air-Conditioned Indoor",
    basePrice: 250000,
  },
  {
    name: "Poolside Sunset Deck",
    capacity: "150 Pax",
    maxCapacity: 150,
    type: "Open-Air Poolside",
    basePrice: 120000,
  },
  {
    name: "Regal Boardroom",
    capacity: "35 Pax",
    maxCapacity: 35,
    type: "Executive Meeting Room",
    basePrice: 60000,
  },
];

export const EventsPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [events, setEvents] = useState<EventBooking[]>(INITIAL_EVENTS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | EventBooking["status"]>("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventBooking | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [venue, setVenue] = useState(VENUE_CATALOG[0].name);
  const [eventDate, setEventDate] = useState("2026-11-15");
  const [pax, setPax] = useState<string>("150");
  const [eventType, setEventType] = useState<EventBooking["eventType"]>("Wedding");
  const [totalCost, setTotalCost] = useState<string>("350000");
  const [depositPaid, setDepositPaid] = useState<string>("100000");
  const [notes, setNotes] = useState("");

  // Payment Recording in Details Modal
  const [additionalPayment, setAdditionalPayment] = useState<string>("");

  // KPIs
  const totalEventYield = events.reduce((acc, e) => acc + e.totalCost, 0);
  const totalDepositCollected = events.reduce((acc, e) => acc + e.depositPaid, 0);
  const confirmedCount = events.filter((e) => e.status === "Confirmed").length;
  const tentativeCount = events.filter((e) => e.status === "Tentative").length;
  const totalPax = events.reduce((acc, e) => acc + e.pax, 0);

  // Filtered Events
  const filteredEvents = statusFilter === "ALL" 
    ? events 
    : events.filter((e) => e.status === statusFilter);

  const handleOpenAdd = (preselectedVenue?: string) => {
    if (preselectedVenue) {
      setVenue(preselectedVenue);
    }
    setIsAddOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hostName) {
      toast.error("Missing Information", "Please enter both Event Title and Host Name.");
      return;
    }

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
      status: "Confirmed",
      eventType,
      notes: notes.trim() || undefined,
    };

    setEvents([newEvt, ...events]);
    setIsAddOpen(false);
    toast.success(
      "Event Venue Booked",
      `${newEvt.title} confirmed for ${newEvt.eventDate}`
    );
    // Reset Form
    setTitle("");
    setHostName("");
    setPhone("+91 ");
    setNotes("");
    setPax("150");
    setTotalCost("350000");
    setDepositPaid("100000");
  };

  const handleStatusChange = (eventId: string, newStatus: EventBooking["status"]) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
    );
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast.success("Status Updated", `Event marked as ${newStatus}`);
  };

  const handleRecordPayment = (eventId: string) => {
    const amount = Number(additionalPayment);
    if (!amount || amount <= 0) {
      toast.error("Invalid Amount", "Please enter a valid payment amount.");
      return;
    }

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const updatedDeposit = Math.min(e.totalCost, e.depositPaid + amount);
          return { ...e, depositPaid: updatedDeposit };
        }
        return e;
      })
    );

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              depositPaid: Math.min(prev.totalCost, prev.depositPaid + amount),
            }
          : null
      );
    }

    toast.success("Payment Recorded", `₹${amount.toLocaleString("en-IN")} credited to event deposit`);
    setAdditionalPayment("");
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }
    toast.info("Booking Cancelled", "The event reservation was removed.");
  };

  const columns: Column<EventBooking>[] = [
    {
      key: "title",
      header: "Event Name & Host",
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
      key: "venue",
      header: "Assigned Venue & Date",
      accessor: (e) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800 block">{e.venue}</span>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#0F5132]" /> {e.eventDate} •{" "}
            {e.pax} Guests
          </span>
        </div>
      ),
    },
    {
      key: "eventType",
      header: "Event Category",
      accessor: (e) => (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
          {e.eventType}
        </span>
      ),
    },
    {
      key: "totalCost",
      header: "Package Value & Deposit",
      accessor: (e) => {
        const remaining = e.totalCost - e.depositPaid;
        return (
          <div>
            <span className="font-bold text-[#0F5132] text-sm block">
              {formatINR(e.totalCost)}
            </span>
            <span className="text-[11px] text-emerald-700">
              Paid: {formatINR(e.depositPaid)}
            </span>
            {remaining > 0 && (
              <span className="text-[10px] text-amber-700 block font-medium">
                Balance: {formatINR(remaining)}
              </span>
            )}
          </div>
        );
      },
      sortable: true,
      sortValue: (e) => e.totalCost,
    },
    {
      key: "status",
      header: "Booking Status",
      accessor: (e) => (
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
            e.status === "Confirmed"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : e.status === "Completed"
              ? "bg-blue-50 text-blue-800 border-blue-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
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
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <PartyPopper className="w-6 h-6 text-[#0F5132]" />
              <span>Banquets, Destination Weddings & Corporate Galas</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Lawn reservations, banquet halls, corporate summits, and event
            deposit management.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => handleOpenAdd()}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Book Venue Space
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Yield */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F5132] shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider truncate">
              Total Event Value
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#0F172A]">
              {formatINR(totalEventYield)}
            </p>
            <p className="text-[10px] text-emerald-700">
              {formatINR(totalDepositCollected)} collected
            </p>
          </div>
        </div>

        {/* KPI 2: Confirmed */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F5132] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider truncate">
              Confirmed Banquets
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#0F172A]">
              {confirmedCount}
            </p>
            <p className="text-[10px] text-[#64748B]">Ready for execution</p>
          </div>
        </div>

        {/* KPI 3: Tentative */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider truncate">
              Tentative Inquiries
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#0F172A]">
              {tentativeCount}
            </p>
            <p className="text-[10px] text-amber-700">Advance awaited</p>
          </div>
        </div>

        {/* KPI 4: Expected Guests */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider truncate">
              Expected Guests
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#0F172A]">
              {totalPax} Pax
            </p>
            <p className="text-[10px] text-[#64748B]">Across all venues</p>
          </div>
        </div>
      </div>

      {/* Venue Spaces Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Luxury Event Venues & Tariffs
          </span>
          <span className="text-[11px] text-[#64748B]">
            Click any venue to quickly reserve
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {VENUE_CATALOG.map((v) => (
            <div
              key={v.name}
              onClick={() => handleOpenAdd(v.name)}
              className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0F5132]/50 hover:shadow-xs transition-all shadow-2xs space-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0F5132] uppercase tracking-wider block">
                  {v.type}
                </span>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#0F5132] font-semibold">
                  Reserve →
                </span>
              </div>
              <p className="font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#0F5132] transition-colors">
                {v.name}
              </p>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-[11px] text-[#64748B] pt-1">
                <span>{v.capacity}</span>
                <span className="font-semibold text-[#0F5132]">
                  {formatINR(v.basePrice)}/day
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-1 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        {(["ALL", "Confirmed", "Tentative", "Completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              statusFilter === status
                ? "bg-[#0F5132] text-white shadow-2xs"
                : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            {status === "ALL" ? `All Events (${events.length})` : `${status} (${events.filter((e) => e.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Events Table */}
      <DataTable
        data={filteredEvents}
        columns={columns}
        keyExtractor={(e) => e.id}
        searchPlaceholder="Search events by name, host, or venue..."
        pageSize={5}
        actions={(e) => (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedEvent(e)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Details
            </Button>
            {e.status === "Tentative" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusChange(e.id, "Confirmed")}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Confirm
              </Button>
            )}
          </div>
        )}
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
              options={VENUE_CATALOG.map((v) => ({
                label: `${v.name} (${v.capacity})`,
                value: v.name,
              }))}
            />
            <Select
              label="Event Nature"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              options={[
                { label: "Destination Wedding", value: "Wedding" },
                {
                  label: "Corporate Offsite / Summit",
                  value: "Corporate Offsite",
                },
                {
                  label: "Birthday Gala / Anniversary",
                  value: "Birthday Gala",
                },
                { label: "Cocktail Reception", value: "Cocktail Reception" },
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
              value={pax}
              onChange={(e) => setPax(e.target.value)}
              placeholder="e.g. 150"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Package Tariff (₹ INR)"
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="e.g. 350000"
              required
            />
            <Input
              label="Advance Deposit Collected (₹ INR)"
              type="number"
              value={depositPaid}
              onChange={(e) => setDepositPaid(e.target.value)}
              placeholder="e.g. 100000"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1F2937] block mb-1">
              Event Notes & Special Arrangements
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catering preferences, live music/DJ, decor setup requirements..."
              className="w-full p-2.5 text-xs rounded-xl bg-white text-[#1F2937] placeholder:text-[#64748B] border border-[#E2E8F0] focus:outline-none focus:border-[#0F5132]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Confirm Venue Reservation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Event Details & Management Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          description={`Reservation ID: ${selectedEvent.id} • ${selectedEvent.eventType}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-left">
            {/* Top Snapshot */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#64748B] block">Primary Host & Contact</span>
                <span className="font-bold text-sm text-[#0F172A] block">{selectedEvent.hostName}</span>
                <span className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-[#0F5132]" /> {selectedEvent.phone}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#64748B] block">Venue & Date</span>
                <span className="font-semibold text-xs text-[#0F172A] block">{selectedEvent.venue}</span>
                <span className="text-xs text-[#0F5132] font-bold block">{selectedEvent.eventDate} ({selectedEvent.pax} Guests)</span>
              </div>
            </div>

            {/* Financial Status Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white border border-[#E2E8F0]">
              <div>
                <span className="text-[11px] text-[#64748B] block">Agreed Tariff</span>
                <span className="font-extrabold text-sm sm:text-base text-[#0F172A]">
                  {formatINR(selectedEvent.totalCost)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-emerald-700 block">Advance Deposited</span>
                <span className="font-extrabold text-sm sm:text-base text-[#0F5132]">
                  {formatINR(selectedEvent.depositPaid)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-amber-700 block">Remaining Balance</span>
                <span className="font-extrabold text-sm sm:text-base text-amber-800">
                  {formatINR(selectedEvent.totalCost - selectedEvent.depositPaid)}
                </span>
              </div>
            </div>

            {/* Event Notes */}
            {selectedEvent.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">Special Setup Instructions:</span>
                <p className="text-slate-64748B leading-relaxed">{selectedEvent.notes}</p>
              </div>
            )}

            {/* Record Additional Advance / Balance Payment */}
            {selectedEvent.totalCost - selectedEvent.depositPaid > 0 && (
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-[#0F5132] block">
                  Record Additional Deposit / Balance Settlement
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter amount in ₹ (e.g. 50000)"
                    type="number"
                    value={additionalPayment}
                    onChange={(e) => setAdditionalPayment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleRecordPayment(selectedEvent.id)}
                    className="shrink-0"
                  >
                    Credit Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Status Change & Cancel Actions */}
            <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B]">Update Status:</span>
                <Button
                  size="sm"
                  variant={selectedEvent.status === "Confirmed" ? "primary" : "outline"}
                  onClick={() => handleStatusChange(selectedEvent.id, "Confirmed")}
                >
                  Confirmed
                </Button>
                <Button
                  size="sm"
                  variant={selectedEvent.status === "Completed" ? "primary" : "outline"}
                  onClick={() => handleStatusChange(selectedEvent.id, "Completed")}
                >
                  Completed
                </Button>
                <Button
                  size="sm"
                  variant={selectedEvent.status === "Tentative" ? "primary" : "outline"}
                  onClick={() => handleStatusChange(selectedEvent.id, "Tentative")}
                >
                  Tentative
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Cancel Event
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
