import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { AdminLayout } from './AdminLayout';
import { StaffLayout } from './StaffLayout';
import { GuestLayout } from './GuestLayout';

export interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Master layout router that dynamically selects the appropriate layout
 * (AdminLayout, StaffLayout, or GuestLayout) based on the current user's role.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { role } = useAuthStore();

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

  // Super Admin and Resort Manager
  return <AdminLayout>{children}</AdminLayout>;
};
