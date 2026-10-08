import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { MOCK_NOTIFICATIONS, NotificationItem } from '@/data/mockNotifications';
import { CommandPalette } from './CommandPalette';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCheck,
} from 'lucide-react';

export interface TopBarProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onOpenMobileDrawer?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
  onOpenMobileDrawer,
}) => {
  const { user, role, switchRole, logout } = useAuthStore();
  const navigate = useNavigate();

  // State for popovers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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
    <>
      <header className="shrink-0 w-full h-16 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30 shadow-xs">
        {/* Left Section: Mobile Menu, Desktop Collapse, Brand */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile/Tablet Drawer Trigger (min-h-[44px], visible on mobile & md screens) */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg text-[#1F2937] hover:bg-[#FFF8F3] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-[#6B7280]" />
          </button>

          {/* Desktop Sidebar Collapse Toggle (visible on lg+ desktop) */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF8F3] transition-colors"
            aria-label="Toggle sidebar collapse"
            title="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>

          {/* Brand Logo & Name (Text visible ONLY on lg screens; on mobile & md only orange icon shows) */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C2410C] to-[#D95F02] flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="hidden lg:block leading-tight">
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#1F2937]">
                Aura Palms <span className="text-[#C2410C]">Resort</span>
              </span>
              <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
                Luxury & Heritage
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Trigger Button */}
        <div className="flex-1 max-w-md mx-3 hidden sm:block">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] hover:border-[#C2410C]/50 transition-colors flex items-center justify-between text-xs text-[#6B7280]"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#C2410C]" />
              <span>Search rooms, guests, bookings...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E5E7EB] text-[10px] text-[#6B7280] font-medium">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Section: Mobile Search, Notifications, Profile with Role Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden w-11 h-11 flex items-center justify-center rounded-lg text-[#1F2937] hover:bg-[#FFF8F3] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-[#C2410C]" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="w-11 h-11 relative flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF8F3] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#6B7280]" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C2410C] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
                <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FFF8F3]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1F2937]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#FFF1E6] text-[#C2410C] text-[11px] font-semibold border border-[#FED7AA]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#C2410C] hover:text-[#9A3412] flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-[#FFF8F3] transition-colors text-left ${
                        !notif.read ? 'bg-[#FFF1E6]/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#1F2937]">{notif.title}</h4>
                        <span className="text-[10px] text-[#6B7280] shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown with Quick Role Switcher */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="min-h-[44px] flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FFF8F3] border border-transparent hover:border-[#E5E7EB] transition-all"
              aria-label="User Profile and Role Menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#FFF1E6] border border-[#FED7AA] text-[#C2410C] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight pr-1">
                <span className="text-xs font-semibold text-[#1F2937] max-w-[110px] truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#C2410C] font-bold">{role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] hidden md:block" />
            </button>

            {/* Profile Popover / Role Switcher Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#E5E7EB] shadow-xl z-50 overflow-hidden divide-y divide-[#E5E7EB]">
                {/* User Info Header */}
                <div className="p-4 bg-[#FFF8F3]">
                  <p className="text-sm font-semibold text-[#1F2937]">{user?.name}</p>
                  <p className="text-xs text-[#6B7280]">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF1E6] border border-[#FED7AA] text-[#C2410C] text-[11px] font-semibold">
                    <Shield className="w-3 h-3 text-[#C2410C]" /> Active: {role}
                  </div>
                </div>

                {/* Role Switcher for Testing (Prominently Accessible) */}
                <div className="p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] mb-2 px-1">
                    Quick Role Switcher (Test RBAC)
                  </p>
                  <div className="space-y-1">
                    {allRoles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          switchRole(r);
                          setIsProfileOpen(false);
                          navigate('/dashboard');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left font-medium ${
                          role === r
                            ? 'bg-[#C2410C] text-white font-semibold'
                            : 'text-[#1F2937] hover:bg-[#FFF8F3] hover:text-[#C2410C]'
                        }`}
                      >
                        <span>{r}</span>
                        {role === r && <span className="text-[10px]">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer links */}
                <div className="p-2 bg-[#FFF8F3]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#DC2626] hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
