import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  Key,
  Compass,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  CalendarDays,
  PhoneCall,
  Bell,
  Wifi,
  Sun,
  Moon,
  Wind,
  ShieldCheck,
  ChevronRight,
  Car,
  Coffee,
} from 'lucide-react';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

export const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [dndActive, setDndActive] = useState(false);

  const handleUnlockDoor = () => {
    setIsUnlocked(true);
    toast.success('Villa #101 Unlocked', 'Electronic RFID deadbolt released. Welcome!');
    setTimeout(() => setIsUnlocked(false), 4000);
  };

  const handleToggleDnd = () => {
    const next = !dndActive;
    setDndActive(next);
    if (next) {
      toast.info('Do Not Disturb Enabled', 'Housekeeping notified to pause service.');
    } else {
      toast.success('Do Not Disturb Disabled', 'Standard room service resumed.');
    }
  };

  return (
    <div className="space-y-4 text-[#111827] w-full pb-8">
      {/* 1. Panoramic Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[190px] sm:min-h-[220px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 sm:via-white/60 to-white/30 sm:to-transparent" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse" />
                  VIP Guest Sanctuary
                </span>
                <span className="text-xs font-medium text-[#64748B]">Joy Resorts Sanctuary</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                Welcome, Indrajeet
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-2xl">
                Your luxury nature stay at Villa #101 • Presidential Waterfront Suite
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Stay: 08 Oct - 12 Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={handleUnlockDoor}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0 active:scale-[0.98]"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Unlock Villa #101</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Guest Highlight KPI Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* KPI 1: RFID Key */}
            <div
              onClick={handleUnlockDoor}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-[#0F5132]/50 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0F5132] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Key className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  {isUnlocked ? 'Unlocked' : 'NFC Active'}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Digital RFID Key
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  Villa #101
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    Tap to unlock door
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 2: Dining Credit */}
            <div
              onClick={() => navigate('/services')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  Resort Credit
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Dining Credit
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  ₹5,000
                  <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">
                    Lakefront Restaurant
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 3: Activities Booked */}
            <div
              onClick={() => navigate('/services')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  Today 04:00 PM
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Curated Activities
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  Kayak & Spa
                  <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">
                    Private sunset slot
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 4: Check-Out */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  11:00 AM
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Express Check-Out
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  12 Oct 2026
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    Folio auto-settle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Digital Room Key & Villa Controls Strip (Stayora Pure Luxury) */}
      <div className="bg-gradient-to-tr from-[#0F5132] to-[#15803D] rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Encrypted Smart Lock
              </span>
              <span className="text-xs text-white/80">Battery: 98% • Lock #L-101</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mt-1">Presidential Waterfront Villa #101</h3>
            <p className="text-xs text-white/80 mt-0.5">
              Hold phone close to door handle or tap below to unlock electronic deadbolt
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleUnlockDoor}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-[#0F5132] hover:bg-slate-100 rounded-xl text-xs font-extrabold shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>{isUnlocked ? 'Door Unlocked!' : 'Tap to Unlock'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleDnd}
              className={cn(
                'flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-[0.98] flex items-center justify-center gap-2',
                dndActive
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              )}
            >
              <Moon className="w-4 h-4" />
              <span>{dndActive ? 'DND Active' : 'Do Not Disturb'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Today's Curated Resort Itinerary */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
              Today's Curated Sanctuary Schedule
            </h3>
            <p className="text-xs text-[#64748B]">Personalized itinerary for Indrajeet</p>
          </div>
          <span className="text-[11px] font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Day 1 of 4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F5132]">01:30 PM</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Confirmed
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#0F172A]">Waterside Gourmet Lunch</h4>
            <p className="text-[11px] text-[#64748B]">Lake Deck Table #4 • Fresh Lake Trout & Salads</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F5132]">04:00 PM</span>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Activity
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#0F172A]">Sunset Kayak & Nature Trail</h4>
            <p className="text-[11px] text-[#64748B]">Private guide Vikram • Life jackets provided</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F5132]">06:30 PM</span>
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                Wellness
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#0F172A]">Ayurvedic Herbal Spa</h4>
            <p className="text-[11px] text-[#64748B]">Lotus Pavilion • 60-min Deep Relaxation</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F5132]">08:30 PM</span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Dining
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#0F172A]">Candlelit Gazebo Dinner</h4>
            <p className="text-[11px] text-[#64748B]">Beachfront Table • Acoustic Guitarist live</p>
          </div>
        </div>
      </div>

      {/* 4. Luxury Guest Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Service 1 */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs flex flex-col justify-between hover:border-[#0F5132]/30 transition-all space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] text-white flex items-center justify-center mb-3 shadow-2xs">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">In-Villa Dining & Bar</h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Order artisanal wood-fired pizzas, gourmet platters, fresh juices, and fine wines direct to Villa #101.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="w-full py-2.5 bg-[#0F5132] text-white hover:bg-[#0B3D25] rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98]"
          >
            Browse Room Menu →
          </button>
        </div>

        {/* Service 2 */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition-all space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Spa & Adventures</h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Sunset boat cruises, herbal garden walks, lakeside campfire acoustic sessions, and birdwatching tours.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/activities')}
            className="w-full py-2.5 bg-[#0F5132] text-white hover:bg-[#0B3D25] rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98]"
          >
            Explore Activities →
          </button>
        </div>

        {/* Service 3 */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs flex flex-col justify-between hover:border-sky-300 transition-all space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Butler & Valet Desk</h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Fresh towels, extra pillows, luggage pickup, electric buggy cart transfer, or airport luxury taxi.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => toast.success('Buggy cart dispatched to Villa #101!')}
              className="py-2.5 bg-white hover:bg-slate-50 text-[#0F5132] border border-[#CBD5E1] rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98] flex items-center justify-center gap-1.5 min-w-0"
            >
              <Car className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Call Buggy</span>
            </button>
            <button
              type="button"
              onClick={() => toast.success('Front desk concierge notified!')}
              className="py-2.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98] flex items-center justify-center gap-1.5 min-w-0"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Butler Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
