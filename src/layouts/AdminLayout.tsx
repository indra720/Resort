import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { PageTransition } from '@/components/layout/PageTransition';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
    <div className="h-screen w-full bg-[#F8FAFC] text-[#111827] flex font-sans selection:bg-[#0F5132] selection:text-white overflow-hidden">
      {/* Desktop Collapsible Sidebar - Full Height on Left (Exact Screenshot Match) */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {/* Right Content Column: TopBar + Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F8FAFC]">
        {/* TopBar on right column */}
        <TopBar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Scrollable Main Content Area with 1px flush padding (Exact Screenshot Match) */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full p-1 sm:p-1.5 pb-20 md:pb-2 flex flex-col bg-[#F8FAFC]">
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
