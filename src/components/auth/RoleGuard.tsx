import React from 'react';
import { UserRole } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { Unauthorized403 } from '@/pages/error/Unauthorized403';

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Ensures current authenticated user possesses one of the allowed roles.
 * Displays 403 Unauthorized view if user lacks permission.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = <Unauthorized403 />,
}) => {
  const { role } = useAuthStore();

  // Super Admin wildcard access across all modules
  if (role === 'Super Admin') {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
