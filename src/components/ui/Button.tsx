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
    // Base styles: rounded, transition, focus ring, font weight, min touch target, no shrink
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 select-none whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC5500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] active:scale-[0.98]';

    // Variants according to Dark + Orange Design System
    const variantStyles = {
      primary: 'bg-[#B84C00] text-white hover:bg-[#E06A10] shadow-sm',
      secondary: 'bg-[#1C1C24] text-[#F5F5F7] border border-[#2A2A35] hover:bg-[#2A2A35] hover:border-[#3E3E4E]',
      outline: 'bg-transparent text-[#F5F5F7] border border-[#2A2A35] hover:border-[#CC5500] hover:text-[#FF8A3D]',
      ghost: 'bg-transparent text-[#A1A1AA] hover:bg-[#1C1C24] hover:text-[#F5F5F7]',
      danger: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444] hover:text-white',
      success: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E] hover:text-white',
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
