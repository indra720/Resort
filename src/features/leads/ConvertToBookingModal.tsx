import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CalendarCheck, CheckCircle2, BedDouble, AlertCircle, Sparkles } from 'lucide-react';
import { Lead } from '@/types/crm';
import { Room } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getRooms } from '@/api/roomsApi';
import { convertLeadToBooking } from '@/api/leads';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';

export interface ConvertToBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSuccess: () => void;
}

export const ConvertToBookingModal: React.FC<ConvertToBookingModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { currentResort, user } = useAuthStore();
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      const rooms = getRooms(currentResort.id);
      // Filter rooms that are Available or Clean
      const usableRooms = rooms.filter((r) => r.status === 'Available' || r.status === 'Clean');
      setAvailableRooms(usableRooms);
      if (usableRooms.length > 0) {
        setSelectedRoomNumber(usableRooms[0].roomNumber);
      }

      // Pre-fill dates
      const start = lead.preferred_date || new Date().toISOString().split('T')[0];
      setCheckInDate(start);
      // Default to 3 nights stay
      const startDateObj = new Date(start);
      startDateObj.setDate(startDateObj.getDate() + 3);
      setCheckOutDate(startDateObj.toISOString().split('T')[0]);
      setErrorMsg(null);
    }
  }, [lead, isOpen, currentResort.id]);

  if (!isOpen || !lead) return null;

  const selectedRoom = availableRooms.find((r) => r.roomNumber === selectedRoomNumber);

  // Calculate nights
  const checkInTime = new Date(checkInDate).getTime();
  const checkOutTime = new Date(checkOutDate).getTime();
  const nights = Math.max(1, Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60 * 24)));

  const roomRate = selectedRoom?.ratePerNight || 8500;
  const subTotal = roomRate * nights;
  // Indian Hotel GST: 12% if room rate < 7500, 18% if >= 7500
  const gstRate = roomRate >= 7500 ? 0.18 : 0.12;
  const gstAmount = Math.round(subTotal * gstRate);
  const totalAmount = subTotal + gstAmount;

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomNumber) {
      setErrorMsg('Please select an available room/villa.');
      return;
    }
    if (checkOutDate <= checkInDate) {
      setErrorMsg('Check-out date must be after check-in date.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const result = convertLeadToBooking(
      lead.id,
      {
        roomNumber: selectedRoomNumber,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalAmount,
        gstAmount,
      },
      currentResort.id,
      user
    );

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to convert lead to booking.');
      return;
    }

    toast.success(
      'Lead Converted to Booking!',
      `Booking #${result.booking?.bookingCode} confirmed for ${lead.name} in Room ${selectedRoomNumber}.`
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl lg:max-w-3xl p-6 sm:p-7 shadow-2xl border border-[#E2E8F0] my-auto text-left text-xs text-[#0F172A] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Convert Lead to Booking</h2>
              <p className="text-xs text-[#64748B]">
                Reserve room and create guest file for <strong>{lead.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleConvert} className="space-y-4">
          {/* Guest Summary Card */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A]">{lead.name}</span>
              <span className="text-xs text-[#0F5132] font-semibold">{lead.lead_code}</span>
            </div>
            <p className="text-xs text-[#64748B]">
              {lead.phone} • {lead.email} • {lead.city}
            </p>
            <p className="text-xs text-[#475569]">
              Inquiry: <strong className="text-[#0F172A]">{lead.interested_in}</strong> ({lead.guests_adults} Adults
              {lead.guests_children > 0 ? `, ${lead.guests_children} Children` : ''})
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Room Selection */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1E293B] mb-1">
                Select Available Villa / Room *
              </label>
              {availableRooms.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                  No rooms currently available in {currentResort.name}. Please check room inventory.
                </div>
              ) : (
                <select
                  value={selectedRoomNumber}
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 font-medium"
                >
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.roomNumber}>
                      Room {r.roomNumber} - {r.category} ({formatINR(r.ratePerNight)}/night)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Dates Selection */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Check-In Date *</label>
              <input
                type="date"
                required
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Check-Out Date *</label>
              <input
                type="date"
                required
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
          </div>

          {/* Price & Billing Calculation */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#64748B]">
              <div className="flex justify-between sm:pr-4 sm:border-r sm:border-[#E2E8F0]">
                <span>Room Tariff ({nights} {nights === 1 ? 'night' : 'nights'} @ {formatINR(roomRate)}):</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(subTotal)}</span>
              </div>
              <div className="flex justify-between sm:pl-2">
                <span>Estimated GST ({(gstRate * 100).toFixed(0)}%):</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(gstAmount)}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-bold text-sm sm:text-base text-[#0F5132]">
              <span>Total Booking Amount:</span>
              <span>{formatINR(totalAmount)}</span>
            </div>
            <p className="text-[10px] text-[#94A3B8] pt-0.5">
              * Note: Tax invoice will be generated at front desk advance deposit or check-out.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableRooms.length === 0}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Reserve Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
