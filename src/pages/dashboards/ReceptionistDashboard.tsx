import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking } from '@/types';
import { formatDate } from '@/lib/utils';
import { formatINR } from '@/lib/formatINR';
import {
  UserCheck,
  UserX,
  BedDouble,
  Search,
  Key,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const ReceptionistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const columns: Column<Booking>[] = [
    {
      key: 'bookingCode',
      header: 'Reservation',
      accessor: (b) => <span className="font-semibold text-[#FF8A3D]">{b.bookingCode}</span>,
      sortable: true,
      sortValue: (b) => b.bookingCode,
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      accessor: (b) => (
        <div>
          <span className="font-medium text-[#F5F5F7] block">{b.guestName}</span>
          <span className="text-[11px] text-[#A1A1AA]">{b.guestPhone}</span>
        </div>
      ),
      sortable: true,
      sortValue: (b) => b.guestName,
    },
    {
      key: 'roomNumber',
      header: 'Room',
      accessor: (b) => <span className="font-medium">Room #{b.roomNumber}</span>,
    },
    {
      key: 'checkIn',
      header: 'Dates',
      accessor: (b) => (
        <span className="text-xs">
          {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Bill',
      accessor: (b) => <span className="font-semibold">{formatINR(b.totalAmount)}</span>,
      sortable: true,
      sortValue: (b) => b.totalAmount,
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      accessor: (b) => <StatusBadge status={b.paymentStatus} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            Front Desk Reception
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Instant check-in/out processing, ID verification, and guest key assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/check-in-out')}
            leftIcon={<Key className="w-4 h-4 text-[#FF8A3D]" />}
          >
            Check-In Terminal
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setSelectedBooking(MOCK_BOOKINGS[1]); // Default to pending booking
              setIsCheckInModalOpen(true);
            }}
            leftIcon={<UserCheck className="w-4 h-4" />}
          >
            Quick Check-In
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Today's Check-Ins"
          value="8 Pending"
          subtitle="4 Checked In"
          icon={UserCheck}
          badge="Front Desk"
        />
        <KPICard
          title="Pending Checkouts"
          value="6 Rooms"
          subtitle="All keys returning by 11:30 AM"
          icon={UserX}
        />
        <KPICard
          title="Rooms Ready (Clean)"
          value="14 Available"
          subtitle="Inspected by Housekeeping"
          trend="up"
          change="+4 ready"
          icon={BedDouble}
        />
        <KPICard
          title="Pending Payments"
          value={formatINR(53030)}
          subtitle="2 Bookings awaiting UPI/Card"
          trend="down"
          icon={CreditCard}
        />
      </div>

      {/* Active Guest Arrivals Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#F5F5F7] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#FF8A3D]" />
            <span>Today's Arrival Queue</span>
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')}>
            All Reservations
          </Button>
        </div>

        <DataTable
          data={MOCK_BOOKINGS}
          columns={columns}
          keyExtractor={(b) => b.id}
          pageSize={5}
          actions={(b) => (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedBooking(b);
                  setIsCheckInModalOpen(true);
                }}
              >
                Process Check-In
              </Button>
            </div>
          )}
        />
      </div>

      {/* Quick Check-In Modal */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Express Guest Check-In"
        description="Verify Indian Government ID proof and hand over RFID key card."
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
            <Button
              variant="ghost"
              fullWidth
              className="sm:w-auto"
              onClick={() => setIsCheckInModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              className="sm:w-auto"
              onClick={() => {
                setIsCheckInModalOpen(false);
                toast.success(
                  'Check-In Successful',
                  `Key card issued for Room #${selectedBooking?.roomNumber || '201'}!`
                );
              }}
              leftIcon={<Key className="w-4 h-4" />}
            >
              Confirm & Issue Key Card
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <div className="p-3.5 rounded-xl bg-[#1C1C24] border border-[#2A2A35] flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#F5F5F7]">
                {selectedBooking?.guestName || 'Kavita Iyer'}
              </p>
              <p className="text-xs text-[#A1A1AA]">
                Reservation #{selectedBooking?.bookingCode || 'RES-8822'}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#FF8A3D] bg-[#CC5500]/18 px-2 py-1 rounded">
              Room #{selectedBooking?.roomNumber || '201'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Govt ID Proof Type"
              defaultValue="aadhaar"
              options={[
                { label: 'Aadhaar Card', value: 'aadhaar' },
                { label: 'Passport (Foreign / NRI)', value: 'passport' },
                { label: 'Driving License', value: 'dl' },
                { label: 'Voter ID', value: 'voter' },
              ]}
            />
            <Input
              label="ID Number / Reference"
              placeholder="e.g. 9876 5432 1098"
              defaultValue="9876 5432 1098"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="RFID Key Card Number"
              placeholder="Scan or enter RFID # (e.g. KEY-89)"
              defaultValue="KEY-201-A"
              leftIcon={<Key className="w-4 h-4" />}
            />
            <Input
              label="Emergency Contact"
              placeholder="+91 Mobile number"
              defaultValue="+91 98411 22998"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 p-2.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>ID proof physically inspected & guest registration card signed.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
