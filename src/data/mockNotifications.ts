export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'service' | 'alert' | 'payment';
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Online Booking',
    message: 'Devendra Singhania booked Pool Villa V-01 for 3 nights (₹84,960).',
    time: '5m ago',
    read: false,
    type: 'booking',
  },
  {
    id: 'notif-2',
    title: 'Housekeeping Alert',
    message: 'Room 202 marked as Dirty after guest checkout. Turnover requested.',
    time: '25m ago',
    read: false,
    type: 'alert',
  },
  {
    id: 'notif-3',
    title: 'Restaurant Order Placed',
    message: 'Table 4 ordered 2x Paneer Tikka, 1x Dal Makhani (₹1,450).',
    time: '1h ago',
    read: false,
    type: 'service',
  },
  {
    id: 'notif-4',
    title: 'GST Invoice Generated',
    message: 'Tax Invoice #INV-2026-088 sent to Rohan Mehra (₹18,480).',
    time: '3h ago',
    read: true,
    type: 'payment',
  },
];
