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

// Errors
import { NotFound404 } from '@/pages/error/NotFound404';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Marketing Website */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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

      {/* Rooms Module */}
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={[
                'Super Admin',
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager', 'Receptionist']}>
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager', 'Receptionist']}>
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager', 'Housekeeping']}>
              <AppLayout>
                <HousekeepingPage />
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager', 'Restaurant/F&B']}>
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
              allowedRoles={['Super Admin', 'Resort Manager', 'Receptionist', 'Accountant']}
            >
              <AppLayout>
                <BillingPage />
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Services & Concierge */}
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <RoleGuard
              allowedRoles={['Super Admin', 'Resort Manager', 'Receptionist', 'Guest']}
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager', 'Receptionist']}>
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager']}>
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
              allowedRoles={['Super Admin', 'Resort Manager', 'Housekeeping', 'Restaurant/F&B']}
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager', 'Accountant']}>
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
            <RoleGuard allowedRoles={['Super Admin', 'Resort Manager', 'Guest']}>
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
            <RoleGuard allowedRoles={['Super Admin']}>
              <AppLayout>
                <SettingsPage />
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
