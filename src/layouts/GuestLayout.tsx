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
  // On md/tablet screens (<1024px), sidebar defaults to collapsed; only expands when user clicks toggle
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
    <div className="h-screen w-full bg-[#FFFFFF] text-[#1F2937] flex flex-col font-sans selection:bg-[#C2410C] selection:text-white overflow-hidden">
      {/* Top Bar with Glass Blur - Fixed */}
      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Guest Hospitality Welcome Banner - Fixed */}
      <div className="shrink-0 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2 z-10 shadow-xs">
        <div className="flex items-center gap-2 text-[#1F2937]">
          <Sparkles className="w-4 h-4 text-[#C2410C]" />
          <span className="font-semibold text-[#1F2937]">Guest Experience Portal</span>
          <span className="text-[#6B7280] hidden sm:inline">| Complimentary Wi-Fi Active</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              toast.info('Resort Wi-Fi', 'SSID: AuraPalms_Guest | Passcode: luxury@stay26')
            }
            className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#C2410C] transition-colors"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Wi-Fi Info</span>
          </button>

          <button
            onClick={() =>
              toast.success('Front Desk Call', 'Front desk notified. An attendant is contacting you.')
            }
            className="flex items-center gap-1.5 text-[#C2410C] hover:text-[#9A3412] transition-colors font-semibold bg-[#FFF1E6] px-2.5 py-1 rounded-lg border border-[#FED7AA]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="text-[11px]">Dial Concierge (Ext. 0)</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        {/* Desktop Sidebar with Guest specific links - Fixed */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Main Content - Fluid full width */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full px-2.5 sm:px-4 lg:px-5 py-2.5 sm:py-3.5 pb-20 md:pb-4 flex flex-col">
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
