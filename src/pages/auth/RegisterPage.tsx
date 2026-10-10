import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/store/useToastStore';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Star,
  CheckCircle2,
  Building,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'Resort Owner' | 'Guest'>('Resort Owner');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    /**
     * CRITICAL SECURITY ARCHITECTURE RULE:
     * Public user signups can strictly ONLY provision 'Resort Owner' (14-day SaaS trial) or 'Guest'.
     * 'Super Admin' can NEVER be provisioned or selected from public registration,
     * protecting platform-level tenant boundaries, MRR data, and cross-resort isolation.
     */
    setTimeout(() => {
      login(email, accountType);
      setIsLoading(false);
      if (accountType === 'Resort Owner') {
        toast.success(
          '14-Day Free Trial Activated',
          `Welcome to Joy Resorts SaaS, ${name}! Your resort owner trial is active.`
        );
      } else {
        toast.success('Registration Complete', `Welcome to Joy Resorts, ${name}!`);
      }
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#F8FAFC] text-[#111827] flex flex-col lg:flex-row font-sans selection:bg-[#0F5132] selection:text-white lg:overflow-hidden">
      {/* LEFT SIDE: LUXURY RESORT SHOWCASE */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-[#E2E8F0]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85"
            alt="Joy Resorts Sanctuary"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-3 group text-left select-none">
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

          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white text-xs text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
          >
            <span>Existing User? Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F5132] text-white text-xs font-semibold shadow-md border border-emerald-400/30">
            <Building className="w-3.5 h-3.5" />
            <span>Exclusive Guest Privileges & VIP Stay</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            Create Moments in Pristine Luxury Nature
          </h2>

          <p className="text-xs xl:text-sm text-white/90 leading-relaxed">
            Create an account to book lakeside villas, reserve dining tables, order butler concierge, and enjoy member-only tariffs.
          </p>

          <div className="p-4 rounded-2xl bg-white/95 border border-white text-[#111827] backdrop-blur-md shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-emerald-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-[#16A34A] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> VIP Club Member
              </span>
            </div>
            <p className="text-xs text-[#111827] italic">
              "Booking was completely seamless. The resort manager personally arranged our private lakeside dinner."
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
          <span>© 2026 Joy Resorts Management</span>
          <span>100% Privacy Protected</span>
        </div>
      </div>

      {/* RIGHT SIDE: SIGNUP CARD */}
      <div className="flex-1 w-full h-full min-h-screen lg:min-h-0 overflow-y-auto bg-[#F8FAFC]">
        <div className="min-h-full w-full flex flex-col items-center justify-start lg:justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-md space-y-4 sm:space-y-5 my-auto">
            <div className="lg:hidden flex items-center justify-between pb-1">
              <Link to="/landing" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F5132] flex items-center justify-center text-white shadow-xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
                  </svg>
                </div>
                <span className="text-base font-bold text-[#111827]">
                  JOY <span className="text-[#0F5132]">RESORTS</span>
                </span>
              </Link>

              <Link
                to="/login"
                className="text-xs text-[#64748B] hover:text-[#0F5132] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            </div>

          <div className="text-left space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#0F5132]" />
              <span>Create Account</span>
            </h1>
            <p className="text-xs text-[#64748B]">
              Register to book luxury villas and access in-room dining & concierge.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xl space-y-3.5">
            {/* Account Type Selector (Resort Owner Trial vs Guest) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B] block">
                Select Registration Purpose:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('Resort Owner')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    accountType === 'Resort Owner'
                      ? 'bg-emerald-50/80 border-[#0F5132] text-[#0F5132] ring-1 ring-[#0F5132]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">Resort Owner</span>
                  <span className="text-[10px] block opacity-80">14-Day Free SaaS Trial</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('Guest')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    accountType === 'Guest'
                      ? 'bg-emerald-50/80 border-[#0F5132] text-[#0F5132] ring-1 ring-[#0F5132]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">Guest / Traveler</span>
                  <span className="text-[10px] block opacity-80">Book Villas & Stays</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <Input
                label="Full Name"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="rahul@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                />
              </div>

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Register & Access Dashboard
              </Button>
            </form>

            <div className="pt-3 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
              <span>Already registered? </span>
              <Link to="/login" className="text-[#0F5132] font-semibold hover:underline">
                Sign In to Account
              </Link>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
