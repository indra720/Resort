import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldAlert, LogOut, FileText } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { isImpersonating, currentResort, exitResortToPlatform } = useAuthStore();
  const navigate = useNavigate();

  if (!isImpersonating) return null;

  const handleExit = () => {
    exitResortToPlatform();
    navigate('/dashboard');
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-3 sm:px-6 py-2 shadow-md flex items-center justify-between text-xs select-none border-b border-amber-600">
      <div className="flex items-center gap-2 sm:gap-3 truncate">
        <div className="w-6 h-6 rounded-md bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
        </div>
        <div className="truncate text-left leading-tight">
          <span className="font-extrabold tracking-wide uppercase text-[10px] sm:text-xs">
            Super Admin Impersonation Mode:
          </span>{' '}
          <span className="font-medium text-slate-900 hidden sm:inline">
            Viewing tenant{' '}
          </span>
          <strong className="font-bold underline decoration-slate-900/40">
            {currentResort?.name} ({currentResort?.code})
          </strong>
          <span className="text-[10px] text-slate-800 ml-2 hidden md:inline">
            • All actions are audited
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/admin/audit-logs')}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-slate-950 font-semibold transition-colors text-[11px]"
        >
          <FileText className="w-3 h-3" />
          <span>Audit Trail</span>
        </button>

        <button
          type="button"
          onClick={handleExit}
          className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 text-[11px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Platform Hub</span>
        </button>
      </div>
    </div>
  );
};
