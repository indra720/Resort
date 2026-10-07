import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { PageTransition } from '@/components/layout/PageTransition';
import { useAuthStore } from '@/store/useAuthStore';
import { Briefcase } from 'lucide-react';

export interface StaffLayoutProps {
  children: React.ReactNode;
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const { role, user } = useAuthStore();
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
    <div className="h-screen w-full bg-[#F1F5F9] text-[#0F172A] flex flex-col font-sans selection:bg-[#B84C00] selection:text-white overflow-hidden">
      {/* Top Bar with glass blur - Fixed */}
      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Staff Operations Sub-header Banner - Fixed */}
      <div className="shrink-0 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2 flex items-center justify-between text-xs z-10 shadow-xs">
        <div className="flex items-center gap-2 text-[#64748B]">
          <Briefcase className="w-3.5 h-3.5 text-[#B84C00]" />
          <span className="font-medium text-[#0F172A]">Staff Operations Desk</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#B84C00] font-semibold">{role}</span>
        </div>
        <div className="text-[11px] text-[#64748B] font-medium bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
          {user?.shift ? `Shift: ${user.shift}` : 'On Duty'}
        </div>
      </div>

      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        {/* Role-Specific Desktop Sidebar - Fixed */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Main Content Area - Fluid full width */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full px-2.5 sm:px-4 lg:px-5 py-2.5 sm:py-3.5 pb-20 md:pb-4 flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenMore={() => setIsMobileDrawerOpen(true)} />

      {/* Mobile Slide-in Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </div>
  );
};
