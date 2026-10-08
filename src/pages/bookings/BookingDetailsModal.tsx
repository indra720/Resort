import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { Booking } from '@/types';
import { toast } from '@/store/useToastStore';
import { Calendar, BedDouble, User, CreditCard, Ban } from 'lucide-react';

export interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelBooking,
}) => {
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  if (!booking) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Reservation Details • ${booking.bookingCode}`}
        description="Comprehensive guest stay voucher and billing summary"
        maxWidth="lg"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            {booking.paymentStatus !== 'Cancelled' ? (
              <Button
                variant="danger"
                size="md"
                fullWidth
                className="sm:w-auto"
                onClick={() => setIsConfirmCancelOpen(true)}
                leftIcon={<Ban className="w-4 h-4" />}
              >
                Cancel Booking
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="outline"
              size="md"
              fullWidth
              className="sm:w-auto"
              onClick={onClose}
            >
              Close Window
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          {/* Header Status Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7280]">Reservation Code:</span>
              <span className="font-bold text-sm text-[#C2410C]">{booking.bookingCode}</span>
            </div>
            <StatusBadge status={booking.paymentStatus} />
          </div>

          {/* Guest and Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-1">
              <span className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C2410C]" /> Primary Guest
              </span>
              <p className="text-sm font-bold text-[#1F2937]">{booking.guestName}</p>
              <p className="text-xs text-[#6B7280]">{booking.guestPhone}</p>
              <p className="text-xs text-[#6B7280]">{booking.guestEmail}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-1">
              <span className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-[#C2410C]" /> Room Assigned
              </span>
              <p className="text-sm font-bold text-[#1F2937]">Room #{booking.roomNumber}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280] pt-1">
                <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>
                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & GST Summary */}
          <div className="p-4 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] space-y-2 text-xs">
            <span className="font-semibold text-xs text-[#1F2937] flex items-center gap-1.5 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-[#22C55E]" /> Financial Summary
            </span>

            <div className="flex justify-between text-[#6B7280]">
              <span>Base Accommodation Charges:</span>
              <span>{formatINR(booking.totalAmount - booking.gstAmount)}</span>
            </div>

            <div className="flex justify-between text-[#6B7280]">
              <span>GST Tax Amount (CGST + SGST):</span>
              <span>{formatINR(booking.gstAmount)}</span>
            </div>

            <div className="flex justify-between font-bold text-sm text-[#1F2937] pt-2 border-t border-[#E5E7EB]">
              <span>Grand Total:</span>
              <span className="text-[#C2410C] text-base">{formatINR(booking.totalAmount)}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        title="Cancel Reservation?"
        description={`Are you sure you want to cancel booking ${booking.bookingCode} for ${booking.guestName}? The room will be released back to inventory.`}
        confirmText="Confirm Cancellation"
        variant="danger"
        onConfirm={() => {
          onCancelBooking(booking.id);
          setIsConfirmCancelOpen(false);
          onClose();
          toast.warning('Reservation Cancelled', `Booking ${booking.bookingCode} has been cancelled.`);
        }}
      />
    </>
  );
};
