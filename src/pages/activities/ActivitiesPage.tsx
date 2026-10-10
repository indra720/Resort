import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import { formatINR } from '@/lib/formatINR';
import {
  Compass,
  PlusCircle,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  MapPin,
  Waves,
} from 'lucide-react';

export interface Activity {
  id: string;
  title: string;
  category: 'Wellness & Spa' | 'Water Sports' | 'Culinary' | 'Adventure';
  price: number;
  duration: string;
  timing: string;
  instructor: string;
  capacity: number;
  bookedCount: number;
  imageUrl: string;
  description: string;
}

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'ACT-1',
    title: 'Sunrise Beach Yoga & Tibetan Sound Healing',
    category: 'Wellness & Spa',
    price: 850,
    duration: '75 mins',
    timing: '06:30 AM - 07:45 AM',
    instructor: 'Acharya Devansh',
    capacity: 15,
    bookedCount: 11,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    description: 'Awaken your soul with restorative Hatha yoga on Candolim beach followed by singing bowl meditation.',
  },
  {
    id: 'ACT-2',
    title: 'Deep Sea Scuba Diving & Coral Expedition',
    category: 'Water Sports',
    price: 3600,
    duration: '3 hours',
    timing: '09:30 AM - 12:30 PM',
    instructor: 'PADI Master Neil Fernandez',
    capacity: 8,
    bookedCount: 6,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Explore vibrant Arabian sea reefs with certified PADI dive instructors. Includes full underwater video & gear.',
  },
  {
    id: 'ACT-3',
    title: 'Abhyanga Herbal Ayurvedic Rejuvenation Spa',
    category: 'Wellness & Spa',
    price: 2900,
    duration: '90 mins',
    timing: '02:00 PM - 03:30 PM',
    instructor: 'Dr. Lekshmi Nair (Ayurvedic Physician)',
    capacity: 6,
    bookedCount: 5,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Full-body synchronized warm medicated herbal oil therapy promoting deep cellular detoxification.',
  },
  {
    id: 'ACT-4',
    title: 'Sunset Catamaran Luxury Yacht Cruise',
    category: 'Adventure',
    price: 2400,
    duration: '2 hours',
    timing: '05:00 PM - 07:00 PM',
    instructor: 'Captain Ronald D’Souza',
    capacity: 20,
    bookedCount: 17,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Sail into the Arabian sunset with chilled champagne, Goan tapas, and dolphin spotting along the coast.',
  },
];

export const ActivitiesPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Booking Form State
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('102');
  const [guestCount, setGuestCount] = useState(2);
  const [date, setDate] = useState('2026-10-12');

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !guestName) return;

    if (selectedActivity.bookedCount + guestCount > selectedActivity.capacity) {
      toast.error('Capacity Exceeded', `Only ${selectedActivity.capacity - selectedActivity.bookedCount} slots remaining.`);
      return;
    }

    setActivities((prev) =>
      prev.map((a) =>
        a.id === selectedActivity.id
          ? { ...a, bookedCount: a.bookedCount + guestCount }
          : a
      )
    );

    setIsBookModalOpen(false);
    toast.success(
      'Activity Booked Successfully',
      `${guestCount} slots reserved for Room #${roomNumber} (${guestName}) for ${selectedActivity.title}.`
    );
    setGuestName('');
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#0F5132]" />
              <span>Resort Activities & Wellness Experiences</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Holistic guest experiences, dive adventures, Ayurvedic spa treatments, and yacht cruises.
          </p>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((act) => {
          const slotsLeft = act.capacity - act.bookedCount;
          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={act.imageUrl}
                  alt={act.title}
                  className="w-full h-full object-cover filter brightness-[0.95]"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                  {act.category}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#0F5132] text-white text-xs font-extrabold shadow-sm">
                  {formatINR(act.price)} / guest
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">{act.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{act.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] text-xs text-[#334155]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#64748B]">
                      <Clock className="w-3.5 h-3.5 text-[#0F5132]" />
                      <span>{act.timing} ({act.duration})</span>
                    </span>
                    <span className="font-semibold text-slate-700">{act.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#64748B]" />
                      <span className="text-[11px] text-[#64748B]">
                        Capacity: {act.bookedCount}/{act.capacity} booked
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        slotsLeft <= 2
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {slotsLeft > 0 ? `${slotsLeft} slots remaining` : 'Fully Booked'}
                    </span>
                  </div>
                </div>

                <Button
                  variant={slotsLeft > 0 ? 'primary' : 'outline'}
                  disabled={slotsLeft <= 0}
                  fullWidth
                  onClick={() => {
                    setSelectedActivity(act);
                    setIsBookModalOpen(true);
                  }}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {slotsLeft > 0 ? 'Book Activity Slot' : 'Sold Out'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Activity Modal */}
      {selectedActivity && (
        <Modal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          title={`Reserve: ${selectedActivity.title}`}
          description={`${selectedActivity.timing} • ${formatINR(selectedActivity.price)} per guest`}
          maxWidth="md"
        >
          <form onSubmit={handleBookSlot} className="space-y-4 text-left">
            <Input
              label="Guest Full Name"
              placeholder="e.g. Vikramaditya Singhania"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Room / Villa Number"
                placeholder="e.g. 102"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
              />
              <Input
                label="Number of Guests"
                type="number"
                value={String(guestCount)}
                onChange={(e) => setGuestCount(Number(e.target.value) || 1)}
                required
              />
            </div>

            <Input
              label="Activity Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Total Billable Tariff:</span>
              <span className="font-extrabold text-sm text-[#0F5132]">
                {formatINR(selectedActivity.price * guestCount)}
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => setIsBookModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" rightIcon={<CheckCircle2 className="w-4 h-4" />}>
                Confirm Reservation & Bill to Room
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
