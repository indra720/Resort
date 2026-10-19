import React, { useState, useMemo } from 'react';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { NewBookingModal } from './NewBookingModal';
import { BookingDetailsModal } from './BookingDetailsModal';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import {
  PlusCircle,
  Eye,
  Briefcase,
  Key,
  Receipt,
  Crown,
  Users2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  FileSpreadsheet,
} from 'lucide-react';

interface EnhancedBooking extends Booking {
  assignedExecutive?: string;
  sourceChannel?: string;
  idProofVerified?: boolean;
}

const ENHANCED_BOOKINGS: EnhancedBooking[] = [
  {
    ...MOCK_BOOKINGS[0],
    assignedExecutive: 'Sameer Verma',
    sourceChannel: 'Corporate Sales Desk (Infosys Retreat)',
    idProofVerified: true,
  },
  {
    ...MOCK_BOOKINGS[1],
    assignedExecutive: 'Kavita Iyer',
    sourceChannel: 'Website Direct',
    idProofVerified: true,
  },
  {
    ...MOCK_BOOKINGS[2],
    assignedExecutive: 'Sameer Verma',
    sourceChannel: 'MICE / Executive Board Meeting',
    idProofVerified: false,
  },
  {
    ...MOCK_BOOKINGS[3],
    assignedExecutive: 'Rohit Kumar',
    sourceChannel: 'TCS Group Buyout',
    idProofVerified: false,
  },
];

