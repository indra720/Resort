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
 * Custom accessible button with 44px touch target and Joy Resorts Forest Green theme.
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
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98]';

    const variantStyles = {
      primary: 'bg-[#0F5132] text-white hover:bg-[#0B3D25] active:bg-[#082C1B] shadow-xs',
      secondary: 'bg-emerald-50 text-[#0F5132] border border-emerald-200 hover:bg-emerald-100 hover:text-[#0B3D25]',
      outline: 'bg-transparent text-[#0F5132] border border-[#0F5132] hover:bg-[#0F5132] hover:text-white',
      ghost: 'bg-transparent text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#0F5132]',
      danger: 'bg-rose-50 text-[#DC2626] border border-rose-200 hover:bg-[#DC2626] hover:text-white',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-[#0F5132] hover:text-white',
    };

    const sizeStyles = {
      sm: 'text-xs min-h-[36px] px-3 gap-1.5',
      md: 'text-sm min-h-[42px] px-4 gap-2',
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
