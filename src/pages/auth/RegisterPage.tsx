import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/store/useToastStore';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Gift,
  Building,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Register and login as Guest
      login(email || 'guest@aurapalms.in', 'Guest');
      setIsLoading(false);
      toast.success(
        'Account Created',
        `Welcome to Aura Palms Resort, ${name || 'Guest'}! Your membership is active.`
      );
      navigate('/dashboard');
    }, 400);
  };

  const handleInstantGuestDemo = () => {
    login('priya.sharma@gmail.com', 'Guest');
    toast.success('Instant Guest Access', 'Logged in as verified guest Priya Sharma.');
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0B0F] text-[#F5F5F7] flex flex-col lg:flex-row font-sans selection:bg-[#CC5500] selection:text-white">
      {/* =========================================================================
          LEFT SIDE: LUXURY GUEST PRIVILEGES SHOWCASE (Non-scrolling Desktop View)
          ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-[#2A2A35]">
        {/* Background Resort Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85"
            alt="Aura Palms Luxury Villas"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/70 to-[#0B0B0F]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B0B0F]" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#CC5500] to-[#E06A10] flex items-center justify-center text-white shadow-lg shadow-[#CC5500]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-lg font-bold tracking-tight text-[#F5F5F7]">
                Aura Palms <span className="text-[#FF8A3D]">Resort</span>
              </span>
              <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-widest font-medium">
                Luxury Coastal Sanctuary • Goa
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl bg-[#14141A]/80 border border-[#2A2A35] hover:border-[#CC5500] text-xs text-[#A1A1AA] hover:text-[#F5F5F7] transition-all flex items-center gap-1.5 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </Link>
        </div>

        {/* Middle Content: Guest Privileges */}
        <div className="relative z-10 space-y-4 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CC5500]/18 border border-[#CC5500]/30 text-[#FF8A3D] text-xs font-semibold">
            <Gift className="w-3.5 h-3.5" />
            <span>Exclusive Guest Privileges</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-[#F5F5F7] leading-tight">
            Unlock Coastal Luxury & Direct Booking Perks
          </h2>

          <p className="text-xs xl:text-sm text-[#A1A1AA] leading-relaxed">
            Create your guest account to manage private plunge pool villas, view stay history, order in-villa dining, and unlock member rates.
          </p>

          {/* Benefits Grid */}
          <div className="space-y-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#14141A]/85 border border-[#2A2A35] flex items-center gap-3 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-[#CC5500]/18 flex items-center justify-center text-[#FF8A3D] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#F5F5F7] block">Express Digital Check-In</span>
                <span className="text-[#A1A1AA]">Skip the front desk queue upon arrival</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#14141A]/85 border border-[#2A2A35] flex items-center gap-3 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#F5F5F7] block">Complimentary Welcome Refreshments</span>
                <span className="text-[#A1A1AA]">Fresh Goan tender coconut upon arrival</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A1A1AA]">
          <span>© 2026 Aura Palms Resort & Spa</span>
          <span>Verified Guest Hospitality • 256-Bit SSL</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: ELEGANT COMPACT SIGNUP CARD (NO PAGE SCROLL)
          ========================================================================= */}
      <div className="flex-1 h-full flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-4 my-auto">
          {/* Mobile Top Brand Bar */}
          <div className="lg:hidden flex items-center justify-between mb-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#CC5500] to-[#E06A10] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#F5F5F7]">
                Aura Palms <span className="text-[#FF8A3D]">Resort</span>
              </span>
            </Link>

            <Link
              to="/"
              className="text-xs text-[#A1A1AA] hover:text-[#FF8A3D] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#FF8A3D]" />
              <span>Create Guest Account</span>
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Register to book luxury villas and access in-room dining & concierge.
            </p>
          </div>

          {/* Glassmorphic Signup Form Card */}
          <div className="bg-[#14141A] border border-[#2A2A35] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-3.5">
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <Input
                label="Full Name"
                placeholder="e.g. Ananya Roy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="ananya@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Mobile Number"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                />
              </div>

              <Input
                label="Create Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Guest Account & Enter
                </Button>
              </div>
            </form>

            {/* Instant Demo Guest Button */}
            <div className="pt-2 border-t border-[#2A2A35] space-y-2">
              <button
                type="button"
                onClick={handleInstantGuestDemo}
                className="w-full py-2 px-3 rounded-xl bg-[#1C1C24] hover:bg-[#1C1C24]/80 border border-[#2A2A35] hover:border-[#CC5500] text-xs font-semibold text-[#F5F5F7] hover:text-[#FF8A3D] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
                <span>1-Click Test: Sign in as Verified Guest</span>
              </button>
            </div>

            {/* Link to Login */}
            <div className="pt-2 border-t border-[#2A2A35] flex items-center justify-between text-xs">
              <span className="text-[#A1A1AA]">Already have an account?</span>
              <Link
                to="/login"
                className="text-xs font-semibold text-[#FF8A3D] hover:text-[#E06A10] transition-colors flex items-center gap-1"
              >
                <span>Sign In to System</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-[11px] text-[#A1A1AA] px-1">
            <Link to="/" className="hover:text-[#F5F5F7] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Aura Palms Website
            </Link>
            <span>Staff member? <Link to="/login" className="text-[#FF8A3D] hover:underline">Staff Login</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};
