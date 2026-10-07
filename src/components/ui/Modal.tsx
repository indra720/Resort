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
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
  maxWidth = 'md',
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
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
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
              'bg-[#14141A] border-t sm:border border-[#2A2A35]',
              'shadow-2xl flex flex-col overflow-hidden',
              // Desktop constraints
              'sm:m-4 sm:w-full',
              maxWidthClasses[maxWidth]
            )}
          >
            {/* Mobile Drag Indicator Handle */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#2A2A35]" />
            </div>

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#2A2A35] flex items-center justify-between shrink-0">
              <div className="space-y-1 pr-4">
                {title && (
                  <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F7] tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-[#A1A1AA]">{description}</p>
                )}
              </div>

              {/* 44px Minimum Touch Target Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC5500]"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-sm text-[#F5F5F7]">
              {children}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div className="p-4 sm:p-5 border-t border-[#2A2A35] bg-[#1C1C24]/50 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
