import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFound404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] mb-6 shadow-lg shadow-[#FF6B00]/5">
        <Compass className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/10 px-3 py-1 rounded-full border border-[#FF6B00]/20 mb-3">
        404 • Page Not Found
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7] tracking-tight mb-2">
        Lost in the Resort?
      </h1>

      <p className="text-sm text-[#A1A1AA] max-w-md mb-8 leading-relaxed">
        The page or resort resource you are looking for has either been moved, renamed, or does not exist.
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
          Resort Dashboard
        </Button>
      </div>
    </div>
  );
};