export const BookingsPage: React.FC = () => {
  const { role, user } = useAuthStore();
  const [bookings, setBookings] = useState<EnhancedBooking[]>(ENHANCED_BOOKINGS);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const isSalesExecutive = role === 'Sales Executive';
  const isReceptionist = role === 'Receptionist';
  const isAccountant = role === 'Accountant';
  const isOwnerOrAdmin = role === 'Resort Owner' || role === 'Super Admin' || role === 'Resort Manager';

  // Role-based filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Sales Executive filter
      if (isSalesExecutive && activeTab === 'my-deals') {
        return b.assignedExecutive === 'Sameer Verma';
      }
      // Receptionist filter
      if (isReceptionist) {
        if (activeTab === 'arrivals') return b.paymentStatus === 'Pending' || b.roomStatus === 'Reserved';
        if (activeTab === 'in-house') return b.roomStatus === 'Occupied';
      }
      // Accountant filter
      if (isAccountant) {
        if (activeTab === 'paid') return b.paymentStatus === 'Paid';
        if (activeTab === 'pending') return b.paymentStatus === 'Pending';
      }
      return true;
    });
  }, [bookings, activeTab, isSalesExecutive, isReceptionist, isAccountant]);

  const handleBookingCreated = (newB: Booking) => {
    const enhanced: EnhancedBooking = {
      ...newB,
      assignedExecutive: isSalesExecutive ? user?.name || 'Sameer Verma' : 'Front Desk',
      sourceChannel: isSalesExecutive ? 'Direct Sales Lead' : 'Front Desk Walk-In',
      idProofVerified: false,
    };
    setBookings((prev) => [enhanced, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, paymentStatus: 'Cancelled', roomStatus: 'Cancelled' } : b
      )
    );
  };

  // Dynamic columns tailored to the active role
  const columns: Column<EnhancedBooking>[] = [
    {
      key: 'bookingCode',
      header: 'Reservation Code',
      accessor: (b) => (
        <div>
          <span className="font-bold text-[#0F5132]">{b.bookingCode}</span>
          {isSalesExecutive && (
            <span className="text-[10px] text-slate-500 block truncate">{b.sourceChannel}</span>
          )}
        </div>
      ),
      sortable: true,
      sortValue: (b) => b.bookingCode,
    },
    {
      key: 'guestName',
      header: 'Guest Details',
      accessor: (b) => (
        <div>
          <span className="font-semibold text-[#1F2937] block">{b.guestName}</span>
          <span className="text-[11px] text-[#6B7280]">{b.guestPhone}</span>
        </div>
      ),
      sortable: true,
      sortValue: (b) => b.guestName,
    },
    {
      key: 'roomNumber',
      header: 'Room',
      accessor: (b) => (
        <div>
          <span className="font-medium text-slate-900">Room #{b.roomNumber}</span>
          {isReceptionist && (
            <span className={`text-[10px] block font-semibold ${b.roomStatus === 'Occupied' ? 'text-amber-700' : 'text-emerald-700'}`}>
              {b.roomStatus === 'Occupied' ? 'In-House' : 'Ready for Check-In'}
            </span>
          )}
        </div>
      ),
      sortable: true,
      sortValue: (b) => b.roomNumber,
    },
    {
      key: 'checkIn',
      header: 'Stay Window',
      accessor: (b) => (
        <span className="text-xs">
          {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
        </span>
      ),
    },
    ...(isAccountant
      ? [
          {
            key: 'taxDetails',
            header: 'Base Tariff + GST',
            accessor: (b: EnhancedBooking) => (
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">{formatINR(b.totalAmount)}</span>
                <span className="text-[10px] text-slate-500">GST: {formatINR(b.gstAmount)} (12%/18%)</span>
              </div>
            ),
          },
        ]
      : [
          {
            key: 'totalAmount',
            header: 'Tariff + GST',
            accessor: (b: EnhancedBooking) => (
              <div>
                <span className="font-semibold text-[#1F2937] block">{formatINR(b.totalAmount)}</span>
                {isSalesExecutive && (
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Est. Incentive: {formatINR(Math.round(b.totalAmount * 0.05))}
                  </span>
                )}
              </div>
            ),
            sortable: true,
            sortValue: (b: EnhancedBooking) => b.totalAmount,
          },
        ]),
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      accessor: (b) => <StatusBadge status={b.paymentStatus} size="sm" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* 1. Role-Specific Banner Alert */}
      {isSalesExecutive && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                Sales Executive Closed Bookings & MICE Retainers
              </span>
              <p className="text-xs text-[#475569] mt-0.5">
                Confirmed corporate retreat bookings converted by Sales Executive <strong>Sameer Verma</strong>. Commission is disbursed on guest checkout.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white border border-emerald-300 text-xs font-bold text-[#0F5132]">
              5% Incentive Eligible
            </span>
          </div>
        </div>
      )}

      {isReceptionist && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Key className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Front Desk Guest Arrivals & Room Key Terminal
              </span>
              <p className="text-xs text-[#475569] mt-0.5">
                Manage expected arrivals, verify Aadhaar/Passport ID, and issue RFID electronic room keys.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info('Front Desk Sync', 'RFID Key Programmer connected')}
          >
            RFID Sync Active
          </Button>
        </div>
      )}

      {isAccountant && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Finance & Tax Invoice Reconciliation Ledger
              </span>
              <p className="text-xs text-[#475569] mt-0.5">
                Audit CGST/SGST tax liabilities, guest folio payments, and bank settlements.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => toast.success('Tally Export', 'Downloaded Tally XML & GST Ledger')}
          >
            Export GST Ledger
          </Button>
        </div>
      )}

      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
            {isSalesExecutive
              ? 'Sales Closed Bookings & Commissions'
              : isReceptionist
              ? 'Front Desk Arrivals & Reservations'
              : isAccountant
              ? 'Guest Folio & Billing Reconciliation'
              : 'Guest Reservations & Bookings'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            {isSalesExecutive
              ? 'Track guest bookings converted from your corporate leads pipeline.'
              : isReceptionist
              ? 'Manage daily guest arrivals, room allocations, and check-in status.'
              : 'Full reservation lifecycle, Indian tax invoices, and payment tracking.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsNewBookingOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          New Reservation
        </Button>
      </div>

      {/* Role-Specific Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto scrollbar-none">
        {isSalesExecutive ? (
          <>
            <button
              onClick={() => setActiveTab('my-deals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'my-deals'
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              My Converted Bookings ({bookings.filter((b) => b.assignedExecutive === 'Sameer Verma').length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              All Resort Bookings ({bookings.length})
            </button>
          </>
        ) : isReceptionist ? (
          <>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('arrivals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'arrivals'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Expected Arrivals (Today)
            </button>
            <button
              onClick={() => setActiveTab('in-house')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'in-house'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              In-House Guests
            </button>
          </>
        ) : isAccountant ? (
          <>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              All Folios ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'paid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Settled & Paid
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'pending'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Payment Pending
            </button>
          </>
        ) : (
          <div className="text-xs text-slate-500 font-medium">
            Showing all {bookings.length} reservations for the active resort property.
          </div>
        )}
      </div>

      {/* Bookings DataTable */}
      <DataTable
        data={filteredBookings}
        columns={columns}
        keyExtractor={(b) => b.id}
        pageSize={6}
        searchPlaceholder="Search guest name, code or room..."
        actions={(b) => (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedBooking(b)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Details
            </Button>
            {isReceptionist && b.roomStatus !== 'Occupied' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  toast.success('Guest Checked-In', `${b.guestName} checked in to Room #${b.roomNumber}`);
                }}
              >
                Check-In
              </Button>
            )}
          </div>
        )}
      />

      {/* New Booking Multi-Step Wizard Modal */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onBookingCreated={handleBookingCreated}
      />

      {/* Booking Details & Cancellation Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onCancelBooking={handleCancelBooking}
      />
    </div>
  );
};
