import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCheck,
  Compass,
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
  const { user, role, switchRole, logout, currentResort, allResorts, switchResort } = useAuthStore();
  const navigate = useNavigate();

  // State for popovers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResortMenuOpen, setIsResortMenuOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const unreadCount = 3; // Exactly 3 notifications as shown in screenshot

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const resortRef = useRef<HTMLDivElement>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (resortRef.current && !resortRef.current.contains(e.target as Node)) {
        setIsResortMenuOpen(false);
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
    <>
      <header className="shrink-0 w-full h-16 border-b border-[#E5E7EB] bg-white px-3 sm:px-6 flex items-center justify-between z-30 shadow-2xs select-none">
        {/* Left Section: Mobile Menu, Desktop Collapse, Search Bar */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          {/* Mobile/Tablet Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-[#6B7280]" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Toggle sidebar collapse"
            title="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Global Search Input Box (Pixel-accurate with screenshot) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0F5132]/40 transition-colors flex items-center justify-between text-xs text-[#64748B]"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-xs text-[#64748B] font-normal">Search leads, guests, bookings...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#64748B] font-medium shadow-2xs">
                Ctrl + K
              </kbd>
            </button>
          </div>

          {/* Multi-Tenant Property Selector */}
          <div className="relative hidden xl:block" ref={resortRef}>
            <button
              type="button"
              onClick={() => setIsResortMenuOpen((prev) => !prev)}
              className="h-10 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0F5132]/40 transition-colors flex items-center gap-2 text-xs text-[#1E293B] font-semibold"
            >
              <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span className="truncate max-w-[180px]">{currentResort.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {isResortMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl z-50 overflow-hidden divide-y divide-[#E2E8F0]">
                <div className="p-3 bg-[#F8FAFC]">
                  <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    Switch Resort Property (Tenant)
                  </p>
                </div>
                <div className="p-2 space-y-1">
                  {allResorts.map((resort) => (
                    <button
                      key={resort.id}
                      type="button"
                      onClick={() => {
                        switchResort(resort.id);
                        setIsResortMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors ${
                        currentResort.id === resort.id
                          ? 'bg-[#0F5132] text-white font-semibold'
                          : 'hover:bg-[#F8FAFC] text-[#1E293B]'
                      }`}
                    >
                      <div>
                        <p className="font-bold">{resort.name}</p>
                        <p className={`text-[10px] ${currentResort.id === resort.id ? 'text-white/80' : 'text-[#64748B]'}`}>
                          {resort.city}, {resort.state} • {resort.plan}
                        </p>
                      </div>
                      {currentResort.id === resort.id && (
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Mobile Search, Guest Website, Notifications, Profile (Admin / Resort Manager) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-[#6B7280]" />
          </button>

          {/* Quick Link to Guest Website Landing Page */}
          {/* <Link
            to="/landing"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0F5132] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-colors shadow-2xs"
            title="View Public Resort Landing Page"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Guest Website</span>
          </Link> */}

          {/* Notifications Dropdown (Bell icon with badge 3) */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="w-10 h-10 relative flex items-center justify-center rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#4B5563]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
                <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
                  <div className="flex flex-col lg:flex-row items-center gap-2">
                    <span className="text-sm font-semibold text-[#111827]">Notifications</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-semibold border border-rose-200">
                      {unreadCount} new
                    </span>
                  </div>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#0F5132] hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-[#F8FAFC] transition-colors text-left ${
                        !notif.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#111827]">{notif.title}</h4>
                        <span className="text-[10px] text-[#6B7280] shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Chip (Photo + "Admin" + "Resort Manager") */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E5E7EB] transition-all"
              aria-label="User Profile and Role Menu"
            >
              {/* Photo Avatar */}
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                }
                alt={user?.name || role}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0F5132]/20 shadow-2xs shrink-0"
              />

              <div className="hidden sm:flex flex-col text-left leading-tight max-w-[140px]">
                <span className="text-xs font-bold text-[#111827] truncate">
                  {user?.name || (role === 'Guest' ? 'Guest User' : role)}
                </span>
                <span className="text-[11px] text-[#0F5132] font-semibold truncate">
                  {role}
                </span>
              </div>
            </button>

            {/* Profile Popover / Role Switcher Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl z-50 overflow-hidden divide-y divide-[#E5E7EB]">
                {/* User Info Header */}
                <div className="p-4 bg-[#F8FAFC] flex items-center gap-3">
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={user?.name || role}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#0F5132]/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#111827] truncate">{user?.name || role}</p>
                    <p className="text-xs text-[#6B7280] truncate">
                      {user?.email || `${role.toLowerCase().replace(/[^a-z0-9]/g, '')}@joyresorts.com`}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] text-[10px] font-semibold border border-emerald-200">
                      <Shield className="w-3 h-3 text-[#0F5132]" /> {role}
                    </span>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] mb-2 px-1">
                    Quick Role Switcher (RBAC)
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
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors text-left font-medium ${
                          role === r
                            ? 'bg-[#0F5132] text-white font-semibold'
                            : 'text-[#111827] hover:bg-[#F3F4F6] hover:text-[#0F5132]'
                        }`}
                      >
                        <span>{r}</span>
                        {role === r && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer links */}
                <div className="p-2 bg-[#F8FAFC]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-rose-50 transition-colors"
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
