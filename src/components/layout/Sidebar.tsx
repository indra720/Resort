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
        'hidden md:flex flex-col shrink-0 border-r border-[#2A2A35] bg-[#0B0B0F] transition-all duration-300 ease-in-out h-full overflow-hidden',
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
                    ? 'bg-[#CC5500] text-white shadow-[0_0_15px_rgba(204,85,0,0.3)] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#14141A]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-[#A1A1AA] group-hover:text-[#FF8A3D]'
                    )}
                  />

                  {!isCollapsed && (
                    <span className="text-sm tracking-tight truncate flex-1 text-left">
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-[#CC5500]/20 text-[#FF8A3D]'
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
        <div className="p-3.5 m-3 rounded-xl bg-[#14141A] border border-[#2A2A35] text-left">
          <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-semibold">
            Role Workspace
          </p>
          <p className="text-xs font-semibold text-[#FF8A3D] mt-0.5 truncate">{role}</p>
        </div>
      )}
    </aside>
  );
};
