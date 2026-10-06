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
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#14141A] via-[#1C1C24] to-[#14141A] border border-[#2A2A35] relative overflow-hidden text-left shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FF6B00]/10 to-transparent pointer-events-none" />

        <div className="max-w-xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Goa, Pooja Hegde
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7] tracking-tight">
            Your Coastal Sanctuary at Aura Palms
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            Enjoy luxury cottages, private plunge pools, Ayurvedic spa therapies, and authentic Goan seafood dining.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="text-left">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#FF6B00]" />
                  <span>Current Stay Details</span>
                </CardTitle>
                <p className="text-xs text-[#A1A1AA]">Reservation Code: RES-8821</p>
              </div>
              <StatusBadge status="Occupied" size="sm" />
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#1C1C24] border border-[#2A2A35]">
                <div>
                  <span className="text-[11px] text-[#A1A1AA] block">Accommodation</span>
                  <span className="text-sm font-bold text-[#F5F5F7]">Pool Villa V-01</span>
                  <span className="text-xs text-[#FF6B00] block mt-0.5">Private Plunge Pool</span>
                </div>

                <div>
                  <span className="text-[11px] text-[#A1A1AA] block">Stay Period</span>
                  <span className="text-sm font-semibold text-[#F5F5F7]">05 Oct → 08 Oct 2026</span>
                  <span className="text-xs text-[#22C55E] block mt-0.5">3 Nights Reserved</span>
                </div>

                <div>
                  <span className="text-[11px] text-[#A1A1AA] block">Folio Balance</span>
                  <span className="text-sm font-bold text-[#F5F5F7]">{formatINR(0)}</span>
                  <span className="text-xs text-[#22C55E] block mt-0.5">Fully Paid (incl. 18% GST)</span>
                </div>
              </div>

              {/* Wi-Fi & Key Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#14141A] border border-[#2A2A35] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wifi className="w-4 h-4 text-[#FF6B00]" />
                    <div>
                      <span className="font-semibold text-[#F5F5F7] block">Complimentary Wi-Fi</span>
                      <span className="text-[#A1A1AA]">Passcode: luxury@stay26</span>
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

                <div className="p-3 rounded-lg bg-[#14141A] border border-[#2A2A35] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                    <div>
                      <span className="font-semibold text-[#F5F5F7] block">Digital Key Card</span>
                      <span className="text-[#A1A1AA]">Active on Phone NFC</span>
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

            <CardFooter className="pt-3 border-t border-[#2A2A35] flex justify-between">
              <span className="text-xs text-[#A1A1AA]">Checkout Time: 11:00 AM on 08 Oct</span>
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
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span>Featured Experiences</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded-xl bg-[#1C1C24] border border-[#2A2A35] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5F5F7]">Ayurvedic Abhyanga Spa</span>
                  <span className="text-xs font-semibold text-[#FF6B00]">{formatINR(3800)}</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA]">60 mins herbal oil massage with steam bath</p>
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

              <div className="p-3 rounded-xl bg-[#1C1C24] border border-[#2A2A35] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5F5F7]">Candlelight Poolside Dinner</span>
                  <span className="text-xs font-semibold text-[#FF6B00]">{formatINR(4500)}</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA]">4-course chef tasting menu with live acoustic guitar</p>
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
