import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { PageTransition } from '@/components/layout/PageTransition';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#0B0B0F] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#CC5500] selection:text-white overflow-hidden">
      {/* Top Navigation Bar - Fixed at top, never scrolls */}
      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        {/* Desktop Collapsible Sidebar - Fixed on left, never scrolls with page */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Scrollable Main Content Area - Fluid full width without restrictive max-w-7xl */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8 flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Mobile Bottom Navigation (4-5 items) */}
      <BottomNav onOpenMore={() => setIsMobileDrawerOpen(true)} />

      {/* Mobile Slide-in Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </div>
  );
};
