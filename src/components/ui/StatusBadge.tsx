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
      bg: 'bg-[#22C55E]/10',
      text: 'text-[#22C55E]',
      border: 'border-[#22C55E]/30',
      dot: 'bg-[#22C55E]',
    },
    Occupied: {
      bg: 'bg-[#FF6B00]/10',
      text: 'text-[#FF6B00]',
      border: 'border-[#FF6B00]/30',
      dot: 'bg-[#FF6B00]',
    },
    Reserved: {
      bg: 'bg-[#3B82F6]/10',
      text: 'text-[#3B82F6]',
      border: 'border-[#3B82F6]/30',
      dot: 'bg-[#3B82F6]',
    },
    Cleaning: {
      bg: 'bg-[#F59E0B]/10',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/30',
      dot: 'bg-[#F59E0B]',
    },
    Maintenance: {
      bg: 'bg-[#EF4444]/10',
      text: 'text-[#EF4444]',
      border: 'border-[#EF4444]/30',
      dot: 'bg-[#EF4444]',
    },
    Paid: {
      bg: 'bg-[#22C55E]/10',
      text: 'text-[#22C55E]',
      border: 'border-[#22C55E]/30',
      dot: 'bg-[#22C55E]',
    },
    Pending: {
      bg: 'bg-[#F59E0B]/10',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/30',
      dot: 'bg-[#F59E0B]',
    },
    Cancelled: {
      bg: 'bg-[#EF4444]/10',
      text: 'text-[#EF4444]',
      border: 'border-[#EF4444]/30',
      dot: 'bg-[#EF4444]',
    },
  };

  const current = configMap[status] || {
    bg: 'bg-[#1C1C24]',
    text: 'text-[#A1A1AA]',
    border: 'border-[#2A2A35]',
    dot: 'bg-[#A1A1AA]',
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
