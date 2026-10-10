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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E5E7EB] shadow-lg px-2 py-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around h-14">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          // Clean, concise mobile label mapping to prevent awkward truncation
          const getMobileLabel = (label: string) => {
            if (label.includes('Platform Hub')) return 'Platform';
            if (label.includes('Resorts (Tenants)')) return 'Tenants';
            if (label.includes('Plans &')) return 'Plans';
            if (label.includes('Subscriptions')) return 'Billing';
            if (label.includes('Dashboard')) return 'Home';
            if (label.includes('CRM')) return 'CRM';
            if (label.includes('Bookings')) return 'Bookings';
            if (label.includes('Rooms')) return 'Rooms';
            if (label.includes('Housekeeping')) return 'Cleaning';
            if (label.includes('Restaurant')) return 'Dining';
            if (label.includes('Staff')) return 'Staff';
            return label.length > 9 ? label.split(' ')[0] : label;
          };

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-1 rounded-xl transition-all duration-150',
                  isActive
                    ? 'text-[#0F5132] font-bold'
                    : 'text-[#6B7280] hover:text-[#111827]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-150',
                      isActive ? 'text-[#0F5132] scale-110' : 'text-[#6B7280]'
                    )}
                  />
                  <span className="text-[10px] mt-1 tracking-tight font-medium whitespace-nowrap text-center leading-none">
                    {getMobileLabel(item.label)}
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
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl text-[#6B7280] hover:text-[#111827] transition-all"
          aria-label="Open full resort navigation menu"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight font-medium">More</span>
        </button>
      </div>
    </nav>
  );
};
