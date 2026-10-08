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
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] flex flex-col font-sans selection:bg-[#C2410C] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C2410C] to-[#D95F02] flex items-center justify-center text-white shadow-md shadow-[#C2410C]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#1F2937]">
                Aura Palms <span className="text-[#C2410C]">Resort</span>
              </h1>
              <p className="text-[11px] text-[#6B7280] hidden sm:block">
                Hospitality & Property Management System
              </p>
            </div>
          </div>

          {/* Role Status Tag */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF1E6] border border-[#FED7AA] text-xs text-[#1F2937]">
              <ShieldCheck className="w-4 h-4 text-[#C2410C]" />
              <span className="hidden sm:inline text-[#6B7280]">Role:</span>
              <span className="font-semibold text-[#C2410C]">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E5E7EB] bg-white py-4 text-center text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-4">
          Resort Management System • Luxury White Theme • All Currency in INR (₹)
        </div>
      </footer>

      {/* Global Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
