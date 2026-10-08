import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
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
  Menu,
  X,
  CreditCard,
  Percent,
  Waves,
  Coffee,
  Check,
  Heart,
  Award,
  Utensils,
  Palmtree,
  Gem,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search Bar State
  const [destination, setDestination] = useState('Candolim Beachfront, North Goa');
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-18');
  const [travelers, setTravelers] = useState('2 Adults, 1 Villa');

  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Testimonial slider state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Live Countdown Timer for Limited Time Offer (Image 1 reference)
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 36,
    seconds: 27,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Featured Accommodations (Exquisite Rooms & Suites)
  const featuredRooms = [
    {
      id: 1,
      name: 'Deluxe Garden Cottage',
      subtitle: 'Surrounded by tropical spice groves',
      guests: '2 Guests',
      bed: '1 King Bed',
      price: 14500,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      tag: 'Best Value',
    },
    {
      id: 2,
      name: 'Ocean View Suite',
      subtitle: 'Panoramic views of Candolim shoreline',
      guests: '3 Guests',
      bed: '1 King Bed',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      tag: 'Ocean View',
    },
    {
      id: 3,
      name: 'Private Pool Villa',
      subtitle: 'Personal plunge pool & sun terrace',
      guests: '4 Guests',
      bed: '2 King Beds',
      price: 38000,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      tag: 'Bestseller',
    },
    {
      id: 4,
      name: 'Royal Heritage Family Suite',
      subtitle: 'Spacious living salon & butler service',
      guests: '5 Guests',
      bed: '2 King Beds',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      tag: 'Family Suite',
    },
  ];

  // 2. Hotel Experiences (Image 1 Pinterest reference)
  const hotelExperiences = [
    {
      id: 1,
      title: 'Spa & Wellness',
      tagline: 'Relax. Rejuvenate.',
      desc: 'Ayurvedic herbal therapies, sound healing & oceanfront steam.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Culinary Journey',
      tagline: 'Taste the Coast.',
      desc: 'Chef Sanjeev’s authentic Goan seafood tasting & poolside wine bar.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'Adventure Tours',
      tagline: 'Explore More.',
      desc: 'Private sunset catamaran sailing, dolphin watch & coastal fort trails.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: 'Local Culture',
      tagline: 'Feel the Soul.',
      desc: 'Acoustic Goan music nights, pottery workshops & heritage walks.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // 3. Testimonials Data (Image 1 & 2 reference)
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      location: 'London, United Kingdom',
      title: 'An Unforgettable Coastal Sanctuary',
      comment:
        'Aura Palms gave us the most beautiful vacation experience! The staff was amazing, the views of Candolim beach were breathtaking, and the private plunge pool villa was simply perfect in every single detail.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      stayedIn: 'Private Pool Villa V-01',
    },
    {
      name: 'Rohan & Pooja Hegde',
      location: 'Mumbai, Maharashtra',
      title: 'Best Anniversary Celebration Ever',
      comment:
        'From the candlelit dinner by the waves to the rejuvenating Ayurvedic spa, everything was arranged to absolute perfection. The staff remembers every little preference with genuine warmth.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      stayedIn: 'Oceanfront Luxury Suite',
    },
    {
      name: 'Vikram Malhotra',
      location: 'New Delhi',
      title: 'Flawless 5-Star Hospitality in Goa',
      comment:
        'The culinary experience at Spice & Palm is truly world-class. High-speed connectivity, peaceful beach access, and seamless check-in. The best luxury resort experience in North Goa.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      stayedIn: 'Presidential Pool Villa',
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
      toast.success('Subscribed Successfully', 'Exclusive secret tariffs will be sent to your inbox.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#1F2937] font-sans selection:bg-[#C2410C] selection:text-white overflow-x-hidden">
      {/* =========================================================================
          1. TOP NAVIGATION BAR (Transparent / Frosted Glass Floating Navbar)
          ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]/80 transition-all shadow-xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between gap-4">
          {/* Logo on Left */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C2410C] flex items-center justify-center text-white shadow-md shadow-[#C2410C]/25 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="leading-tight text-left">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#1F2937] whitespace-nowrap">
                Aura Palms <span className="text-[#C2410C]">Resort</span>
              </span>
              <span className="hidden sm:block text-[10px] text-[#6B7280] uppercase tracking-widest font-semibold whitespace-nowrap">
                Hotels & Luxury Villas • Goa
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-9 text-xs font-semibold text-[#6B7280] shrink-0">
            <a href="#home" className="text-[#C2410C] hover:text-[#9A3412] transition-colors py-1">
              Home
            </a>
            <a href="#rooms" className="hover:text-[#C2410C] transition-colors py-1">
              Rooms & Villas
            </a>
            <a href="#experiences" className="hover:text-[#C2410C] transition-colors py-1">
              Experiences
            </a>
            <a href="#advantage" className="hover:text-[#C2410C] transition-colors py-1">
              About Us
            </a>
            <a href="#reviews" className="hover:text-[#C2410C] transition-colors py-1">
              Reviews
            </a>
            <a href="#contact" className="hover:text-[#C2410C] transition-colors py-1">
              Contact
            </a>
          </div>

          {/* Right Header Actions: Phone + Sign In + Book Now */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href="tel:+918322499888"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#C2410C] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>+91 832 249 9888</span>
            </a>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF8F3] transition-all whitespace-nowrap"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-bold text-white shadow-md shadow-[#C2410C]/25 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] shrink-0"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-[#E5E7EB] bg-white px-5 py-4 space-y-3 shadow-xl text-left">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="#rooms"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#FFF8F3] text-[#1F2937] border border-[#E5E7EB] font-medium"
              >
                Rooms & Villas
              </a>
              <a
                href="#experiences"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#FFF8F3] text-[#1F2937] border border-[#E5E7EB] font-medium"
              >
                Experiences
              </a>
              <a
                href="#advantage"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#FFF8F3] text-[#1F2937] border border-[#E5E7EB] font-medium"
              >
                About Us
              </a>
              <a
                href="#reviews"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#FFF8F3] text-[#1F2937] border border-[#E5E7EB] font-medium"
              >
                Guest Reviews
              </a>
            </div>
            <div className="pt-2 border-t border-[#E5E7EB] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] text-xs font-semibold text-[#1F2937]"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/rooms')}
                }
                className="w-full py-2.5 rounded-xl bg-[#C2410C] text-xs font-bold text-white shadow-md shadow-[#C2410C]/25"
              >
                Book Your Villa Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================================
          2. HERO SECTION (Grand Panoramic Coastal Resort Photography - Image 1 Reference)
          ========================================================================= */}
      <section
        id="home"
        className="relative min-h-[660px] lg:min-h-[740px] pt-28 sm:pt-32 pb-24 sm:pb-32 flex flex-col justify-center overflow-hidden w-full text-left"
      >
        {/* Full-bleed Luxury Infinity Pool & Ocean Sunset Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=90"
            alt="Aura Palms Luxury Resort Infinity Pool and Coastal Sunset"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Subtle multi-layer gradient for pristine readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-10">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            {/* Kicker */}
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#FED7AA] flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#C2410C]" />
              LUXURY STAYS • UNFORGETTABLE JOURNEYS
            </p>

            {/* Main Headline (Image 1 reference) */}
            <h1 className="text-4xl sm:text-6xl xl:text-[68px] font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-sm font-serif">
              Your Perfect Getaway <br />
              <span className="font-sans italic font-normal text-orange-100">Awaits</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-100 max-w-2xl leading-relaxed drop-shadow-xs">
              Discover world-class comfort, private plunge pools, breathtaking Arabian sea views, and personalized 5-star experiences at Aura Palms Resort & Luxury Villas, Goa.
            </p>
          </div>

          {/* Floating Handwritten Script Overlay (Image 1 Reference) */}
          <div className="hidden lg:flex items-center gap-2 absolute right-16 top-1/2 -translate-y-12 text-white/90 select-none">
            <span className="font-serif italic text-lg xl:text-xl tracking-wide drop-shadow-md">
              More than a stay — it's an experience
            </span>
            <Heart className="w-5 h-5 text-[#FDBA74] fill-orange-300 animate-pulse" />
          </div>
        </div>

        {/* =========================================================================
            3. FLOATING BOOKING SEARCH BAR (Elevated White Glass Card - Image 1 Reference)
            ========================================================================= */}
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-12 xl:px-16 mt-12 sm:mt-16">
          <div className="w-full rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 sm:p-5">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center"
            >
              {/* Field 1: Destination */}
              <div className="lg:col-span-3 p-3 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#C2410C] shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <span className="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                    Destination
                  </span>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#1F2937] focus:outline-none truncate"
                    placeholder="Where are you going?"
                  />
                </div>
              </div>

              {/* Field 2: Check-In */}
              <div className="lg:col-span-2 p-3 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#C2410C] shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <span className="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                    Check In
                  </span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#1F2937] focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 3: Check-Out */}
              <div className="lg:col-span-2 p-3 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#C2410C] shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <span className="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                    Check Out
                  </span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#1F2937] focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 4: Guests */}
              <div className="lg:col-span-3 p-3 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] flex items-center gap-3">
                <Users className="w-5 h-5 text-[#C2410C] shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <span className="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                    Guests & Rooms
                  </span>
                  <input
                    type="text"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#1F2937] focus:outline-none truncate"
                    placeholder="2 Adults, 1 Villa"
                  />
                </div>
              </div>

              {/* Field 5: CTA Search Button */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-bold text-white shadow-md shadow-[#C2410C]/30 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Rooms →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 5 KEY LUXURY AMENITIES STRIP (Image 1 Reference)
          ========================================================================= */}
      <section className="py-8 bg-white border-b border-[#E5E7EB] w-full px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 text-left">
          {/* Item 1 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF8F3] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Luxury Rooms & Suites</h4>
              <p className="text-[11px] text-[#6B7280]">Elegant spaces for every traveler</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF8F3] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">World-Class Amenities</h4>
              <p className="text-[11px] text-[#6B7280]">Pool, spa, yoga & wellness</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF8F3] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Fine Dining & Bistro</h4>
              <p className="text-[11px] text-[#6B7280]">Global flavors, coastal seafood</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF8F3] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Prime Beach Location</h4>
              <p className="text-[11px] text-[#6B7280]">Candolim coastal retreat, Goa</p>
            </div>
          </div>

          {/* Item 5 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF8F3] transition-colors col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Trusted & 5-Star Safe</h4>
              <p className="text-[11px] text-[#6B7280]">Your comfort, our highest priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED STAYS: "EXQUISITE ROOMS & SUITES" (Image 1 Reference)
          ========================================================================= */}
      <section id="rooms" className="py-16 sm:py-20 w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] bg-[#FFF1E6] px-3 py-1 rounded-full border border-[#FED7AA] inline-block mb-2">
              FEATURED STAYS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F2937] font-serif">
              Exquisite Rooms & Suites
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2 leading-relaxed">
              Thoughtfully designed for your comfort, our villas and suites blend contemporary luxury with authentic Goan serenity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="px-5 py-2.5 rounded-xl border border-[#C2410C] text-[#C2410C] hover:bg-[#C2410C] hover:text-white transition-all text-xs font-bold flex items-center gap-2 self-start md:self-auto group shadow-xs"
          >
            <span>View All Rooms</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cards Grid (Deluxe Room, Ocean View Suite, Private Pool Villa, Family Suite) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigate('/rooms')}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#C2410C]/40 transition-all flex flex-col justify-between hover:-translate-y-1 duration-300"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#C2410C] border border-[#E5E7EB] shadow-xs">
                    {room.tag}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#C2410C] transition-colors line-clamp-1">
                    {room.name}
                  </h3>
                  <p className="text-[11px] text-[#6B7280] line-clamp-1">
                    {room.subtitle}
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-xs text-[#6B7280] border-t border-[#E5E7EB]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#C2410C]" /> {room.guests}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-[#C2410C]" /> {room.bed}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Bottom Strip */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-[#E5E7EB]">
                <div className="text-left">
                  <span className="text-base font-extrabold text-[#C2410C]">
                    {formatINR(room.price)}
                  </span>
                  <span className="text-[11px] text-[#6B7280]"> / night</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#FFF8F3] border border-[#E5E7EB] group-hover:bg-[#C2410C] group-hover:text-white group-hover:border-[#C2410C] flex items-center justify-center text-[#6B7280] transition-colors shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. SPLIT SECTION: TOP DESTINATION & HOTEL EXPERIENCES (Image 1 Reference)
          ========================================================================= */}
      <section id="experiences" className="py-16 bg-[#F8FAFC] border-y border-[#E5E7EB] w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Big Feature Card with Video Preview (6 cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[460px] flex flex-col justify-end p-6 sm:p-8 text-white shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
              alt="Beach Resort Paradise"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* Top Video Play Button Trigger */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:bg-[#C2410C] transition-all">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
              <span className="text-xs font-bold text-white drop-shadow-md">Watch 4K Tour</span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FED7AA] bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 inline-block">
                TOP DESTINATION
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif leading-tight">
                Experience Paradise at Our Beach Resort
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Wake up to Arabian sea waves, stroll through private spice groves, and indulge in unforgettable Goan sunsets.
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D95F02]" /> Candolim Beach, North Goa
                </span>

                <button
                  type="button"
                  onClick={() => navigate('/rooms')}
                  className="px-4 py-2 rounded-xl bg-white text-[#C2410C] hover:bg-[#FFF1E6] text-xs font-bold shadow-md transition-all flex items-center gap-1"
                >
                  <span>Explore Resort</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hotel Experiences 4-Card Grid (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] bg-[#FFF1E6] px-3 py-1 rounded-full border border-[#FED7AA] inline-block mb-2">
                CURATED MEMORIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] font-serif">
                Hotel Experiences
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                More than a stay — a journey of unforgettable coastal moments.
              </p>
            </div>

            {/* 4 Photo Cards Grid (Image 1 Reference) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {hotelExperiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => navigate('/services')}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#C2410C]/40 transition-all flex flex-col"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="p-4 space-y-1 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-[#C2410C]">{exp.tagline}</div>
                      <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#C2410C] transition-colors">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center text-xs font-semibold text-[#C2410C] gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Discover experience</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. "WHY CHOOSE US" & TESTIMONIALS (3-Column Layout - Image 1 Reference)
          ========================================================================= */}
      <section id="advantage" className="py-16 sm:py-20 w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Col 1: The Advantage 4 Pill Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] bg-[#FFF1E6] px-3 py-1 rounded-full border border-[#FED7AA] inline-block mb-2">
                WHY CHOOSE US
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] font-serif">
                The Aura Palms Advantage
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                From bespoke butler service to pristine private shorelines, every detail is crafted for extraordinary memories.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF1E6] border border-[#FED7AA] text-[#C2410C] flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">5-Star Service</h4>
                  <p className="text-[11px] text-[#6B7280]">Always at your service</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF1E6] border border-[#FED7AA] text-[#C2410C] flex items-center justify-center shrink-0">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">Best Price Guarantee</h4>
                  <p className="text-[11px] text-[#6B7280]">More value, direct booking</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF1E6] border border-[#FED7AA] text-[#C2410C] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">Flexible Booking</h4>
                  <p className="text-[11px] text-[#6B7280]">Cancel with complete ease</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF1E6] border border-[#FED7AA] text-[#C2410C] flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">24/7 Dedicated Support</h4>
                  <p className="text-[11px] text-[#6B7280]">We're always here for you</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Center Photo with Romantic Script (4 cols) */}
          <div className="lg:col-span-4 relative h-[380px] rounded-3xl overflow-hidden shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
              alt="Where comfort meets adventure"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            <div className="absolute bottom-6 left-6 right-6 text-center">
              <span className="font-serif italic text-lg sm:text-xl text-white font-medium drop-shadow-md">
                "Where comfort meets adventure ♡"
              </span>
            </div>
          </div>

          {/* Col 3: Testimonial Card with Carousel Controls (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E7EB] shadow-xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] border border-[#FED7AA] text-[#C2410C] flex items-center justify-center font-serif text-2xl font-bold">
                “
              </div>

              <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed italic">
                "{testimonials[currentTestimonialIndex].comment}"
              </p>

              <div className="flex items-center gap-1 text-[#C2410C]">
                {[...Array(testimonials[currentTestimonialIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-amber-500" />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[currentTestimonialIndex].avatar}
                  alt={testimonials[currentTestimonialIndex].name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#C2410C]/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">
                    {testimonials[currentTestimonialIndex].name}
                  </h4>
                  <span className="text-[10px] text-[#6B7280]">
                    {testimonials[currentTestimonialIndex].location}
                  </span>
                </div>
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentTestimonialIndex((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="w-8 h-8 rounded-full bg-[#FFF8F3] border border-[#E5E7EB] hover:border-[#C2410C] hover:text-[#C2410C] flex items-center justify-center text-[#6B7280] transition-colors"
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
                  className="w-8 h-8 rounded-full bg-[#FFF8F3] border border-[#E5E7EB] hover:border-[#C2410C] hover:text-[#C2410C] flex items-center justify-center text-[#6B7280] transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. LIMITED TIME OFFER BANNER WITH LIVE COUNTDOWN TIMER (Image 1 Reference)
          ========================================================================= */}
      <section className="py-12 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl overflow-hidden min-h-[280px] p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
          {/* Scenic Twilight Mountain / Coastal Backdrop */}
          <img
            src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=85"
            alt="Limited Time Offer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/60" />

          {/* Left Text */}
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FED7AA] bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 inline-block">
              LIMITED TIME OFFER
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
              Save Up to 30% on Your Dream Stay
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Book direct today and enjoy exclusive discounts, complimentary gourmet breakfast, and ₹3,000 resort spa credit.
            </p>

            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="mt-2 px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-bold text-white shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Live Ticking Countdown Timer Boxes (Image 1 Reference) */}
          <div className="relative z-10 flex items-center gap-2.5 sm:gap-4 shrink-0">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[64px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#FED7AA] uppercase font-semibold">
                Days
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[64px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#FED7AA] uppercase font-semibold">
                Hours
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[64px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#FED7AA] uppercase font-semibold">
                Minutes
              </span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[64px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D95F02] block animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#FED7AA] uppercase font-semibold">
                Seconds
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. TRUST STATS STRIP (Image 2 Wanderly Reference)
          ========================================================================= */}
      <section className="py-10 bg-[#FFF8F3] border-t border-[#E5E7EB] w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C2410C] block">
              50,000+
            </span>
            <p className="text-xs font-semibold text-[#1F2937]">Happy Travelers</p>
            <p className="text-[11px] text-[#6B7280]">Across India & Abroad</p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C2410C] block">
              100%
            </span>
            <p className="text-xs font-semibold text-[#1F2937]">Verified Stays</p>
            <p className="text-[11px] text-[#6B7280]">Curated 5-Star Keys</p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C2410C] block">
              4.9 / 5
            </span>
            <p className="text-xs font-semibold text-[#1F2937]">Customer Rating</p>
            <p className="text-[11px] text-[#6B7280]">Google & TripAdvisor</p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C2410C] block">
              15+
            </span>
            <p className="text-xs font-semibold text-[#1F2937]">Hospitality Awards</p>
            <p className="text-[11px] text-[#6B7280]">Excellence in Goa</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. NEWSLETTER SUBSCRIPTION (Image 2 Reference)
          ========================================================================= */}
      <section className="py-14 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C]">
                STAY INSPIRED
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1F2937]">
                Get Secret Tariffs Straight to Your Inbox
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Exclusive seasonal villas, chef tastings, and private invitations delivered monthly.
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
              className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] text-xs text-[#1F2937] placeholder-[#6B7280] focus:outline-none focus:border-[#C2410C] min-w-0"
            />
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-bold text-white transition-all shadow-md shrink-0 whitespace-nowrap active:scale-95"
            >
              {isSubscribed ? 'Subscribed!' : 'Subscribe →'}
            </button>
          </form>
        </div>
      </section>

      {/* =========================================================================
          11. LUXURY FOOTER (Clean Dark Slate Bottom - Image 1 Reference)
          ========================================================================= */}
      <footer id="contact" className="border-t border-[#E5E7EB] bg-[#1F2937] text-white pt-16 pb-8 text-left w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C2410C] flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-white">
                  Aura Palms <span className="text-[#D95F02]">Resort</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                Aura Palms Resort & Spa is Goa’s premier 5-star beachfront sanctuary, featuring private plunge pool villas, Ayurvedic therapies, and bespoke coastal dining.
              </p>
              <div className="text-xs text-slate-400">
                Candolim Beach Road, North Goa, 403515, India
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDBA74]">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">Home</a>
                </li>
                <li>
                  <a href="#rooms" className="hover:text-white transition-colors">Rooms & Villas</a>
                </li>
                <li>
                  <a href="#experiences" className="hover:text-white transition-colors">Experiences</a>
                </li>
                <li>
                  <a href="#advantage" className="hover:text-white transition-colors">About Resort</a>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                    Staff Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Resort Amenities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDBA74]">
                Experiences
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>Private Villa Booking</li>
                <li>Ayurvedic Ocean Spa</li>
                <li>Beachfront Candlelight Dining</li>
                <li>Sunset Catamaran Charters</li>
                <li>Airport Luxury Pickup</li>
              </ul>
            </div>

            {/* Col 4: Contact Concierge */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDBA74]">
                Direct Contact
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D95F02]" />
                  <span>+91 832 249 9888</span>
                </li>
                <li className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-[#D95F02]" />
                  <span>reservations@aurapalms.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D95F02]" />
                  <span>Candolim, North Goa</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Aura Palms Resort & Spa. All Rights Reserved. GSTIN: 30AABCA1234F1Z8.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-[#D95F02] hover:underline font-medium"
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
          <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-white border border-[#E5E7EB] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#C2410C]">
                Aura Palms Resort & Spa • Virtual 4K Drone Tour
              </h3>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937]"
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
                <div className="w-16 h-16 rounded-full bg-[#C2410C] text-white flex items-center justify-center shadow-2xl animate-pulse">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <span className="text-xs font-semibold text-white">
                  Candolim Shoreline & Private Villas 4K Showcase
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
