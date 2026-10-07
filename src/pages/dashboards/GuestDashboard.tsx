import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  Sparkles,
  BedDouble,
  Wifi,
  Calendar,
  Compass,
  Utensils,
  Key,
  ShieldCheck,
} from 'lucide-react';

export const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Welcome Banner */}
      <div className="p-4 sm:p-5 lg:p-6 rounded-2xl bg-gradient-to-r from-white via-[#FFF7ED]/30 to-white border border-[#E2E8F0] relative overflow-hidden text-left shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 sm:gap-4">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#B84C00]/5 to-transparent pointer-events-none" />

        <div className="max-w-xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#B84C00] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Goa, Pooja Hegde
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#B84C00] tracking-tight">
            Your Coastal Sanctuary at Aura Palms
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Enjoy luxury cottages, private plunge pools, Ayurvedic spa therapies, and authentic Goan seafood dining.
          </p>
        </div>

        {/* Action Buttons - Clean horizontal row, right-aligned on desktop, never flex-col */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 relative z-10 pt-1 lg:pt-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/services')}
            leftIcon={<Compass className="w-4 h-4" />}
          >
            Explore Resort Experiences
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/rooms')}
            leftIcon={<BedDouble className="w-4 h-4" />}
          >
            Book Another Villa
          </Button>
        </div>
      </div>

      {/* Active Stay Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="text-left">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#B84C00]" />
                  <span>Current Stay Details</span>
                </CardTitle>
                <p className="text-xs text-[#64748B]">Reservation Code: RES-8821</p>
              </div>
              <StatusBadge status="Occupied" size="sm" />
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <span className="text-[11px] text-[#64748B] block">Accommodation</span>
                  <span className="text-sm font-bold text-[#0F172A]">Pool Villa V-01</span>
                  <span className="text-xs text-[#B84C00] block mt-0.5">Private Plunge Pool</span>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748B] block">Stay Period</span>
                  <span className="text-sm font-semibold text-[#0F172A]">05 Oct → 08 Oct 2026</span>
                  <span className="text-xs text-[#22C55E] block mt-0.5">3 Nights Reserved</span>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748B] block">Folio Balance</span>
                  <span className="text-sm font-bold text-[#0F172A]">{formatINR(0)}</span>
                  <span className="text-xs text-[#22C55E] block mt-0.5">Fully Paid (incl. 18% GST)</span>
                </div>
              </div>

              {/* Wi-Fi & Key Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wifi className="w-4 h-4 text-[#B84C00]" />
                    <div>
                      <span className="font-semibold text-[#0F172A] block">Complimentary Wi-Fi</span>
                      <span className="text-[#64748B]">Passcode: luxury@stay26</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.success('Wi-Fi Copied', 'Connected to AuraPalms_Guest')}
                  >
                    Connect
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                    <div>
                      <span className="font-semibold text-[#0F172A] block">Digital Key Card</span>
                      <span className="text-[#64748B]">Active on Phone NFC</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.info('Door Key', 'Hold phone near Villa V-01 lock')}
                  >
                    Tap Door
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-[#E2E8F0] flex justify-between">
              <span className="text-xs text-[#64748B]">Checkout Time: 11:00 AM on 08 Oct</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/feedback')}
              >
                Submit Stay Feedback
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Resort Experiences Quick Booking */}
        <div className="space-y-4">
          <Card className="text-left h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B84C00]" />
                <span>Featured Experiences</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">Ayurvedic Abhyanga Spa</span>
                  <span className="text-xs font-semibold text-[#B84C00]">{formatINR(3800)}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">60 mins herbal oil massage with steam bath</p>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  className="mt-2"
                  onClick={() => toast.success('Spa Requested', 'Concierge will confirm slot.')}
                >
                  Book Slot
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">Candlelight Poolside Dinner</span>
                  <span className="text-xs font-semibold text-[#B84C00]">{formatINR(4500)}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">4-course chef tasting menu with live acoustic guitar</p>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  className="mt-2"
                  onClick={() => toast.success('Dinner Requested', 'Table reserved for 8:00 PM!')}
                >
                  Reserve Table
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
