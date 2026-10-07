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
      default: 'bg-[#1C1C24] text-[#F5F5F7] border-[#2A2A35]',
      primary: 'bg-[#CC5500]/18 text-[#FF8A3D] border-[#CC5500]/30',
      secondary: 'bg-[#14141A] text-[#A1A1AA] border-[#2A2A35]',
      outline: 'bg-transparent text-[#F5F5F7] border-[#2A2A35]',
      success: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
      warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
      danger: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
      info: 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30',
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
