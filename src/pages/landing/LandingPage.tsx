import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '@/lib/formatINR';
import {
  Sparkles,
  Search,
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Play,
  Phone,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  Send,
  BedDouble,
  Compass,
  Tag,
  Building,
  Menu,
  X,
  CreditCard,
  Percent,
  Waves,
  Coffee,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search Bar State
  const [activeTab, setActiveTab] = useState<'villas' | 'activities' | 'packages' | 'deals'>('villas');
  const [destination, setDestination] = useState('Candolim Beachfront, North Goa');
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-18');
  const [travelers, setTravelers] = useState('2 Adults, 1 Child');

  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Testimonial slider state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Popular Villa Accommodations
  const popularAccommodations = [
    {
      id: 1,
      name: 'Private Plunge Pool Villa',
      location: 'Candolim Shoreline',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      tag: 'Most Booked',
    },
    {
      id: 2,
      name: 'Oceanfront Presidential Villa',
      location: 'Arabian Sea Front',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      tag: 'Ultra Luxury',
    },
    {
      id: 3,
      name: 'Royal Heritage Rajput Suite',
      location: 'Private Courtyard',
      price: 24000,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      tag: 'Heritage Design',
    },
    {
      id: 4,
      name: 'Lagoon Water Villa & Jacuzzi',
      location: 'Infinity Lake Edge',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      tag: 'Panoramic View',
    },
    {
      id: 5,
      name: 'Tropical Palm Garden Cottage',
      location: 'Spice Plantation Grove',
      price: 16000,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      tag: 'Eco Serenity',
    },
  ];

  // Tour Packages Data
  const tourPackages = [
    {
      id: 1,
      title: 'Candolim Sunset & Plunge Pool Escape',
      duration: '4 Days / 3 Nights',
      originalPrice: 32000,
      discountPrice: 24999,
      discount: '22% OFF',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 2,
      title: 'Goa Coastal Romance Honeymoon Package',
      duration: '5 Days / 4 Nights',
      originalPrice: 42000,
      discountPrice: 34999,
      discount: '18% OFF',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
    },
    {
      id: 3,
      title: 'Ayurvedic Spa & Wellness Retreat',
      duration: '4 Days / 3 Nights',
      originalPrice: 26000,
      discountPrice: 19999,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 4,
      title: 'Royal Heritage Family Suite Experience',
      duration: '3 Days / 2 Nights',
      originalPrice: 24000,
      discountPrice: 18999,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      id: 5,
      title: 'Private Yacht Cruise & Beachfront Dining',
      duration: '4 Days / 3 Nights',
      originalPrice: 50000,
      discountPrice: 38999,
      discount: '22% OFF',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      rating: 4.95,
    },
    {
      id: 6,
      title: 'Monsoon Nature & Infinity Pool Getaway',
      duration: '3 Days / 2 Nights',
      originalPrice: 19000,
      discountPrice: 14999,
      discount: '21% OFF',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      comment:
        'The plunge pool villa was exceptional! Chef Sanjeev prepared customized Goan seafood every evening, and the beach sunset was breathtaking.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Rohit & Sneha Verma',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      comment:
        'Best anniversary vacation we have ever had. The private butler service and candlelit dinner on the beach were arranged to absolute perfection.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Anjali Mehta',
      location: 'New Delhi',
      rating: 5,
      comment:
        'Highly recommended! Check-in took barely 2 minutes, and the Ayurvedic wellness spa relieved all our city fatigue. Will definitely return.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Karanvir Singh',
      location: 'Chandigarh',
      rating: 5,
      comment:
        'Outstanding hospitality! Cleanliness is 10/10 and the high-speed connectivity made my remote work retreat completely stress-free.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/rooms');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0B0F] text-[#F5F5F7] font-sans selection:bg-[#CC5500] selection:text-white overflow-x-hidden">
      {/* =========================================================================
          1. TOP NAVIGATION BAR (Full Width, No Content Shrink or Text Wrapping)
          ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0F]/90 backdrop-blur-xl border-b border-[#2A2A35]/80 transition-all">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between gap-4">
          {/* Logo on Left - No shrink */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#CC5500] to-[#E06A10] flex items-center justify-center text-white shadow-[0_0_20px_rgba(204,85,0,0.45)] group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#F5F5F7] whitespace-nowrap">
                Aura Palms <span className="text-[#FF8A3D]">Resort</span>
              </span>
              <span className="hidden sm:block text-[10px] text-[#A1A1AA] uppercase tracking-widest font-medium whitespace-nowrap">
                Luxury Coastal Sanctuary • Goa
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Center) - Guaranteed No Shrink / No Wrapping */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-[#A1A1AA] shrink-0">
            <a
              href="#home"
              className="text-[#F5F5F7] hover:text-[#FF8A3D] transition-colors whitespace-nowrap py-1"
            >
              Home
            </a>
            <a
              href="#villas"
              className="hover:text-[#FF8A3D] transition-colors whitespace-nowrap py-1"
            >
              Villas & Suites
            </a>
            <a
              href="#packages"
              className="hover:text-[#FF8A3D] transition-colors whitespace-nowrap py-1"
            >
              Stay Packages
            </a>
            <a
              href="#concierge"
              className="hover:text-[#FF8A3D] transition-colors whitespace-nowrap py-1"
            >
              Experiences
            </a>
            <a
              href="#reviews"
              className="hover:text-[#FF8A3D] transition-colors whitespace-nowrap py-1"
            >
              Guest Reviews
            </a>
            <a
              href="#contact"
              className="hover:text-[#FF8A3D] transition-colors whitespace-nowrap py-1"
            >
              Contact
            </a>
          </div>

          {/* Right Header Actions: Phone Badge + Sign In + Management Suite (No Shrink) */}
          <div className="hidden sm:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Direct Phone Concierge - visible on xl */}
            <a
              href="tel:+918322499888"
              className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14141A] border border-[#2A2A35] hover:border-[#CC5500]/40 text-xs font-semibold text-[#F5F5F7] transition-all whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF8A3D] shrink-0" />
              <span>+91 832 249 9888</span>
            </a>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl bg-[#14141A] hover:bg-[#1C1C24] border border-[#2A2A35] hover:border-[#CC5500] text-xs font-semibold text-[#F5F5F7] hover:text-[#FF8A3D] transition-all whitespace-nowrap shrink-0"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl bg-[#B84C00] hover:bg-[#E06A10] text-xs font-bold text-white shadow-lg shadow-[#CC5500]/30 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
            >
              <span>Management Suite</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-xl bg-[#14141A] border border-[#2A2A35] flex items-center justify-center text-[#F5F5F7] shrink-0"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-[#2A2A35] bg-[#14141A] px-5 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="#villas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#1C1C24] text-[#F5F5F7]"
              >
                Villas & Suites
              </a>
              <a
                href="#packages"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#1C1C24] text-[#F5F5F7]"
              >
                Tour Packages
              </a>
              <a
                href="#concierge"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#1C1C24] text-[#F5F5F7]"
              >
                Experiences
              </a>
              <a
                href="#reviews"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#1C1C24] text-[#F5F5F7]"
              >
                Guest Reviews
              </a>
            </div>
            <div className="pt-2 border-t border-[#2A2A35] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 rounded-xl bg-[#1C1C24] text-xs font-semibold text-[#F5F5F7]"
              >
                Sign In / Register
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-[#B84C00] text-xs font-semibold text-white shadow-md shadow-[#CC5500]/25"
              >
                Staff / Admin Portal
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================================
          2. UPGRADED BREATHTAKING HERO SECTION (Split Showcase + Tropical Sunset)
          ========================================================================= */}
      <section
        id="home"
        className="relative min-h-[720px] lg:min-h-[780px] pt-28 sm:pt-36 pb-28 lg:pb-36 flex items-center overflow-hidden w-full"
      >
        {/* Full-width High-Definition Tropical Ocean Resort Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=90"
            alt="Aura Palms Luxury Resort Pool and Beachfront"
            className="w-full h-full object-cover object-center scale-105 brightness-[0.70] contrast-[1.05]"
          />
          {/* Gradient overlays to blend into theme seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-[#0B0B0F]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F] via-[#0B0B0F]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0B0F]/30 to-[#0B0B0F]/80 pointer-events-none" />
        </div>

        {/* Ambient Orange Glow Orb behind Headline */}
        <div className="absolute left-10 top-1/3 w-96 h-96 rounded-full bg-[#CC5500]/18 blur-[130px] pointer-events-none" />

        {/* Hero Content - Fluid Full-Width Container (No large empty side margins) */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Bold Luxury Typography & CTAs (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Pill Badge with Pulsing Glow */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14141A]/90 border border-[#CC5500]/40 backdrop-blur-md shadow-xl shadow-[#CC5500]/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B84C00] animate-ping" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#F5F5F7]">
                  ✨ LUXURY BEACHFRONT SANCTUARY • CANDOLIM, GOA
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#F5F5F7] leading-[1.12]">
                Find your dream <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CC5500] via-[#FF8A3D] to-[#FFB878] drop-shadow-[0_0_40px_rgba(204,85,0,0.45)]">
                  Stay & Villa
                </span>{' '}
                <br />
                at Aura Palms Resort
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base xl:text-lg text-[#D4D4D8] max-w-xl leading-relaxed">
                Experience private plunge pool villas, sun-drenched Arabian Sea sands,
                and personalized 24/7 butler hospitality in Goa’s most prestigious coastal retreat.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/rooms')}
                  className="px-7 py-4 rounded-xl bg-[#B84C00] hover:bg-[#E06A10] text-sm font-bold text-white shadow-[0_0_30px_rgba(204,85,0,0.4)] transition-all flex items-center gap-2.5 group active:scale-95"
                >
                  <span>Explore Villas Now</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-6 py-4 rounded-xl bg-[#14141A]/90 hover:bg-[#1C1C24] border border-[#2A2A35] hover:border-[#CC5500]/60 text-sm font-semibold text-[#F5F5F7] backdrop-blur-md transition-all flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-[#CC5500]/18 flex items-center justify-center text-[#FF8A3D] shadow-md shadow-[#CC5500]/20">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span>Watch Resort Tour</span>
                </button>
              </div>

              {/* Quick Perks Strip under buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#A1A1AA] border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#FF8A3D] text-[#FF8A3D]" />
                  <span className="font-semibold text-[#F5F5F7]">4.92 / 5.0</span>
                  <span>(340+ Verified Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-[#FF8A3D]" />
                  <span className="text-[#F5F5F7]">Direct Beachfront Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#FF8A3D]" />
                  <span className="text-[#F5F5F7]">Complimentary In-Villa Breakfast</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating 3D Villa Showcase Card (5 cols on lg) */}
            <div className="lg:col-span-5 hidden lg:block relative">
              {/* Outer Glow behind the card */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#CC5500]/40 to-[#E06A10]/20 blur-xl opacity-70 pointer-events-none" />

              {/* Main Floating Villa Card */}
              <div className="relative rounded-3xl overflow-hidden bg-[#14141A]/95 border border-[#2A2A35] shadow-2xl p-4 space-y-4 backdrop-blur-xl">
                {/* Villa Image */}
                <div className="relative h-64 xl:h-72 w-full rounded-2xl overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=85"
                    alt="Presidential Plunge Pool Villa"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0B0B0F]/85 backdrop-blur-md text-[11px] font-bold text-[#FF8A3D] border border-[#CC5500]/40">
                      ⭐ Featured Masterpiece
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/90 text-white text-[10px] font-bold shadow-md">
                      Instant Confirmation
                    </span>
                  </div>

                  {/* Price overlay at bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">
                        Direct Rate
                      </span>
                      <span className="text-xl font-extrabold text-[#F5F5F7]">
                        ₹35,000 <span className="text-xs font-normal text-[#A1A1AA]">/ night</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/rooms')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#B84C00] hover:bg-[#E06A10] text-xs font-bold text-white shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="text-left space-y-2 px-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#F5F5F7]">
                      Presidential Plunge Pool Villa
                    </h3>
                    <div className="flex items-center gap-1 text-[#FF8A3D] text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>5.0 (52 stays)</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A1A1AA] line-clamp-2">
                    Private infinity plunge pool, open-air sun pavilion, marble bathroom with rain shower, and dedicated round-the-clock butler.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#0B0B0F] border border-[#2A2A35] text-[10px] text-[#A1A1AA]">
                      🏊 Private Pool
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#0B0B0F] border border-[#2A2A35] text-[10px] text-[#A1A1AA]">
                      🌊 Oceanfront
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#0B0B0F] border border-[#2A2A35] text-[10px] text-[#A1A1AA]">
                      🤵 Butler Service
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#0B0B0F] border border-[#2A2A35] text-[10px] text-[#A1A1AA]">
                      📶 Wi-Fi 6
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Live Occupancy Badge */}
              <div className="absolute -bottom-5 -left-5 p-3 rounded-2xl bg-[#0B0B0F]/95 border border-[#2A2A35] shadow-2xl flex items-center gap-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#F5F5F7]">98% Occupancy</div>
                  <div className="text-[10px] text-[#A1A1AA]">High demand this weekend</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel indicator dots on the right */}
        <div className="hidden lg:flex flex-col gap-2.5 absolute right-6 top-1/2 -translate-y-1/2 z-20">
          <div className="w-2.5 h-7 rounded-full bg-[#B84C00] shadow-[0_0_12px_#CC5500]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A35] hover:bg-[#A1A1AA] transition-colors cursor-pointer" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A35] hover:bg-[#A1A1AA] transition-colors cursor-pointer" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A35] hover:bg-[#A1A1AA] transition-colors cursor-pointer" />
        </div>
      </section>

      {/* =========================================================================
          3. FLOATING INTERACTIVE SEARCH BAR (Full Width Container, No Shrink)
          ========================================================================= */}
      <section className="relative z-30 -mt-12 sm:-mt-16 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full rounded-2xl bg-[#14141A]/95 border border-[#2A2A35] shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 sm:p-6 backdrop-blur-xl">
          {/* Top Tabs */}
          <div className="flex items-center gap-2 pb-3.5 border-b border-[#2A2A35] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('villas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'villas'
                  ? 'bg-[#B84C00] text-white shadow-md shadow-[#CC5500]/25'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24]'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Villas & Rooms</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'activities'
                  ? 'bg-[#B84C00] text-white shadow-md shadow-[#CC5500]/25'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Activities & Spa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'packages'
                  ? 'bg-[#B84C00] text-white shadow-md shadow-[#CC5500]/25'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Stay Packages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('deals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'deals'
                  ? 'bg-[#B84C00] text-white shadow-md shadow-[#CC5500]/25'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24]'
              }`}
            >
              <Tag className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[#22C55E]">Exclusive Deals</span>
            </button>
          </div>

          {/* Form Filter Row (4 Fields + Search Button) */}
          <form
            onSubmit={handleSearchSubmit}
            className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center"
          >
            {/* Field 1: Destination / Room Type */}
            <div className="lg:col-span-3 p-3 rounded-xl bg-[#0B0B0F] border border-[#2A2A35] flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#FF8A3D] shrink-0" />
              <div className="flex-1 text-left">
                <span className="block text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">
                  Location / Villa Type
                </span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#F5F5F7] focus:outline-none truncate"
                  placeholder="Where are you going?"
                />
              </div>
            </div>

            {/* Field 2: Check-in Date */}
            <div className="lg:col-span-2 p-3 rounded-xl bg-[#0B0B0F] border border-[#2A2A35] flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#FF8A3D] shrink-0" />
              <div className="flex-1 text-left">
                <span className="block text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">
                  Check In
                </span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#F5F5F7] focus:outline-none"
                />
              </div>
            </div>

            {/* Field 3: Check-out Date */}
            <div className="lg:col-span-2 p-3 rounded-xl bg-[#0B0B0F] border border-[#2A2A35] flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#FF8A3D] shrink-0" />
              <div className="flex-1 text-left">
                <span className="block text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">
                  Check Out
                </span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#F5F5F7] focus:outline-none"
                />
              </div>
            </div>

            {/* Field 4: Guests / Travelers */}
            <div className="lg:col-span-3 p-3 rounded-xl bg-[#0B0B0F] border border-[#2A2A35] flex items-center gap-3">
              <Users className="w-5 h-5 text-[#FF8A3D] shrink-0" />
              <div className="flex-1 text-left">
                <span className="block text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">
                  Travelers
                </span>
                <input
                  type="text"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#F5F5F7] focus:outline-none truncate"
                  placeholder="2 Adults, 1 Child"
                />
              </div>
            </div>

            {/* CTA Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-[#B84C00] hover:bg-[#E06A10] text-xs font-bold text-white shadow-xl shadow-[#CC5500]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Check Availability</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =========================================================================
          4. POPULAR DESTINATIONS / LUXURY VILLAS SECTION (Fluid Full Width)
          ========================================================================= */}
      <section id="villas" className="py-20 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F7]">
                Popular Accommodations
              </h2>
              <span className="text-[#FF8A3D] font-bold text-xl select-none">〰〰</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Curated private pool villas, beachside cottages, and royal heritage suites.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="text-xs font-semibold text-[#FF8A3D] hover:text-[#E06A10] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View all accommodations</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5-Column Responsive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-5">
          {popularAccommodations.map((acc) => (
            <div
              key={acc.id}
              onClick={() => navigate('/rooms')}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#14141A] border border-[#2A2A35] hover:border-[#CC5500]/60 transition-all shadow-xl hover:-translate-y-1.5"
            >
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src={acc.image}
                  alt={acc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-black/20" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#0B0B0F]/80 backdrop-blur-md text-[10px] font-semibold text-[#FF8A3D] border border-[#2A2A35]">
                  {acc.tag}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="flex items-center gap-1 text-[11px] text-[#A1A1AA] mb-0.5">
                    <MapPin className="w-3 h-3 text-[#FF8A3D]" />
                    <span className="truncate">{acc.location}</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#F5F5F7] line-clamp-1">{acc.name}</h3>
                  <div className="text-xs font-semibold text-[#FF8A3D] mt-1">
                    {formatINR(acc.price)}{' '}
                    <span className="text-[10px] font-normal text-[#A1A1AA]">/ night</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. POPULAR TOUR PACKAGES SECTION (Fluid Full Width)
          ========================================================================= */}
      <section id="packages" className="py-20 bg-[#14141A]/50 border-y border-[#2A2A35]/50 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F7]">
                Popular Tour Packages
              </h2>
              <span className="text-[#FF8A3D] font-bold text-xl select-none">〰〰</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              All-inclusive luxury holidays with gourmet breakfast, airport transfers, and private excursions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="text-xs font-semibold text-[#FF8A3D] hover:text-[#E06A10] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View all packages</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {tourPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-2xl overflow-hidden bg-[#14141A] border border-[#2A2A35] hover:border-[#CC5500]/50 transition-all shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14141A] via-transparent to-black/20" />
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold shadow-md">
                    {pkg.discount}
                  </span>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0B0F]/80 backdrop-blur-md text-[11px] text-[#F5F5F7] border border-[#2A2A35]">
                    <Clock className="w-3.5 h-3.5 text-[#FF8A3D]" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <div className="p-5 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#FF8A3D] text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{pkg.rating} (Verified Stay)</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#F5F5F7] group-hover:text-[#FF8A3D] transition-colors line-clamp-1">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              {/* Footer price & book button */}
              <div className="p-5 pt-0 border-t border-[#2A2A35]/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#A1A1AA] line-through block">
                    {formatINR(pkg.originalPrice)}
                  </span>
                  <span className="text-base font-bold text-[#FF8A3D]">
                    {formatINR(pkg.discountPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/bookings')}
                  className="px-4 py-2 rounded-xl bg-[#1C1C24] hover:bg-[#E06A10] hover:text-white border border-[#2A2A35] text-xs font-semibold text-[#F5F5F7] transition-all"
                >
                  Book Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. "NEED ASSISTANCE?" CONCIERGE CALLOUT BANNER (Fluid Full Width)
          ========================================================================= */}
      <section id="concierge" className="py-20 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] border border-[#2A2A35] p-6 sm:p-12 shadow-2xl">
          {/* Background image tint */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
              alt="Concierge Assistance"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF8A3D] bg-[#CC5500]/18 px-3 py-1 rounded-full border border-[#CC5500]/30 inline-block">
                WE'RE HERE TO HELP 24/7
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F7]">
                Need Assistance Planning Your Stay?
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                Our resident concierge and guest managers are ready to curate your bespoke itinerary,
                private airport pick-up, and beachside dining reservations.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="tel:+918322499888"
                  className="px-5 py-3 rounded-xl bg-[#B84C00] hover:bg-[#E06A10] text-xs font-bold text-white shadow-lg transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call +91 832 249 9888</span>
                </a>
                <button
                  type="button"
                  onClick={() => navigate('/feedback')}
                  className="px-5 py-3 rounded-xl bg-[#14141A]/80 hover:bg-[#14141A] border border-[#2A2A35] text-xs font-semibold text-[#F5F5F7] transition-all"
                >
                  Contact Concierge
                </button>
              </div>
            </div>

            {/* 3 Trust Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full lg:w-auto">
              <div className="p-4 rounded-2xl bg-[#0B0B0F]/70 border border-white/10 backdrop-blur-md text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#FF8A3D] mx-auto" />
                <h4 className="text-xs font-bold text-[#F5F5F7]">Best Rate</h4>
                <p className="text-[10px] text-[#A1A1AA]">Direct booking promise</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0B0F]/70 border border-white/10 backdrop-blur-md text-center space-y-1">
                <Headphones className="w-5 h-5 text-[#FF8A3D] mx-auto" />
                <h4 className="text-xs font-bold text-[#F5F5F7]">24/7 Support</h4>
                <p className="text-[10px] text-[#A1A1AA]">Dedicated villa butler</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0B0F]/70 border border-white/10 backdrop-blur-md text-center space-y-1">
                <CreditCard className="w-5 h-5 text-[#FF8A3D] mx-auto" />
                <h4 className="text-xs font-bold text-[#F5F5F7]">Secure Booking</h4>
                <p className="text-[10px] text-[#A1A1AA]">100% encrypted & UPI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. "WHAT OUR TRAVELERS SAY" TESTIMONIALS SECTION (Fluid Full Width)
          ========================================================================= */}
      <section id="reviews" className="py-20 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F7]">
                What Our Guests Say
              </h2>
              <span className="text-[#FF8A3D] font-bold text-xl select-none">〰〰</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Read authentic feedback from couples, families, and business executives who stayed with us.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() =>
                setCurrentTestimonialIndex((prev) =>
                  prev === 0 ? testimonials.length - 1 : prev - 1
                )
              }
              className="w-9 h-9 rounded-full bg-[#14141A] border border-[#2A2A35] hover:border-[#CC5500] flex items-center justify-center text-[#A1A1AA] hover:text-[#FF8A3D] transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentTestimonialIndex((prev) =>
                  (prev + 1) % testimonials.length
                )
              }
              className="w-9 h-9 rounded-full bg-[#14141A] border border-[#2A2A35] hover:border-[#CC5500] flex items-center justify-center text-[#A1A1AA] hover:text-[#FF8A3D] transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Testimonial Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#14141A] border border-[#2A2A35] flex flex-col justify-between text-left space-y-4 hover:border-[#CC5500]/40 transition-colors shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#CC5500]/50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F5F7]">{t.name}</h4>
                    <span className="text-[10px] text-[#A1A1AA]">{t.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-[#FF8A3D]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-[#A1A1AA] leading-relaxed italic line-clamp-4">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-[#2A2A35]/50 flex items-center gap-1.5 text-[10px] text-[#22C55E]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Guest Stay</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. 4 TRUST BADGES STRIP (Fluid Full Width, Spacious on Mobile)
          ========================================================================= */}
      <section className="py-10 bg-[#0B0B0F] border-t border-[#2A2A35] w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#14141A]/50 border border-[#2A2A35]/50 sm:border-0 sm:bg-transparent">
            <Building className="w-6 h-6 text-[#FF8A3D]" />
            <h4 className="text-xs font-bold text-[#F5F5F7]">30+ Private Luxury Villas</h4>
            <p className="text-[10px] text-[#A1A1AA]">Beachfront & plunge pools</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#14141A]/50 border border-[#2A2A35]/50 sm:border-0 sm:bg-transparent">
            <Percent className="w-6 h-6 text-[#FF8A3D]" />
            <h4 className="text-xs font-bold text-[#F5F5F7]">Best Price Guarantee</h4>
            <p className="text-[10px] text-[#A1A1AA]">Get best direct rates in ₹</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#14141A]/50 border border-[#2A2A35]/50 sm:border-0 sm:bg-transparent">
            <Users className="w-6 h-6 text-[#FF8A3D]" />
            <h4 className="text-xs font-bold text-[#F5F5F7]">10K+ Happy Guests</h4>
            <p className="text-[10px] text-[#A1A1AA]">4.9 / 5 rated hospitality</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#14141A]/50 border border-[#2A2A35]/50 sm:border-0 sm:bg-transparent">
            <CreditCard className="w-6 h-6 text-[#FF8A3D]" />
            <h4 className="text-xs font-bold text-[#F5F5F7]">100% Safe Payments</h4>
            <p className="text-[10px] text-[#A1A1AA]">UPI, Cards & Net Banking</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. NEWSLETTER SUBSCRIPTION BANNER (Fluid Full Width, Contained on Mobile)
          ========================================================================= */}
      <section className="py-16 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#14141A] via-[#1C1C24] to-[#14141A] border border-[#2A2A35] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#CC5500]/18 border border-[#CC5500]/40 flex items-center justify-center text-[#FF8A3D] shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F7]">
                Subscribe to Exclusive Offers
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Get private seasonal discount codes and VIP villa invitations directly in your inbox.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-2.5"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-[#0B0B0F] border border-[#2A2A35] text-xs text-[#F5F5F7] placeholder-[#A1A1AA] focus:outline-none focus:border-[#CC5500] min-w-0"
            />
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-[#B84C00] hover:bg-[#E06A10] text-xs font-bold text-white transition-all shadow-md shrink-0 whitespace-nowrap active:scale-95"
            >
              {isSubscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

      {/* =========================================================================
          10. FOOTER (Fluid Full Width)
          ========================================================================= */}
      <footer id="contact" className="border-t border-[#2A2A35] bg-[#07070A] pt-16 pb-8 text-left w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info & Socials */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#CC5500] to-[#E06A10] flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-[#F5F5F7]">
                  Aura Palms <span className="text-[#FF8A3D]">Resort</span>
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] max-w-sm leading-relaxed">
                Aura Palms Resort & Spa is Goa’s premier 5-star beachfront sanctuary, offering private plunge pool villas, authentic coastal cuisine, and personalized concierge experiences.
              </p>
              <div className="text-xs text-[#A1A1AA]">
                Candolim Beach Road, North Goa, 403515, India
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-[#A1A1AA]">
                <li>
                  <a href="#home" className="hover:text-[#FF8A3D] transition-colors">Home</a>
                </li>
                <li>
                  <a href="#villas" className="hover:text-[#FF8A3D] transition-colors">Villas & Suites</a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-[#FF8A3D] transition-colors">Stay Packages</a>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/feedback')} className="hover:text-[#FF8A3D] transition-colors">
                    Guest Feedback
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/login')} className="hover:text-[#FF8A3D] transition-colors">
                    Staff Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Resort Amenities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">
                Resort Services
              </h4>
              <ul className="space-y-2 text-xs text-[#A1A1AA]">
                <li>Private Villa Booking</li>
                <li>Ayurvedic Ocean Spa</li>
                <li>Beachfront Candlelight Dining</li>
                <li>Yacht & Sunset Charters</li>
                <li>Airport Luxury Pickup</li>
              </ul>
            </div>

            {/* Col 4: Contact Concierge */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">
                Direct Contact
              </h4>
              <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>+91 832 249 9888</span>
                </li>
                <li className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>reservations@aurapalms.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>Candolim, North Goa</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-[#2A2A35] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
            <p>© 2026 Aura Palms Resort & Spa. All Rights Reserved. GSTIN: 30AABCA1234F1Z8.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-[#FF8A3D] cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#FF8A3D] cursor-pointer">Terms & Conditions</span>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-[#FF8A3D] hover:underline font-medium"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal Preview */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-[#14141A] border border-[#2A2A35] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F5F5F7]">
                Aura Palms Resort & Spa • Virtual Video Tour
              </h3>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#1C1C24] flex items-center justify-center text-[#A1A1AA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center relative">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85"
                alt="Video Tour Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#B84C00] text-white flex items-center justify-center shadow-2xl animate-pulse">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <span className="text-xs font-semibold text-white">
                  Candolim Shoreline 4K Drone Showcase
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
