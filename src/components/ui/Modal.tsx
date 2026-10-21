import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

/**
 * Responsive Modal Component:
 * - Desktop: Centered elevated dialog with backdrop blur.
 * - Mobile: Full-screen sheet modal with 44px touch targets.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'lg',
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg md:max-w-xl lg:max-w-2xl',
    lg: 'sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
    xl: 'sm:max-w-2xl md:max-w-3xl lg:max-w-4xl',
    '2xl': 'sm:max-w-3xl md:max-w-4xl lg:max-w-5xl',
    '3xl': 'sm:max-w-4xl md:max-w-5xl lg:max-w-6xl',
    '4xl': 'sm:max-w-5xl md:max-w-6xl lg:max-w-7xl',
    '5xl': 'sm:max-w-6xl md:max-w-7xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container: Full-screen on mobile, centered rounded dialog on desktop */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className={cn(
              // Mobile styles: Full-screen sheet with top handle
              'relative z-10 w-full h-[92vh] sm:h-auto max-h-[92vh] sm:max-h-[85vh]',
              'rounded-t-2xl sm:rounded-xl',
              'bg-white border-t sm:border border-[#E5E7EB] text-[#1F2937]',
              'shadow-2xl flex flex-col overflow-hidden',
              // Desktop constraints
              'sm:m-4 sm:w-full',
              maxWidthClasses[maxWidth]
            )}
          >
            {/* Mobile Drag Indicator Handle */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
            </div>

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
              <div className="space-y-1 pr-4">
                {title && (
                  <h2 className="text-base sm:text-lg font-bold text-[#0F5132] tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-[#6B7280]">{description}</p>
                )}
              </div>

              {/* 44px Minimum Touch Target Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132]"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-sm text-[#1F2937]">
              {children}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div className="p-4 sm:p-5 border-t border-[#E5E7EB] bg-[#F8FAFC] shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
