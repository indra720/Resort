import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInvites, acceptStaffInvite } from '@/api/staffApi';
import { StaffInvite } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/store/useToastStore';
import {
  ShieldCheck,
  Building2,
  User,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AcceptInvitePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login, switchResort } = useAuthStore();

  const [invite, setInvite] = useState<StaffInvite | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorStatus('No invitation token provided in the URL.');
      return;
    }

    const allInvites = getInvites();
    const found = allInvites.find((i) => i.token === token);

    if (!found) {
      setErrorStatus('This staff invitation is invalid or does not exist.');
      return;
    }

    if (found.status === 'Accepted') {
      setErrorStatus('This invitation has already been accepted and activated.');
      return;
    }

    if (found.status === 'Revoked') {
      setErrorStatus('This invitation was revoked by the resort management.');
      return;
    }

    const isExpired = new Date() > new Date(found.expiresAt);
    if (isExpired) {
      setErrorStatus('This invitation expired after 7 days. Please ask your Resort Owner/Manager to reissue an invite.');
      return;
    }

    setInvite(found);
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite || !token) return;

    if (!fullName.trim()) {
      toast.error('Name required', 'Please provide your full legal name.');
      return;
    }

    if (password.length < 6) {
      toast.error('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password mismatch', 'Password and confirmation password do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = acceptStaffInvite(token, fullName, phone);

      if (!result.success || !result.user) {
        setIsSubmitting(false);
        setErrorStatus(result.error || 'Failed to accept invitation.');
        return;
      }

      // Log in as accepted user
      login(result.user.email, result.user.role);
      switchResort(invite.resortId);

      setIsSubmitting(false);
      toast.success(
        'Welcome to the Team!',
        `Your account has been activated as ${invite.role} at ${invite.resortName}.`
      );
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col justify-between font-sans selection:bg-[#0F5132] selection:text-white">
      {/* Header */}
      <header className="p-4 sm:p-6 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
        <div className="flex flex-col lg:flex-row items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F5132] flex items-center justify-center text-white">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
            </svg>
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#111827]">
            JOY <span className="text-[#0F5132]">RESORTS</span>
          </span>
        </div>

        <Link
          to="/login"
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F5132] flex items-center gap-1"
        >
          <span>Already have an account? Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {errorStatus ? (
            <div className="bg-white border border-red-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Invitation Unavailable</h2>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{errorStatus}</p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/login')}
                  fullWidth
                >
                  Go to Sign In
                </Button>
              </div>
            </div>
          ) : invite ? (
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 text-left">
              {/* Badge & Title */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F5132]" />
                  Verified Staff Invitation
                </div>
                <h1 className="text-xl font-extrabold text-[#0F172A]">
                  Join {invite.resortName}
                </h1>
                <p className="text-xs text-[#64748B] mt-1">
                  You've been invited by <span className="font-semibold text-slate-800">{invite.invitedBy}</span> as{' '}
                  <span className="font-bold text-[#0F5132]">{invite.role}</span>.
                </p>
              </div>

              {/* Invitation Summary Card */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Invited Email:</span>
                  <span className="font-semibold text-[#0F172A]">{invite.email}</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Designated Role:</span>
                  <span className="font-bold text-[#0F5132]">{invite.role}</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Validity:</span>
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Clock className="w-3.5 h-3.5" /> 7-day secure link
                  </span>
                </div>
              </div>

              {/* Set Account Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Contact Phone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Create Password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isSubmitting}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Activate Account & Enter Resort
                </Button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#64748B]">
              Validating invitation token...
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#64748B]">
        <span>© 2026 Joy Resorts SaaS Platform • Multi-Tenant Enterprise Security</span>
      </footer>
    </div>
  );
};
