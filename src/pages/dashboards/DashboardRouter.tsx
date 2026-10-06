import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { ResortManagerDashboard } from './ResortManagerDashboard';
import { ReceptionistDashboard } from './ReceptionistDashboard';
import { HousekeepingDashboard } from './HousekeepingDashboard';
import { RestaurantDashboard } from './RestaurantDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { GuestDashboard } from './GuestDashboard';

/**
 * Intelligent Router that automatically renders the exact dashboard tailored to the active role.
 * Supports all 7 resort roles seamlessly.
 */
export const DashboardRouter: React.FC = () => {
  const { role } = useAuthStore();

  switch (role) {
    case 'Super Admin':
      return <SuperAdminDashboard />;
    case 'Resort Manager':
      return <ResortManagerDashboard />;
    case 'Receptionist':
      return <ReceptionistDashboard />;
    case 'Housekeeping':
      return <HousekeepingDashboard />;
    case 'Restaurant/F&B':
      return <RestaurantDashboard />;
    case 'Accountant':
      return <AccountantDashboard />;
    case 'Guest':
      return <GuestDashboard />;
    default:
      return <SuperAdminDashboard />;
  }
};
