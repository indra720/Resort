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
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2A35] bg-[#0B0B0F]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A33] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#F5F5F7]">
                Aura Palms <span className="text-[#FF6B00]">Resort</span>
              </h1>
              <p className="text-[11px] text-[#A1A1AA] hidden sm:block">
                Hospitality & Property Management System
              </p>
            </div>
          </div>

          {/* Role Status Tag */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141A] border border-[#2A2A35] text-xs text-[#F5F5F7]">
              <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
              <span className="hidden sm:inline text-[#A1A1AA]">Role:</span>
              <span className="font-medium text-[#FF6B00]">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#2A2A35] bg-[#0B0B0F] py-4 text-center text-xs text-[#A1A1AA]">
        <div className="max-w-7xl mx-auto px-4">
          Resort Management System • Dark & Orange Theme • All Currency in INR (₹)
        </div>
      </footer>

      {/* Global Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
