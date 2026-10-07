import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatINR } from '@/lib/formatINR';
import { calculateGST } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import { Booking } from '@/types';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

export interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  onBookingCreated,
}) => {
  // Multi-step: 1 -> Guest Details, 2 -> Dates & Room, 3 -> Services, 4 -> Payment & Summary
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [guestName, setGuestName] = useState('Ananya Sharma');
  const [guestPhone, setGuestPhone] = useState('+91 98192 34567');
  const [guestEmail, setGuestEmail] = useState('ananya.s@tajhaveli.in');

  const [checkIn, setCheckIn] = useState('2026-10-12');
  const [checkOut, setCheckOut] = useState('2026-10-15');
  const [roomNumber, setRoomNumber] = useState('201');

  // Add-on services state
  const [includeAirportPickup, setIncludeAirportPickup] = useState(true);
  const [includeSpaPackage, setIncludeSpaPackage] = useState(false);

  // Payment mode
  const [paymentMode, setPaymentMode] = useState('UPI');

  // Calculations
  const nights = 3;
  const roomRatePerNight = roomNumber === 'V-01' ? 24000 : roomNumber === '201' ? 11500 : 5500;
  const roomBase = nights * roomRatePerNight;
  const serviceExtras = (includeAirportPickup ? 2500 : 0) + (includeSpaPackage ? 3800 : 0);
  const totalBase = roomBase + serviceExtras;
  const gstBreakup = calculateGST(totalBase, roomRatePerNight >= 7500 ? 18 : 12);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleConfirm = () => {
    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      bookingCode: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName,
      guestPhone,
      guestEmail,
      roomNumber,
      checkIn,
      checkOut,
      totalAmount: gstBreakup.totalWithGst,
      gstAmount: gstBreakup.totalGst,
      paymentStatus: 'Paid',
      roomStatus: 'Reserved',
    };

    onBookingCreated(newBooking);
    toast.success('Reservation Confirmed', `Booking Code: ${newBooking.bookingCode}`);
    onClose();
    setCurrentStep(1);
  };

  const steps = ['Guest Info', 'Dates & Room', 'Add-on Services', 'Payment & Tax'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Reservation"
      description={`Step ${currentStep} of 4: ${steps[currentStep - 1]}`}
      maxWidth="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <Button
            variant="ghost"
            fullWidth
            className="sm:w-auto"
            onClick={currentStep === 1 ? onClose : handleBack}
            leftIcon={currentStep > 1 ? <ArrowLeft className="w-4 h-4" /> : undefined}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              fullWidth
              className="sm:w-auto"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              className="sm:w-auto"
              onClick={handleConfirm}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Confirm Booking ({formatINR(gstBreakup.totalWithGst)})
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6 text-left">
        {/* Compact Mobile Progress Indicator */}
        <div className="flex items-center justify-between gap-2">
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#22C55E] text-white'
                      : isCurrent
                      ? 'bg-[#B84C00] text-white ring-2 ring-[#B84C00]/30'
                      : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className="text-[10px] text-[#64748B] text-center hidden sm:block truncate">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Guest Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Input
              label="Primary Guest Name"
              placeholder="e.g. Vikram Malhotra"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              helperText="Government Photo ID required upon check-in"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Phone (+91)"
                placeholder="+91 98201 12345"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="guest@domain.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Dates & Room Allocation */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Check-In Date"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <Input
                label="Check-Out Date"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <Select
              label="Select Room & Villa"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              options={[
                { label: 'Room 101 - Deluxe Cottage (₹5,500/night)', value: '101' },
                { label: 'Room 201 - Luxury Suite (₹11,500/night)', value: '201' },
                { label: 'Villa V-01 - Pool Villa (₹24,000/night)', value: 'V-01' },
              ]}
              helperText={`Total Stay: ${nights} Nights`}
            />
          </div>
        )}

        {/* Step 3: Add-on Services */}
        {currentStep === 3 && (
          <div className="space-y-3">
            <p className="text-xs text-[#64748B]">
              Select luxury concierge add-ons for the guest stay:
            </p>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:border-[#B84C00]/40 transition-colors">
              <div>
                <span className="text-sm font-semibold text-[#0F172A] block">
                  Private Airport Transfer (AC Sedan)
                </span>
                <span className="text-xs text-[#64748B]">Pick-up from Goa Dabolim Airport</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#B84C00]">{formatINR(2500)}</span>
                <input
                  type="checkbox"
                  checked={includeAirportPickup}
                  onChange={(e) => setIncludeAirportPickup(e.target.checked)}
                  className="w-5 h-5 rounded accent-[#B84C00]"
                />
              </div>
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:border-[#B84C00]/40 transition-colors">
              <div>
                <span className="text-sm font-semibold text-[#0F172A] block">
                  Ayurvedic Spa Couple Package
                </span>
                <span className="text-xs text-[#64748B]">60-minute therapeutic massage</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#B84C00]">{formatINR(3800)}</span>
                <input
                  type="checkbox"
                  checked={includeSpaPackage}
                  onChange={(e) => setIncludeSpaPackage(e.target.checked)}
                  className="w-5 h-5 rounded accent-[#B84C00]"
                />
              </div>
            </label>
          </div>
        )}

        {/* Step 4: Payment Mode & GST Breakdown */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <Select
              label="Payment Method"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              options={[
                { label: 'UPI (Google Pay / PhonePe / Paytm)', value: 'UPI' },
                { label: 'Credit / Debit Card (Visa/Mastercard/RuPay)', value: 'Card' },
                { label: 'Cash at Front Desk', value: 'Cash' },
                { label: 'Corporate Billing / Direct Transfer', value: 'NetBanking' },
              ]}
            />

            {/* GST Tax Breakdown Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Room Charges ({nights} Nights):</span>
                <span>{formatINR(roomBase)}</span>
              </div>

              {serviceExtras > 0 && (
                <div className="flex justify-between text-[#64748B]">
                  <span>Add-on Services:</span>
                  <span>{formatINR(serviceExtras)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#64748B]">
                <span>Sub-Total:</span>
                <span>{formatINR(totalBase)}</span>
              </div>

              <div className="flex justify-between text-[#64748B]">
                <span>GST Tax ({gstBreakup.gstRate}%):</span>
                <span>{formatINR(gstBreakup.totalGst)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0] font-bold text-sm text-[#0F172A]">
                <span>Total Amount Payable:</span>
                <span className="text-[#B84C00] text-base">
                  {formatINR(gstBreakup.totalWithGst)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
