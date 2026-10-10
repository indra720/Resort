import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const TrialBanner: React.FC = () => {
  const { currentResort, role, isImpersonating } = useAuthStore();
  const navigate = useNavigate();

  // Only show trial banner if current resort is on Trial and not in Super Admin impersonation (which has its own banner)
  if (!currentResort || currentResort.status !== 'Trial' || isImpersonating || role === 'Guest') {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-emerald-900 via-[#0F5132] to-emerald-950 text-white px-3 sm:px-6 py-2 shadow-xs flex items-center justify-between text-xs select-none border-b border-emerald-800 shrink-0">
      <div className="flex items-center gap-2 sm:gap-2.5 truncate">
        <div className="w-5 h-5 rounded-md bg-emerald-400 text-[#0F5132] flex items-center justify-center shrink-0 font-bold text-[10px]">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="truncate text-left leading-tight">
          <span className="font-bold text-emerald-300">
            14-Day Free SaaS Trial Active:
          </span>{' '}
          <span className="text-white/90 hidden sm:inline">
            You are operating on the <strong>{currentResort.plan} Plan</strong>.
          </span>{' '}
          <span className="text-emerald-200 text-[11px] font-semibold">
            11 Days Remaining
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/subscription')}
        className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 active:scale-95 shrink-0 shadow-2xs"
      >
        <span>Upgrade Plan</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
