import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/store/useToastStore';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Reset Link Dispatched', `Password instructions sent to ${email}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-[#0F5132] selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 items-center justify-center text-[#0F5132] mb-1 shadow-2xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Enter your Joy Resorts staff or guest email to recover access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xl">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F5132] mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#111827]">Email Dispatched</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We have sent an authentication reset link to <strong className="text-[#111827]">{email}</strong>. Please check your inbox or spam folder.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="outline" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="e.g. admin@joyresorts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Send Recovery Instructions
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F5132] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
