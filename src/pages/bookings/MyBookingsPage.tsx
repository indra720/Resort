import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import { BedDouble, Calendar, Download, Sparkles, PlusCircle } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#B84C00]">
            My Resort Reservations
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            View your active cottage vouchers, confirmed booking dates, and GST receipts.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/rooms')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Book a Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_BOOKINGS.map((booking) => (
          <Card key={booking.id} hoverEffect>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base text-[#B84C00]">
                  {booking.bookingCode}
                </CardTitle>
                <p className="text-xs text-[#64748B]">Room #{booking.roomNumber}</p>
              </div>
              <StatusBadge status={booking.paymentStatus} size="sm" />
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <Calendar className="w-4 h-4 text-[#3B82F6]" />
                <span>
                  Stay: {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#64748B]">
                <BedDouble className="w-4 h-4 text-[#B84C00]" />
                <span>Occupying: Room #{booking.roomNumber}</span>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[#64748B]">Total Tariff (incl. GST):</span>
                <span className="font-bold text-sm text-[#B84C00]">
                  {formatINR(booking.totalAmount)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-[#E2E8F0] flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast.success(
                    'Invoice Downloaded',
                    `Tax invoice for ${booking.bookingCode} saved as PDF`
                  )
                }
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Tax Invoice
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/services')}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Add Spa & Dining
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
