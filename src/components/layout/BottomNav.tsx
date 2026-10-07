import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getBottomNavItemsForRole } from '@/lib/permissions';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomNavProps {
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMore }) => {
  const { role } = useAuthStore();
  const primaryItems = getBottomNavItemsForRole(role);

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] shadow-lg px-2 py-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around h-14">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-150',
                  isActive
                    ? 'text-[#B84C00] font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-150',
                      isActive ? 'text-[#B84C00] scale-110' : 'text-[#64748B]'
                    )}
                  />
                  <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* 5th slot: Dedicated "More" Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMore}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl text-[#64748B] hover:text-[#0F172A] transition-all"
          aria-label="Open full resort navigation menu"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight font-medium">More</span>
        </button>
      </div>
    </nav>
  );
};
