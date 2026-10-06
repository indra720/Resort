import React, { useState } from 'react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#0B0B0F] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white overflow-hidden">
      {/* Top Bar with glass blur - Fixed */}
      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Staff Operations Sub-header Banner - Fixed */}
      <div className="shrink-0 bg-[#14141A] border-b border-[#2A2A35] px-4 sm:px-6 py-2 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2 text-[#A1A1AA]">
          <Briefcase className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Staff Operations Desk</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#F5F5F7] font-medium">{role}</span>
        </div>
        <div className="text-[11px] text-[#A1A1AA]">
          {user?.shift ? `Shift: ${user.shift}` : 'On Duty'}
        </div>
      </div>

      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        {/* Role-Specific Desktop Sidebar - Fixed */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Main Content Area - Fluid full width */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8 flex flex-col">
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
