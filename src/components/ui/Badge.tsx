import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

/**
 * Visual status indicator badge matching the dark + orange design system.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full border transition-colors select-none tracking-wide';

    const variantStyles = {
      default: 'bg-[#F8FAFC] text-[#1F2937] border-[#E5E7EB]',
      primary: 'bg-[#F0FDF4] text-[#0F5132] border-[#BBF7D0] font-semibold',
      secondary: 'bg-white text-[#6B7280] border-[#E5E7EB]',
      outline: 'bg-transparent text-[#1F2937] border-[#E5E7EB]',
      success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warning: 'bg-amber-50 text-amber-700 border-amber-200',
      danger: 'bg-rose-50 text-rose-700 border-rose-200',
      info: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-[11px] gap-1',
      md: 'px-2.5 py-1 text-xs gap-1.5',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
