import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS, NotificationItem } from '@/data/mockNotifications';
import { Button } from '@/components/ui/Button';
import { toast } from '@/store/useToastStore';
import {
  Bell,
  CheckCheck,
  Trash2,
  CalendarCheck,
  AlertTriangle,
  Utensils,
  CreditCard,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All Notifications Read', 'Marked all messages as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.info('Inbox Cleared', 'All notifications cleared.');
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-[#FF8A3D]" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      case 'service':
        return <Utensils className="w-4 h-4 text-[#3B82F6]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-[#22C55E]" />;
      default:
        return <Bell className="w-4 h-4 text-[#FF8A3D]" />;
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#FF8A3D]" />
            <span>Resort Notifications Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Real-time updates regarding guest bookings, turnovers, and dining orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All Read
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearAll}
            leftIcon={<Trash2 className="w-4 h-4 text-[#EF4444]" />}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#2A2A35] pb-2 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            filter === 'all'
              ? 'bg-[#B84C00] text-white'
              : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            filter === 'unread'
              ? 'bg-[#B84C00] text-white'
              : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
          }`}
        >
          Unread Only ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#14141A] border border-[#2A2A35] text-xs text-[#A1A1AA]">
            No notifications found in this view.
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                !item.read
                  ? 'bg-[#1C1C24] border-[#CC5500]/40 shadow-sm'
                  : 'bg-[#14141A] border-[#2A2A35]'
              }`}
            >
              <div className="p-2 rounded-lg bg-[#14141A] border border-[#2A2A35] shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-[#F5F5F7]">{item.title}</h4>
                  <span className="text-[10px] text-[#A1A1AA]">{item.time}</span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{item.message}</p>
              </div>

              {!item.read && (
                <div className="w-2 h-2 rounded-full bg-[#B84C00] shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
