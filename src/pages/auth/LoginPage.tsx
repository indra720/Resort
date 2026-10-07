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
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row font-sans selection:bg-[#B84C00] selection:text-white">
      {/* =========================================================================
          LEFT SIDE: LUXURY RESORT VISUAL SHOWCASE (Hidden on small mobile if needed, or compact)
          ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-[#E2E8F0]">
        {/* Background Resort Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85"
            alt="Aura Palms Resort Goa"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Top Header: Brand & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group text-left select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B84C00] to-[#E06A10] flex items-center justify-center text-white shadow-lg shadow-[#B84C00]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                Aura Palms <span className="text-[#FF8A3D]">Resort</span>
              </span>
              <span className="block text-[10px] text-white/80 uppercase tracking-widest font-medium">
                Luxury Coastal Sanctuary • Goa
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white text-xs text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </Link>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-4 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B84C00] text-white text-xs font-semibold shadow-md">
            <Building className="w-3.5 h-3.5" />
            <span>5-Star Hospitality Operations Suite</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            Seamless Resort Operations & Guest Concierge
          </h2>

          <p className="text-xs xl:text-sm text-white/90 leading-relaxed">
            Manage luxury villa reservations, housekeeping workflows, coastal dining orders, and GST billing with real-time role-based access.
          </p>

          {/* Floating Testimonial Quote Card (White Theme) */}
          <div className="p-4 rounded-2xl bg-white/95 border border-white text-[#0F172A] backdrop-blur-md shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#B84C00]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-[#16A34A] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Verified 4.9/5 Rating
              </span>
            </div>
            <p className="text-xs text-[#0F172A] italic">
              "The plunge pool villa was immaculate and check-in was instantaneous. World-class coastal experience!"
            </p>
            <span className="text-[10px] text-[#64748B] block">
              — Pooja Hegde, Grand Pool Villa (Candolim Beach)
            </span>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
          <span>© 2026 Aura Palms Resort & Spa</span>
          <span>256-bit SSL Security • GST Compliant</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: ELEGANT COMPACT AUTH CARD (WHITE THEME)
          ========================================================================= */}
      <div className="flex-1 h-full flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 overflow-y-auto bg-[#F8FAFC]">
        <div className="w-full max-w-md space-y-5 my-auto">
          {/* Mobile Top Brand Bar (Visible on mobile only) */}
          <div className="lg:hidden flex items-center justify-between mb-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B84C00] to-[#E06A10] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#0F172A]">
                Aura Palms <span className="text-[#B84C00]">Resort</span>
              </span>
            </Link>

            <Link
              to="/"
              className="text-xs text-[#64748B] hover:text-[#B84C00] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#B84C00] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#B84C00]" />
              <span>Sign In to System</span>
            </h1>
            <p className="text-xs text-[#64748B]">
              Enter employee credentials or select a 1-click test role below.
            </p>
          </div>

          {/* White Theme Form Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
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
                    className="text-[11px] text-[#64748B] hover:text-[#B84C00] transition-colors"
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
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                <span className="flex items-center gap-1 text-[#B84C00] font-semibold">
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
                    className="p-1.5 text-left rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#B84C00] hover:bg-[#FFF7ED] text-[#0F172A] hover:text-[#B84C00] transition-all truncate select-none active:scale-95 group shadow-xs"
                  >
                    <span className="text-[11px] font-semibold block truncate group-hover:text-[#B84C00]">
                      {r}
                    </span>
                    <span className="text-[9px] text-[#64748B] block truncate">
                      Instant Access
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Link to Guest Registration */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">New guest booking?</span>
              <Link
                to="/signup"
                className="text-xs font-semibold text-[#B84C00] hover:text-[#9C3800] transition-colors flex items-center gap-1"
              >
                <span>Register Guest Account</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1">
            <Link to="/" className="hover:text-[#0F172A] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Aura Palms Website
            </Link>
            <span>Role-Based Auth Matrix</span>
          </div>
        </div>
      </div>
    </div>
  );
};
