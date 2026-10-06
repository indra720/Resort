import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from '@/store/useToastStore';
import { formatINR, formatCompactINR } from '@/lib/formatINR';
import { formatDate, calculateGST } from '@/lib/utils';
import { MOCK_ROOMS, MOCK_USERS, MOCK_BOOKINGS } from '@/data/mockData';
import { StatusType, UserRole } from '@/types';
import {
  Search,
  IndianRupee,
  Calendar,
  Check,
  Bell,
  Sparkles,
  BedDouble,
  Users,
  Shield,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for test inputs
  const [sampleName, setSampleName] = useState('Vikram Malhotra');
  const [sampleRoomType, setSampleRoomType] = useState('deluxe');

  // Sample Room Rates & GST calculation test
  const testBaseAmount = 14500;
  const gst12 = calculateGST(testBaseAmount, 12);
  const gst18 = calculateGST(testBaseAmount, 18);

  const allStatuses: StatusType[] = [
    'Available',
    'Occupied',
    'Reserved',
    'Cleaning',
    'Maintenance',
    'Paid',
    'Pending',
    'Cancelled',
  ];

  const allRoles: UserRole[] = [
    'Super Admin',
    'Resort Manager',
    'Receptionist',
    'Housekeeping',
    'Restaurant/F&B',
    'Accountant',
    'Guest',
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2A2A35] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Step 1: Design System & Core Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#F5F5F7] tracking-tight">
            Resort Design System UI
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Pure Dark + Orange theme (#0B0B0F / #FF6B00), mobile-first 44px touch targets, zero TanStack.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => toast.info('System Alert', 'Auto-sync completed at 14:55')}
            leftIcon={<Bell className="w-4 h-4" />}
          >
            Test Alert
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<BedDouble className="w-4 h-4" />}
          >
            Open Booking Modal
          </Button>
        </div>
      </div>

      {/* 1. Indian Currency (formatINR) & GST Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold text-[#F5F5F7]">
            Currency (INR ₹) & GST Tax Calculator
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hoverEffect>
            <CardHeader className="pb-2">
              <CardDescription>Single Room Rate</CardDescription>
              <CardTitle className="text-2xl text-[#FF6B00]">
                {formatINR(5500)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#A1A1AA]">
              Standard Deluxe Cottage per night
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardHeader className="pb-2">
              <CardDescription>Luxury Suite (12% GST)</CardDescription>
              <CardTitle className="text-2xl text-[#F5F5F7]">
                {formatINR(gst12.totalWithGst)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#A1A1AA]">
              Base: {formatINR(gst12.baseAmount)} + GST 12%: {formatINR(gst12.totalGst)}
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardHeader className="pb-2">
              <CardDescription>Private Villa (18% GST)</CardDescription>
              <CardTitle className="text-2xl text-[#F5F5F7]">
                {formatINR(gst18.totalWithGst)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#A1A1AA]">
              Base: {formatINR(gst18.baseAmount)} + GST 18%: {formatINR(gst18.totalGst)}
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardHeader className="pb-2">
              <CardDescription>Monthly Resort Revenue</CardDescription>
              <CardTitle className="text-2xl text-[#22C55E]">
                {formatCompactINR(4850000)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#A1A1AA]">
              Compact format: ₹48.5 Lakh ({formatINR(4850000)})
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. StatusBadges Requirement */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold text-[#F5F5F7]">
            StatusBadges (All 8 Required Statuses)
          </h3>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-3">
              {allStatuses.map((st) => (
                <div key={st} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[#1C1C24] border border-[#2A2A35]">
                  <StatusBadge status={st} size="md" />
                  <span className="text-[11px] text-[#A1A1AA]">Status: {st}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. Base UI: Buttons */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#F5F5F7]">Button Component Variants</h3>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary (#FF6B00)</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#2A2A35]">
              <Button size="sm" variant="secondary">Small (36px)</Button>
              <Button size="md" variant="primary">Medium (44px Mobile Touch)</Button>
              <Button size="lg" variant="primary">Large (48px Touch)</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Form Components (44px touch targets, single-column mobile) */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#F5F5F7]">
          Form Inputs & Select (44px Touch Targets)
        </h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Input
                label="Guest Full Name"
                placeholder="e.g. Vikram Malhotra"
                value={sampleName}
                onChange={(e) => setSampleName(e.target.value)}
                leftIcon={<Users className="w-4 h-4" />}
                helperText="Enter name as per Indian Govt ID proof"
              />

              <Input
                label="Contact Mobile (with Country Code)"
                placeholder="+91 98201 12345"
                defaultValue="+91 98201 12345"
                leftIcon={<IndianRupee className="w-4 h-4 opacity-0" />} // layout spacer
                helperText="SMS confirmation sent to this number"
              />

              <Select
                label="Room Category"
                value={sampleRoomType}
                onChange={(e) => setSampleRoomType(e.target.value)}
                options={[
                  { label: 'Deluxe Cottage (₹5,500/night)', value: 'deluxe' },
                  { label: 'Luxury Suite (₹11,500/night)', value: 'suite' },
                  { label: 'Pool Villa (₹24,000/night)', value: 'villa' },
                ]}
                helperText="Includes complimentary breakfast & Wi-Fi"
              />

              <Input
                label="Search Reservation Code"
                placeholder="e.g. RES-8821"
                leftIcon={<Search className="w-4 h-4" />}
              />

              <Input
                label="GSTIN Number (Optional)"
                placeholder="27AAAAA0000A1Z5"
                error="GSTIN must be 15 characters valid Indian format"
              />

              <div className="flex flex-col justify-end">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() =>
                    toast.success('Form Validated', 'Guest information saved successfully!')
                  }
                >
                  Save Guest Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. Toast Notifications Interactive Demo */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#F5F5F7]">Toast Notifications</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="success"
                onClick={() =>
                  toast.success(
                    'Booking Confirmed',
                    'Room 102 booked for Rohan Mehra (₹18,480)'
                  )
                }
              >
                Trigger Success Toast
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  toast.error(
                    'Payment Failed',
                    'UPI transaction timed out. Please retry.'
                  )
                }
              >
                Trigger Error Toast
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  toast.warning(
                    'Housekeeping Required',
                    'Room 202 requires turnover before 3:00 PM.'
                  )
                }
              >
                Trigger Warning Toast
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  toast.info(
                    'New Room Service Order',
                    'Table 4 ordered 2x Paneer Tikka & 1x Dal Makhani.'
                  )
                }
              >
                Trigger Info Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Mobile-First Card View (Replacing TanStack Table with Responsive Stacked Cards) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-[#F5F5F7]">
              Live Room Inventory (Mobile-Ready Cards / Table)
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Zero TanStack table dependency: Responsive layout transforms gracefully on 320px screens.
            </p>
          </div>
          <Badge variant="primary">{MOCK_ROOMS.length} Rooms Configured</Badge>
        </div>

        {/* Mobile Swipe Guidance Banner */}
        <div className="sm:hidden flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#1C1C24] border border-[#2A2A35] text-[11px] text-[#A1A1AA]">
          <span className="flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF6B00] animate-pulse shrink-0" />
            <span>Swipe horizontally to view full table columns</span>
          </span>
          <span className="text-[10px] text-[#FF6B00] font-medium bg-[#FF6B00]/10 px-1.5 py-0.5 rounded">
            Full Table
          </span>
        </div>

        {/* Full Scrollable Table */}
        <div className="overflow-x-auto rounded-xl border border-[#2A2A35] bg-[#14141A] pb-1">
          <table className="w-full min-w-[760px] text-left text-sm text-[#F5F5F7] border-collapse">
            <thead className="bg-[#1C1C24] text-xs text-[#A1A1AA] uppercase border-b border-[#2A2A35]">
              <tr>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Room</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Rate / Night</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Max Guests</th>
                <th className="py-3.5 px-4 font-semibold text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A35]">
              {MOCK_ROOMS.map((room) => (
                <tr key={room.id} className="hover:bg-[#1C1C24]/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#F5F5F7] whitespace-nowrap">
                    #{room.roomNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA] whitespace-nowrap">{room.category}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={room.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#F5F5F7] whitespace-nowrap">
                    {formatINR(room.ratePerNight)}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA] whitespace-nowrap">{room.maxGuests} Guests</td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.info(`Room #${room.roomNumber}`, `Status: ${room.status}`)
                      }
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (<= 640px) */}
        <div className="sm:hidden space-y-3">
          {MOCK_ROOMS.map((room) => (
            <div
              key={room.id}
              className="p-4 rounded-xl bg-[#14141A] border border-[#2A2A35] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-semibold text-[#F5F5F7]">
                    Room #{room.roomNumber}
                  </span>
                  <p className="text-xs text-[#A1A1AA]">{room.category}</p>
                </div>
                <StatusBadge status={room.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2A2A35]/50">
                <span className="text-[#A1A1AA]">Tariff:</span>
                <span className="font-semibold text-[#FF6B00] text-sm">
                  {formatINR(room.ratePerNight)} / night
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A1A1AA]">Capacity:</span>
                <span className="text-[#F5F5F7]">{room.maxGuests} Guests</span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() =>
                  toast.info(`Room #${room.roomNumber}`, `Status: ${room.status}`)
                }
              >
                Manage Room #{room.roomNumber}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Skeleton & EmptyState Demos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-[#F5F5F7]">Skeleton Loading Demo</h3>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-12 h-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-4 w-3/4" />
                  <Skeleton variant="text" className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton variant="rectangular" className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton variant="rectangular" className="h-10 w-24" />
                <Skeleton variant="rectangular" className="h-10 flex-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-[#F5F5F7]">Empty State Component</h3>
          <EmptyState
            title="No Bookings Found"
            description="There are no active reservations matching your selected dates or filters."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Create Reservation
              </Button>
            }
          />
        </div>
      </section>

      {/* 8. Active Bookings with Indian Guest Data & Dates */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold text-[#F5F5F7]">
            Recent Bookings (Indian Guest Data & Date Formatter)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_BOOKINGS.map((b) => (
            <Card key={b.id} hoverEffect>
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <div>
                  <CardTitle>{b.guestName}</CardTitle>
                  <CardDescription>{b.bookingCode} • Room #{b.roomNumber}</CardDescription>
                </div>
                <StatusBadge status={b.paymentStatus} size="sm" />
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Stay Duration:</span>
                  <span className="text-[#F5F5F7] font-medium">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Total Amount (incl. GST):</span>
                  <span className="text-[#FF6B00] font-semibold text-sm">
                    {formatINR(b.totalAmount)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t border-[#2A2A35]/50 flex justify-between">
                <span className="text-xs text-[#22C55E] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> GST #{formatINR(b.gstAmount)} Paid
                </span>
                <Button size="sm" variant="ghost">View Invoice</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 9. Roles & Resort Staff Preview Section */}
      {/* 9. Roles Architecture & Resort Staff Preview */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="text-lg font-semibold text-[#F5F5F7]">
            User Roles Architecture (7 Supported Roles)
          </h3>
        </div>

        {/* 7 Roles Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {allRoles.map((role) => (
            <div
              key={role}
              className="p-3 rounded-lg bg-[#14141A] border border-[#2A2A35] text-center flex flex-col items-center justify-center gap-1.5"
            >
              <div className="w-8 h-8 rounded-full bg-[#1C1C24] flex items-center justify-center text-[#FF6B00]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#F5F5F7] line-clamp-1">{role}</span>
            </div>
          ))}
        </div>

        {/* Personnel with Real Indian Mock Data */}
        <div className="pt-2">
          <p className="text-xs text-[#A1A1AA] mb-3">Assigned Staff Directory (Indian Mock Profiles):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_USERS.map((usr) => (
              <div
                key={usr.id}
                className="p-3.5 rounded-xl bg-[#14141A] border border-[#2A2A35] flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#1C1C24] border border-[#2A2A35] flex items-center justify-center text-[#FF6B00] shrink-0 font-semibold text-sm">
                  {usr.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#F5F5F7] truncate">{usr.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#FF6B00] font-medium truncate">{usr.role}</span>
                    <span className="text-[11px] text-[#A1A1AA] truncate">{usr.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Modal / Mobile Sheet */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Reservation Quick-Form"
        description="Book a cottage or luxury suite for incoming guests."
        maxWidth="lg"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
            <Button
              variant="ghost"
              fullWidth
              className="sm:w-auto"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              className="sm:w-auto"
              onClick={() => {
                setIsModalOpen(false);
                toast.success('Reservation Created', 'Confirmation SMS sent to guest!');
              }}
            >
              Confirm Reservation
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <Input
            label="Guest Full Name"
            placeholder="e.g. Ananya Sharma"
            defaultValue="Ananya Sharma"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              placeholder="+91 98192 34567"
              defaultValue="+91 98192 34567"
            />
            <Input
              label="Check-In Date"
              type="date"
              defaultValue="2026-10-06"
            />
          </div>

          <Select
            label="Select Accommodation"
            defaultValue="201"
            options={[
              { label: 'Room 201 - Luxury Suite (₹11,500/night)', value: '201' },
              { label: 'Villa V-01 - Pool Villa (₹24,000/night)', value: 'v01' },
              { label: 'Room 101 - Deluxe Cottage (₹5,500/night)', value: '101' },
            ]}
          />

          <div className="p-3.5 rounded-lg bg-[#1C1C24] border border-[#2A2A35] text-xs space-y-1.5">
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Base Rate (1 Night):</span>
              <span>{formatINR(11500)}</span>
            </div>
            <div className="flex justify-between text-[#A1A1AA]">
              <span>GST (18% for Suite):</span>
              <span>{formatINR(2070)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#F5F5F7] pt-1 border-t border-[#2A2A35]">
              <span>Total Payable:</span>
              <span className="text-[#FF6B00]">{formatINR(13570)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
