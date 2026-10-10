import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { PageTransition } from '@/components/layout/PageTransition';
import { Sparkles, PhoneCall, Wifi } from 'lucide-react';
import { toast } from '@/store/useToastStore';

export interface GuestLayoutProps {
  children: React.ReactNode;
}

export const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth < 1024 && prevWidth >= 1024) {
        setIsSidebarCollapsed(true);
      }
      prevWidth = currentWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-full bg-[#F8FAFC] text-[#111827] flex font-sans selection:bg-[#0F5132] selection:text-white overflow-hidden">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {/* Right Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F8FAFC]">
        {/* Top Bar */}
        <TopBar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Guest Hospitality Welcome Banner */}
        <div className="shrink-0 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2 z-10 shadow-2xs">
          <div className="flex items-center gap-2 text-[#111827]">
            <Sparkles className="w-4 h-4 text-[#0F5132]" />
            <span className="font-semibold text-[#111827]">Guest Experience Portal</span>
            <span className="text-[#64748B] hidden sm:inline">| Complimentary Wi-Fi Active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                toast.info('Joy Resorts Wi-Fi', 'SSID: JoyResorts_Guest | Passcode: nature@stay26')
              }
              className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0F5132] transition-colors"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Connect Wi-Fi</span>
            </button>

            <button
              onClick={() =>
                toast.info('Concierge Hotline', 'Front Desk Extension: #100 | Butler: #101')
              }
              className="flex items-center gap-1.5 text-[#0F5132] font-semibold hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Concierge Dial #100</span>
            </button>
          </div>
        </div>

        {/* Scrollable Main Area with 1px flush padding */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full p-1 sm:p-1.5 pb-20 md:pb-2 flex flex-col bg-[#F8FAFC]">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenMore={() => setIsMobileDrawerOpen(true)} />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </div>
  );
};
