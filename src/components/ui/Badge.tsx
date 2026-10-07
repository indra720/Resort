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
      default: 'bg-[#F1F5F9] text-[#0F172A] border-[#E2E8F0]',
      primary: 'bg-orange-50 text-[#B84C00] border-orange-200 font-semibold',
      secondary: 'bg-white text-[#64748B] border-[#E2E8F0]',
      outline: 'bg-transparent text-[#0F172A] border-[#E2E8F0]',
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
