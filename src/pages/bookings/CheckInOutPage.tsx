import React, { useState } from 'react';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking } from '@/types';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import {
  UserCheck,
  UserX,
  Key,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const CheckInOutPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');

  const handlePerformCheckIn = (bkgId: string, roomNo: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bkgId ? { ...b, roomStatus: 'Occupied' } : b))
    );
    toast.success('Check-In Complete', `RFID key card activated for Room #${roomNo}`);
  };

  const handlePerformCheckOut = (bkgId: string, roomNo: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bkgId ? { ...b, roomStatus: 'Cleaning' } : b))
    );
    toast.success(
      'Check-Out Complete',
      `Room #${roomNo} vacated. Notified housekeeping for turnover.`
    );
  };

  const checkInList = bookings.filter((b) => b.paymentStatus !== 'Cancelled');
  const checkOutList = bookings.filter((b) => b.roomStatus === 'Occupied');

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
          Front Desk Check-In & Check-Out Terminal
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Guest arrivals, identity document capture, and key issuance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A35] gap-4">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'checkin'
              ? 'border-[#CC5500] text-[#FF8A3D]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F5F5F7]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Expected Check-Ins ({checkInList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checkout')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'checkout'
              ? 'border-[#CC5500] text-[#FF8A3D]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F5F5F7]'
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
              className="p-5 rounded-2xl bg-[#14141A] border border-[#2A2A35] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#F5F5F7]">{b.guestName}</span>
                  <StatusBadge status={b.paymentStatus} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#A1A1AA] pt-1">
                  <div>
                    <span className="block text-[11px]">Room Assigned:</span>
                    <span className="font-semibold text-[#FF8A3D] text-sm">
                      Room #{b.roomNumber}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px]">Booking ID:</span>
                    <span className="font-semibold text-[#F5F5F7]">{b.bookingCode}</span>
                  </div>
                </div>

                <div className="text-xs text-[#A1A1AA] pt-1">
                  <span>Stay Window: </span>
                  <span className="text-[#F5F5F7] font-medium">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 p-2 rounded-lg mt-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Aadhaar verified • {formatINR(b.totalAmount)} total bill</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A2A35]">
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
              className="p-5 rounded-2xl bg-[#14141A] border border-[#2A2A35] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#F5F5F7]">{b.guestName}</span>
                  <span className="text-xs font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-[#22C55E]/20">
                    Folio Settled
                  </span>
                </div>

                <div className="text-xs text-[#A1A1AA]">
                  <span>Occupying: </span>
                  <span className="font-bold text-[#FF8A3D]">Room #{b.roomNumber}</span>
                </div>

                <div className="text-xs text-[#A1A1AA]">
                  <span>Total Settled Tariff: </span>
                  <span className="font-bold text-[#F5F5F7]">{formatINR(b.totalAmount)}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#1C1C24] border border-[#2A2A35] text-xs text-[#A1A1AA] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#FF8A3D]" />
                  <span>Mini-bar and room service charges cleared.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A2A35]">
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => handlePerformCheckOut(b.id, b.roomNumber)}
                  leftIcon={<UserX className="w-4 h-4" />}
                >
                  Return Key & Mark Room Dirty
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
