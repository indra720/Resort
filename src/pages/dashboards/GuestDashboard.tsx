import React from 'react';
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
} from 'lucide-react';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';

export const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 text-[#111827]">
      {/* 1. Panoramic Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[170px] sm:min-h-[190px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse" />
                  Guest Experience
                </span>
                <span className="text-xs font-medium text-[#64748B]">Joy Resorts Sanctuary</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                Welcome, Indrajeet
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Your luxury nature stay at Villa #101 • Presidential Waterfront Suite
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Stay: 08 Oct - 12 Oct 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Guest Highlight Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0F5132] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Key className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Active
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Digital RFID Key
                </p>
                <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  Villa #101
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    Tap to unlock
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  Credit
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Dining Credit
                </p>
                <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  ₹5,000
                  <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">
                    Lake Restaurant
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  4:00 PM
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Activities
                </p>
                <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  Kayak & Spa
                  <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">
                    Confirmed slot
                  </p>
                </div>
              </div>
            </div>

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
                  Check-Out
                </p>
                <div className="flex justify-between text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  12 Oct
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    Express checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Services Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#0F5132]/10 text-[#0F5132] flex items-center justify-center mb-3">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">In-Villa Dining</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Order fresh lake trout, farm-to-table salads, and artisanal desserts straight to Villa #101.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="mt-4 w-full py-2 bg-[#0F5132] text-white hover:bg-[#0B3D25] rounded-xl text-xs font-semibold transition-colors"
          >
            Browse Menu
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Nature Activities</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Sunset kayak tours, guided herbal garden walks, campfire acoustic nights, and cycling.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="mt-4 w-full py-2 bg-[#0F5132] text-white hover:bg-[#0B3D25] rounded-xl text-xs font-semibold transition-colors"
          >
            Explore Activities
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Concierge Request</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Need fresh towels, extra pillows, luggage pickup, or airport transfer? We are here 24/7.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.success('Front desk concierge notified!')}
            className="mt-4 w-full py-2 bg-[#0F5132] text-white hover:bg-[#0B3D25] rounded-xl text-xs font-semibold transition-colors"
          >
            Call Front Desk
          </button>
        </div>
      </div>
    </div>
  );
};
