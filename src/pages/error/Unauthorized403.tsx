import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const Unauthorized403: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-6 shadow-lg shadow-[#EF4444]/5">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 px-3 py-1 rounded-full border border-[#EF4444]/20 mb-3">
        403 • Access Denied
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#B84C00] tracking-tight mb-2">
        Restricted Access Area
      </h1>

      <p className="text-sm text-[#64748B] max-w-md mb-8 leading-relaxed">
        Your current role (<strong className="text-[#B84C00]">{role}</strong>) does not have
        permission to view this section of the resort management system.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          fullWidth
          className="sm:w-auto"
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate('/dashboard')}
          leftIcon={<Home className="w-4 h-4" />}
          fullWidth
          className="sm:w-auto"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
