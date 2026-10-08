import React, { useState } from 'react';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { NewBookingModal } from './NewBookingModal';
import { BookingDetailsModal } from './BookingDetailsModal';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { PlusCircle, Eye } from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleBookingCreated = (newB: Booking) => {
    setBookings((prev) => [newB, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, paymentStatus: 'Cancelled', roomStatus: 'Cancelled' } : b
      )
    );
  };

  const columns: Column<Booking>[] = [
    {
      key: 'bookingCode',
      header: 'Reservation Code',
      accessor: (b) => <span className="font-bold text-[#C2410C]">{b.bookingCode}</span>,
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
      accessor: (b) => <span>Room #{b.roomNumber}</span>,
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
    {
      key: 'totalAmount',
      header: 'Tariff + GST',
      accessor: (b) => (
        <span className="font-semibold text-[#1F2937]">{formatINR(b.totalAmount)}</span>
      ),
      sortable: true,
      sortValue: (b) => b.totalAmount,
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      accessor: (b) => <StatusBadge status={b.paymentStatus} size="sm" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#C2410C]">
            Guest Reservations & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Full reservation lifecycle, Indian tax invoices, and check-in management.
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

      {/* Bookings DataTable */}
      <DataTable
        data={bookings}
        columns={columns}
        keyExtractor={(b) => b.id}
        pageSize={6}
        searchPlaceholder="Search guest name or reservation code..."
        actions={(b) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedBooking(b)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Details
          </Button>
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
