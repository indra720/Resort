import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { ResortOwnerDashboard } from './ResortOwnerDashboard';
import { ResortManagerDashboard } from './ResortManagerDashboard';
import { CRMPage } from '@/pages/crm/CRMPage';
import { ReceptionistDashboard } from './ReceptionistDashboard';
import { HousekeepingDashboard } from './HousekeepingDashboard';
import { RestaurantDashboard } from './RestaurantDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { GuestDashboard } from './GuestDashboard';

/**
 * Intelligent Router that automatically renders the exact dashboard tailored to the active role:
 * - Super Admin: SaaS Platform Owner Hub (MRR, Tenants, Audit Trail)
 * - Resort Owner: Business, Profit, Multi-Branch, Capex Approvals Hub
 * - Resort Manager: General Operations Hub (Arrivals, Departures, Shift Pulse)
 * - Sales Executive: CRM & Corporate Retreats Lead Pipeline
 * - Receptionist: Front Desk & Room Key Board
 * - Housekeeping: Room Cleaning & Inspection Board
 * - Restaurant/F&B: Dining Tables & Kitchen KOT Live Orders
 * - Accountant: Finance, Cash Flow & GST Ledgers
 * - Guest: VIP Guest Sanctuary & In-Room Concierge
 */
export const DashboardRouter: React.FC = () => {
  const { role } = useAuthStore();

  switch (role) {
    case 'Super Admin':
      return <SuperAdminDashboard />;
    case 'Resort Owner':
      return <ResortOwnerDashboard />;
    case 'Resort Manager':
      return <ResortManagerDashboard />;
    case 'Sales Executive':
      return <CRMPage />;
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
