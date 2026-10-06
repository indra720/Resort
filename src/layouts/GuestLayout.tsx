import React, { useState } from 'react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#0B0B0F] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white overflow-hidden">
      {/* Top Bar with Glass Blur - Fixed */}
      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Guest Hospitality Welcome Banner - Fixed */}
      <div className="shrink-0 bg-gradient-to-r from-[#14141A] via-[#1C1C24] to-[#14141A] border-b border-[#2A2A35] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2 z-10">
        <div className="flex items-center gap-2 text-[#F5F5F7]">
          <Sparkles className="w-4 h-4 text-[#FF6B00]" />
          <span>Guest Experience Portal</span>
          <span className="text-[#A1A1AA] hidden sm:inline">| Complimentary Wi-Fi Active</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              toast.info('Resort Wi-Fi', 'SSID: AuraPalms_Guest | Passcode: luxury@stay26')
            }
            className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-[#FF6B00] transition-colors"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[11px]">Wi-Fi Info</span>
          </button>

          <button
            onClick={() =>
              toast.success('Front Desk Call', 'Front desk notified. An attendant is contacting you.')
            }
            className="flex items-center gap-1.5 text-[#FF6B00] hover:text-[#FF8A33] transition-colors font-medium"
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
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8 flex flex-col">
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
