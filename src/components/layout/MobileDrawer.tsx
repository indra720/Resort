import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getNavItemsForRole } from '@/lib/permissions';
import { X, Shield, LogOut, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, role, isImpersonating, switchRole, logout } = useAuthStore();
  const navItems = getNavItemsForRole(role, isImpersonating);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const allRoles: UserRole[] = [
    'Super Admin',
    'Resort Owner',
    'Resort Manager',
    'Sales Executive',
    'Receptionist',
    'Housekeeping',
    'Restaurant/F&B',
    'Accountant',
    'Guest',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Menu Sliding from Left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-[85%] max-w-xs sm:max-w-sm h-full bg-white border-r border-[#E5E7EB] text-[#111827] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] flex items-center justify-center text-white shadow-xs">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F5132]">JOY RESORTS</h3>
                  <span className="text-[9px] font-semibold text-[#6B7280] tracking-wider uppercase">NATURE • STAY</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User & Current Role Header */}
            <div className="p-3.5 bg-[#F8FAFC]/50 border-b border-[#E5E7EB] text-left">
              <p className="text-xs font-bold text-[#111827]">{user?.name || 'Admin'}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] text-[11px] font-semibold border border-emerald-200">
                <Shield className="w-3 h-3 text-[#0F5132]" /> {role}
              </div>
            </div>

            {/* Navigation Links (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {/* Visit Public Resort Website */}
              <NavLink
                to="/landing"
                onClick={onClose}
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200 font-semibold text-xs transition-colors mb-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#0F5132]" />
                  <span>Public Resort Website</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">Explore →</span>
              </NavLink>

              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] px-2 mb-1.5 text-left">
                Navigation
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3.5 min-h-[44px] rounded-xl transition-colors text-sm text-left',
                        isActive
                          ? 'bg-[#0F5132] text-white font-semibold shadow-xs'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn('w-4 h-4', isActive ? 'text-white' : 'text-[#6B7280]')}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                            isActive ? 'bg-white/20 text-white' : 'bg-[#0F5132]/10 text-[#0F5132]'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* Mobile Role Switcher for RBAC testing */}
              <div className="pt-4 border-t border-[#E5E7EB] text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] px-2 mb-2">
                  Switch Role Demo
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {allRoles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        onClose();
                      }}
                      className={cn(
                        'px-2 py-1.5 text-left text-xs rounded-lg border transition-colors truncate',
                        role === r
                          ? 'bg-[#0F5132] border-[#0F5132] text-white font-bold'
                          : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logout Footer */}
            <div className="p-3 border-t border-[#E5E7EB] bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#DC2626] bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
