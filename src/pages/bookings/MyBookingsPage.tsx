import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import {
  BedDouble,
  Calendar,
  Download,
  Sparkles,
  PlusCircle,
  Key,
  Wifi,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
  MapPin,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentResort } = useAuthStore();
  const [isKeyUnlocked, setIsKeyUnlocked] = useState(false);

  // Dedicated single luxury booking record for the logged-in guest
  const guestReservation = {
    bookingCode: 'JOY-VVIP-2026',
    guestName: user?.name || 'Indrajeet Singh',
    villaName: 'Presidential Waterfront Pool Villa #V-01',
    resortName: currentResort.name,
    checkIn: '2026-10-18',
    checkOut: '2026-10-22',
    nights: 4,
    adults: 2,
    children: 1,
    tariffPerNight: 24000,
    subtotal: 96000,
    gstAmount: 17280, // 18% GST
    totalAmount: 113280,
    paymentStatus: 'Paid' as const,
    inclusions: [
      'Private Heated Plunge Pool',
      'Personal Dedicated Butler (Karan Singh - Dial #101)',
      'Complimentary Sunset Wine & Cheese Gazebo Service',
      'Airport Luxury BMW Chauffeur Transfers',
      'Organic Farm-to-Table Breakfast Buffet',
    ],
  };

  const handleDigitalKeyUnlock = () => {
    setIsKeyUnlocked(true);
    toast.success('Villa #V-01 Electronic Deadbolt Opened', 'Welcome inside your Presidential Sanctuary!');
    setTimeout(() => setIsKeyUnlocked(false), 5000);
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0F5132] uppercase tracking-wider">
              Confirmed VIP Resident
            </span>
            <span className="text-xs text-slate-500 font-semibold">{guestReservation.resortName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132] mt-1">
            My Luxury Stay Voucher & Reservation
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Your confirmed room reservation, electronic RFID villa key, and tax invoice.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/rooms')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Book Another Villa
        </Button>
      </div>

      {/* Main Guest Reservation Voucher Card */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Card Header with Scenic Resort Backdrop */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#0F5132] text-white">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">
                Booking Reference • {guestReservation.bookingCode}
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                {guestReservation.villaName}
              </h2>
              <p className="text-xs text-emerald-100 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                {guestReservation.resortName} • Waterfront Deck Wing
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-400 text-emerald-950 text-xs font-extrabold shadow-sm">
                CONFIRMED &amp; PAID
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Stay Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Check-In Date
              </span>
              <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                {formatDate(guestReservation.checkIn)}
              </span>
              <span className="text-[11px] text-[#0F5132] font-semibold">From 02:00 PM</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Check-Out Date
              </span>
              <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                {formatDate(guestReservation.checkOut)}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">Until 11:00 AM (Late checkout on request)</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Stay Length &amp; Guests
              </span>
              <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                {guestReservation.nights} Nights • {guestReservation.adults} Adults, {guestReservation.children} Child
              </span>
              <span className="text-[11px] text-purple-700 font-semibold">All-Inclusive Sanctuary Plan</span>
            </div>
          </div>

          {/* Electronic Key Card Section */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0F5132] text-white flex items-center justify-center font-bold shadow-xs">
                <Key className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#0F5132] uppercase tracking-wider block">
                  Electronic RFID Digital Door Key
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tap to unlock your villa door lock via encrypted bluetooth RFID beacon.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleDigitalKeyUnlock}
              leftIcon={<Key className="w-4 h-4" />}
            >
              {isKeyUnlocked ? 'Door Unlocked (Open)' : 'Unlock Villa Door'}
            </Button>
          </div>

          {/* Complimentary VIP Inclusions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Complimentary Inclusions with your Villa Stay
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guestReservation.inclusions.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tariff & Tax Invoice Summary */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500">Total Tariff Paid (includes 18% Hospitality GST):</span>
              <span className="text-xl font-black text-[#0F5132] block">
                {formatINR(guestReservation.totalAmount)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success(
                    'Stay Voucher Downloaded',
                    `Official PDF voucher for ${guestReservation.bookingCode} saved.`
                  )
                }
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download PDF Voucher
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success(
                    'Tax Invoice Downloaded',
                    `GST Tax Invoice for ${formatINR(guestReservation.totalAmount)} downloaded.`
                  )
                }
                leftIcon={<Download className="w-4 h-4" />}
              >
                Tax Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
