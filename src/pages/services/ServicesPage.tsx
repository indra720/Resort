import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  Compass,
  Sparkles,
  Car,
  PartyPopper,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface ResortService {
  id: string;
  name: string;
  category: 'Spa' | 'Activities' | 'Events' | 'Transport';
  price: number;
  duration: string;
  description: string;
  features: string[];
}

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [bookingService, setBookingService] = useState<ResortService | null>(null);

  const [serviceDate, setServiceDate] = useState('2026-10-07');
  const [serviceTime, setServiceTime] = useState('16:00');
  const [guestCount, setGuestCount] = useState(2);

  const services: ResortService[] = [
    {
      id: 'srv-1',
      name: 'Ayurvedic Abhyanga Spa Therapy',
      category: 'Spa',
      price: 3800,
      duration: '75 mins',
      description: 'Traditional Kerala herbal warm oil massage for full body rejuvenation.',
      features: ['Herbal Steam Bath', 'Organic Sesame Oil', 'Complimentary Herbal Tea'],
    },
    {
      id: 'srv-2',
      name: 'Himalayan Salt Scrub & Vichy Shower',
      category: 'Spa',
      price: 4500,
      duration: '90 mins',
      description: 'Deep exfoliation followed by 6-jet therapeutic hydrotherapy rain shower.',
      features: ['Dead Sea Mineral Salts', 'Essential Aromatherapy', 'Skin Hydration'],
    },
    {
      id: 'srv-3',
      name: 'Sunset Catamaran Sailing Cruise',
      category: 'Activities',
      price: 6500,
      duration: '2.5 hrs',
      description: 'Private catamaran sailing through the Arabian Sea with canapés & mocktails.',
      features: ['Complimentary Finger Food', 'Dolphin Watching', 'Life Jackets & Crew'],
    },
    {
      id: 'srv-4',
      name: 'Dudhsagar Waterfall Jeep Expedition',
      category: 'Activities',
      price: 5200,
      duration: '6 hrs',
      description: '4x4 Jungle safari through Bhagwan Mahaveer Sanctuary to the misty falls.',
      features: ['Jungle Entry Pass', 'Forest Guide', 'Packed Gourmet Picnic Basket'],
    },
    {
      id: 'srv-5',
      name: 'Candlelight Beachfront Gazebo Dinner',
      category: 'Events',
      price: 7500,
      duration: '3 hrs',
      description: 'Private decorated beach gazebo with 5-course customized chef menu and violin.',
      features: ['Floral Table Decor', 'Personal Butler', 'Chef Curated 5 Courses'],
    },
    {
      id: 'srv-6',
      name: 'Luxury Airport Transfer (Mercedes E-Class)',
      category: 'Transport',
      price: 3500,
      duration: 'Single Trip',
      description: 'Chauffeured luxury pickup/drop to Goa Dabolim or MOPA Airport.',
      features: ['Chilled Mineral Water', 'High-Speed Wi-Fi', 'Flight Tracking'],
    },
  ];

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category === selectedCategory;
  });

  const handleConfirmService = () => {
    if (!bookingService) return;
    toast.success(
      'Service Reserved',
      `${bookingService.name} booked for ${serviceDate} at ${serviceTime} (${formatINR(
        bookingService.price * (bookingService.category === 'Spa' ? guestCount : 1)
      )})`
    );
    setBookingService(null);
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
          Resort Experiences & Concierge Services
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Spa wellness therapies, coastal adventures, events, and airport transfers.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'Spa', 'Activities', 'Events', 'Transport'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
              selectedCategory === cat
                ? 'bg-[#0F5132] text-white border-[#0F5132] font-semibold'
                : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#1F2937]'
            }`}
          >
            {cat === 'ALL' ? 'All Services' : cat}
          </button>
        ))}
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#0F5132]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB]">
                  {srv.category}
                </span>
                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0F5132]" /> {srv.duration}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937]">{srv.name}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{srv.description}</p>

              <div className="space-y-1 pt-2">
                {srv.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-[#1F2937]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-[#0F5132]">
                  {formatINR(srv.price)}
                </span>
                <span className="text-[10px] text-[#6B7280] block">incl. taxes</span>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setBookingService(srv)}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Book Experience
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Reservation Modal */}
      {bookingService && (
        <Modal
          isOpen={!!bookingService}
          onClose={() => setBookingService(null)}
          title={`Reserve: ${bookingService.name}`}
          description={`Category: ${bookingService.category} • ${formatINR(bookingService.price)}`}
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button variant="ghost" onClick={() => setBookingService(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmService}>
                Confirm Reservation
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Preferred Date"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
              <Input
                label="Time Slot"
                type="time"
                value={serviceTime}
                onChange={(e) => setServiceTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Number of Guests"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              />
              <Select
                label="Charge Billing To"
                options={[
                  { label: 'Room Folio (Pay at Checkout)', value: 'room' },
                  { label: 'Pay Instant via UPI', value: 'upi' },
                ]}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
