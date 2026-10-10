import React from 'react';
import { cn } from '@/lib/utils';
import { StatusType } from '@/types';

export interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

/**
 * Specialized StatusBadge for Resort Management workflows:
 * Available, Occupied, Reserved, Cleaning, Maintenance, Paid, Pending, Cancelled.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className,
}) => {
  // Color configuration mapped to design tokens
  const configMap: Record<
    StatusType,
    { bg: string; text: string; border: string; dot: string }
  > = {
    Available: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-600',
    },
    Occupied: {
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#0F5132]',
      border: 'border-[#BBF7D0]',
      dot: 'bg-[#0F5132]',
    },
    Reserved: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-600',
    },
    Dirty: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      dot: 'bg-orange-500',
    },
    Cleaning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-600',
    },
    Clean: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      dot: 'bg-teal-600',
    },
    Maintenance: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-600',
    },
    Paid: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-600',
    },
    Pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-600',
    },
    Cancelled: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-600',
    },
  };

  const current = configMap[status] || {
    bg: 'bg-[#F8FAFC]',
    text: 'text-[#6B7280]',
    border: 'border-[#E5E7EB]',
    dot: 'bg-[#6B7280]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border select-none tracking-wide transition-colors whitespace-nowrap',
        current.bg,
        current.text,
        current.border,
        sizeStyles[size],
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', current.dot)} />
      )}
      <span>{status}</span>
    </span>
  );
};
