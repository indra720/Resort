import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

/**
 * Confirmation dialog for destructive actions (cancellations, refunds, checkout).
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const icons = {
    danger: <AlertCircle className="w-6 h-6 text-[#DC2626]" />,
    warning: <AlertTriangle className="w-6 h-6 text-[#D97706]" />,
    primary: <HelpCircle className="w-6 h-6 text-[#0F5132]" />,
  };

  const buttonVariants: Record<'danger' | 'warning' | 'primary', 'danger' | 'primary'> = {
    danger: 'danger',
    warning: 'primary',
    primary: 'primary',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 w-full">
          <Button
            variant="ghost"
            fullWidth
            className="sm:w-auto"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            fullWidth
            className="sm:w-auto"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4 text-left">
        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] shrink-0">
          {icons[variant]}
        </div>
        <p className="text-sm text-[#6B7280] leading-relaxed pt-1">
          {description}
        </p>
      </div>
    </Modal>
  );
};
