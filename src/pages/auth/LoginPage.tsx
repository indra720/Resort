import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/store/useToastStore';
import {
  Sparkles,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  Building,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { MOCK_USERS } from '@/data/mockData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('vikram.m@tajhaveli.in');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(email);
      setIsLoading(false);
      toast.success('Welcome Back', `Logged in successfully as ${email}`);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    const userForRole = MOCK_USERS.find((u) => u.role === role);
    const targetEmail = userForRole
      ? userForRole.email
      : `${role.toLowerCase().replace(/[^a-z]/g, '')}@resort.in`;
    setEmail(targetEmail);
    login(targetEmail, role);
    toast.success('Demo Role Activated', `Switched to role: ${role}`);
    navigate('/dashboard');
  };

  const demoRoles: UserRole[] = [
    'Super Admin',
    'Resort Manager',
    'Receptionist',
    'Housekeeping',
    'Restaurant/F&B',
    'Accountant',
    'Guest',
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0B0F] text-[#F5F5F7] flex flex-col lg:flex-row font-sans selection:bg-[#CC5500] selection:text-white">
      {/* =========================================================================
          LEFT SIDE: LUXURY RESORT VISUAL SHOWCASE (Hidden on small mobile if needed, or compact)
          ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-[#2A2A35]">
        {/* Background Resort Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85"
            alt="Aura Palms Resort Goa"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/70 to-[#0B0B0F]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B0B0F]" />
        </div>

        {/* Top Header: Brand & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group text-left select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#CC5500] to-[#E06A10] flex items-center justify-center text-white shadow-lg shadow-[#CC5500]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
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

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-4 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CC5500]/18 border border-[#CC5500]/30 text-[#FF8A3D] text-xs font-semibold">
            <Building className="w-3.5 h-3.5" />
            <span>5-Star Hospitality Operations Suite</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-[#F5F5F7] leading-tight">
            Seamless Resort Operations & Guest Concierge
          </h2>

          <p className="text-xs xl:text-sm text-[#A1A1AA] leading-relaxed">
            Manage luxury villa reservations, housekeeping workflows, coastal dining orders, and GST billing with real-time role-based access.
          </p>

          {/* Floating Testimonial Quote Card */}
          <div className="p-4 rounded-2xl bg-[#14141A]/90 border border-[#2A2A35] backdrop-blur-md shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#FF8A3D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-[#22C55E] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Verified 4.9/5 Rating
              </span>
            </div>
            <p className="text-xs text-[#F5F5F7] italic">
              "The plunge pool villa was immaculate and check-in was instantaneous. World-class coastal experience!"
            </p>
            <span className="text-[10px] text-[#A1A1AA] block">
              — Pooja Hegde, Grand Pool Villa (Candolim Beach)
            </span>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A1A1AA]">
          <span>© 2026 Aura Palms Resort & Spa</span>
          <span>256-bit SSL Security • GST Compliant</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: ELEGANT COMPACT AUTH CARD (FITS 100vh WITHOUT PAGE SCROLL)
          ========================================================================= */}
      <div className="flex-1 h-full flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-5 my-auto">
          {/* Mobile Top Brand Bar (Visible on mobile only) */}
          <div className="lg:hidden flex items-center justify-between mb-2">
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
              <KeyRound className="w-5 h-5 text-[#FF8A3D]" />
              <span>Sign In to System</span>
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Enter employee credentials or select a 1-click test role below.
            </p>
          </div>

          {/* Glassmorphic Form Card */}
          <div className="bg-[#14141A] border border-[#2A2A35] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              <Input
                label="Staff / Guest Email"
                type="email"
                placeholder="e.g. vikram.m@tajhaveli.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <div className="flex justify-end pt-0.5">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#A1A1AA] hover:text-[#FF8A3D] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>
            </form>

            {/* Quick 1-Click Demo Role Selector (Prominently testing RBAC) */}
            <div className="pt-3 border-t border-[#2A2A35] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
                <span className="flex items-center gap-1 text-[#FF8A3D] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Quick Demo Role Login:
                </span>
                <span>Click to switch</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {demoRoles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleQuickRoleSelect(r)}
                    className="p-1.5 text-left rounded-lg bg-[#1C1C24] border border-[#2A2A35] hover:border-[#CC5500] hover:text-[#FF8A3D] text-[#F5F5F7] transition-all truncate select-none active:scale-95 group"
                  >
                    <span className="text-[11px] font-semibold block truncate group-hover:text-[#FF8A3D]">
                      {r}
                    </span>
                    <span className="text-[9px] text-[#A1A1AA] block truncate">
                      Instant Access
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Link to Guest Registration */}
            <div className="pt-3 border-t border-[#2A2A35] flex items-center justify-between text-xs">
              <span className="text-[#A1A1AA]">New guest booking?</span>
              <Link
                to="/signup"
                className="text-xs font-semibold text-[#FF8A3D] hover:text-[#E06A10] transition-colors flex items-center gap-1"
              >
                <span>Register Guest Account</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-[11px] text-[#A1A1AA] px-1">
            <Link to="/" className="hover:text-[#F5F5F7] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Aura Palms Website
            </Link>
            <span>Role-Based Auth Matrix</span>
          </div>
        </div>
      </div>
    </div>
  );
};
