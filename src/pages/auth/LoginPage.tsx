import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/store/useToastStore';
import {
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

  const [email, setEmail] = useState('superadmin@joyresorts.com');
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
      : `${role.toLowerCase().replace(/[^a-z]/g, '')}@joyresorts.com`;
    setEmail(targetEmail);
    login(targetEmail, role);
    toast.success('Role Activated', `Switched to role: ${role}`);
    navigate('/dashboard');
  };

  const demoRoles: UserRole[] = [
    'Super Admin',
    'Resort Owner',
    'Resort Manager',
    'Sales Executive',
    'Receptionist',
    'Housekeeping',
    'Restaurant/F&B',
    'Accountant',
    'Guest',
  ];

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#F8FAFC] text-[#111827] flex flex-col lg:flex-row font-sans selection:bg-[#0F5132] selection:text-white lg:overflow-hidden">
      {/* LEFT SIDE: LUXURY RESORT VISUAL SHOWCASE */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-[#E2E8F0]">
        {/* Background Resort Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85"
            alt="Joy Resorts Sanctuary"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
        </div>

        {/* Top Header: Brand & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/landing"
            className="flex items-center gap-3 group text-left select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] flex items-center justify-center text-white shadow-lg shadow-[#0F5132]/30 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                JOY <span className="text-emerald-400">RESORTS</span>
              </span>
              <span className="block text-[10px] text-white/80 uppercase tracking-widest font-semibold">
                NATURE • STAY • EXPERIENCE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/landing"
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white text-xs text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
            >
              <span>Guest Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white text-xs text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CRM</span>
            </Link>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-4 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F5132] text-white text-xs font-semibold shadow-md border border-emerald-400/30">
            <Building className="w-3.5 h-3.5" />
            <span>Luxury Resort Management Suite</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            Integrated Resort CRM & Operational Command
          </h2>

          <p className="text-xs xl:text-sm text-white/90 leading-relaxed">
            Manage villas, leads, corporate retreats, restaurant orders, and guest concierge from one elegant dashboard.
          </p>

          {/* Testimonial Quote Card */}
          <div className="p-4 rounded-2xl bg-white/95 border border-white text-[#111827] backdrop-blur-md shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-emerald-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-[#16A34A] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Verified 4.9/5 Rating
              </span>
            </div>
            <p className="text-xs text-[#111827] italic">
              "The overwater gazebo and lakeside villas were breathtaking. Truly world-class hospitality."
            </p>
            <span className="text-[10px] text-[#64748B] block">
              — Pooja Hegde, Presidential Pool Villa Guest
            </span>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
          <span>© 2026 Joy Resorts & Spa</span>
          <span>256-bit SSL Security • GST Compliant</span>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH CARD */}
      <div className="flex-1 w-full h-full min-h-screen lg:min-h-0 overflow-y-auto bg-[#F8FAFC]">
        <div className="min-h-full w-full flex flex-col items-center justify-start lg:justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-md space-y-4 sm:space-y-5 my-auto">
            {/* Mobile / MD Top Brand Bar */}
            <div className="lg:hidden flex items-center justify-between pb-1">
              <Link to="/landing" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#0F5132] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
                  </svg>
                </div>
                <div className="text-left leading-tight">
                  <span className="text-sm sm:text-base font-bold text-[#111827]">
                    JOY <span className="text-[#0F5132]">RESORTS</span>
                  </span>
                  <span className="hidden sm:block text-[9px] text-[#64748B] font-medium tracking-wider uppercase">
                    Hospitality System
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  to="/landing"
                  className="text-xs font-semibold text-[#0F5132] hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                >
                  <span>Website</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/"
                  className="text-xs text-[#64748B] hover:text-[#0F5132] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-left space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#0F5132] shrink-0" />
                <span>Sign In to System</span>
              </h1>
              <p className="text-xs text-[#64748B]">
                Enter employee credentials or choose a 1-click test role below.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                <Input
                  label="Staff / Manager Email"
                  type="email"
                  placeholder="e.g. admin@joyresorts.com"
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
                      className="text-[11px] text-[#64748B] hover:text-[#0F5132] transition-colors"
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

              {/* Quick 1-Click Demo Role Selector */}
              <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1 text-[#0F5132] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Quick Demo Role Login:
                  </span>
                  <span>Click to switch</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {demoRoles.map((r) => {
                    const isGuest = r === 'Guest';
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleQuickRoleSelect(r)}
                        className={`p-2 text-left rounded-lg transition-all select-none active:scale-95 group shadow-2xs ${
                          isGuest
                            ? 'col-span-2 sm:col-span-3 flex items-center justify-between bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100/70 hover:border-emerald-300'
                            : 'bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0F5132] hover:bg-emerald-50 text-[#111827] hover:text-[#0F5132]'
                        }`}
                      >
                        <div className="truncate">
                          <span
                            className={`text-[11px] font-semibold block truncate ${
                              isGuest ? 'text-[#0F5132]' : 'group-hover:text-[#0F5132]'
                            }`}
                          >
                            {isGuest ? 'Guest Portal (Visitor Access)' : r}
                          </span>
                          <span className="text-[9px] text-[#64748B] block truncate">
                            {isGuest ? 'Book Villas, Dining & Concierge' : 'Instant Access'}
                          </span>
                        </div>
                        {isGuest && (
                          <span className="text-[10px] font-bold text-[#0F5132] shrink-0 ml-2">
                            Switch Role →
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Link to Registration */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">New guest or staff?</span>
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-[#0F5132] hover:underline transition-colors flex items-center gap-1"
                >
                  <span>Register Account</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Footer note with Website Link */}
            <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1 pt-1">
              <Link to="/landing" className="hover:text-[#0F5132] flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3 h-3 text-[#0F5132]" />
                <span>Visit Guest Landing Website</span>
              </Link>
              <span>Role-Based Auth Matrix</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
