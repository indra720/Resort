import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Custom accessible button with 44px mobile touch target and brand orange focus ring.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles: rounded, transition, focus ring, font weight, min touch target
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B84C00] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98]';

    // Variants according to White + Dark Orange Design System
    const variantStyles = {
      primary: 'bg-[#B84C00] text-white hover:bg-[#9C3800] active:bg-[#8F3800] shadow-sm',
      secondary: 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]',
      outline: 'bg-transparent text-[#B84C00] border border-[#B84C00] hover:bg-[#B84C00] hover:text-white',
      ghost: 'bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]',
      danger: 'bg-rose-50 text-[#DC2626] border border-rose-200 hover:bg-[#DC2626] hover:text-white',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white',
    };

    // Sizes ensuring at least 44px touch height on mobile
    const sizeStyles = {
      sm: 'text-xs min-h-[40px] sm:min-h-[36px] px-3 gap-1.5',
      md: 'text-sm min-h-[44px] px-4 gap-2',
      lg: 'text-base min-h-[48px] px-5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? 'w-full' : 'whitespace-nowrap shrink-0',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        <span>{children}</span>

        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
