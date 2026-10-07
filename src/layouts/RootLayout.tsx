import React from 'react';
import { ToastContainer } from '@/components/ui/Toast';
import { Sparkles, ShieldCheck } from 'lucide-react';

export interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root Layout with dark-orange brand theme header, role indicator, and toast container.
 */
export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col font-sans selection:bg-[#B84C00] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B84C00] to-[#E06A10] flex items-center justify-center text-white shadow-md shadow-[#B84C00]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#0F172A]">
                Aura Palms <span className="text-[#B84C00]">Resort</span>
              </h1>
              <p className="text-[11px] text-[#64748B] hidden sm:block">
                Hospitality & Property Management System
              </p>
            </div>
          </div>

          {/* Role Status Tag */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-[#0F172A]">
              <ShieldCheck className="w-4 h-4 text-[#B84C00]" />
              <span className="hidden sm:inline text-[#64748B]">Role:</span>
              <span className="font-semibold text-[#B84C00]">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4">
          Resort Management System • Luxury White Theme • All Currency in INR (₹)
        </div>
      </footer>

      {/* Global Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
