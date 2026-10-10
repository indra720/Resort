import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppLayout } from '@/layouts/AppLayout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { LandingPage } from '@/pages/landing/LandingPage';

// Dashboards
import { DashboardRouter } from '@/pages/dashboards/DashboardRouter';
import { CRMPage } from '@/pages/crm/CRMPage';

// Modules
import { RoomsPage } from '@/pages/rooms/RoomsPage';
import { BookingsPage } from '@/pages/bookings/BookingsPage';
import { MyBookingsPage } from '@/pages/bookings/MyBookingsPage';
import { CheckInOutPage } from '@/pages/bookings/CheckInOutPage';
import { HousekeepingPage } from '@/pages/housekeeping/HousekeepingPage';
import { RestaurantPage } from '@/pages/restaurant/RestaurantPage';
import { BillingPage } from '@/pages/billing/BillingPage';
import { ServicesPage } from '@/pages/services/ServicesPage';
import { GuestListPage } from '@/pages/guests/GuestListPage';
import { StaffListPage } from '@/pages/staff/StaffListPage';
import { InventoryPage } from '@/pages/inventory/InventoryPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { FeedbackPage } from '@/pages/feedback/FeedbackPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { DesignSystemShowcase } from '@/pages/DesignSystemShowcase';

// SaaS Public & Settings Pages
import { PricingPage } from '@/pages/landing/PricingPage';
import { ResortOnboardingPage } from '@/pages/auth/ResortOnboardingPage';
import { AcceptInvitePage } from '@/pages/auth/AcceptInvitePage';
import { SubscriptionPage } from '@/pages/settings/SubscriptionPage';

// Dedicated CRM & Operations Modules
import { LeadsPage } from '@/pages/crm/LeadsPage';
import { EnquiriesPage } from '@/pages/crm/EnquiriesPage';
import { FollowUpsPage } from '@/pages/crm/FollowUpsPage';
import { MarketingPage } from '@/pages/crm/MarketingPage';
import { ActivitiesPage } from '@/pages/activities/ActivitiesPage';
import { EventsPage } from '@/pages/events/EventsPage';
import { PaymentsPage } from '@/pages/billing/PaymentsPage';
import { RefundsPage } from '@/pages/billing/RefundsPage';
import { ExpensesPage } from '@/pages/billing/ExpensesPage';
import { MaintenancePage } from '@/pages/housekeeping/MaintenancePage';

// Super Admin SaaS Platform Pages
import { AdminResortsPage } from '@/pages/admin/AdminResortsPage';
import { AdminPlansPage } from '@/pages/admin/AdminPlansPage';
import { AdminSubscriptionsPage } from '@/pages/admin/AdminSubscriptionsPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminPlatformSettingsPage } from '@/pages/admin/AdminPlatformSettingsPage';
import { AdminSupportTicketsPage } from '@/pages/admin/AdminSupportTicketsPage';

// Errors
import { NotFound404 } from '@/pages/error/NotFound404';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Primary Dashboard Route (Smart routing per active role) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardRouter />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Public Auth & Onboarding Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/resort-signup" element={<ResortOnboardingPage />} />
      <Route path="/invite/:token" element={<AcceptInvitePage />} />

      {/* Design System Reference Page */}
      <Route
        path="/design-system"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DesignSystemShowcase />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Dashboard (Dynamic per role for all 7 roles) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardRouter />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Joy Resorts CRM SaaS Module (Matches 1:1 Live Dashboard) */}
      <Route
        path="/crm"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive', 'Receptionist']}>
              <AppLayout>
                <CRMPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive', 'Receptionist']}>
              <AppLayout>
                <LeadsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/enquiries"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive', 'Receptionist']}>
              <AppLayout>
                <EnquiriesPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/follow-ups"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive', 'Receptionist']}>
              <AppLayout>
                <FollowUpsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/marketing"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager']}>
              <AppLayout>
                <MarketingPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/activities"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ActivitiesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EventsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Rooms Module */}
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={[
                'Super Admin',
                'Resort Owner',
                'Resort Manager',
                'Receptionist',
                'Housekeeping',
                'Guest',
              ]}
            >
              <AppLayout>
                <RoomsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Bookings Module */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive', 'Receptionist']}>
              <AppLayout>
                <BookingsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Guest My Bookings */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Guest']}>
              <AppLayout>
                <MyBookingsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Front Desk Check-In / Out */}
      <Route
        path="/check-in-out"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist']}>
              <AppLayout>
                <CheckInOutPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Housekeeping */}
      <Route
        path="/housekeeping"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Housekeeping']}>
              <AppLayout>
                <HousekeepingPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Engineering & Facility Maintenance */}
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Housekeeping']}>
              <AppLayout>
                <MaintenancePage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Restaurant & F&B */}
      <Route
        path="/restaurant"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Restaurant/F&B']}>
              <AppLayout>
                <RestaurantPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Billing & GST Invoices */}
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Accountant']}
            >
              <AppLayout>
                <BillingPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Payments Ledger */}
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Accountant']}
            >
              <AppLayout>
                <PaymentsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Cancellations & Refunds */}
      <Route
        path="/refunds"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant']}
            >
              <AppLayout>
                <RefundsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Expenses & Petty Cash */}
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant']}
            >
              <AppLayout>
                <ExpensesPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      {/* Expenses & Ledger URL Aliases */}
      <Route path="/ledgers" element={<Navigate to="/expenses" replace />} />
      <Route path="/ledger" element={<Navigate to="/expenses" replace />} />
      <Route path="/expense" element={<Navigate to="/expenses" replace />} />
      <Route path="/expenses-ledgers" element={<Navigate to="/expenses" replace />} />

      {/* Services & Concierge */}
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Guest']}
            >
              <AppLayout>
                <ServicesPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Guest Directory */}
      <Route
        path="/guests"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist']}>
              <AppLayout>
                <GuestListPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Staff Directory */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager']}>
              <AppLayout>
                <StaffListPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Housekeeping', 'Restaurant/F&B']}
            >
              <AppLayout>
                <InventoryPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant']}>
              <AppLayout>
                <ReportsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Feedback */}
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager', 'Guest']}>
              <AppLayout>
                <FeedbackPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Profile & Notifications */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotificationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner']}>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* SaaS Subscription & Plans */}
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin', 'Resort Owner', 'Resort Manager']}>
              <AppLayout>
                <SubscriptionPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Super Admin Exclusive SaaS Platform Routes */}
      <Route
        path="/admin/resorts"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin']}>
              <AppLayout>
                <AdminResortsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/plans"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin']}>
              <AppLayout>
                <AdminPlansPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/subscriptions"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin']}>
              <AppLayout>
                <AdminSubscriptionsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin']}>
              <AppLayout>
                <AdminAuditLogsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/platform-settings"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin']}>
              <AppLayout>
                <AdminPlatformSettingsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/support-tickets"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['Super Admin']}>
              <AppLayout>
                <AdminSupportTicketsPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};
