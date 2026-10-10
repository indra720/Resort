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
  const { user, role } = useAuthStore();
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

        {/* Staff Operations Sub-header Banner */}
        <div className="shrink-0 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2 flex items-center justify-between text-xs z-10 shadow-2xs">
          <div className="flex items-center gap-2 text-[#64748B]">
            <Briefcase className="w-3.5 h-3.5 text-[#0F5132]" />
            <span className="font-semibold text-[#111827]">Staff Operations Desk</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-[#0F5132] font-semibold">{role}</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-medium bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
            {user?.shift ? `Shift: ${user.shift}` : 'On Duty'}
          </div>
        </div>

        {/* Scrollable Main Area */}
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
