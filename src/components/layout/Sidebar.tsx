import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getNavItemsForRole } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { role, isImpersonating } = useAuthStore();
  const navItems = getNavItemsForRole(role, isImpersonating);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col shrink-0 border-r border-[#E5E7EB] bg-white text-[#111827] transition-all duration-300 ease-in-out h-full overflow-hidden shadow-xs select-none',
        isCollapsed ? 'w-[76px]' : 'w-[250px]'
      )}
    >
      {/* Brand Header */}
      <div className={cn('pt-5 pb-3 px-4 flex items-center border-b border-[#F3F4F6]', isCollapsed ? 'justify-center' : 'gap-3')}>
        {/* Organic Leaf Emblem */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] flex items-center justify-center text-white shadow-sm shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-white" />
        </div>

        {!isCollapsed && (
          <div className="flex flex-col text-left leading-tight truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-[#0F5132]">JOY</span>
              <span className="text-sm font-semibold tracking-widest text-[#1F2937]">RESORTS</span>
            </div>
            <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#6B7280] uppercase mt-0.5">
              NATURE • STAY • EXPERIENCE
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links List */}
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-xl transition-all duration-150 min-h-[42px]',
                  isCollapsed ? 'justify-center px-0 w-11 mx-auto' : 'px-3.5 gap-3 w-full',
                  isActive
                    ? 'bg-[#0F5132] text-white shadow-sm font-semibold'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] font-medium'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#111827]'
                    )}
                  />

                  {!isCollapsed && (
                    <span className="text-xs tracking-tight truncate flex-1 text-left">
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#0F5132]/10 text-[#0F5132]'
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

      {/* Bottom Promo Scenic Card: "Create Moments In Nature" */}
      {!isCollapsed && (
        <NavLink
          to="/landing"
          title="Visit Public Resort Website"
          className="p-3 m-3 mt-auto rounded-2xl relative overflow-hidden border border-[#E5E7EB] shadow-xs group cursor-pointer bg-gradient-to-b from-stone-900/60 to-black/80 block"
        >
          {/* Background image of resort lake gazebo */}
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
            alt="Joy Resorts Nature"
            className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="relative z-10 py-4 px-3 text-center flex flex-col items-center justify-center">
            <span className="font-serif italic text-white text-base tracking-wide drop-shadow-md">
              Create Moments
            </span>
            <span className="font-serif italic text-white text-sm tracking-wide drop-shadow-md mt-0.5 font-light">
              In Nature
            </span>
            <div className="w-6 h-0.5 bg-emerald-400/80 rounded-full mt-1.5 mb-1.5" />
            <span className="text-[10px] text-emerald-300 font-semibold tracking-wide flex items-center gap-1 group-hover:underline">
              Visit Website →
            </span>
          </div>
        </NavLink>
      )}
    </aside>
  );
};
