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
      <header className="shrink-0 w-full h-16 border-b border-[#2A2A35] bg-[#0B0B0F]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30">
        {/* Left Section: Mobile Menu, Desktop Collapse, Brand */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Drawer Trigger (min-h-[44px]) */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg text-[#F5F5F7] hover:bg-[#1C1C24] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24] transition-colors"
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A33] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,107,0,0.3)] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="hidden lg:block leading-tight">
              <span className="text-sm sm:text-base font-semibold tracking-tight text-[#F5F5F7]">
                Aura Palms <span className="text-[#FF6B00]">Resort</span>
              </span>
              <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider font-medium">
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
            className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#14141A] border border-[#2A2A35] hover:border-[#FF6B00]/50 transition-colors flex items-center justify-between text-xs text-[#A1A1AA]"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#FF6B00]" />
              <span>Search rooms, guests, bookings...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#1C1C24] border border-[#2A2A35] text-[10px] text-[#A1A1AA]">
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
            className="sm:hidden w-11 h-11 flex items-center justify-center rounded-lg text-[#F5F5F7] hover:bg-[#1C1C24] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-[#FF6B00]" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="w-11 h-11 relative flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0B0B0F]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#14141A] border border-[#2A2A35] shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 border-b border-[#2A2A35] flex items-center justify-between bg-[#1C1C24]/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#F5F5F7]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-[11px] font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#FF6B00] hover:text-[#FF8A33] flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#2A2A35]/50">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-[#1C1C24]/60 transition-colors text-left ${
                        !notif.read ? 'bg-[#FF6B00]/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#F5F5F7]">{notif.title}</h4>
                        <span className="text-[10px] text-[#A1A1AA] shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">{notif.message}</p>
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
              className="min-h-[44px] flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#1C1C24] border border-transparent hover:border-[#2A2A35] transition-all"
              aria-label="User Profile and Role Menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#1C1C24] border border-[#FF6B00]/40 text-[#FF6B00] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight pr-1">
                <span className="text-xs font-medium text-[#F5F5F7] max-w-[110px] truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#FF6B00] font-medium">{role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA] hidden md:block" />
            </button>

            {/* Profile Popover / Role Switcher Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#14141A] border border-[#2A2A35] shadow-2xl z-50 overflow-hidden divide-y divide-[#2A2A35]">
                {/* User Info Header */}
                <div className="p-4 bg-[#1C1C24]/50">
                  <p className="text-sm font-semibold text-[#F5F5F7]">{user?.name}</p>
                  <p className="text-xs text-[#A1A1AA]">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00] text-[11px] font-semibold">
                    <Shield className="w-3 h-3" /> Active: {role}
                  </div>
                </div>

                {/* Role Switcher for Testing (Prominently Accessible) */}
                <div className="p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2 px-1">
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
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          role === r
                            ? 'bg-[#FF6B00] text-white font-medium'
                            : 'text-[#F5F5F7] hover:bg-[#1C1C24] hover:text-[#FF6B00]'
                        }`}
                      >
                        <span>{r}</span>
                        {role === r && <span className="text-[10px]">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer links */}
                <div className="p-2 bg-[#1C1C24]/20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
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
