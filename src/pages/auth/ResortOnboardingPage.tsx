import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createResortTenant } from '@/api/resortsApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/store/useToastStore';
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const ResortOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlan = (searchParams.get('plan') || 'pro').toLowerCase();

  const { login, switchResort } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    resortName: 'Joy Palms Beachfront Sanctuary',
    city: 'Goa',
    state: 'Goa',
    totalRooms: 28,
    ownerName: 'Vikramaditya Singhania',
    ownerEmail: 'owner.demo@joyresorts.com',
    ownerPhone: '+91 98200 44332',
    password: 'password123',
    selectedPlan: (initialPlan === 'enterprise' ? 'Enterprise' : initialPlan === 'basic' ? 'Basic' : 'Pro') as 'Basic' | 'Pro' | 'Enterprise',
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.resortName || !formData.city) {
        toast.error('Missing details', 'Please enter your resort name and city.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.ownerName || !formData.ownerEmail) {
        toast.error('Missing credentials', 'Please enter your owner name and email.');
        return;
      }
      setStep(3);
    } else {
      // Step 3 Submit & Provision Tenant
      setIsLoading(true);
      setTimeout(() => {
        const newTenant = createResortTenant({
          name: formData.resortName,
          city: formData.city,
          state: formData.state,
          totalRooms: Number(formData.totalRooms) || 20,
          plan: formData.selectedPlan,
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
          phone: formData.ownerPhone,
        });

        // Log in as Resort Owner
        login(formData.ownerEmail, 'Resort Owner');
        switchResort(newTenant.id);

        setIsLoading(false);
        toast.success(
          '14-Day Free SaaS Trial Activated!',
          `Tenant "${newTenant.name}" initialized. Welcome, ${formData.ownerName}!`
        );
        navigate('/dashboard');
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col justify-between font-sans selection:bg-[#0F5132] selection:text-white">
      {/* Top Header */}
      <header className="p-4 sm:p-6 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
        <Link to="/pricing" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F5132] flex items-center justify-center text-white">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
            </svg>
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#111827]">
            JOY <span className="text-[#0F5132]">RESORTS</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F5132] flex items-center gap-1"
        >
          <span>Existing Staff / Owner? Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Wizard Form Card */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] px-1">
            <span className={step >= 1 ? 'text-[#0F5132] font-bold' : ''}>1. Property Info</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-[#0F5132] font-bold' : ''}>2. Owner Details</span>
            <span>→</span>
            <span className={step === 3 ? 'text-[#0F5132] font-bold' : ''}>3. 14-Day Trial Plan</span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 text-left">
            {/* Step 1: Property Details */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Step 1: Your Resort Property</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Enter the resort name and operational location for your tenant setup.
                  </p>
                </div>

                <Input
                  label="Resort / Hotel Name"
                  placeholder="e.g. Joy Whispering Palms Beach Resort"
                  value={formData.resortName}
                  onChange={(e) => setFormData({ ...formData, resortName: e.target.value })}
                  leftIcon={<Building2 className="w-4 h-4" />}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City / Destination"
                    placeholder="e.g. Candolim"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    leftIcon={<MapPin className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="e.g. Goa"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Total Villa / Room Capacity"
                  type="number"
                  placeholder="28"
                  value={String(formData.totalRooms)}
                  onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) || 1 })}
                  required
                />

                <Button type="submit" variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Owner Account
                </Button>
              </form>
            )}

            {/* Step 2: Owner Account */}
            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Step 2: Owner & Master Admin</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    This account will receive full Resort Owner credentials and P&L authority.
                  </p>
                </div>

                <Input
                  label="Owner Full Name"
                  placeholder="e.g. Vikramaditya Singhania"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Official Work Email"
                    type="email"
                    placeholder="owner@joyresorts.com"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Contact Phone"
                    type="tel"
                    placeholder="+91 98200 11223"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    leftIcon={<Phone className="w-4 h-4" />}
                    required
                  />
                </div>

                <Input
                  label="Create Security Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Choose Plan & Finish
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Plan & Trial Activation */}
            {step === 3 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Step 3: Select 14-Day Free Trial</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    No credit card required. Full operational access unlocked instantly.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {(['Basic', 'Pro', 'Enterprise'] as const).map((plan) => {
                    const isSelected = formData.selectedPlan === plan;
                    return (
                      <div
                        key={plan}
                        onClick={() => setFormData({ ...formData, selectedPlan: plan })}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50/80 border-[#0F5132] ring-2 ring-[#0F5132]/20'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0F172A]">{plan} Plan</span>
                            {plan === 'Pro' && (
                              <span className="px-1.5 py-0.2 rounded bg-[#0F5132] text-white text-[9px] font-bold">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#64748B]">
                            {plan === 'Basic'
                              ? 'Up to 15 Villas • 5 Staff'
                              : plan === 'Pro'
                              ? 'Up to 30 Villas • 15 Staff • Full CRM & Dining'
                              : 'Unlimited Villas & Staff • Multi-Branch Group'}
                          </p>
                        </div>
                        <span className="text-xs font-black text-[#0F5132]">
                          14 Days Free
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                  <span>
                    Your tenant will be provisioned in <strong>Trial Mode</strong>. All data will be isolated strictly to your resort.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                    rightIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Launch Resort Hub
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#64748B]">
        <span>© 2026 Joy Resorts SaaS Platform • 100% Tenant Isolation Guarantee</span>
      </footer>
    </div>
  );
};
