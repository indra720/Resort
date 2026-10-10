import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { AdminLayout } from './AdminLayout';
import { StaffLayout } from './StaffLayout';
import { GuestLayout } from './GuestLayout';
import { ImpersonationBanner } from '@/components/layout/ImpersonationBanner';
import { TrialBanner } from '@/components/layout/TrialBanner';

export interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Master layout router that dynamically selects the appropriate layout
 * (AdminLayout, StaffLayout, or GuestLayout) based on the current user's role.
 * Renders the sticky ImpersonationBanner and TrialBanner when active.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { role } = useAuthStore();

  const renderContent = () => {
    if (role === 'Guest') {
      return <GuestLayout>{children}</GuestLayout>;
    }

    if (
      role === 'Receptionist' ||
      role === 'Housekeeping' ||
      role === 'Restaurant/F&B' ||
      role === 'Accountant'
    ) {
      return <StaffLayout>{children}</StaffLayout>;
    }

    // Super Admin, Resort Owner, Resort Manager, Sales Executive
    return <AdminLayout>{children}</AdminLayout>;
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <ImpersonationBanner />
      <TrialBanner />
      <div className="flex-1 w-full min-h-0 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};
