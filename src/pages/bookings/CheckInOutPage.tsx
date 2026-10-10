import React, { useState, useEffect } from 'react';
import { getBookings, checkInBooking, checkOutBooking, BookingRecord } from '@/api/bookingsApi';
import { useAuthStore } from '@/store/useAuthStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  UserCheck,
  UserX,
  Key,
  CreditCard,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const CheckInOutPage: React.FC = () => {
  const { currentResort, role } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);

  const loadData = () => {
    const isSuperAdmin = role === 'Super Admin';
    const list = getBookings(currentResort.id, isSuperAdmin);
    setAllBookings(list);
  };

  useEffect(() => {
    loadData();
  }, [currentResort.id, role]);

  const checkInList = allBookings.filter(
    (b) => b.roomStatus === 'Reserved' || b.paymentStatus === 'Pending' || b.roomStatus === 'Available'
  );
  const checkOutList = allBookings.filter((b) => b.roomStatus === 'Occupied');

  const handlePerformCheckIn = (bookingId: string, roomNum: string) => {
    checkInBooking(bookingId);
    loadData();
    toast.success('Check-In Successful', `Room #${roomNum} RFID key assigned. Room status marked Occupied.`);
  };

  const handlePerformCheckOut = (bookingId: string, roomNum: string) => {
    checkOutBooking(bookingId);
    loadData();
    toast.success('Check-Out Processed', `Room #${roomNum} marked Dirty. Turnover task dispatched to Housekeeping!`);
  };

  return (
    <div className="space-y-5 text-left text-[#111827]">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
          Front Desk Check-In & Check-Out Terminal
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Joy Resorts guest arrivals, identity document capture, and RFID key issuance.
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full flex flex-col md:flex-row border-b border-[#E2E8F0] gap-4">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'checkin'
              ? 'border-[#0F5132] text-[#0F5132]'
              : 'border-transparent text-[#64748B] hover:text-[#111827]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Expected-Ins ({checkInList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checkout')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'checkout'
              ? 'border-[#0F5132] text-[#0F5132]'
              : 'border-transparent text-[#64748B] hover:text-[#111827]'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Scheduled Check-Outs ({checkOutList.length})</span>
        </button>
      </div>

      {/* Check-In Tab View */}
      {activeTab === 'checkin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checkInList.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#111827]">{b.guestName}</span>
                  <StatusBadge status={b.paymentStatus} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B] pt-1">
                  <div>
                    <span className="block text-[11px]">Room Assigned:</span>
                    <span className="font-semibold text-[#0F5132] text-sm">
                      Room #{b.roomNumber}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px]">Booking ID:</span>
                    <span className="font-semibold text-[#111827]">{b.bookingCode}</span>
                  </div>
                </div>

                <div className="text-xs text-[#64748B] pt-1">
                  <span>Stay Window: </span>
                  <span className="text-[#111827] font-medium">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg mt-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Aadhaar verified • {formatINR(b.totalAmount)} total bill</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handlePerformCheckIn(b.id, b.roomNumber)}
                  leftIcon={<Key className="w-4 h-4" />}
                >
                  Issue RFID Key & Complete Check-In
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Check-Out Tab View */}
      {activeTab === 'checkout' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checkOutList.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#111827]">{b.guestName}</span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Folio Settled
                  </span>
                </div>

                <div className="text-xs text-[#64748B]">
                  <span>Occupying: </span>
                  <span className="font-bold text-[#0F5132]">Room #{b.roomNumber}</span>
                </div>

                <div className="text-xs text-[#64748B]">
                  <span>Total Settled Tariff: </span>
                  <span className="font-bold text-[#111827]">{formatINR(b.totalAmount)}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0F5132]" />
                  <span>Mini-bar and room service charges cleared.</span>
                </div>
              </div>

              <div className="pt-3  border-t border-[#E2E8F0]">
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => handlePerformCheckOut(b.id, b.roomNumber)}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Process Check-Out 
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
