import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  UserX,
  BedDouble,
  Search,
  Key,
  ShieldCheck,
  CalendarDays,
  Plus,
  Filter,
  List,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';

export const ReceptionistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(MOCK_BOOKINGS[0]?.id || 'b1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const activeBooking = useMemo(() => {
    return MOCK_BOOKINGS.find((b) => b.id === selectedBookingId) || MOCK_BOOKINGS[0];
  }, [selectedBookingId]);

  const filteredBookings = useMemo(() => {
    return MOCK_BOOKINGS.filter((b) => {
      if (activeTab === 'arrivals' && b.paymentStatus !== 'Pending') return false;
      if (activeTab === 'in-house' && b.paymentStatus !== 'Paid') return false;
      if (statusFilter !== 'All' && b.paymentStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.guestName.toLowerCase().includes(q);
        const matchesCode = b.bookingCode.toLowerCase().includes(q);
        const matchesRoom = b.roomNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesRoom) return false;
      }
      return true;
    });
  }, [activeTab, statusFilter, searchQuery]);

  return (
    <div className="space-y-4 text-[#111827]">
      {/* 1. Panoramic Hero Section with Header & 5 Reception KPI Cards */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden flex flex-col justify-between p-5 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Front Desk
                </span>
                <span className="text-xs text-[#64748B]">Guest Hospitality</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Front Desk Reception
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Instant guest check-ins, villa key cards, and luxury concierge services
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Today: 08 Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/check-in-out')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>Check-In Desk</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Reception Metric Cards (Responsive spreading cards with top icon layout) */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* Card 1 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  +4 VIP
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Today's Check-Ins</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  18
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 whitespace-nowrap">
                  Scheduled today
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  8 Cleared
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Today's Check-Outs</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  12
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 whitespace-nowrap">
                  By 11:00 AM
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <BedDouble className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  Ready
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Available Villas</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  6
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 whitespace-nowrap">
                  Sanitized & Clean
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  Active
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">In-House Guests</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  76
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 whitespace-nowrap">
                  24 occupied keys
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#84CC16] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  To Settle
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Pending Folios</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  ₹84,000
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5 whitespace-nowrap">
                  At Check-Out
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'all', label: 'All Reservations', count: MOCK_BOOKINGS.length },
            { id: 'arrivals', label: 'Expected Arrivals', count: 18 },
            { id: 'in-house', label: 'Currently In-House', count: 24 },
            { id: 'departures', label: 'Departures Today', count: 12 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-lg',
                  isActive
                    ? 'text-[#0F5132] font-bold'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-full font-semibold',
                    isActive
                      ? 'bg-[#DCFCE7] text-[#0F5132]'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  )}
                >
                  {tab.count}
                </span>

                {isActive && (
                  <div className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-[#0F5132] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate('/check-in-out')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Walk-In Guest</span>
        </button>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search arrivals by name, mobile, room #..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:border-[#0F5132] text-[#1E293B] placeholder-[#94A3B8]"
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#475569] font-medium focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Payment Pending</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              toast.info('Filters reset.');
            }}
            className="h-9 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] flex items-center gap-1.5 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 4. Split View: Arrivals Table + Selected Guest Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col">
          {/* Mobile / Tablet Horizontal Scroll Notice */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0F5132] animate-pulse" />
              Scroll table horizontally for full reservation details
            </span>
            <span className="text-[10px] font-semibold text-[#0F5132] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] whitespace-nowrap">
              ↔ Swipe to explore
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[880px] text-left text-xs text-[#1E293B] border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                  <th className="py-3.5 px-3 min-w-[120px]">Reservation</th>
                  <th className="py-3.5 px-3 min-w-[180px]">Guest Details</th>
                  <th className="py-3.5 px-3 min-w-[160px]">Assigned Villa</th>
                  <th className="py-3.5 px-3 min-w-[110px]">Stay Dates</th>
                  <th className="py-3.5 px-3 min-w-[110px]">Tariff</th>
                  <th className="py-3.5 px-3 min-w-[120px]">Payment</th>
                  <th className="py-3.5 px-3 text-right min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredBookings.map((b) => {
                  const isSelected = selectedBookingId === b.id;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBookingId(b.id)}
                      className={cn(
                        'hover:bg-[#F8FAFC] cursor-pointer transition-colors',
                        isSelected && 'bg-[#F0FDF4]/70 font-medium'
                      )}
                    >
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-[#0F5132]">{b.bookingCode}</span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col lg:flex-row items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#0F5132]/10 text-[#0F5132] font-bold text-xs flex items-center justify-center shrink-0">
                            {b.guestName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0F172A] whitespace-nowrap">{b.guestName}</p>
                            <p className="text-[11px] text-[#64748B] whitespace-nowrap">{b.guestPhone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-[#1E293B] whitespace-nowrap">Room #{b.roomNumber}</span>
                        <span className="text-[11px] text-[#64748B] block whitespace-nowrap">Deluxe Villa Suite</span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-[#0F172A] whitespace-nowrap">{formatDate(b.checkIn)}</span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-[#0F172A] whitespace-nowrap">{formatINR(b.totalAmount)}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                            b.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          )}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              b.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                            )}
                          />
                          {b.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/check-in-out');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#0F5132] text-white font-medium hover:bg-[#0B3D25] text-xs transition-colors"
                        >
                          Check-In
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Guest Action Card */}
        {activeBooking && (
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-4 sm:p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0F5132]/10 text-[#0F5132] font-bold text-base flex items-center justify-center ring-2 ring-[#0F5132]/20">
                  {activeBooking.guestName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">{activeBooking.guestName}</h3>
                  <p className="text-xs text-[#64748B] font-medium">{activeBooking.bookingCode}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#475569] py-1 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#94A3B8]" />
                <span>{activeBooking.guestPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#94A3B8]" />
                <span>{activeBooking.guestEmail}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toast.success(`Check-In key issued for Room #${activeBooking.roomNumber}!`);
                navigate('/check-in-out');
              }}
              className="w-full py-2.5 px-4 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>Issue Villa RFID Key</span>
            </button>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Key Allotment Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#64748B] text-[10px] block">Villa Room</span>
                  <span className="font-bold text-[#0F172A]">Room #{activeBooking.roomNumber}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#64748B] text-[10px] block">Sanitization</span>
                  <span className="font-bold text-[#16A34A]">Inspected Clean</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
