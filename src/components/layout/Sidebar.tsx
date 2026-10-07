import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getNavItemsForRole } from '@/lib/permissions';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { role } = useAuthStore();
  const navItems = getNavItemsForRole(role);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col shrink-0 border-r border-[#9C3800] bg-[#B84C00] text-white transition-all duration-300 ease-in-out h-full overflow-hidden shadow-md',
        isCollapsed ? 'w-[76px]' : 'w-[250px]'
      )}
    >
      {/* Navigation Links List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-xl transition-all duration-150 min-h-[44px]',
                  isCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-3.5 gap-3 w-full',
                  isActive
                    ? 'bg-[#8F3800] text-white shadow-sm font-semibold ring-1 ring-white/10'
                    : 'text-orange-100 hover:text-white hover:bg-[#A33E00]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-orange-200 group-hover:text-white'
                    )}
                  />

                  {!isCollapsed && (
                    <span className="text-sm tracking-tight truncate flex-1 text-left font-medium">
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                        isActive
                          ? 'bg-black/35 text-white'
                          : 'bg-black/20 text-orange-100'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Role Indicator Footer in Sidebar */}
      {!isCollapsed && (
        <div className="p-3.5 m-3 rounded-xl bg-[#8F3800] border border-[#7A2E00] text-left shadow-sm">
          <p className="text-[11px] text-orange-200 uppercase tracking-wider font-semibold">
            Role Workspace
          </p>
          <p className="text-xs font-bold text-white mt-0.5 truncate">{role}</p>
        </div>
      )}
    </aside>
  );
};
