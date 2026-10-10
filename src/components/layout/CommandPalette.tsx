import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BedDouble, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ROOMS, MOCK_BOOKINGS } from '@/data/mockData';
import { formatINR } from '@/lib/formatINR';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lowerQuery = query.toLowerCase().trim();

  // Filter rooms
  const matchingRooms = MOCK_ROOMS.filter(
    (r) =>
      r.roomNumber.toLowerCase().includes(lowerQuery) ||
      r.category.toLowerCase().includes(lowerQuery)
  );

  // Filter bookings
  const matchingBookings = MOCK_BOOKINGS.filter(
    (b) =>
      b.guestName.toLowerCase().includes(lowerQuery) ||
      b.bookingCode.toLowerCase().includes(lowerQuery) ||
      b.roomNumber.toLowerCase().includes(lowerQuery)
  );

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-xl bg-white border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <Search className="w-5 h-5 text-[#0F5132] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rooms, guest names, booking codes (e.g. 101, Rohan)..."
              className="w-full min-h-[50px] bg-transparent text-sm text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-[#6B7280] hover:text-[#1F2937] mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-[#6B7280] bg-white rounded border border-[#E5E7EB]">
              ESC
            </kbd>
          </div>

          {/* Results list */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Quick Actions / Navigation */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] px-2 mb-1.5">
                Quick Navigation
              </p>
              <div className="space-y-1">
                {[
                  { label: 'Rooms & Villas Inventory', path: '/rooms' },
                  { label: 'All Guest Bookings', path: '/bookings' },
                  { label: 'Front-Desk Check-In / Out', path: '/check-in-out' },
                  { label: 'Restaurant & F&B Orders', path: '/restaurant' },
                  { label: 'Billing & GST Invoices', path: '/billing' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#1F2937] hover:bg-[#F8FAFC] hover:text-[#0F5132] transition-colors group text-left"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#0F5132] transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Matching Rooms */}
            {matchingRooms.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] px-2 mb-1.5">
                  Rooms
                </p>
                <div className="space-y-1">
                  {matchingRooms.slice(0, 4).map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleSelect('/rooms')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#0F5132]/40 hover:bg-[#F0FDF4]/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <BedDouble className="w-4 h-4 text-[#0F5132]" />
                        <span className="font-medium text-[#1F2937]">Room #{room.roomNumber}</span>
                        <span className="text-xs text-[#6B7280]">{room.category}</span>
                      </div>
                      <div className="flex flex-col lg:flex-row items-center gap-2">
                        <StatusBadge status={room.status} size="sm" />
                        <span className="text-xs font-semibold text-[#0F5132]">
                          {formatINR(room.ratePerNight)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Bookings */}
            {matchingBookings.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] px-2 mb-1.5">
                  Bookings
                </p>
                <div className="space-y-1">
                  {matchingBookings.slice(0, 4).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelect('/bookings')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#0F5132]/40 hover:bg-[#F0FDF4]/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-[#2563EB]" />
                        <span className="font-medium text-[#1F2937]">{b.guestName}</span>
                        <span className="text-xs text-[#6B7280]">{b.bookingCode}</span>
                      </div>
                      <StatusBadge status={b.paymentStatus} size="sm" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
