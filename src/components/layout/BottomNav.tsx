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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] px-2 py-1 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
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
                  'flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-[#0F5132] font-bold'
                    : 'text-slate-500 hover:text-slate-900 active:scale-95'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'p-1 rounded-xl transition-all duration-200 flex items-center justify-center',
                      isActive ? 'bg-[#0F5132]/10 scale-105' : 'bg-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-200',
                        isActive ? 'text-[#0F5132]' : 'text-slate-500'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[9px] sm:text-[10px] mt-0.5 tracking-tight whitespace-nowrap text-center leading-none transition-all truncate max-w-full',
                      isActive ? 'font-bold text-[#0F5132]' : 'font-medium text-slate-500'
                    )}
                  >
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
          className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-slate-500 hover:text-slate-900 active:scale-95 transition-all"
          aria-label="Open full resort navigation menu"
        >
          <div className="p-1 rounded-xl bg-transparent flex items-center justify-center">
            <MoreHorizontal className="w-4 sm:w-5 h-4 sm:h-5 text-slate-500" />
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-medium text-slate-500">More</span>
        </button>
      </div>
    </nav>
  );
};
