import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getNavItemsForRole } from '@/lib/permissions';
import { X, Sparkles, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, role, switchRole, logout } = useAuthStore();
  const navItems = getNavItemsForRole(role);

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
    'Resort Manager',
    'Receptionist',
    'Housekeeping',
    'Restaurant/F&B',
    'Accountant',
    'Guest',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Menu Sliding from Left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-[85%] max-w-xs h-full bg-[#14141A] border-r border-[#2A2A35] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#2A2A35] flex items-center justify-between bg-[#1C1C24]/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#CC5500] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F5F7]">Aura Palms Resort</h3>
                  <span className="text-[10px] text-[#A1A1AA]">Navigation Menu</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User & Current Role Header */}
            <div className="p-3.5 bg-[#1C1C24]/30 border-b border-[#2A2A35] text-left">
              <p className="text-xs font-semibold text-[#F5F5F7]">{user?.name}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#CC5500]/18 text-[#FF8A3D] text-[11px] font-medium border border-[#CC5500]/30">
                <Shield className="w-3 h-3" /> {role}
              </div>
            </div>

            {/* Navigation Links (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] px-2 mb-1.5 text-left">
                Resort Modules
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
                          ? 'bg-[#CC5500] text-white font-semibold'
                          : 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn('w-4 h-4', isActive ? 'text-white' : 'text-[#FF8A3D]')}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 text-white">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* Mobile Role Switcher for RBAC testing */}
              <div className="pt-4 border-t border-[#2A2A35] text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] px-2 mb-2">
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
                          ? 'bg-[#CC5500]/20 border-[#CC5500] text-[#FF8A3D] font-semibold'
                          : 'bg-[#1C1C24] border-[#2A2A35] text-[#A1A1AA] hover:text-white'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logout Footer */}
            <div className="p-3 border-t border-[#2A2A35] bg-[#1C1C24]/50">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-medium text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors"
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
